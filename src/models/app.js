import { message } from 'antd';
import { routerRedux } from 'dva';
import localStorage from '../utils/localStorage';
import { checkLoggedIn } from '../services/global';

export default {
  namespace: 'app',
  state: {},
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/Login') {
          return false;
        }
        const storage = localStorage.get();
        dispatch({ type: 'updateState', payload: storage });
      });
    },
  },
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    newState(state, { payload }) {
      return { ...payload };
    },
    emptyState() {
      return {};
    },
  },
  effects: {
    *checkLoggedIn({ payload }, { call, put }) {
      const { token } = payload;
      if (!token) {
        yield put(routerRedux.push({ pathname: '/Login' }));
      }
      const { success, message } = yield call(checkLoggedIn, {});
      if (!success || message === 'Logged Out') {
        yield put(routerRedux.push({ pathname: '/Login' }));
      } else {
        return;
      }
    },

    *stateClear({ payload }, { call, put }) {
      yield put({ type: 'emptyState' });
    },

    *logout({ payload }, { call, put }) {
      localStorage.clear();
      yield put(routerRedux.push({ pathname: '/Login' }));
    },

    *errorHandler({ payload }, { put }) {
      const { error } = payload;
      if (error.message === 'No token provided.') {
        message.warning('Your session has expired. Please login again.');
        yield put({
          type: 'logout',
        });
      } else if (error.message === 'Cannot select the same tokens.') {
        message.warning(error.message);
      } else {
        message.warning(error.message);
      }
    },
  },
};
