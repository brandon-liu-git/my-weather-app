import config from './config';
import request from './request';
import constants from './constants';

const getDate = dateTimeStamp => {
  let date = new Date(dateTimeStamp * 1000);
  let day = constants.daysMap[date.getDay()];
  let month = constants.monthsMap[date.getMonth()] + ' ' + date.getDate();
  return day + ', ' + month;
};

const getTime = dateTimeStamp => {
  let date = new Date(dateTimeStamp * 1000)
  let hours = date.getHours() ? date.getHours() : "00";
  let minutes = date.getMinutes() ? date.getMinutes() : "00"; 
  let seconds = date.getSeconds() ? date.getSeconds() : "00"; 
  return hours + ":" + minutes + ":" + seconds;
}

export default {
  config,
  request,
  localStorage,
  constants,
  getDate, 
  getTime
};
