import axios from 'axios';

const api = axios.create({
  timeout: 10000,
  baseURL: process.env.NODE_ENV === 'production'
    ? '/novoponto/backend'
    : 'http://192.168.0.109:3001' // ip fixo - video pra configurar > https://youtu.be/hRB1J5NxZdE
})


async function isOnline() {
  try {
    return navigator.onLine && await axios.get(window.location.host)
  } catch {
    return false;
  }
}


function successInterceptor(response) {
  const refreshToken = response.headers['refresh-token'];
  if (refreshToken) {
    api.defaults.headers.common['Authorization'] = `Bearer ${refreshToken}`;
    localStorage.token = refreshToken;
  }

  sessionStorage.requestTries && sessionStorage.removeItem('requestTries');

  return response;
}


function errorInterceptor(error) {
  if (error.message === 'Network Error' && isOnline()) error.message = 'Offline';
  
  const defaults = {
    'Offline': 'Hum... Parece que você está sem internet.',
    'Network Error': 'Falha ao contatar servidor. Tente novamente em alguns instantes.'
  }
    
  const message = defaults[error.message] ?? error.message;
  return Promise.reject(message);
}




api.interceptors.response.use(successInterceptor, errorInterceptor);
api.defaults.headers.common['Authorization'] = `Bearer ${localStorage.token}`;


export default api;