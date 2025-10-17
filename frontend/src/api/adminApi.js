import API from './axiosInstance';

export const getProvidersRequest = () => API.get('/admin/providers');
export const approveProviderRequest = (id) => API.put(`/admin/providers/${id}/approve`);
export const blockProviderRequest = (id) => API.put(`/admin/providers/${id}/block`);

// **FIX: Add the new API calls**
export const getConsumersRequest = () => API.get('/admin/consumers');
export const getAllBookingsRequest = () => API.get('/admin/bookings');