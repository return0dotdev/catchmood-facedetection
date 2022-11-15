import React from 'react'
import './App.scss';
import { HashRouter, Route, Switch, } from 'react-router-dom';
const Login = React.lazy(() => import('./views/Login/login'));
const Register = React.lazy(() => import('./views/Register/Register'));
const Dashboard = React.lazy(() => import('./views/Dashboard/Dashboard'));
const EditProfile = React.lazy(() => import('./views/EditProfile/EditProfile'));
const MainLayout = React.lazy(() => import('./containers/MainLayout'));
const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;
function App() {
  const user_login = localStorage.getItem('login')

  if (user_login === null || user_login === 'Fail') {
    return (
      <HashRouter>
        <React.Suspense fallback={loading()}>
          <link href="https://fonts.googleapis.com/css?family=Kanit" rel="stylesheet" />
          <Switch>
            <Route exact path="/login" name="Login Page" render={props => <Login {...props} />} />
            <Route exact path="/register" name="Register Page" render={props => <Register {...props} />} />
            <Route path="/" name="Home" render={props => <Login {...props} />} />
          </Switch>
        </React.Suspense>
      </HashRouter>
    );
  } else {
    return (
      <HashRouter>
        <React.Suspense fallback={loading()}>
          <link href="https://fonts.googleapis.com/css?family=Kanit" rel="stylesheet" />
          <Switch>
            <Route path="/" name="Home" render={props => <MainLayout {...props} />} />
          </Switch>
        </React.Suspense>
      </HashRouter>
    );
  }
}

export default App;
