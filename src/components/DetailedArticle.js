import React, { Component } from 'react';
import './detailedarticle.css'
import { Bookmark, BookmarkFill, ChevronDown, ChevronUp } from 'react-bootstrap-icons';
import commentBox from 'commentbox.io';
import Toast from 'react-bootstrap/Toast'
import { Row, Col, Container} from 'react-bootstrap';
import Card from 'react-bootstrap/Card'
import Tooltip from '@material-ui/core/Tooltip';
import ScrollUpButton from "react-scroll-up-button";

import { EmailIcon, FacebookIcon, TwitterIcon, FacebookShareButton, EmailShareButton, TwitterShareButton } from "react-share";
class DetailedArticle extends Component {

    constructor(props) {
        super(props);
        this.state = {   
            source: this.props.location.state.source,         
            bookmark: null,
            show: false,
            expand: false
        }        
    }
    
    componentWillMount()
    {
        if(localStorage.getItem('articles')===null)
            {
                this.setState({
                    bookmark: false
                });
            }
            else{            
                var favs = JSON.parse(localStorage.getItem('articles'));
                if(favs[this.props.location.state.article.id]!=null || favs[this.props.location.state.article.web_url])
                {
                    this.setState({
                        bookmark: true
                    })
                }
                else{
                    this.setState({
                        bookmark: false
                    })
                }
            }
    }
    toggleShow() {
        this.setState(
            {
                show: !this.state.show
            });
    }
    componentDidMount() {
        let id;
        if(this.props.location.state.article.uri)
        {
            id = this.props.location.state.article.uri.replace(/:/g, '');
        }
        else if(this.props.location.state.article.id)
            id = this.props.location.state.article.id;
        /*this.removeCommentBox = */commentBox('5112673779843072-proj',
            {
                createBoxUrl(boxId, pageLocation) {
                    //const queryParams = qs.parse(pageLocation.search.replace('?', ''));
                    //pageLocation.search = id;
                    //pageLocation.hash = boxId;
                    return id;
                }
            });
    }

    componentWillUnmount() {

        //this.removeCommentBox();
    }    
    sendToBookmark() {
        var favs,id;
        if(this.props.location.state.article.id)
            id = this.props.location.state.article.id;
        else if(this.props.location.state.article.web_url)
            id = this.props.location.state.article.web_url
        if (localStorage.getItem('articles') === null)
            favs = {};
        else
            favs = JSON.parse(localStorage.getItem('articles'));
        this.setState({ bookmark: !this.state.bookmark });
        this.toggleShow();
        if (!this.state.bookmark) {
            favs[id] = this.props.location.state.article;
        }
        else {
            delete favs[id];
        }
        localStorage.removeItem('articles');
        localStorage.setItem('articles', JSON.stringify(favs));

    }
    largestImage(result)
        {                    
            console.log(result)
            if(result.multimedia===null)
            return "https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg";
              
          for(var i=0;i<result.multimedia.length;i++)
          {
            if(result.multimedia[i].width>=2000)
              {
              return result.multimedia[i].url;}
          }               
          return "https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg" ;
        } 


    resizeCard()
    {
        this.setState({ expand: !this.state.expand});

    }
    render() {    

        const article = this.props.location.state.article;
        let page, message;
        
        if (this.props.location.state.source === "guardian") 
        {
            message = article.webTitle;
            if (this.state.bookmark) {
                message = "Saving - " + message;
            }
            else {
                message = "Removing - " + message;
            }            
            page = <Container style={{position: "relative"}}>     
                                          
                <Card>
                    <Card.Title style={{ fontStyle: "italic"}}>{article.webTitle}</Card.Title>
                    <Card.Text>
                        <Row>
                            <Col style={{ fontStyle: "italic", padding: "1%"}} xs={4} sm={8}>{article.webPublicationDate.slice(0,10)}</Col>                                                           
                            <Col xs={6} sm={3}>
                                <FacebookShareButton url={article.webUrl}><Tooltip title="Facebook"  arrow><FacebookIcon round={true} size={32}></FacebookIcon></Tooltip></FacebookShareButton>
                                <TwitterShareButton url={article.webUrl}><Tooltip title="Twitter"  arrow><TwitterIcon round={true} size={32}></TwitterIcon></Tooltip></TwitterShareButton>
                                <EmailShareButton url={article.webUrl}><Tooltip title="Email"  arrow><EmailIcon round={true} size={32}></EmailIcon></Tooltip></EmailShareButton>
                            </Col>
                            <Col xs={1} sm={1}>
                                <span id="bookmark_unclicked" className={`bookmark ${this.state.bookmark===true ? "hidden" : ""}`} onClick={() => this.sendToBookmark()}><Bookmark color="red" size={32}/></span>
                                <span id="bookmark_clicked" className={`bookmark ${this.state.bookmark===true ? "" : "hidden"}`} onClick={() => this.sendToBookmark()}><BookmarkFill color="red" size={32}/></span>
                                
                                
                            </Col>
                        </Row>                                                                                                    
                    </Card.Text>
                    <Card.Img variant="top" src={((empty) => {
                            if (empty)
                                return "https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png"
                            else
                                return article.blocks.main.elements[0].assets[article.blocks.main.elements[0].assets.length-1].file;
                        })(article.blocks.main.elements[0].assets.length === 0)} />                                                                
                        <Card.Text>
                            <Row>
                                <Col className={`expand ${this.state.expand===true ? "" : "guardian-div"}`}>
                                    {article.blocks.body[0].bodyTextSummary}
                                </Col>
                            </Row>
                            <Row>
                                <Col style={{textAlign: "right"}}> 
                                 <span onClick={() => this.resizeCard()} className={`arrow ${this.state.expand===true ? "hidden" : ""}`}><ChevronDown /></span>
                                 
                                 <ScrollUpButton ContainerClassName={`arrow ${this.state.expand===true ? "" : "hidden"}`} TransitionClassName="ScrollUpButton__Toggled">   
                                 <span onClick={() => this.resizeCard()} ><ChevronUp /></span>
                                </ScrollUpButton>
                                </Col>
                            </Row>                                                        
                        </Card.Text>                                            
                </Card>                                
            </Container>
        }
        else if(this.props.location.state.source === "nytimes") {
            message = article.headline.main;
            if (this.state.bookmark) {
                message = "Saving - " + message;
            }
            else {
                message = "Removing - " + message;
            }                 
            page = <Container style={{position: "relative"}}>                
                
                <Card>
                    <Card.Title style={{ fontStyle: "italic"}}>{article.headline.main}</Card.Title>
                    <Card.Text>
                        <Row>
                            <Col style={{ fontStyle: "italic"}} xs={3} sm={8}>{article.pub_date.slice(0,10)} </Col>                                                           
                            <Col>
                            <FacebookShareButton url={article.webUrl}><Tooltip title="Facebook"  arrow><FacebookIcon round={true} size={32}></FacebookIcon></Tooltip></FacebookShareButton>
                                <TwitterShareButton url={article.webUrl}><Tooltip title="Twitter"  arrow><TwitterIcon round={true} size={32}></TwitterIcon></Tooltip></TwitterShareButton>
                                <EmailShareButton url={article.webUrl}><Tooltip title="Email"  arrow><EmailIcon round={true} size={32}></EmailIcon></Tooltip></EmailShareButton>   
                            </Col>
                            <Col sm={1}>
                                <span id="bookmark_unclicked" className={`bookmark ${this.state.bookmark===true ? "hidden" : ""}`} onClick={() => this.sendToBookmark()}><Bookmark color="red" size={32}/></span>
                                <span id="bookmark_clicked" className={`bookmark ${this.state.bookmark===true ? "" : "hidden"}`} onClick={() => this.sendToBookmark()}><BookmarkFill color="red" size={32}/></span>
                            </Col>
                        </Row>                                                                                  
                    </Card.Text>
                    <Card.Img variant="top" src={this.largestImage(article)} />  
                    <Card.Text className="card-details guardian-div">
                            <Row>
                                <Col className={`expand ${this.state.expand===true ? "" : "guardian-div"}`}>
                                    {article.abstract}
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                <span onClick={() => this.resizeCard()} className={`arrow ${this.state.expand===true ? "hidden" : ""}`}><ChevronDown /></span>
                                <ScrollUpButton ContainerClassName={`arrow ${this.state.expand===true ? "" : "hidden"}`} TransitionClassName="ScrollUpButton__Toggled">   
                                 <span onClick={() => this.resizeCard()} ><ChevronUp /></span>
                                </ScrollUpButton>
                                </Col>
                            </Row>                                                        
                        </Card.Text>                                                               
                        <Card.Text>                                               
                        </Card.Text>                                            
                </Card>      
            </Container>
        }
        return (
            <>
                <Container style={{postion:"relative"}} >                
                    <Toast
                            className = "toast"
                            style={{
                                position: 'absolute',                            
                                top: "5%",                            
                                zIndex : 2                                                                
                            }}
                            onClose={() => this.toggleShow()} show={this.state.show} delay={3000} autohide>
                            <Toast.Header>{message}</Toast.Header>
                    </Toast>                
                    {page}                
                    <div className="commentbox" style={{position: "relative"}} />
                </Container>
                

            </>
        );
    }
}

export default DetailedArticle;