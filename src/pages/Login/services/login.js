import request from "../../../utils/request";
import config from "../../../utils/config";

const { api } = config;
const { loginUrl } = api;

export async function login(params) {   
  return request({
    url: loginUrl,
    method: "get",
    params
  });
}
