import { stringify } from 'qs';
import request from '@/utils/request';
import { Base64 } from 'js-base64';

export async function login (params) {
  const body = new FormData();
  body.append('grant_type', 'password');
  body.append('username', params.userName);
  body.append('password', params.password);

  return request('/oauth/tokens', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Base64.encode('admin:secret')}`,
    },
    body,
  }).then((data) => {
    if (data) {
      return {
        status: 'ok',
        type: params.type,
        currentAuthority: 'admin',
        token: data.access_token,
      };
    }
    throw new Error('Login failed');
  });
}

export async function register () {
  return null;
}

export async function fetchOrganization (namespace) {
  return request(`/organizations/${namespace}`);
}

export async function fetchOrganizations () {
  const params = {
    page_size: 100,
  };

  return request(`/organizations?${stringify(params)}`).then((data) => data.items);
}

export async function fetchRequests (namespace) {
  return request(`/organizations/${namespace}/transactions/request`).then((data) => data.items);
}

export async function fetchResponses (namespace) {
  return request(`/organizations/${namespace}/transactions/response`).then((data) => data.items);
}

export async function fetchDataSpecs (namespace) {
  return Promise.all([
    request(`/organizations/${namespace}/requests?state=reviewing&request_type=create_spec`)
      .then((data) => data.items.map((item) => ({
        ...item,
        reviewState: item.state,
        state: item.content.state,
        name: item.content.name,
        canonical_name: item.content.canonical_name,
        public: item.content.public,
      }))),
    request(`/organizations/${namespace}/specs`).then((data) => data.items.map((item) => ({
      ...item,
      reviewState: 'accepted',
    })))])
    .then((data) => [...data[0], ...data[1]].sort((a, b) => {
      if (a.created_at > b.created_at) {
        return -1;
      }
      if (a.created_at < b.created_at) {
        return 1;
      }
      return 0;
    }));
}

export async function fetchDataSpec (params) {
  return request(`/organizations/${params.namespace}/specs/${params.spec}`);
}

export async function fetchTransactions (namespace) {
  return request(`/organizations/${namespace}/transactions/balance`).then((data) => data.items);
}

export async function createDataSpec (data) {
  const { user: { currentUser: { namespace } } } = window.g_app._store.getState();
  return request(`/organizations/${namespace}/specs`, {
    method: 'POST',
    body: data,
  });
}

export async function updateDataSpec (data) {
  const { user: { currentUser: { namespace } } } = window.g_app._store.getState();
  return request(`/organizations/${namespace}/specs/blacklist`, {
    method: 'PATCH',
    body: data,
  });
}

export async function fetchPlatformDataSpecs () {
  return request(`/organizations/platform/specs`).then((data) => data.items);
}

export async function downloadFile (url) {
  return request(url);
}

export async function fetchActiveCert () {
  const { user: { currentUser: { namespace } } } = window.g_app._store.getState();
  return request(`/organizations/${namespace}/certs`).then((data) => data.items);
}
