import pathToRegexp from "path-to-regexp";
import { routerRedux } from "dva";
import localStorage from "../../../utils/localStorage";
import { login } from "../services/login";

export default {
    namespace: "login",
    state: {
      text: "login model"
    },
    subscriptions: {
      setup({ dispatch, history }) {
        history.listen(({ pathname }) => {
          const match = pathToRegexp("/Login").exec(pathname);
          if (match) {
            dispatch({
                type: "app/stateClear"
            });
          }
        });
      }
    },
    effects: {
      *login({ payload }, { call, put, select }) {
        const { status, message, userName, currentAuthority, token } = yield call(login, { ...payload });
        localStorage.clear();
        
        if (status === 'ok') {
          userName && localStorage.set("userName", userName);          
          currentAuthority && localStorage.set("role", currentAuthority);
          token && localStorage.set("jwt", token);
          yield put(routerRedux.push('/Home'));
        } else {
          throw message;
        }
      }
    },
    reducers: {
      updateState(state, { payload }) {
        return {
          ...state,
          ...payload
        };
      }
    }
  };
  