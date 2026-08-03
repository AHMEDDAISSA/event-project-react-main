import {postRequest} from './apiService'; // your Axios instance
import { ApiPaths } from './apiPaths';

export const updateUserInfo = async (payload) => {
  const response = await postRequest(ApiPaths.editProfile, payload);
  return response.data;
};

export const markNotifAsRead = async id => {
  const response = await postRequest(ApiPaths.markAsRead, {"id": id});  
  return response;
};

export const updateSpeakers = async (payload) => {
  const response = await postRequest(ApiPaths.editSpeakers, payload);  
  return response;
};
