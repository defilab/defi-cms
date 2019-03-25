import { fetchDataSpecs } from '@/services/api';

export default {
  namespace: 'dataSpecs',

  state: {
    dataSpecs: [],
  },

  effects: {
    * fetch ({ payload }, { call, put }) {
      const data = yield call(fetchDataSpecs, payload.namespace);
      yield put({
        type: 'update',
        payload: data,
      });
    },
    * clear (_, { put }) {
      yield put({
        type: 'update',
        payload: [],
      });
    },
  },

  reducers: {
    update (_, action) {
      return {
        dataSpecs: action.payload,
      };
    },
  },
};
