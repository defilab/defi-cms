import { fetchResponses } from '@/services/api';

export default {
  namespace: 'responses',

  state: {
    responses: [],
  },

  effects: {
    * fetch ({ payload }, { call, put }) {
      const data = yield call(fetchResponses, payload.namespace);
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
        responses: action.payload,
      };
    },
  },
};
