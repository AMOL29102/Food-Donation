import API from './axiosInstance';

// **FIX: Correct API endpoint to fetch available food**
export const getAvailableFood = () => API.get('/consumer/available-food');

export const bookFoodRequest = (bookingData) => API.post('/consumer/book', bookingData);
export const getConsumerBookings = () => API.get('/consumer/bookings');
export const cancelBookingRequest = (id) => API.put(`/consumer/bookings/${id}/cancel`);