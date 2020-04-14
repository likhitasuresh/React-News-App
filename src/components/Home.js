import React, { Component }from 'react';
import './posts.css';
import Posts from './postsg';
import Spinner from 'react-bootstrap/Spinner'
import {Container } from 'react-bootstrap';
class Home extends Component{
    constructor(props)
    {
      super(props);
      this.state = {
        posts: [],  
        loading: true, 
        source: "guardian"                  
      }
    }
                
      componentDidMount() {    
        console.log(this.props);        
        const source = this.props.match.params.source;
        const field =  this.props.match.params.field; 
        // this.setState({
        //   source : source,
        //   field : field
        // })                                 
        console.log("goign here");        
        const url = `/api/?source=${source}&field=${field}`;
        var posts = []
        this.setState({loading:true})
        fetch(url)
        .then(response => response.json())
        .then((data) => { 
          
          if(source === "guardian")
          {            
            if(data.response.results)
            {
              for(var i=0;i<Math.min(data.response.results.length, 10);i++)
              {
                if(data.response.results[i].blocks && data.response.results[i].blocks.main && data.response.results[i].blocks.main.elements && data.response.results[i].blocks.main.elements[0].assets)
                  posts.push(data.response.results[i])
              }
            }
            this.setState({ posts: posts, source : source, loading:false
            })            
            posts = []           
          }
          else if(source === "nytimes")
          {
            i=0;
            
            if(data.results)
            {
              while(posts.length<10)
              {              
                console.log(data.results.length)  
                posts.push(data.results[i++])
              }
            }
            this.setState({ posts: posts, source : source, loading:false
              })  
            posts = []  
          }
         })
        .catch(error => console.log(error));                                      
      }   
       
      componentDidUpdate(previous_props, previous_state)
      {        
        
        const old_source = previous_props.match.params.source;
        const old_field =  previous_props.match.params.field;
        const source = this.props.match.params.source;
        const field =  this.props.match.params.field;
        console.log(source,field,old_source,old_field);
        if(old_source === source && old_field === field)
          return;

                                                    
        console.log(source+field);
        var posts = []
        const url = `/api/?source=${source}&field=${field}`;
        this.setState({loading:true})
        fetch(url)
        .then(response => response.json())
        .then((data) => {           
          if(source === "guardian")
          {
            var i=0;
            if(data.response.results)
            {
              for(i=0;i<Math.min(data.response.results.length, 10);i++)
              {
                if(data.response.results[i].blocks && data.response.results[i].blocks.main && data.response.results[i].blocks.main.elements && data.response.results[i].blocks.main.elements[0].assets)
                  posts.push(data.response.results[i])
              }
            }
            this.setState({ 
              source: source,
              posts: posts, 
              loading : false                           
            })     
            posts = []
          }
          else if(source === "nytimes")
          {
            i=0;
            
            if(data.results)
            {
              while(posts.length<10)
              {                               
                posts.push(data.results[i++])
              }
            }
            this.setState({ 
              source: source,
              posts: posts,  
              loading : false                          
            })                                    
          }
         })
        .catch(error => console.log(error));         
      }
    render()
    {

      //console.log(localStorage.getItem('toggleValue')); 
      console.log(this.state.posts)                                            
      return (
          <>                   
          {this.state.loading?<Container style={{ margin: "auto", marginTop: "20%", textAlign: "center"}}><Spinner animation="grow"  style={{color: "rgb(9, 9, 126)"}}/><h2>Loading</h2></Container>:<Posts source={this.state.source} posts={this.state.posts} />}   
          </>                                       
        );
    }
}
    
    

export default Home;