import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:9000/'
});

// set the jwt token header for all requests
instance.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');

export default instance;
