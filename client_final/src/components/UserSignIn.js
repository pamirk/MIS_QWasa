import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Form from './Form';
import { Radio } from 'antd';

export default class UserSignIn extends Component {
  state = {
    username: '',
    password: '',
    role: 'admin',
    errors: [],
  };

  render() {
    const {
      username,
      password,
      errors,
    } = this.state;

    return (
      <div>
        <div className="grid-33 centered signin">
          <h1>Sign In</h1>
          <Form
            cancel={this.cancel}
            errors={errors}
            submit={this.submit}
            submitButtonText="Sign In"
            elements={() => (
              <React.Fragment>
                <div className='d-flex justify-content-center mb-3 '>
                  <Radio.Group name='role' buttonStyle={"solid"} size="large" onChange={this.change} defaultValue="admin">
                    <Radio.Button  value="admin" >Admin</Radio.Button>
                    <Radio.Button value="employee">Employee</Radio.Button>
                    <Radio.Button value="consumer">Consumer</Radio.Button>
                  </Radio.Group>
                </div>
                  <div className='mb-3'>
                   <input
                       className='mb-3'
                       id="username"
                       name="username"
                       type="text"
                       value={username}
                       onChange={this.change}
                       placeholder="Email" />
                   <input
                       id="password"
                       name="password"
                       type="password"
                       value={password}
                       onChange={this.change}
                       placeholder="Password" />
               </div>
              </React.Fragment>
            )} />
          <p>
            Are you Wasa consumer but Don't have a user account? <Link to="/signup">Click here</Link> to sign up! Now
          </p>
        </div>
      </div>
    );
  }

  change = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState(() => {
      return {
        [name]: value
      };
    });
  }

  submit = () => {
    const { context } = this.props;
    const { from } = this.props.location.state || { from: { pathname: '/authenticated' } };
    const { username, password , role} = this.state;

    if (role === 'consumer') {
      context.actions.consumerSignIn(username, password)
          .then(() => {
            this.props.history.push('/complain_dashboard');
          });

    } else {
      //not a consumer login
      context.actions.signIn(username, password, role)
          .then((user) => {
            if (user === null) {
              this.setState(() => {
                return { errors: [ 'Sign-in was unsuccessful' ] };
              });
            } else {
              this.props.history.push(from);
            }
          })
          .catch((error) => {
            console.error(error);
            this.props.history.push('/error');
          });
    }
  };

  cancel = () => {
    this.props.history.push('/');
  }
}
