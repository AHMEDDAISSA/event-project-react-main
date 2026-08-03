import axios from 'axios';
import { ApiPaths } from './apiPaths';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create an Axios instance
const apiClient = axios.create({
  baseURL: ApiPaths.baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach token dynamically
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Generic GET method
export const getRequest = async (endpoint, params = {}) => {
  try {
    const response = await apiClient.get(endpoint + ApiPaths.apiKey, { params });
    console.log("API URL - GET: ", endpoint + ApiPaths.apiKey);

    if (!response || !response.data) {
      throw new Error('No data received from API');
    }

    return response.data;
  } catch (error) {
    console.error(`GET ERROR (${error.response?.status}):`, error.response?.data);
    return {
      code: error.response?.status || 500,
      message: "Something_went_wrong",
      errorData: error.response?.data || null,
      validationError: error.response?.data?.validationError || null,
      requestData: null,
    }
  }
};

// Generic POST method
export const postRequest = async (endpoint, data) => {
  try {
    const response = await apiClient.post(endpoint + ApiPaths.apiKey, data);
    console.log("API URL - POST: ", endpoint + ApiPaths.apiKey);
    return response.data;
  } catch (error) {
    console.error(`POST ERROR (${error.response?.status}):`, error.response?.data);

    return {
      code: error.response?.status || 500,
      message: "Something_went_wrong",
      errorData: error.response?.data || null,
      validationError: error.response?.data?.validationError || null,
      requestData: null,
    };
  }
};

export const postRequestWithParams = async (endpoint, data) => {
  try {
    const response = await apiClient.post(endpoint, data);    
    console.log("API URL - POST: ", endpoint);
    return response.data;
  } catch (error) {
    console.error(`Post with params ERROR (${error.response?.status}):`, error.response?.data);
    return {
      code: error.response?.status || 500,
      message: "Something_went_wrong",
      errorData: error.response?.data || null,
      validationError: error.response?.data?.validationError || null,
      requestData: null,
    }
  }
};

// Generic PUT method
export const putRequest = async (endpoint, data) => {
  try {
    const response = await apiClient.put(endpoint + ApiPaths.apiKey, data);
    console.log("API URL - PUT: ", endpoint + ApiPaths.apiKey);
    return response.data;
  } catch (error) {
    console.error(`PUT ERROR (${error.response?.status}):`, error.response?.data);
    return {
      code: error.response?.status || 500,
      message: "Something_went_wrong",
      errorData: error.response?.data || null,
      validationError: error.response?.data?.validationError || null,
      requestData: null,
    }
  }
};

// Generic DELETE method
export const deleteRequest = async (endpoint) => {
  try {
    const response = await apiClient.delete(endpoint + ApiPaths.apiKey);
    console.log("API URL - DELETE: ", endpoint + ApiPaths.apiKey);
    return response.data;
  } catch (error) {
    console.error(`DELETE ERROR (${error.response?.status}):`, error.response?.data);
    return {
      code: error.response?.status || 500,
      message: "Something_went_wrong",
      errorData: error.response?.data || null,
      validationError: error.response?.data?.validationError || null,
      requestData: null,
    }
  }
};
