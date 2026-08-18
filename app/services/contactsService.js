import {postRequest, getRequest} from './apiService';
import {ApiPaths} from './apiPaths';

/**
 * Save a contact (exhibitor or visitor) to the user's event passport
 * Idempotent — duplicate calls are safe
 */
export const saveContact = async (contactId, contactType) => {
  const response = await postRequest(ApiPaths.saveContact, {
    contact_id: contactId,
    contact_type: contactType,
  });
  return response;
};

/**
 * Fetch the user's saved contacts list (paginated)
 */
export const getContacts = async (page = 1, search = '') => {
  const response = await getRequest(ApiPaths.getContacts, {
    page,
    search,
  });
  return response;
};

/**
 * Remove a saved contact by contact_id + contact_type
 */
export const removeContact = async (contactId, contactType) => {
  const response = await postRequest(ApiPaths.removeContact, {
    contact_id: contactId,
    contact_type: contactType,
  });
  return response;
};
