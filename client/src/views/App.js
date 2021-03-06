import React from 'react';
import {
  Switch,
  Route,
  Link,
  withRouter,
} from 'react-router-dom';

import { Layout, Menu } from 'antd';

import './App.css'

import CreateTodo from '../components/CreateTodo/CreateTodo'
import Login from './Login/Login';
import Dashboard from './Dashboard/Dashboard';
import About from './About/About';
import Signup from './Signup/Signup';

import * as api from '../utils/api'

class App extends React.Component {
  routes = [
    { name: 'Todolists', path: "/", component: Dashboard, activate: () => !!api.token },
    { name: 'Signup', path: "/signup", component: Signup, activate: () => !api.token },
    { name: 'Login', path: "/login", component: Login, activate: () => !api.token },
    { name: 'About', path: "/about", component: About },
  ]

  async componentDidMount() {
    await api.checkToken();
  }

  shouldShowRoute = i => {
    const route = this.routes[i];

    if (route.activate) {
      return route.activate();
    }

    return true;
  }

  render() {
    const activated_routes = this.routes.reduce((acc, route, i) => {
      if (route.path === this.props.location.pathname) {
        acc.push(i.toString());
      }

      return acc;
    }, []);

    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Layout.Header>
          <Menu theme="dark" mode="horizontal" selectedKeys={activated_routes}>
            {this.routes.map((route, i) => (
              <Menu.Item key={i.toString()} hidden={!this.shouldShowRoute(i)}>
                <Link to={route.path}>{route.name}</Link>
              </Menu.Item>
            ))}
          </Menu>
        </Layout.Header>
        <Layout.Content className="layout-content">
          <Switch>
            {this.routes.map((route, i) => (
              <Route key={i.toString()} exact path={route.path}>
                {this.shouldShowRoute(i) ? (
                  <route.component />
                ) : (
                    <React.Fragment>404 page not found.</React.Fragment>
                  )}
              </Route>
            ))}
            <Route>
              <React.Fragment>404 page not found.</React.Fragment>
            </Route>
          </Switch>
        </Layout.Content>
        <CreateTodo />
        <Layout.Footer style={{ textAlign: 'center' }}>Yoni Firroloni & Nathanael Demacon ©2020</Layout.Footer>
      </Layout>
    );
  }
}

export default withRouter(App);
