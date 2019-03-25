import { fetchOrganizations } from '@/services/api';

export default {
  namespace: 'organizations',

  state: {
    organizations: []
  },

  effects: {
    * fetch (_, { call, put }) {
      const data = yield call(fetchOrganizations);
      yield put({
        type: 'update',
        payload: data,
      });
    },
  },

  reducers: {
    update(_, action) {
      return {
        organizations: action.payload,
      };
    },
  },
};
