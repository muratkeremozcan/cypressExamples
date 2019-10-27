import Axios from "axios";
import React from "react";
import "./App.css";
import { AUTHENTICATE_API_URL, SERVER_URL } from "./constants";
import logoWS from "./logo-ws.svg";
import logo from "./logo.svg";
import {
  GENERIC_ERROR,
  LOADING,
  LOGIN_BUTTON,
  LONG_WAITING,
  PASSWORD_PLACEHOLDER,
  SUCCESS_FEEDBACK,
  UNAUTHORIZED_ERROR,
  USERNAME_PLACEHOLDER
} from "./strings";

/**
 * This app is far from being a well-written React app, its sole purpose is to allow me showing
 * some e2e testing characteristics
 */
function App() {
  // the controlled input states
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  // the AJAX state
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState(false);
  const [longWaiting, setLongWaiting] = React.useState(false);

  const authenticate = async (usr, pwd) => {
    setLoading(true);
    let response;
    // in case of big loading duration, it changes the user feedback
    const timeoutId = setTimeout(() => setLongWaiting(true), 1000);
    try {
      // the real AJAX call
      response = await Axios.post(SERVER_URL + AUTHENTICATE_API_URL, {
        username: usr,
        password: pwd
      });
    } catch (e) {
      // 401 error means "unauthorized", it manages all the other error states as "generic" errors
      setError(e.response && e.response.status === 401 ? UNAUTHORIZED_ERROR : GENERIC_ERROR);
      setSuccess(false);
    }
    setLoading(false);
    setLongWaiting(false);
    clearTimeout(timeoutId);

    // success management
    if (response && response.status === 200) {
      setSuccess(true);
    }
  };

  // Always add some shortcuts letting the UI test to run faster
  // @see https://slides.com/noriste/working-software-2019-mastering-ui-testing#test-shortcuts
  if (window.Cypress) {
    window.cypressShortcuts = {
      authenticate
    };
  }

  return (
    <div className="App">
      {/* some companies to thank 😊 */}
      <header className="App-header-ws">
        <img src={logoWS} className="App-logo" alt="logo" />
      </header>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      {/* the app content to be tested */}
      <section className="App-body">
        <span>Please type</span>
        <input
          placeholder={USERNAME_PLACEHOLDER}
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          placeholder={PASSWORD_PLACEHOLDER}
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button onClick={() => authenticate(username, password)}>{LOGIN_BUTTON}</button>
        {/* AJAX loading feedbacks */}
        <span>
          {loading && LOADING}
          {success && SUCCESS_FEEDBACK}
          {error}
        </span>
        <span>{longWaiting && LONG_WAITING}</span>
      </section>
    </div>
  );
}

export default App;
