import {getRequest, postRequest} from './apiService';
import {ApiPaths} from './apiPaths';

export const fetchRegisterData = async () => {
  try {
    const data = await getRequest(ApiPaths.registerData);
    return data;
  } catch (error) {
    throw error;
  }
};

export const registerUser = async (
  visitor_profile,
  name,
  last_name,
  company_name,
  company_adress,
  company_sector,
  job_title,
  job_function,
  Countrycode,
  phone,
  website,
  email,
  image,
  password,
) => {
  try {
    const response = await postRequest(ApiPaths.register, {
      visitor_profile,
      name,
      last_name,
      company_name,
      company_adress,
      company_sector,
      job_title,
      job_function,
      Countrycode,
      phone,
      website,
      email,
      image,
      password,
    });

    if (response.code != 200) {
      throw response;
    } else {
      return response;
    }
  } catch (error) {
    throw error;
  }
};

export const registerExhibitor = async (
  name,
  last_name,
  organization_name,
  company_adress,
  company_sector,
  job_title,
  job_function,
  square_metres,
  comments,
  Countrycode,
  phone,
  website,
  email,
  image,
  password,
) => {
  try {
    const response = await postRequest(ApiPaths.registerExhibitor, {
      name,
      last_name,
      organization_name,
      company_adress,
      company_sector,
      job_title,
      job_function,
      square_metres,
      comments,
      Countrycode,
      phone,
      website,
      email,
      image,
      password,
    });

    if (response.code != 200) {
      throw response;
    } else {
      return response;
    }
  } catch (error) {
    throw error;
  }
};