import './App.css';
import React from 'react';
import {BrowserRouter, Switch, Route, Link} from 'react-router-dom';
import Pairs from './Pairs';

function App() {

  return (
    <BrowserRouter>
      <div>
        <nav>
          <ul>
          <li>
              <Link to="/">Home</Link>
            </li>            
            <li>
              <Link to="/pairs">Pair List</Link>
            </li>
          </ul>
        </nav>

      <Switch>
        <Route path="/pairs">
          <Pairs />
        </Route>  
      </Switch>

      </div>
    </BrowserRouter>
  );
}

export default App;
