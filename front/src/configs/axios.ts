// ** Axios Imports
import axios from 'axios';
import i18n from 'i18next'

const getCookie = (name: string) => {
    const cookie = document.cookie
        .split('; ')
        .find(row => row.startsWith(name + '='));
    return cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
};


const axiosInstance = axios.create({
    baseURL: process.env.API_URL,
    xsrfCookieName: 'csrftoken',
    xsrfHeaderName: 'X-CSRFTOKEN',
    withCredentials: true,
})

// Request interceptor for API calls
axiosInstance.interceptors.request.use(
    async config => {
        config.headers['Accept-Language'] = i18n.language.split('-')[0];
        
        const csrfToken = getCookie('csrftoken');
        if (csrfToken) {
            config.headers['X-CSRFToken'] = csrfToken;
        }
        
        return config;
    },
    error => {
        Promise.reject(error)
    });

export default axiosInstance
