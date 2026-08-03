import {postRequest, postRequestWithParams} from './apiService';
import {ApiPaths} from './apiPaths';

export const getConferencesList = async page => {
  const response = await postRequestWithParams(
    `${ApiPaths.conference + ApiPaths.apiKey}&page=${page}`,
  );
  return response;
};

export const addRemoveToSchedule = async id => {
  const response = await postRequest(`${ApiPaths.addRemoveToSchedule}`, {
    id: id,
  });
  return response;
};

export const getMySchedulesList = async page => {
  const response = await postRequestWithParams(
    `${ApiPaths.mySchedule + ApiPaths.apiKey}&page=${page}`,
  );
  return response;
};

export const getSponsorsList = async page => {
  const response = await postRequestWithParams(
    `${ApiPaths.sponsors + ApiPaths.apiKey}&page=${page}`,
  );
  return response;
};