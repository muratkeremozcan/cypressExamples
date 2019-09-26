import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import Auth from '../../Auth';
import { Button, Menu, Container } from 'semantic-ui-react';

export default class Header extends Component {

  handleLogin = () => {
    Auth.login();
  }

  handleLogout = () => {
    Auth.logout();
  }

  render() {
    const actionButton =
     Auth.isAuthenticated()
     ? (
      <Button
        as='a'
        inverted
        onClick={ this.handleLogout }
      >
        Log Out
      </Button>
      )
     : (
      <Button
        as='a'
        inverted
        onClick={ this.handleLogin }
      >
        Log In
      </Button>
     );
    return (
      <Menu
        fixed='top'
        inverted={true}
        size='large'
      >
        <Container>
          <Menu.Item>
            <Link to="/">Home</Link>
          </Menu.Item>

          {
            Auth.isAuthenticated() && (
            <Menu.Item>
              <Link to="/profile">Profile</Link>
            </Menu.Item>
            )
          }

          <Menu.Item position='right'>
            {actionButton}
          </Menu.Item>
        </Container>
      </Menu>
    )
  }
}
