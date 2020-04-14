import React, {Component} from 'react';
import {MdShare} from 'react-icons/md';
import './posts.css';  
import { withRouter} from 'react-router-dom';
import { EmailIcon, FacebookIcon,TwitterIcon, FacebookShareButton, EmailShareButton, TwitterShareButton} from "react-share";
import Modal from 'react-bootstrap/Modal';
import { ModalTitle } from 'react-bootstrap';
import { Row, Col, Container } from 'react-bootstrap';
import Card from 'react-bootstrap/Card'
import Spinner from 'react-bootstrap/Spinner'
    
    class Posts extends Component{
        
      constructor(props)
          {
            super(props);
            this.state = {
              chosenArticle : [],
              click : null,       
              source : this.props.source, 
              show : false,    
              shareArticle : [],
              loading : false                            
            }                                 
          }
          
      
        handleClose()
          {
            this.setState(
              {
                show : false
              }
            );
          }
          
          
        handleShow()
          {
            this.setState(
              {
                show : true,                
              }
            );

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
        detailedArticle(post)
          {                                            
            var id;           
            if(post.result.id)
              id = post.result.id;               
            else if(post.result.url)
              id = post.result.url;  
            this.setState({loading:true})                   
            fetch(`/api/detailedArticle/?source=${this.props.source}&id=${id}`)
            .then(response => response.json())
            .then((data) => {               
              if(this.props.source === "guardian")
              {
                // this.setState({ chosenArticle: data.response.content }) 
                this.setState({loading: false})
                
                this.props.history.push({
                  pathname: `/article`,
                  state: {"article" : data.response.content, 'source' : this.props.source, }
                });
              }
              else if(this.props.source === "nytimes")
              {
                // this.setState({ chosenArticle: data.response.docs[0]})   
                this.setState({loading: false})
                this.props.history.push({
                  pathname: `/article`,
                  state: {"article" : data.response.docs[0], 'source' : this.props.source, }
                });
              }
              })            
            
            .catch(error => console.log(error));         
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
        
        
        render()
          {                                  
            let posts = this.props.posts;
                        
            if(this.state.loading === "true")
            {
              return(
                <Container style={{ margin: "auto", marginTop: "20%", textAlign:"center"}}><h2>Loading</h2><Spinner animation="grow"  style={{color: "rgb(9, 9, 126)"}}/></Container>
              )
            }
            if(this.props.source === "guardian" && this.state.loading=== false)  
            {            
              return (
                <>                                        
                  {posts.map((result) => (                  
                    <>  
                    <Card className="clickable" fluid onClick={(e) => {
                              e.preventDefault();
                              this.setState({loading: true});
                              this.detailedArticle({result});                      
                              }}>  
                      <Row>
                        <Col sm={4}>
                          <Card.Img fluid variant="top" src={((empty) => {
                                  if (empty)
                                      return "https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png"
                                  else
                                      return result.blocks.main.elements[0].assets[result.blocks.main.elements[0].assets.length-1].file;
                            })(result.blocks.main.elements[0].assets.length === 0)} /> 
                        </Col>
                        <Col>
                          <Card.Title style={{ fontStyle: "italic"}}>
                                {result.webTitle}
                                <span onClick={(e) => { 
                                    e.stopPropagation(); 
                                    this.setState({
                                        shareArticle : result,
                                    });                    
                                    this.handleShow();                       
                                    }}><MdShare /></span> 
                            </Card.Title>
                            <Card.Text>                                                                                      
                              <Row>
                                  <Col className="guardian-div">{result.blocks.body[0].bodyTextSummary} </Col>
                              </Row>
                              <Row>
                                  <Col style={{ fontStyle: "italic"}}>{result.webPublicationDate.slice(0,10)}</Col>
                                  <Col style={{textAlign: 'right'}}><span style={{
                                    backgroundColor: this.sectionColor(result.sectionName.toUpperCase()),
                                    color: this.fontColor(result.sectionName.toUpperCase()),
                                    fontWeight : "bold",
                                    paddingLeft: "7px",
                                    paddingRight: "7px",
                                    borderRadius: "10%"
                                    }}>{result.sectionName.toUpperCase()}</span></Col>                                                                                                                                                     
                              </Row>                                            
                          </Card.Text>                           
                        </Col>
                      </Row>                                                                                                                                                                                                                                                      
                    </Card> 
                    </>                                                  
                  ))}
                  <Modal show={this.state.show} onHide={ (e) => {
                    //e.stopPropagation();
                    this.handleClose();
                  }} dialogClassName={"primaryModal"}>
                    <Modal.Header closeButton>
                      <Modal.Title>{ this.state.shareArticle.webTitle }</Modal.Title>
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
                </>
              )
            }   
            else if (this.props.source === "nytimes" && this.state.loading=== false)
            {
              return (
                <>                                        
                  {posts.map((result) => (                  
                    <>  
                    <Card className="clickable" fluid onClick={(e) => {
                              e.preventDefault();
                              this.setState({loading: true});
                              this.detailedArticle({result});                      
                              }}>   
                      <Row>
                        <Col sm={4}>
                          <Card.Img style={{border: "1px solid #ddd",
                                            borderRadius: "4px",  /* Rounded border */
                                            padding: "5px" /* Some padding */                                            
                                          }}
                              variant="top" src={this.largestImage(result)} alt="NY Times img" />
                        </Col>
                        <Col>
                          <Card.Title style={{ fontStyle: "italic"}}>
                              { result.title }
                                <span onClick={(e) => { 
                                    e.stopPropagation(); 
                                    this.setState({
                                        shareArticle : result,
                                    });                    
                                    this.handleShow();                       
                                    }}><MdShare /></span> 
                          </Card.Title>
                          <Card.Text>
                            <Row>
                              <Col>{ result.abstract }</Col>
                            </Row>
                            <Row>
                              <Col  style={{ fontStyle: "italic"}}>{ result.published_date.slice(0,10)}</Col>
                              <Col style={{textAlign: 'right'}}>
                                <span style={{
                                  backgroundColor: this.sectionColor(result.section.toUpperCase()),
                                  color: this.fontColor(result.section.toUpperCase()),
                                  fontWeight : "bold",
                                  paddingLeft: "7px",
                                  paddingRight: "7px",
                                  borderRadius: "10%"
                                  }}>{ result.section.toUpperCase() } </span>
                              </Col>                                                                                                                   
                            </Row>                                                                                                    
                          </Card.Text>                          
                          <Card.Text>
                            
                            
                          </Card.Text>      
                        </Col>
                      </Row>                
                                                                                                                                                          
                          </Card> 
                      </>                                                  
                  ))}
                  <Modal show={this.state.show} onHide={ (e) => {
                    //e.stopPropagation();
                    this.handleClose();
                  }} dialogClassName={"primaryModal"}>
                    <Modal.Header closeButton>
                      <Modal.Title>{ this.state.shareArticle.webTitle }</Modal.Title>
                    </Modal.Header>
                    <Modal.Body id="modal-body">                        
                      <ModalTitle >Share via</ModalTitle>
                      <FacebookShareButton url={this.state.shareArticle.webUrl}><FacebookIcon round={true}></FacebookIcon></FacebookShareButton>
                      <TwitterShareButton url={this.state.shareArticle.webUrl}><TwitterIcon round={true}></TwitterIcon></TwitterShareButton>
                      <EmailShareButton url={this.state.shareArticle.webUrl}><EmailIcon round={true}></EmailIcon></EmailShareButton>
                    </Modal.Body>                                              
                  </Modal>                                  
                </>
              )            
            }    
            else
            {
              return(
                <></>
              )
            }
          };
    }
    export default withRouter(Posts);