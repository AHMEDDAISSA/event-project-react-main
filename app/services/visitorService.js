import {postRequest, postRequestWithParams} from './apiService';
import {ApiPaths} from './apiPaths';

export const getVisitorsList = async (page, search) => {
  const response = await postRequestWithParams(
    `${ApiPaths.visitors + ApiPaths.apiKey}&page=${page}`,
    {search: search},
  );
  return response;
};

export const getVisitorDetails = async id => {
  const response = await postRequest(ApiPaths.visitorDetails, {
    id: id,
  });
  return response;
};

export const addInterestToVisitor = async id => {
  const response = await postRequest(ApiPaths.addInterestVisitor, {
    id: id,
  });
  return response;
};