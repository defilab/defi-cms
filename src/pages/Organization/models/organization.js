import { fetchOrganization } from '@/services/api';

export default {
  namespace: 'organization',

  state: {
    organization: {
      expense: {},
      income: {}
    }
  },

  effects: {
    * fetch ({payload}, { call, put }) {
      const data = yield call(fetchOrganization, payload.namespace);
      yield put({
        type: 'update',
        payload: data,
      });
    },
    * clear (_, { put }) {
      yield put({
        type: 'update',
        payload: {
          expense: {},
          income: {}
        }
      })
    }
  },

  reducers: {
    update(_, action) {
      return {
        organization: action.payload,
      };
    },
  },
};
