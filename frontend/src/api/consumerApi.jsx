import API from './axiosInstance';

export const getAvailableFood = () => API.get('/consumer/available-food');

export const bookFoodRequest = (bookingData) => {
    console.log("Sending booking data:", bookingData);
    // **FIX: You must return the promise from the API call**
    return API.post('/consumer/book', bookingData);
}

export const getConsumerBookings = () => API.get('/consumer/bookings');
export const cancelBookingRequest = (id) => API.put(`/consumer/bookings/${id}/cancel`);