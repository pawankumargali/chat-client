import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './components/Home';
import ChatDashboard from './components/ChatDashboard/ChatDashboard';

function App() {

  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/chat/:toUser" exact component={ChatDashboard} />
      </Switch>
    </Router>
  )
  
}

export default App;
