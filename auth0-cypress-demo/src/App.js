import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import Loading from './components/Loading';

import Auth from './Auth';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './views/Profile';
import Home from './views/Home';
import { Segment } from 'semantic-ui-react';
const Callback = () => (
    <Loading />
);

class App extends Component {

  state = {
    checkingSession: true,
  }

  async componentDidMount() {
    if (this.props.location.pathname === 'callback') return;
    try {
      await Auth.renewTokens();
      this.forceUpdate();
    } catch (error) {
      console.error(error);
    }
    this.setState({ checkingSession: false });
  }

  checkAuthentication = async (props) => {
    try {
      await Auth.handleAuthentication();
      props.history.replace('/');
    } catch(error) {
      console.log('an error occured checking authentication');
      console.error(error);
    }
  }

  render() {
    return (
      <Segment
        className="App"
        // inverted
        textAlign='center'
        vertical
        style={{ minHeight: 700, padding: '5em 0em' }}
      >
        <Header />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/callback" render={ (props) => {
            this.checkAuthentication(props);
            return (<Callback />);
          }} />
          <ProtectedRoute
            path="/profile"
            checkingSession={ this.state.checkingSession }
            component={Profile} />
        </Switch>
      </Segment>
    );
  }
}

export default withRouter(App);
