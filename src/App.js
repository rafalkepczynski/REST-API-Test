import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from "./Home";
import Login from "./Login";
import {Component} from "react";
import UserList from "./UserList";

class App extends Component {
  render() {
      return (
          <Router>
              <Switch>
                  <Route path='/' exact={true} component={ Home }/>
                  <Route path='/login/' exact={true} component={ Login }/>
                  <Route path='/users/' exact={true} component={ UserList }/>
              </Switch>
          </Router>
      );
  }
}

export default App;
