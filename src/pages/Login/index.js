import React, { Component } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { Form, Input, Row, Button } from 'antd';
import localStorage from '../../utils/localStorage';

const FormItem = Form.Item;

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: 'Login component!',
    };
  }

  componentDidMount = () => {
    localStorage.clear();
  };

  handleLogin = () => {
    const { form, dispatch } = this.props;
    const { validateFieldsAndScroll } = form;
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return;
      }
      let input = {
        ...values,
      };
      dispatch({ type: 'login/login', payload: input });
    });
  };

  handleForgotPassword = () => {
    console.log('FORGOT PASSWORD');
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading } = this.props;

    return (
      <div className={styles.layout}>
        <div />
        <div className={styles.form}>
          <div className={styles.logo}>
            <span>{'Weather App Login'}</span>
          </div>
          <form>
            <FormItem hasFeedback>
              {getFieldDecorator('username', {
                rules: [
                  {
                    required: true,
                    message: 'Username is Required...',
                  },
                ],
              })(
                <Input
                  size="large"
                  onPressEnter={() => {
                    this.handleLogin();
                  }}
                  placeholder="account"
                />,
              )}
            </FormItem>
            <FormItem hasFeedback>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: 'Password is Required...' }],
              })(
                <Input
                  size="large"
                  type="password"
                  onPressEnter={() => {
                    this.handleLogin();
                  }}
                  placeholder="password"
                />,
              )}
            </FormItem>
            <div
              className={styles.forgotPassword}
              onClick={() => {
                this.handleForgotPassword();
              }}
            >
              Forgot password?
            </div>
            <Row>
              <Button
                type="primary"
                size="large"
                onClick={() => {
                  this.handleLogin();
                }}
                loading={loading.effects['login/login']}
              >
                login
              </Button>
            </Row>
          </form>
        </div>
      </div>
    );
  }
}

export default connect(({ login, loading }) => ({ ...login, loading }))(Form.create()(Login));
