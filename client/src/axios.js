import axios from 'axios';

export const instance = axios.create({
  // baseURL: 'http://localhost:9000/api/'
  baseURL: 'https://notely-app.herokuapp.com/api/'
});

export const authInstance = axios.create({
  // baseURL: 'http://localhost:9000/api/auth/'
  baseURL: 'https://notely-app.herokuapp.com/api/auth/'
});
