import { message } from 'antd';
import { fetchDataSpec, updateDataSpec, fetchPlatformDataSpecs } from '@/services/api';

export default {
  namespace: 'dataSpec',

  state: {
    dataSpec: {
      properties: {},
    },
  },

  effects: {
    * fetch ({ payload, callback }, { call, put }) {
      const data = yield call(fetchDataSpec, payload);
      yield put({
        type: 'update',
        payload: data,
      });
      callback(data);
    },
    * fetchPlatformSpecs ({ callback }, { call }) {
      const data = yield call(fetchPlatformDataSpecs);
      callback(data);
    },
    * patch ({ payload, callback }, { call }) {
      try {
        yield call(updateDataSpec, {
          ...payload,
          reference: payload.canonical_name,
        });
        callback();
        message.success('编辑成功');
      } catch (error) {
        message.error('编辑失败');
      }
    },
    * clear (_, { put }) {
      yield put({
        type: 'update',
        payload: {
          properties: {},
        },
      });
    },
  },

  reducers: {
    update (_, action) {
      return {
        dataSpec: { ...action.payload, properties: action.payload.properties || {} },
      };
    },
  },
};
