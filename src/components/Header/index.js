import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Menu, Icon } from 'antd';
import styles from './index.less';
import constant from '../../utils/constants';
const SubMenu = Menu.SubMenu;

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleMenu = e => {
    if (e.key.includes('logout')) {
      this.handleGoToPath(e.key);
    }
  };

  handleGoToPath = pathname => {
    const { dispatch } = this.props;
    if (pathname === 'logout') {
      dispatch({ type: 'app/logout' });
    } else {
      dispatch(
        routerRedux.push({
          pathname,
        }),
      );
    }
  };

  render() {
    const { userName } = this.props;    
    
    return (
      <div id="header" className={styles.header}>
        <div className={styles.titleWrapper}>{constant.title}</div>
        <div className={styles.centerWarpper}></div>
        <div className={styles.rightWarpper}>
          <Menu
            mode="horizontal"
            onClick={this.handleMenu}
            style={{ background: 'rgba(73,132,241,1)', lineHeight: '64px' }}
          >
            <SubMenu
              style={{
                float: 'right',
              }}
              title={
                <span>
                  <Icon type="user" />
                  {userName}
                </span>
              }
            >
              <Menu.Item key="logout">Sign out</Menu.Item>
            </SubMenu>
          </Menu>
        </div>
      </div>
    );
  }
}
export default connect(({ app, loading }) => ({
  ...app,
  loading,
}))(Header);
