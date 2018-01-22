import React, { Component } from 'react';
import { Link, IndexLink } from 'react-router';
import Auth from '../modules/Auth';
import OptModal from './OptModal.jsx';
import PresModal from './PresModal.jsx';

class MenuNav extends Component {
    
constructor(props){
        super(props);
        this.state = {modal1: false, modal2: false, username: this.props.username, term: this.props.term, city: this.props.city, state: this.props.state};
        this.handleSearchOpt = this.handleSearchOpt.bind(this);
        this.handleonCloseOpt = this.handleonCloseOpt.bind(this);
        this.handlePres = this.handlePres.bind(this);
        this.handleonClosePres = this.handleonClosePres.bind(this);
        this.handleUpdateTerm = this.handleUpdateTerm.bind(this);
        this.handleUpdatePres = this.handleUpdatePres.bind(this);
        this.handleShowHelp = this.handleShowHelp.bind(this);
        this.handleShowHome = this.handleShowHome.bind(this);
    }
    
handleSearchOpt(){
    this.setState({modal1:true});
}
    
handlePres(){
    this.setState({modal2:true});
}
    
handleonCloseOpt(){
     this.setState({modal1:false});
}
       
handleonClosePres(){
     this.setState({modal2:false});
}
    
handleUpdateTerm(data){
    //get this data to the parent.
    this.props.termUpdate(data);    
}
    
handleUpdatePres(data){
    //get this data to the parent.
    this.props.presUpdate(data);    
} 
    
handleShowHelp(){
    this.props.showHelp();    
}
    
handleShowHome(){
    this.props.showHome();    
}
    
  render() {
         
    return (
      <div>
       <nav className="navbar navbar-inverse">
         <div className="container-fluid">
        <div className="navbar-header">
              <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>                        
              </button>
          </div>
        
        <div className="collapse navbar-collapse" id="myNavbar">
              <ul className="nav navbar-nav">
                <li onClick={this.handleShowHome} className="active"><IndexLink to="/">Home</IndexLink></li>
                <li className="active"><Link to="/search">Search</Link></li>
                <li className="dropbtn"><div className="dropdown"><a>Options</a>
                  <div className="dropdown-content">
                    <Link to="/options" onClick={this.handleSearchOpt}>Search Criteria</Link>
                    <Link to="/options" onClick={this.handlePres}>Presentation</Link>
                  </div></div>
                 </li>
               <li onClick={this.handleShowHelp} className="active"><Link to="/help">Help</Link></li>
             </ul>
                <ul className="nav navbar-nav navbar-right">
        <li className="active">      
{Auth.isUserAuthenticated() ? (<Link to="/logout"><span className="glyphicon glyphicon-log-in"></span>&nbsp;Log out</Link>) 
    : (<Link to="/signlog"><span className="glyphicon glyphicon-log-in"></span>&nbsp;Log in/Sign Up</Link>)}
          </li></ul>     
         </div>
         </div>
        </nav>
<OptModal modal={this.state.modal1} updateTerm = {this.handleUpdateTerm} onClose={this.handleonCloseOpt} username={this.props.username} term={this.props.term} city={this.props.city} state={this.props.state}/>
<PresModal modal={this.state.modal2} updatePres = {this.handleUpdatePres} onClose={this.handleonClosePres}  username={this.props.username} total={this.props.total} page={this.props.page} offset={this.props.offset}/>
        
      </div>
    );
  }
}

export default MenuNav;
