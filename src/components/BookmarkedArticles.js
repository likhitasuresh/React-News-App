import React, { Component } from 'react';
import { MdShare, MdDelete } from 'react-icons/md';
import { EmailIcon, FacebookIcon, TwitterIcon, FacebookShareButton, EmailShareButton, TwitterShareButton } from "react-share";
import Modal from 'react-bootstrap/Modal';
import {ModalTitle } from 'react-bootstrap';
import Toast from 'react-bootstrap/Toast'
import { withRouter } from 'react-router-dom';
import { Row, Col, Container } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import './results.css'

class BookmarkedArticle extends Component {

  constructor(props) {
    super(props);
    this.state = {
      delete: false,
      shows: false,
      showd: false,
      chosenArticle: [],
      click: false,      
      source: "",
      message: "",
      shareArticle : []
    }
  }

  handleClose() { //Share Modal
    this.setState(
      {
        shows: false
      }
    );
  }

  handleShow() { //Share Modal   
    this.setState(
      {
        shows: true
      }
    );
  }

  toggleShow() { //Toast
    this.setState(
      {
        showd: !this.state.showd
      });
  }

  handleDeletion(post) {
    var favs = JSON.parse(localStorage.getItem('articles'));
    //this.setState({delete : !this.state.delete});
    this.toggleShow();
    if(post.post.id)
    {
      //favs[post.post.id] = null;
      delete favs[post.post.id];
    }
    else if(post.post.web_url)
    {
      //favs[post.post.web_url] = null;
      delete favs[post.post.web_url];
    }
    if (post.post.webUrl != null) {
      this.setState(
        {
          message: "Removing - " + post.post.webTitle,
        });
    }
    else {
      this.setState(
        {
          message: "Removing - " + post.post.headline.main,
        });
    }
    localStorage.removeItem('articles');
    localStorage.setItem('articles', JSON.stringify(favs));
  }

  detailedArticle(post) //updated func that works from postsg
          {                     
            this.setState(
              {
              click: true
              }
            );            
            var id, source;           
            if(post.id)
            {
              id = post.id;
              source = "guardian";
            }                             
            else if(post.web_url)
            {
              id = post.web_url;
              source = "nytimes"
            }
                                    
            fetch(`/api/detailedArticle/?source=${source}&id=${id}`)
            .then(response => response.json())
            .then((data) => { 
              this.setState({loading:false})
              if(source === "guardian")
              {
                // this.setState({ chosenArticle: data.response.content }) 
                this.props.history.push({
                  pathname: `/article`,
                  state: {"article" : data.response.content, 'source' : source}
                });
              }
              else if(source === "nytimes")
              {
                // this.setState({ chosenArticle: data.response.docs[0]})
                this.props.history.push({
                  pathname: `/article`,
                  state: {"article" : data.response.docs[0], 'source' : source}
                });
              }
              })
            .catch(error => console.log(error));            
          }                  


  sectionColor(section)
        {
          var color;
          if(section === "WORLD")
            color = "rgb(193, 74, 240)"
          else if(section === "POLITICS")
            color = "rgb(6, 180, 172)"
            
          else if(section === "BUSINESS")
            color = "rgb(63, 190, 240)"
            
          else if(section === "TECHNOLOGY")
            color = "rgb(173, 255, 47)"
            
          else if(section === "SPORTS" || section === "SPORT")
            color = "rgb(228, 228, 2)"
            
          else if(section === "GUARDIAN")
            color = "rgb(3, 3, 109)"
            
          else if(section === "NYTIMES")
            color = "rgb(128, 128, 128)"
           
          else
            color = "rgb(119, 117, 117)"
           
          return color;
        }
        fontColor(section)
        {
          if(section === "TECHNOLOGY" || section === "SPORTS" || section === "NYTIMES" || section === "SPORT")
            return "black";
          else
            return "white";
        }
  largestImage(result)
        {          
          if(result.multimedia===null)
            return "https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg";
               
          for(var i=0;i<result.multimedia.length;i++)
          {
            if(result.multimedia[i].width>=2000)
              return result.multimedia[i].url;
          }               
          return "https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg" ;
        }   
  renderAppropriately(post) {
    
    if (post.webUrl != null) //for guardian
    {
      return (
        <>
        <Col xl={3}>
        <Card className="clickable" style={{width:"18rem"}} onClick={(e) => {
            e.preventDefault();
            this.detailedArticle(post);                      
          }}>
            <Card.Header>
              <Card.Title  style={{ fontStyle: "italic"}}>
                  <span className="line-clamp">{post.webTitle}</span>
                  <span onClick={(e) => { 
                      e.stopPropagation(); 
                      this.setState({
                          shareArticle : post,
                      });                    
                      this.handleShow();                       
                      }}><MdShare /></span> 
                      <span onClick={(e) => {
                        e.stopPropagation();
                        this.handleDeletion({ post });
                      }}><MdDelete />
                  </span>
              </Card.Title> 
            </Card.Header>                   
            <Card.Img variant="top" src={((empty) => {
                      if (empty)
                          return "https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png"
                      else
                          return post.blocks.main.elements[0].assets[post.blocks.main.elements[0].assets.length-1].file;
                  })(post.blocks.main.elements[0].assets.length === 0)} />
            <Card.Text>
              <Row style={{paddingTop:"2%"}}>
                <Col xs={5}sm={5} style={{ fontStyle: "italic", fontSize: "14px"}}>{post.webPublicationDate.slice(0,10)}</Col>
                <Col style={{padding: "0"}}>
                <span style={{
                              backgroundColor: this.sectionColor(post.sectionId.toUpperCase()),
                              color: this.fontColor(post.sectionId.toUpperCase()),
                              fontSize : "13px",
                              fontWeight : "bold",
                              paddingLeft: "3px",
                              paddingRight: "3px",
                              borderRadius: "10%"
                              }}>{ post.sectionId.toUpperCase() }</span>    <span> </span>            
                  <span style={{
                                  backgroundColor: this.sectionColor("GUARDIAN"),
                                  color: this.fontColor("GUARDIAN"),
                                  fontWeight : "bold",
                                  fontSize : "13px",
                                  paddingLeft: "3px",
                                  paddingRight: "3px",
                                  borderRadius: "10%"
                                  }}>                          
                  GUARDIAN
                  </span>
                </Col>                                                                                                                
              </Row>    
            </Card.Text>                                                                                                                                                                                                                                                                                               
          </Card>
        </Col>
           
        </>                                       
      );
    }  
    else if( post.web_url != null )
    { //for NY Times  
      return (
        <>
        <Col xl={3}>
        <Card className="clickable" style={{width:"18rem"}} onClick={(e) => {
            e.preventDefault();
            this.detailedArticle(post);                      
          }}>  
          <Card.Header>
            <Card.Title style={{ fontStyle: "italic"}}>
              <span className="line-clamp">{post.headline.main}</span>
              <span onClick={(e) => { 
                  e.stopPropagation(); 
                  this.setState({
                      shareArticle : post,
                  });                    
                  this.handleShow();                       
                  }}><MdShare /></span> 
                  <span onClick={(e) => {
                    e.stopPropagation();
                    this.handleDeletion({ post });
                  }}><MdDelete />
              </span>
            </Card.Title>
          </Card.Header>                                            
          <Card.Img variant="top" src={this.largestImage(post)} />                           
          <Card.Text>
            <Row>
              <Col xs={5} sm={5} style={{ fontStyle: "italic", fontSize: "14px"}}>{post.pub_date.slice(0,10)}</Col>
              <Col style={{padding: "0"}}>
                <span style={{
                              backgroundColor: this.sectionColor(post.section_name.toUpperCase()),
                              color: this.fontColor(post.section_name.toUpperCase()),
                              fontWeight : "bold",
                              fontSize : "13px",
                              paddingLeft: "3px",
                              paddingRight: "3px",
                              borderRadius: "10%"
                              }}>
                  { post.section_name.toUpperCase() } 
                </span> <span> </span>
                <span style={{
                              backgroundColor: this.sectionColor("NYTIMES"),
                              color: this.fontColor("NYTIMES"),
                              fontWeight : "bold",
                              fontSize : "13px",
                              paddingLeft: "3px",
                              paddingRight: "3px",
                              borderRadius: "10%"
                              }}>
                  NYTIMES</span>
              </Col>                                                                                                                
            </Row>      
          </Card.Text>                                                                                                                                                                                                                                                                                        
          </Card>
        </Col>
           
        </>       
        
      )
    }
  }
  openBookmarks()
  {
    if(localStorage.getItem('articles'))
     return (JSON.parse(localStorage.getItem('articles')));
    
    return {}
  }
  render() {
    const favs = this.openBookmarks()
    var arr = [];
    Object.keys(favs).forEach(function (key) {
      arr.push(favs[key]);
    });  
    var empty_msg;
    if(arr.length===0)     
      empty_msg = <h3 style={{textAlign: "center"}}>You have no saved articles</h3>
    
    var msg="";
    if(this.state.shareArticle.webTitle)
        {
          msg = this.state.shareArticle.webTitle
          
        }
        else if(this.state.shareArticle.abstract)
        {
          msg = this.state.shareArticle.abstract
          
        }
    return (
      <Container style={{position: "relative"}} fluid>
        {empty_msg?<h3 style={{textAlign: "center"}}>{empty_msg}</h3>:<h3>Favourites</h3>}                        
        <Toast style={{
                        position: 'absolute',                        
                        top: "5%",
                        zIndex : 2
                        }}
          className="toast" onClose={() => this.toggleShow()} show={this.state.showd} delay={3000} autohide>                                
            <Toast.Header>{this.state.message}</Toast.Header>
        </Toast>   
        <Container fluid><Row>{arr.map(article => this.renderAppropriately(article))}</Row></Container>        
        <Modal show={this.state.shows} onHide={() => this.handleClose()} dialogClassName={"primaryModal"}>
          <Modal.Header closeButton={(e) => e.stopPropagation()}>
            <Modal.Title>{msg}</Modal.Title>
          </Modal.Header>
          <Modal.Body id="modal-body">
            <ModalTitle >Share via</ModalTitle>
            <Row>
              <Col>
                <FacebookShareButton url={this.state.shareArticle.webUrl}><FacebookIcon round={true}></FacebookIcon></FacebookShareButton>
              </Col>
              <Col>
                <TwitterShareButton url={this.state.shareArticle.webUrl}><TwitterIcon round={true}></TwitterIcon></TwitterShareButton>
              </Col>
              <Col>
                <EmailShareButton url={this.state.shareArticle.webUrl}><EmailIcon round={true}></EmailIcon></EmailShareButton>
              </Col>
            </Row> 
          </Modal.Body>
        </Modal>
      </Container>
    );
  }
}

export default withRouter(BookmarkedArticle);