import styles from './index.less';
import React, { Component } from 'react';
import { connect } from 'dva';
import { Select, Table, Row, Col } from 'antd';
import utils from '../../utils';
import localStorage from '../../utils/localStorage';
import WeatherDetail from './components/WeatherDetail';

const { getDate } = utils;
const { Option } = Select;

@connect(({ loading, home }) => {
  return {
    loading,
    ...home,
  };
})
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: '',
      /**
       * titleHeight:               87
       * SelectHeight:              195
       * columnHeight:              38
       * footerHeight:              24
       * ------------------------------
       * Total                      344
       */
      scrollHeight: window.innerHeight - 344,
    };
  }

  UNSAFE_componentWillMount = () => {
    this.updateDimentions();
  };

  componentDidMount = () => {
    let token = localStorage.get('jwt');
    this.props.dispatch({
      type: "app/checkLoggedIn", 
      payload: {
        token
      }
    });
    window.addEventListener('resize', this.updateDimentions);
  };

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.updateDimentions);     
  };

  updateDimentions = () => {
    this.setState({
      scrollHeight: window.innerHeight - 344,
    });
  };

  _handleSelectChange = selectedOption => {
    const { dispatch } = this.props;

    if (!!selectedOption) {
      dispatch({
        type: 'home/getWeather',
        payload: {
          location: selectedOption,
        },
      });
    } else {
      dispatch({
        type: 'home/updateState', 
        payload: {
          forecasts: []
        }
      });
    }
    this.setState({ location: selectedOption });
  };

  _renderDate = date => {
    if (!!date) {
      return getDate(date);
    }
    return '';
  };

  _handleRowClick = row => {};

  render() {
    const { forecasts, current_observation } = this.props;
    const { scrollHeight, location } = this.state;
    const columns = [
      {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
        render: this._renderDate,
      },
      {
        title: 'Day',
        dataIndex: 'day',
        key: 'day',
      },
      {
        title: 'Low (F)',
        dataIndex: 'low',
        key: 'low',
      },
      {
        title: 'High (F)',
        dataIndex: 'high',
        key: 'high',
      },
      {
        title: 'Description',
        dataIndex: 'text',
        key: 'text',
      },
    ];

    return (
      <div className={styles.container}>
        <Row>
          <Col className={styles.selectPanel} span={5}>
            <h1 className={styles.selectText}>Please Select a City</h1>
            <Select
              allowClear={true}
              className={styles.select}
              showSearch
              style={{ width: 215 }}
              placeholder="City, State"
              optionFilterProp="children"
              onChange={this._handleSelectChange}
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              <Option value="Mountain View,CA">Mountain View, CA</Option>
              {/* <Option value="San Diego,CA">San Diego, CA</Option> */}
            </Select>
          </Col>
          <Col span={19}>
            <WeatherDetail {...{ current_observation, location }} />
          </Col>
        </Row>
        <Table
          className={styles.table}
          columns={columns}
          size="small"
          dataSource={forecasts}
          rowKey={(record, index) => index}
          bordered={false}
          onRow={this._handleRowClick}
          scroll={{
            y: scrollHeight,
          }}
          pagination={false}
        />
      </div>
    );
  }
}
export default Home;
