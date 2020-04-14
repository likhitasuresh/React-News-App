import React, {Component} from 'react';
import { NavLink, withRouter} from 'react-router-dom';
import { Nav, Navbar, Form} from 'react-bootstrap';
import { Bookmark, BookmarkFill } from 'react-bootstrap-icons';
import  './navbar.css';
import AsyncSelect from 'react-select/async';

import Tooltip from '@material-ui/core/Tooltip';


//const value=" "
class NavBar extends Component
    {                          
            constructor(props) {
                super(props);
                this.state = {
                  source:"guardian",                  
                  bookmark: false,  
                  query : "",
                  suggestions_array : [],
                  trial : true,
                  searchQuery : "",
                  trigger: false,   
                  defaultValue: ""                
                };
            } 
            componentDidMount()
            {                
                localStorage.setItem("source", "guardian");
                
            }              

            async bingAutosuggest()
            {            
                const url = "https://likhita.cognitiveservices.azure.com/bing/v7.0/suggestions?q=" + this.state.query;
                let suggestions = [];
                
                const response = await fetch(url,{ headers:
                    {
                        "Ocp-Apim-Subscription-Key": "274d08877b924b03953cab19cc643715"
                    }
                });
                const data = await response.json();
                if(data._type === "Suggestions")
                {
                    suggestions = data.suggestionGroups[0].searchSuggestions.map((result) => ({'value': result.query, 'label' : result.query}));
                   
                    return suggestions;
                }
                return [];
            }            
            sendToBookmark()
            {                        
                this.toggleShow();
                if(!this.state.bookmark)
                {
                    if(localStorage.getItem(this.props.article.id)==null)
                        localStorage.setItem(this.props.article.id, JSON.stringify(this.props.article));
                }
                else{
                    localStorage.removeItem(this.props.article.id);
                }
            }      
            handleBookmark(event)
            {
                 
                this.setState({
                    bookmark: !this.state.bookmark
                })                
                this.props.history.push("/bookmarked");                
            }   
            componentDidUpdate(prev_prop,prev_state)
            {
                if(prev_state.source === this.state.source)
                    return;
                             
            }

            



            render()
            {                                   
                const source = this.state.source;
                
                
                var hide_status="";
                var current_location = this.props.location.pathname;
                if(current_location.includes("bookmarked") || current_location.includes("article") || current_location.includes("search"))
                    hide_status = "hidden";
                else
                    hide_status = "";
                  
                           
                return(
                    <>
                        <Navbar className="color-nav" variant="dark" expand="lg" > 
                            <AsyncSelect                                 
                                className={`react-select-container`}
                                width='500px'                          
                                loadOptions={this.bingAutosuggest.bind(this)}                                                            
                                onInputChange= {(inputValue) =>                                 
                                    {                                                                                    
                                        this.setState( {query : inputValue});
                                    }}  
                                                      
                                noOptionsMessage={() => "No Match"}    
                                onChange={(option)=> {             
                                    this.setState({defaultValue: option.value})                             
                                    this.props.history.push(`/search/${option.value}`)                                                                                                                   
                                }} 
                                value = {{value: "hi", label: current_location.includes("search")?this.state.defaultValue:"Enter Keyword"}}
                            />       
                            <Navbar.Toggle aria-controls="basic-navbar-nav" />
                            <Navbar.Collapse id="basic-navbar-nav">                                                   
                            <Nav className="mr-auto">                                  
                                <Nav.Link as={NavLink} to={`/${source}/home`}>Home</Nav.Link>
                                <Nav.Link as={NavLink} to={`/${source}/world`}>World</Nav.Link>
                                <Nav.Link as={NavLink} to={`/${source}/politics`}>Politics</Nav.Link>
                                <Nav.Link as={NavLink} to={`/${source}/business`}>Business</Nav.Link>
                                <Nav.Link as={NavLink} to={`/${source}/technology`}>Technology</Nav.Link> 
                            </Nav>
                            <Nav>                                  
                                
                                    <span style={{color: "white"}} id="bookmark_unclicked" className ={`bookmark ${current_location.includes("bookmarked") ? "hidden" : ""}`} onClick= {(event) => 
                                    {
                                        this.handleBookmark();
                                        event.stopPropagation();
                                    }}><Tooltip title="Bookmark" placement="bottom" arrow><Bookmark /></Tooltip></span> 
                                    <span style={{color: "white"}}  id="bookmark_clicked" className ={`bookmark ${ current_location.includes("bookmarked") ? "" : "hidden"}`} onClick= {(event) => {
                                    this.handleBookmark();
                                    event.stopPropagation();
                                    }}><Tooltip title="Bookmark" placement="bottom" ><BookmarkFill /></Tooltip></span>
                                                                                                                                                                   
                            </Nav>                                    
                            <span className = {`${hide_status}`} style={{color: "white"}}>NY Times </span>                                                                                    
                            <Form>                                                                    
                                <Form.Check size={50}
                                type="switch"
                                id="custom-switch"
                                className = {`${hide_status}`}                                    
                                label=""
                                defaultChecked="checked"
                                onChange={ () => 
                                    {
                                        
                                        const toggled_src = this.state.source==="guardian"?"nytimes":"guardian"  
                                        this.setState({source : toggled_src})  
                                        const field = this.props.location.pathname.split("/").slice(-1);                                                                                                               
                                        this.props.history.push(`/${toggled_src}/${field}`)                                        
                                        
                                    }
                                }
                                />                                 
                                
                            </Form>
                            <span className = {`${hide_status}`} style={{color: "white"}}>Guardian</span>
                            </Navbar.Collapse>    
                    </Navbar>
                     
                    
                    </>
                );
                }
            }
    //}

export default withRouter(NavBar);