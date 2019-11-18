// import { extend } from 'umi-request';
// import { notification } from 'antd';

// const codeMessage = {
//   200: 'OK',
//   201: 'Created',
//   202: 'Accepted',
//   204: 'The server successfully processed the request and is not returning any content.',
//   400: 'Bad Request',
//   401: 'Unauthorized',
//   403: 'Forbidden',
//   404: 'The requested resource could not be found but may be available in the future. Subsequent requests by the client are permissible.',
//   406: 'Not Acceptable',
//   410: 'Indicates that the resource requested is no longer available and will not be available again.',
//   422: 'The request was well-formed but was unable to be followed due to semantic errors.',
//   500: 'Internal Server Error',
//   502: 'The server was acting as a gateway or proxy and received an invalid response from the upstream server. ',
//   503: 'Service Unavailable',
//   504: 'Gateway Timeout',
// };

// const errorHandler = error => {
//   const { response } = error;

//   if (response && response.status) {
//     const errorText = codeMessage[response.status] || response.statusText;
//     const { status, url } = response;
//     notification.error({
//       message: `Request Error ${status}: ${url}`,
//       description: errorText,
//     });
//   } else if (!response) {
//     notification.error({
//       description: 'Cannot connect to the server. ',
//       message: 'Server Error ',
//     });
//   }

//   return response;
// };


// const request = extend({
//   errorHandler,
//   credentials: 'include', 
// });
// export default request;

import axios from "axios";
import qs from "qs";
import jsonp from "jsonp";
import lodash from "lodash";
import { message } from "antd";
import config from "./config";
import localStorage from "./localStorage";
const YQL = config.YQL;
const CORS = config.CORS;

const fetch = options => {
  let { method = "get", params, fetchType, url } = options;
  let data = JSON.parse(JSON.stringify(params || {}));
  let cloneData = lodash.cloneDeep(data);

  try {
    let domin = "";
    if (url.match(/[a-zA-z]+:\/\/[^/]*/)) {
      domin = url.match(/[a-zA-z]+:\/\/[^/]*/)[0];
      url = url.slice(domin.length);
    }
    url = domin + url;
  } catch (e) {
    message.error(e.message);
  }

  if (fetchType === "JSONP") {
    return new Promise((resolve, reject) => {
      jsonp(
        url,
        {
          param: `${qs.stringify(data)}&callback`,
          name: `jsonp_${new Date().getTime()}`,
          timeout: 4000
        },
        (error, result) => {
          if (error) {
            reject(error);
          }
          resolve({ statusText: "OK", status: 200, data: result });
        }
      );
    });
  } else if (fetchType === "YQL") {
    url = `http://query.yahooapis.com/v1/public/yql?q=select * from json where url='${
      options.url
    }?${encodeURIComponent(qs.stringify(options.data))}'&format=json`;
    data = null;
  }

  let token = localStorage.get("jwt");
  if (token) {
    if (method.toLowerCase() === "get") {
      if (cloneData && !!Object.keys(cloneData).length) {
        cloneData.token = token;
      } else {
        cloneData = { token };
      }
    } else if (url.indexOf("?") > 0) {
      url = `${url}&token=${token}`;
    } else {
      url = `${url}?token=${token}`;
    }
  }
  cloneData.type = 'Bearer';
  switch (method.toLowerCase()) {
    case "get":
      return axios.get(url, {
        params: cloneData
      });
    case "delete":
      return axios.delete(url, {
        data: cloneData
      });
    case "post":
      return axios.post(url, cloneData);
    case "put":
      return axios.put(url, cloneData);
    case "patch":
      return axios.patch(url, cloneData);
    default:
      return axios(options);
  }
};

export default function request(options) {  
  if (options.url && options.url.indexOf("//") > -1) {
    const origin = `${options.url.split("//")[0]}//${
      options.url.split("//")[1].split("/")[0]
    }`;
    if (window.location.origin !== origin) {      
      if (CORS && CORS.indexOf(origin) > -1) {
        options.fetchType = "CORS";
      } else if (YQL && YQL.indexOf(origin) > -1) {
        options.fetchType = "YQL";
      } else {
        options.fetchType = "JSONP";
      }
    }
  }  
  return fetch(options)
    .then(response => {      
      const { statusText, status } = response;            
      let data =
        options.fetchType === "YQL"
          ? response.data.query.results.json
          : response.data;
      if (data instanceof Array) {
        data = {
          list: data
        };
      }
      return Promise.resolve({
        success: true,
        message: statusText,
        statusCode: status,
        ...data
      });
    })
    .catch(error => {
      const { response } = error;
      return Promise.reject(response.data || {});
    });
}
