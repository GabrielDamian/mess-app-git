import './App.css';
import {
  BrowserRouter as Router,
  Route, 
  Switch
} from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import Home from './components/Home/Home';
import NotFound404 from './components/NotFound404/NotFound404.js';
import Profile from './components/Profile/Profile';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact  path='/' component={Home}></Route>
        <Route exact path="/dashboard" component={Dashboard}></Route>
        <Route exact path="/login" component={Login}></Route>
        <Route exact path="/signup" component={Signup}></Route>
        <Route exact path="/profile" component={Profile}></Route>
        <Route exact path="*" component={NotFound404}></Route>
      </Switch>

    </Router>
  );
}

export default App;
