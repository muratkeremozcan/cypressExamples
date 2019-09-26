import React, { Component } from 'react'
import Auth from '../../Auth';
import { Card, Image } from 'semantic-ui-react'

export default class Profile extends Component {

  componentWillMount = () => {
    const profile = Auth.getProfile();
    this.setState({ profile });
  }

  state = {
    profile: {
      email: '',
      picture: '',
    }
  }

  render() {
    const { profile: { email, nickname, picture } } = this.state;

    const cardStyle = {
      boxShadow: '0 8px 17px 0 rgba(0, 0, 0, .2), 0 6px 20px 0 rgba(0, 0, 0, .15)'
    }

    return (
      <div >
        <p>You are on the profile route.</p>
        <Card centered style={cardStyle}>
          <Image src={ picture } />
          <Card.Content textAlign='left'>
            <Card.Header> { nickname } </Card.Header>
            <Card.Meta>{ email }</Card.Meta>
          </Card.Content>
        </Card>
      </div>
    )
  }
}
