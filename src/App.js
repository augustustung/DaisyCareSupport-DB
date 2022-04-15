import React from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom"
import { Forget, Login } from './containers/auth'
import ChatShell from './containers/shell/ChatShell'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const { isUserLoggedIn } = useSelector(state => state.userState)
  return (
    <>
      <Router>
        <Switch>
          <Route exact path='/' component={ChatShell} />
          <Route exact path='/login' component={Login} />
          <Route exact path='forgot-password' component={Forget} />
        </Switch>
        <Redirect to={isUserLoggedIn ? '/' : '/login'} />
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}

export default App;
