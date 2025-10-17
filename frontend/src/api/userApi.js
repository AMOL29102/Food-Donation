import API from './axiosInstance';

export const getProfileRequest = () => API.get('/users/profile');
export const updateProfileRequest = (profileData) => API.put('/users/profile', profileData);