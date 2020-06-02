import axios from 'axios';

export const instance = axios.create({
  // baseURL: 'http://localhost:9000/api/'
  baseURL: '/api/'
});

export const authInstance = axios.create({
  // baseURL: 'http://localhost:9000/api/auth/'
  baseURL: '/api/auth/'
});

// set the jwt token header for all requests
instance.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
