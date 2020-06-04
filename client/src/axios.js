import axios from 'axios';

export const instance = axios.create({
  baseURL: 'https://notely-app.herokuapp.com/api/'
});

export const authInstance = axios.create({
  baseURL: 'https://notely-app.herokuapp.com/api/auth/'
});
