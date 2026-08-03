import {postRequest} from './apiService'; // your Axios instance
import {ApiPaths} from './apiPaths';

export const getRecommandedForYou = async payload => {
  const response = await postRequest(ApiPaths.recommendedExhibitors, payload);
  return response;
};

export const getExhibitorDetails = async id => {
  const response = await postRequest(ApiPaths.exhibitorDetails, {
    id: id,
  });
  return response;
};

export const addInterest = async id => {
  const response = await postRequest(ApiPaths.addInterest, {
    id: id,
  });
  return response;
};

export const createMeeting = async (
  user_id,
  meeting_date,
  meeting_time,
  meeting_speaker,
  meeting_place,
  personel_message,
  meeting_type
) => {
  const response = await postRequest(ApiPaths.createMeeting, {
    user_id: user_id,
    meeting_date: meeting_date,
    meeting_time: meeting_time,
    meeting_speaker: meeting_speaker,
    meeting_place: meeting_place,
    personel_message: personel_message,
    meeting_type: meeting_type,
  });
  return response;
};

export const getExhibitors = async payload => {
  const response = await postRequest(ApiPaths.exhibitors, payload);
  return response;
};

export const createVMeeting = async (
  user_id,
  meeting_date,
  meeting_time,
  meeting_speaker,
  meeting_place,
  personel_message,
  meeting_type
) => {
  const response = await postRequest(ApiPaths.createVMeeting, {
    user_id: user_id,
    meeting_date: meeting_date,
    meeting_time: meeting_time,
    meeting_speaker: meeting_speaker,
    meeting_place: meeting_place,
    personel_message: personel_message,
    meeting_type: meeting_type,
  });
  return response;
};