import {postRequest, postRequestWithParams} from './apiService';
import {ApiPaths} from './apiPaths';

export const getMeetingSent = async (page, status) => {
  const response = await postRequestWithParams(
    `${ApiPaths.meetingSent + ApiPaths.apiKey}&page=${page}`,
    {status: status},
  );
  return response;
};

export const getMeetingReceived = async (page, status) => {
  const response = await postRequestWithParams(
    `${ApiPaths.meetingReceived + ApiPaths.apiKey}&page=${page}`,
    {status: status},
  );
  return response;
};

export const getMeetingConfirmed = async (page, date) => {
  const response = await postRequestWithParams(
    `${ApiPaths.meetingConfirmed + ApiPaths.apiKey}&page=${page}`,
    {date: date},
  );
  return response;
};

export const acceptMeeting = async id => {
  const response = await postRequest(`${ApiPaths.acceptMeeting}`, {id: id});
  return response;
};

export const refuseMeeting = async id => {
  const response = await postRequest(`${ApiPaths.refuseMeeting}`, {id: id});

  return response;
};

export const cancelMeeting = async id => {
  const response = await postRequest(`${ApiPaths.cancelMeeting}`, {id: id});
  return response;
};
