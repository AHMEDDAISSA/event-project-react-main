import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  card: {
    borderRadius: 8,
    marginHorizontal: 3,
    marginVertical: 10,
    marginBottom: 10,
    borderWidth: 0.5,
  },
  searchText: {
    fontSize: 16,
    borderRadius: 10,
    marginBottom: 20,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  addButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 10,
  },
  modalContent: {
    borderRadius: 20,
    padding: 20,
  },
  imagePicker: {
    alignSelf: 'center',
    marginTop: 20,
  },
  imagePreview: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  imageActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    paddingHorizontal: 16,
    height: 45,
    borderRadius: 12,
  },
});
