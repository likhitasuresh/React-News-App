import React, { Component } from 'react';
import { withRouter} from 'react-router-dom';
import { EmailIcon, FacebookIcon,TwitterIcon, FacebookShareButton, EmailShareButton, TwitterShareButton} from "react-share";
import Card from 'react-bootstrap/Card'
import {Row, Col, Container } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { ModalTitle } from 'react-bootstrap';
import {MdShare} from 'react-icons/md';
import './results.css'
class SearchResults extends Component{

    constructor(props)
    {
        super(props);
        this.state = {
            searchResG : [],
            searchResN : [],
            show : false,
            click : false,
            shareArticle: [],
            chosenArticle: [],
            source : ""
        }
        console.log(this.props);
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
    componentDidMount()
    {
        console.log("happening");
        var posts=[]
        //fetch("/api/search/guardian/?q=ricciardo")
        fetch(`/api/search/guardian/?q=${this.props.match.params.query}`)        
        .then(response => response.json())
        .then((data) => { 
            console.log(data);
            var i=0;
            if(data.response.results)
            {
                for(i=0;i<(Math.min(data.response.results.length, 5));i++)
                {
                  if(data.response.results[i].blocks && data.response.results[i].blocks.main && data.response.results[i].blocks.main.elements && data.response.results[i].blocks.main.elements[0].assets)
                    posts.push(data.response.results[i])
                }                            
            }
            console.log(posts)
            this.setState({ searchResG : posts })
             
        })                        
        //.then((data) => { console.log(data.response.results)})
        .catch(error => console.log(error));
        var nyposts=[];     
        //fetch(`/api/search/nytimes/?q=ricciardo`)   
        fetch(`/api/search/nytimes/?q=${this.props.match.params.query}`)        
        .then(response => response.json())
        .then((data) => { 
            console.log(data);            
            console.log("coming here?")
            if(data.response.docs)
            {
              for(var i=0;i<Math.min(data.response.docs.length, 5); i++)
              {              
                //console.log(data.results.length)                
                nyposts.push(data.response.docs[i])
              }                            
           }
           console.log(nyposts);
           this.setState({ searchResN: nyposts })  
          }
        )                         
        //.then((data) => { console.log(data.response.docs)})
        .catch(error => console.log(error));
        
    }
    /*componentDidUpdate()
    {
        console.log("happening");
        //fetch(`/api/search/guardian/?q=${this.props.searchQuery}`)
        fetch(`/api/search/guardian/?q=trump`)
            .then(response => response.json())
            .then((data) => { this.setState({ searchResG : data.response.results }) })                        
            //.then((data) => { console.log(data.response)})
            .catch(error => console.log(error));
            
        //fetch(`/api/search/nytimes/?q=${this.props.searchQuery}`)
        fetch(`/api/search/nytimes/?q=trump`)
            .then(response => response.json())
            .then((data) => { this.setState({ searchResN : data.response.docs }) })                        
            .then((data) => { console.log(data.response.docs)})
            .catch(error => console.log(error));
    }*/
    handleShow()
          {
            this.setState(
              {
                show : true,                
              }
            );

          }   
    handleClose()
    {
    this.setState(
        {
        show : false
        });
    } 
    largestImage(result)
        {          
          console.log(result);
          if(result.multimedia===null)
            return "https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg";
               
          for(var i=0;i<result.multimedia.length;i++)
          {
            if(result.multimedia[i].width>=2000)
              return result.multimedia[i].url;
          }             
          return "https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg" ;
        } 


    share(post)
    {                     
      this.setState(
        {
        click: true
        }
      );            
      console.log(post); 
      var id, source;           
      if(post.result.id)
        {
            id = post.result.id;
            source = "guardian"          
        }               
        else if(post.result.web_url)
          {
              id = post.result.web_url;
              source = "nytimes"              
          } 
      console.log(id);           
      console.log(this.props.source);                       
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
      .then((data)=> console.log(data.response.content))
      .catch(error => console.log(error));  
      //console.log("here"+this.state.chosenArticle);            
    }                  




    render()
    {
      console.log("search page loading");
      console.log(this.state.searchResG);
      console.log(this.state.searchResN);  
      
        console.log(this.state.searchResN);
        var guardian_results;
        var nytimes_results;
        if(this.state.searchResG)
        {
            guardian_results =
                <>                                                                                   
                {this.state.searchResG.map((result) => ( 
                        <Col xl={3}>               
                            <Card className="clickable "onClick={(e) => {
                              e.preventDefault();
                              this.share({result});                      
                              }}> 
                              <Card.Header>
                                <Card.Title style={{ fontStyle: "italic"}}>
                                    {result.webTitle}
                                    <span onClick={(e) => { 
                                        e.stopPropagation(); 
                                        this.setState({
                                            shareArticle : result,
                                        });   
                                        console.log("somethin is happenin")                 
                                        this.handleShow();                       
                                        }}><MdShare /></span> 
                                </Card.Title> 
                              </Card.Header>                  
                              <Card.Img variant="top" src={((empty) => {
                                          if (empty)
                                              return "https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png"
                                          else
                                              return result.blocks.main.elements[0].assets[result.blocks.main.elements[0].assets.length-1].file;
                                      })(result.blocks.main.elements[0].assets.length === 0)} />
                                <Card.Text> 
                                  <Row>
                                    <Col xs={5}>
                                      <span style={{ fontStyle: "italic"}}>{result.webPublicationDate.slice(0,10)}</span>
                                    </Col>  
                                    <Col style={{textAlign: "right"}}>
                                      <span style={{
                                            backgroundColor: this.sectionColor(result.sectionName.toUpperCase()),
                                            color: this.fontColor(result.sectionName.toUpperCase()),
                                            fontWeight : "bold",
                                            fontSize: "13px",
                                            paddingLeft: "7px",
                                            paddingRight: "7px",
                                            borderRadius: "10%"
                                            }}>{ result.sectionName.toUpperCase() } </span> 
                                    </Col>
                                  </Row>                                            
                                </Card.Text>
                                
                                                                                                                                                      
                                                                                                                                                                
                          </Card>
                          
                        </Col>
                                                                   
                ))}
                 
                
            </>
            
        
        }
        console.log(this.state.searchResN);
        
        if(this.state.searchResN)
        {            
            nytimes_results = 
                <>                                                 
                {this.state.searchResN.map((result) => (     
                    <Col xl={3}>           
                      <Card  className="clickable" onClick={(e) => {
                            e.preventDefault();
                            this.share({result});                      
                            }}>  
                        <Card.Header>
                          <Card.Title style={{ fontStyle: "italic"}}>
                              {result.headline.main}                          
                              <span onClick={(e) => { 
                                  e.stopPropagation(); 
                                  this.setState({
                                      shareArticle : result,
                                  });                    
                                  this.handleShow();                       
                                  }}><MdShare /></span> 
                          </Card.Title>                            
                        </Card.Header> 
                        <Card.Img variant="top" src={this.largestImage(result)} />                                        
                        <Card.Text>                          
                          <Row>
                              <Col xs={5}>
                                <span style={{ fontStyle: "italic"}} >{result.pub_date.slice(0,10)}</span>
                              </Col>  
                              <Col style={{textAlign: "right"}}>
                              <span style={{
                                  backgroundColor: this.sectionColor(result.section_name.toUpperCase()),
                                  color: this.fontColor(result.section_name.toUpperCase()),
                                  fontWeight : "bold",
                                  paddingLeft: "7px",
                                  paddingRight: "7px",
                                  borderRadius: "10%",
                                  fontSize: "13px",
                                  }}>
                                { result.section_name.toUpperCase() } 
                                </span>
                              </Col>                                                                                                                 
                          </Row> 
                        </Card.Text>                                                                                                                                                                                                                                                                                                                  
                      </Card> 
                      </Col>                                      
                ))}                                             
            </>
        }
        var msg=""
            
        if(this.state.shareArticle.webTitle)
        {
          msg = this.state.shareArticle.webTitle
          
        }
        else if(this.state.shareArticle.abstract)
        {
          msg = this.state.shareArticle.abstract
         
        }
            return(
                <>
                    <h3 style={{ paddingLeft: "1%"}}>Results</h3>
                    <Container fluid>
                      <Row>
                        {guardian_results}
                        {nytimes_results}
                      </Row>
                      
                    </Container>                    
                    <Modal show={this.state.show} onHide={ (e) => {
                        //e.stopPropagation();
                        this.handleClose();
                      }} dialogClassName={"primaryModal"}>  
                    <Modal.Header closeButton>
                        <Modal.Title>{ msg }</Modal.Title>
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
        
    
}

export default withRouter(SearchResults)