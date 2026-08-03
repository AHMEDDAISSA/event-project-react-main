import {getRequest, postRequest} from './apiService';
import {ApiPaths} from './apiPaths';

export const loginUser = async (email, password, provider, deviceToken) => {
  try {
    const response = await postRequest(ApiPaths.login, {
      email: email,
      password: password,
      provider: provider,
      device_token: deviceToken,
    });    

    if (response.code != 200) {
      throw new Error(response.message || 'signin_failed');
    } else {
      console.log("response info: ", response);
      return response;
    }
  } catch (error) {
    throw error.message || 'signin_failed';
  }
};

export const fetchUserByToken = async () => {
  try {
    const response = await getRequest(ApiPaths.getUser);

    if (response.code != 200) {
      throw new Error(response.message || 'err_load_user_data');
    } else {
      return response;
    }
  } catch (error) {
    throw error.message || 'err_load_user_data';
  }
};

export const loadAppData = async () => {
  try {
    const response = await getRequest(ApiPaths.loader);
    console.log("response loader", response);
    if (response.code != 200) {
      throw new Error(response.message || 'err_load_data');
    } else {
      return response;
    }
  } catch (error) {
    throw error.message || 'err_load_data';
  }
};
