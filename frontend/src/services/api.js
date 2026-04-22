const BASE_URL = '/api';

const request = async (endpoint, options = {}) => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message = data?.error?.message || `HTTP ${res.status}`;
    throw new Error(message);
  }

  return data;
};

export const get = (endpoint, params) => {
  const url = params ? `${endpoint}?${new URLSearchParams(params)}` : endpoint;
  return request(url);
};

export const post = (endpoint, body) =>
  request(endpoint, { method: 'POST', body: JSON.stringify(body) });

export const put = (endpoint, body) =>
  request(endpoint, { method: 'PUT', body: JSON.stringify(body) });

export const del = (endpoint) => request(endpoint, { method: 'DELETE' });
