import config from '../../../utils/config';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import _ from 'lodash';
import request from "../../../utils/request";

const { api, app_id, consumer_key, consumer_secret } = config;
const { getWeatherUrl, getLocationsUrl } = api;

let method = 'GET';
let concat = '&';

export async function getLocations(params) {
  return request({
    url: getLocationsUrl,
    method: "get"
  });
}

export async function getWeather(params) {
  const { location } = params;
  let merged = {}; 
  let query = {'location': location, 'format': 'json'};
  let oauth = {
    'oauth_consumer_key': consumer_key,
    'oauth_nonce': Math.random().toString(36).substring(2),
    'oauth_signature_method': 'HMAC-SHA1',
    'oauth_timestamp': parseInt(new Date().getTime() / 1000).toString(),
    'oauth_version': '1.0'
  };
  _.merge(merged, query, oauth);

  let merged_arr = Object.keys(merged).sort().map(function(k) {
    return [k + '=' + encodeURIComponent(merged[k])];
  });
  let signature_base_str = method
    + concat + encodeURIComponent(getWeatherUrl)
    + concat + encodeURIComponent(merged_arr.join(concat));

  let composite_key = encodeURIComponent(consumer_secret) + concat;
  let hash = CryptoJS.HmacSHA1(signature_base_str, composite_key);
  let signature = hash.toString(CryptoJS.enc.Base64);

  oauth['oauth_signature'] = signature;

  let auth_header = 'OAuth ' + Object.keys(oauth).map(function(k) {
    return [k + '="' + oauth[k] + '"'];
  }).join(',');
  
  let instance = axios.create({
    timeout: 10000,
    headers: {
      'Authorization': auth_header,
      'X-Yahoo-App-Id': app_id 
    }
  });

  return instance.get(getWeatherUrl, {
    params: {
      format: 'json',
      location: location,
    }
  });
}
