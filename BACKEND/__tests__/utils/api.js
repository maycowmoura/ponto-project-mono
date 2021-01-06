const axios = require('axios');

const api = axios.create({
  baseURL: 'http://novoponto',
  timeout: 10000
});

api.defaults.headers.common['Authorization'] = `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjbGllbnQiOiJ0ZXN0ZSIsInVzZXIiOjEwMDEsInR5cCI6ImFkbWluIiwicmVmcmVzaCI6IjAiLCJleHAiOjE2MDk4ODY4Mjh9.L954y8q0pPSIJNLMGiMrgZEAOi4HeQXI_KJSkSbp9cI`;

module.exports = api;