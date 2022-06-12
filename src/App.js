import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from "./Home";
import Login from "./Login";
import {Component} from "react";
import UserList from "./UserList";
import UserEdit from "./UserEdit";
import UserDetails from "./UserDetails";
import TestList from "./TestList";
import TestEdit from "./TestEdit";
import TestDetails from "./TestDetails";
import Results from "./Results"

class App extends Component {
  render() {
      return (
          <Router>
              <Switch>
                  <Route path='/' exact={true} component={ Home }/>
                  <Route path='/login/' exact={true} component={ Login }/>
                  <Route path='/users/' exact={true} component={ UserList }/>
                  <Route path='/users/new' exact={true} component={ UserEdit }/>
                  <Route path='/users/:id' exact={true} component={ UserDetails }/>
                  <Route path='/users/edit/:id' exact={true} component={ UserEdit }/>
                  <Route path='/tests/' exact={true} component={ TestList }/>
                  <Route path='/tests/new' exact={true} component={ TestEdit }/>
                  <Route path='/tests/:id' exact={true} component={ TestDetails }/>
                  <Route path='/tests/edit/:id' exact={true} component={ TestEdit }/>
                  <Route path='/results' exact={true} component={ Results }/>
              </Switch>
          </Router>
      );
  }
}

export default App;
