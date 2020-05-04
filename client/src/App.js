import React from 'react';
import './App.css';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Register from './components/auth/Register';
import Login from './components/auth/Login';

const App = () => (
 <Router>
  <React.Fragment>
   <Navbar />
   <Route exact path='/' component={Landing} />
   <div className="">
    <section className=''>
     <Switch>
      <Route exact path='/register' component={Register} />
      <Route exact path='/login' component={Login} />

     </Switch>
    </section>
   </div>
  </React.Fragment>
 </Router>
)

export default App;
