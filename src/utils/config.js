const domainService = require('./domainService');
const apiTemp = domainService.apiTemp;

module.exports = {
  CORS: [apiTemp],
  app_id: '6ea4BY6s',
  consumer_key:
    'dj0yJmk9eVQyaTdWY0xhM3NBJmQ9WVdrOU5tVmhORUpaTm5NbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PTI2',
  consumer_secret: '9edc3ce4c3b993cac8e58e5be467be579f2b7fd6',
  api: {
    loginUrl: `${apiTemp}/my_weather_app/login`,
    getWeatherUrl: 'https://weather-ydn-yql.media.yahoo.com/forecastrss',
    checkLoggedInUrl: `${apiTemp}/my_weather_app/check_logged_in`, 
    getLocationsUrl: `${apiTemp}/my_weather_app/get_locations`, 
  },
};
