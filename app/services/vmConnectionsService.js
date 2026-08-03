import {postRequest, postRequestWithParams} from './apiService';
import {ApiPaths} from './apiPaths';

export const getVMeetingSent = async (page, status) => {
  const response = await postRequestWithParams(
    `${ApiPaths.VMeetingSent + ApiPaths.apiKey}&page=${page}`,
    {status: status},
  );
  return response;
};

export const getVMeetingReceived = async (page, status) => {
  const response = await postRequestWithParams(
    `${ApiPaths.VMeetingReceived + ApiPaths.apiKey}&page=${page}`,
    {status: status},
  );
  return response;
};

export const getVMeetingConfirmed = async (page, date) => {
  const response = await postRequestWithParams(
    `${ApiPaths.VMeetingConfirmed + ApiPaths.apiKey}&page=${page}`,
    {date: date},
  );
  return response;
};

export const acceptVMeeting = async id => {
  const response = await postRequest(`${ApiPaths.acceptVMeeting}`, {id: id});
  return response;
};

export const refuseVMeeting = async id => {
  const response = await postRequest(`${ApiPaths.refuseVMeeting}`, {id: id});

  return response;
};

export const cancelVMeeting = async id => {
  const response = await postRequest(`${ApiPaths.cancelVMeeting}`, {id: id});
  return response;
};
