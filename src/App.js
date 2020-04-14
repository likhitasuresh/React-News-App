import React, { Component } from 'react';
import { BrowserRouter, Route, Switch} from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import ErrorFile from './components/ErrorFile'
import NavBar from './NavBar';

import BookmarkedArticles from './components/BookmarkedArticles';
import Home from './components/Home';

import SearchResults from './components/SearchResults';
import DetailedArticle from './components/DetailedArticle';
class App extends Component{
  
  render(){
      
  return (
    
    <BrowserRouter>
          <div className="App">                              
          <NavBar  /> 
            <div id='page-body'>           
              <Switch>
                  <Route path={`/article`} component={DetailedArticle} exact/>}/>                                 
                  <Route path="/bookmarked" component={BookmarkedArticles} exact/>  
                  <Route path="/search/:query" component={SearchResults} exact />                      
                  <Route path="/:source/:field"  component={Home} exact />    
                  <Route path='/' component={ErrorFile} />
              </Switch>
                                             
            </div>                                                                                                               
          </div>
    </BrowserRouter>    
  );
}

}

export default App;
