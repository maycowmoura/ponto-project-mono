const api = require('./api');
const { invalidToken, markerToken } = require('./vars');

module.exports = {

  async invalidToken(url, method = 'get', data = {}, params = {}) {
    const response = await api.request({
      url,
      method,
      data,
      params,
      headers: { Authorization: invalidToken }
    });
    expect(response.data?.error).toMatch('Chave de acesso inválida.');
  },

  async mustBeAdmin(url, method, data = {}, params = {}) {
    const response = await api.request({
      url,
      method,
      data,
      params,
      headers: { Authorization: markerToken }
    });

    expect(response.data).toEqual({
      "error": "Acesso negado. Você precisa ser administrador para executar esta ação."
    })
  }


}