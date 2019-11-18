import pathToRegexp from 'path-to-regexp';
import { getWeather } from '../services/home';

export default {
  namespace: 'home',
  state: {
    text: 'home model',
    forecasts: [],
    current_observation: {
      astronomy: {},
      atmosphere: {},
      condition: {},
      wind: {},
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const match = pathToRegexp('/Home').exec(pathname);
        if (match) {

        }
      });
    },
  },
  effects: {
    *getWeather({ payload }, { call, put, select }) {      
      const { data } = yield call(getWeather, { ...payload });
      const { forecasts, current_observation } = data;
      
      if (!!forecasts && forecasts.length >= 0) {
        yield put({
          type: 'updateState',
          payload: {
            forecasts: forecasts,
            current_observation: current_observation,
          },
        });
      }
    },
  },
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    }
  },
};
