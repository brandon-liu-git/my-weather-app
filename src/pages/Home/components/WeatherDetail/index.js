import styles from './index.less';
import React, { Component } from 'react';
import { Icon, Descriptions } from 'antd';
import utils from '../../../../utils';

const { getTime } = utils;

const Item = Descriptions.Item;

class WeatherDetail extends Component {
  render() {
    const { current_observation, location } = this.props;
    const { astronomy, atmosphere, condition, wind, pubDate } = current_observation;
    return !!location ? (
      <div className={styles.container}>
        <div>
          <Icon type="cloud" style={{ fontSize: '35px' }} />
          <span className={styles.currentTimeText}>Current Time: {getTime(pubDate)}</span>
        </div>
        <Descriptions title="Current Weather">
          <Item label="Sunrise">{astronomy.sunrise}</Item>
          <Item label="Sunset">{astronomy.sunset}</Item>
          <Item label="Humidity">{atmosphere.humidity}</Item>
          <Item label="Pressure">{atmosphere.pressure}</Item>
          <Item label="Visibility">{atmosphere.visibility}</Item>
          <Item label="Temperature">{condition.temperature + '(F)'}</Item>
          <Item label="Condition">{condition.text}</Item>
          <Item label="Wind Direction">{wind.direction}</Item>
          <Item label="Wind Speed">{wind.speed}</Item>
        </Descriptions>
      </div>
    ) : (
      ''
    );
  }
}
export default WeatherDetail;
