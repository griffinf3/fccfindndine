import React from 'react';
import fccLogo from '../img/fcc.jpg';
class Help extends React.Component {
    
  constructor(props) {
    super(props);
    this.state = {show: this.props.show};
    this.handleClose = this.handleClose.bind(this);
  }
     
handleClose(){
  this.props.onHide(); 
}
  
  render() {
      
  const divStyle = {
      color: 'black',
      backgroundColor: 'white',
      margin: '20px',
      padding: '2em',
      border: '1px solid black',
      borderRadius: '5px',
  }
  
  const imgStyle =
  {position: 'relative',
   top: '-10px', 
   width: '30px',
   height: '30px',
   border: '0'   
  }
      
    return (
      <div>{ this.props.show ? <div style={divStyle}>
         <button type="button" className="close" aria-label="Close" onClick={this.handleClose}> <span aria-hidden="true">&times;</span></button>
        
        <div style={{display:"inline", fontSize: "30px", fontFamily: "Cooper Black"}}>Find-n-Dine</div><div style={{display: "inline"}}> is a Free Code Camp (FCC) <a href="https://www.freecodecamp.org/griffinf3" target="_blank">
<img alt="FreeCodeCamp profile" src = {fccLogo}
      style = {{ border: 0, width: 30, height: 30 }}/>
</a> restaurant search application developed by Franklin Griffin. This project was written to fulfill part of FCC's requirements for certification in backend website development. Using the search and presentation options accessed through the main menu, a user can specify various search and presentation criteria.  Clicking the 'Search' option (also accessed through the main menu) triggers a request for data from the <a href="https://www.yelp.com" target="_blank">Yelp</a> database. Once data has been retrieved, the user can then do the following:</div>
<ol>
<li>View the restaurants retrieved.</li>
<li>View up to three reviews for each business returned. (Note: Selecting a smaller number of businesses to be displayed will help insure that all three reviews for a business of interest will be returned from Yelp.)</li>
<li>View the number of users who plan to attend a specific restaurant on a given date.</li>
<li>Change the date of interest.</li>
<li>Click a restaurant's "Going" Button to be included in the tally of those attending.</li>
<li>Click a restaurant's "Going" Button a second time to be excluded in the tally of those attending.</li>
</ol>

<p>A user can search without first logging in or setting up an account. Only registered users are allowed to augment or decrement the planned attendance tally as only authorized users are allowed to be included in the tally.</p>

<p>There are three options for signing in as an authorized user:</p>
<ol>
<li>Sign up and log in solely with a username and password.</li>
<li>Sign up and log in with a Twitter account.</li>
<li>Sign up and log in with a Google account.</li>
</ol>
<p>
A unique username is required of all registered users.  Therefore, all users, regardless of their preference for logging in will first be required to set up a local account with a username and password.  In order to use Google or Twitter as a login method, a user must first link Google/Twitter to their local account.  After clicking the Twitter/Google login button, the linking takes place after the user inputs the local signin/login information.  On subsequent logins, a user can rapidly login just by clicking the Goggle (or Twitter) login button.</p></div> : null }
      </div>
    )
  }
}

export default Help;