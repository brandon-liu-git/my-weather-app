import request from "../utils/request";
import config from "../utils/config";

const { api } = config;
const { checkLoggedInUrl } = api;

export async function checkLoggedIn(params) {   
  return request({
    url: checkLoggedInUrl,
    method: "get",
    params
  });
}
