import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {
  saveContact as saveContactAPI,
  getContacts as getContactsAPI,
  removeContact as removeContactAPI,
} from '../services/contactsService';

/**
 * Fetch paginated contacts list
 */
export const fetchContacts = createAsyncThunk(
  'contacts/fetchContacts',
  async ({page = 1, search = ''} = {}, {rejectWithValue}) => {
    try {
      const response = await getContactsAPI(page, search);
      if (response?.code === 200) {
        return {
          data: response.requestData ?? [],
          meta: response.meta ?? {current_page: 1, last_page: 1, total: 0},
          page,
        };
      }
      return rejectWithValue(response?.message ?? 'Something_went_wrong');
    } catch (error) {
      return rejectWithValue(error.message ?? 'Something_went_wrong');
    }
  },
);

/**
 * Save a contact — optimistic update; reverts on failure
 */
export const saveContact = createAsyncThunk(
  'contacts/saveContact',
  async ({contactId, contactType}, {rejectWithValue}) => {
    try {
      const response = await saveContactAPI(contactId, contactType);
      if (response?.code === 200) {
        return {contactId, contactType};
      }
      return rejectWithValue(response?.message ?? 'Something_went_wrong');
    } catch (error) {
      return rejectWithValue(error.message ?? 'Something_went_wrong');
    }
  },
);

/**
 * Remove a saved contact
 */
export const removeContact = createAsyncThunk(
  'contacts/removeContact',
  async ({contactId, contactType}, {rejectWithValue}) => {
    try {
      const response = await removeContactAPI(contactId, contactType);
      if (response?.code === 200) {
        return {contactId, contactType};
      }
      return rejectWithValue(response?.message ?? 'Something_went_wrong');
    } catch (error) {
      return rejectWithValue(error.message ?? 'Something_went_wrong');
    }
  },
);

const contactsSlice = createSlice({
  name: 'contacts',
  initialState: {
    contacts: [],       // Full list of saved contacts
    savedIds: {},       // { "exhibitor_45": true, "visitor_12": true } — O(1) lookup
    loading: false,
    saving: {},         // { "exhibitor_45": true } — per-contact saving spinner
    removing: {},       // { "exhibitor_45": true } — per-contact removing spinner
    pagination: {
      current_page: 1,
      last_page: 1,
      total: 0,
    },
    error: null,
  },
  reducers: {
    // Optimistically mark a contact as saved (before API response)
    optimisticSave: (state, action) => {
      const {contactId, contactType} = action.payload;
      const key = `${contactType}_${contactId}`;
      state.savedIds[key] = true;
    },
    // Optimistically mark as NOT saved (before API response for removal)
    optimisticRemove: (state, action) => {
      const {contactId, contactType} = action.payload;
      const key = `${contactType}_${contactId}`;
      state.savedIds[key] = false;
    },
    // Seed saved IDs from a fresh contacts list
    setSavedIds: (state, action) => {
      const ids = {};
      (action.payload ?? []).forEach(c => {
        ids[`${c.contact_type}_${c.contact_id}`] = true;
      });
      state.savedIds = ids;
    },
    // Clear state on logout
    clearContacts: state => {
      state.contacts = [];
      state.savedIds = {};
      state.loading = false;
      state.saving = {};
      state.removing = {};
      state.pagination = {current_page: 1, last_page: 1, total: 0};
      state.error = null;
    },
  },
  extraReducers: builder => {
    // ── FETCH ────────────────────────────────────────────────────────────────
    builder
      .addCase(fetchContacts.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.loading = false;
        // For page 1, replace list; for subsequent pages, append
        if (action.payload.page === 1) {
          state.contacts = action.payload.data;
        } else {
          state.contacts = [...state.contacts, ...action.payload.data];
        }
        state.pagination = action.payload.meta;

        // Rebuild savedIds from the full list (page 1 refresh)
        if (action.payload.page === 1) {
          const ids = {};
          action.payload.data.forEach(c => {
            ids[`${c.contact_type}_${c.contact_id}`] = true;
          });
          state.savedIds = {...state.savedIds, ...ids};
        }
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── SAVE ─────────────────────────────────────────────────────────────────
    builder
      .addCase(saveContact.pending, (state, action) => {
        const {contactId, contactType} = action.meta.arg;
        state.saving[`${contactType}_${contactId}`] = true;
      })
      .addCase(saveContact.fulfilled, (state, action) => {
        const {contactId, contactType} = action.payload;
        const key = `${contactType}_${contactId}`;
        state.saving[key] = false;
        state.savedIds[key] = true;
      })
      .addCase(saveContact.rejected, (state, action) => {
        const {contactId, contactType} = action.meta.arg;
        const key = `${contactType}_${contactId}`;
        state.saving[key] = false;
        // Revert optimistic update
        state.savedIds[key] = false;
      });

    // ── REMOVE ───────────────────────────────────────────────────────────────
    builder
      .addCase(removeContact.pending, (state, action) => {
        const {contactId, contactType} = action.meta.arg;
        state.removing[`${contactType}_${contactId}`] = true;
      })
      .addCase(removeContact.fulfilled, (state, action) => {
        const {contactId, contactType} = action.payload;
        const key = `${contactType}_${contactId}`;
        state.removing[key] = false;
        state.savedIds[key] = false;
        // Remove from contacts list
        state.contacts = state.contacts.filter(
          c => !(c.contact_id === contactId && c.contact_type === contactType),
        );
      })
      .addCase(removeContact.rejected, (state, action) => {
        const {contactId, contactType} = action.meta.arg;
        const key = `${contactType}_${contactId}`;
        state.removing[key] = false;
        // Revert optimistic removal
        state.savedIds[key] = true;
      });
  },
});

export const {optimisticSave, optimisticRemove, setSavedIds, clearContacts} =
  contactsSlice.actions;

export default contactsSlice.reducer;
