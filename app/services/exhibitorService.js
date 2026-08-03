import {postRequest, postRequestWithParams} from './apiService';
import {ApiPaths} from './apiPaths';

export const getMyInterstedList = async (page, search) => {
  const response = await postRequestWithParams(
    `${ApiPaths.myInterstedList + ApiPaths.apiKey}&page=${page}`,
    {search: search},
  );
  return response;
};

export const getInterstedInYouList = async (page, search) => {
  const response = await postRequestWithParams(
    `${ApiPaths.interestedInYouList + ApiPaths.apiKey}&page=${page}`,
    {search: search},
  );
  return response;
};

export const getRecommendedForYouList = async (page, search) => {
  const response = await postRequestWithParams(
    `${ApiPaths.recommendedForYouList + ApiPaths.apiKey}&page=${page}`,
    {search: search},
  );
  return response;
};

export const getExhibitorsList = async (page, search) => {
  const response = await postRequestWithParams(
    `${ApiPaths.exhibitors + ApiPaths.apiKey}&page=${page}`,
    {search: search},
  );
  return response;
};
