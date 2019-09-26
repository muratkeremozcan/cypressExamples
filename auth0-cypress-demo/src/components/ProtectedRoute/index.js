import React, { Component } from 'react'
import {Route} from 'react-router-dom';
import Auth from '../../Auth';
import Loading from '../Loading';

export default class SecureRoute extends Component {

  render() {
    const { component: Component, path, checkingSession } = this.props;

    return (
      <Route path={path} render={() => {
        if (checkingSession) return <Loading />

        if (!Auth.isAuthenticated()) {
          Auth.login();
          return null;
        }
        return <Component />
      }} />
    );
  }
}
