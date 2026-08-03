import { postRequest } from './apiService';
import { ApiPaths } from './apiPaths';

const resetPasswordOTP = async (email) => {
  try {
    const response = await postRequest(ApiPaths.resetPasswordOtp, { email });
    console.log('API Response (OTP):', response); 
    return response; 
  } catch (error) {
    console.log('API resetPasswordOTP Error:', error.response?.data || error.message); 
    throw error;
  }
};

const resetPassword = async (otp, password) => {
  try {
    const response = await postRequest(ApiPaths.resetPassword, { otp, password });
    console.log('API Response (Reset):', response); 
    return response; 
  } catch (error) {
    console.log('API resetPassword Error:', error.response?.data || error.message); 
    throw error;
  }
};

const changePassword = async ({ old_password, password }) => {  
  const response = await postRequest(ApiPaths.changePassword, { old_password, password });
  return response;
};

export default { resetPasswordOTP, resetPassword, changePassword };
