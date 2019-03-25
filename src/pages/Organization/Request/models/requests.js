import { fetchRequests } from '@/services/api';

export default {
  namespace: 'requests',

  state: {
    requests: [],
  },

  effects: {
    * fetch ({ payload }, { call, put }) {
      const data = yield call(fetchRequests, payload.namespace);
      yield put({
        type: 'update',
        payload: data,
      });
    },
    * clear (_, { put }) {
      yield put({
        type: 'update',
        payload: []
      })
    }
  },

  reducers: {
    update (_, action) {
      return {
        requests: action.payload,
      };
    },
  },
};
