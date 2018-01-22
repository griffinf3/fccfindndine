import React, { Component } from 'react';
import PropTypes from 'prop-types'; // ES6
import 'whatwg-fetch';
import RingSpinner from './RingSpinner.jsx';
import DatePicker from 'material-ui/DatePicker';
import Auth from '../modules/Auth';
import {browserHistory} from 'react-router';
import noImage from '../img/ina.jpg';
import swal from 'sweetalert';

var moment = require('moment');
var update = require('immutability-helper');
var querystring = require('querystring');


class SearchPage extends Component {
    
constructor(props){
        super(props);
        this.handlePre = this.handlePre.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.handlePatron = this.handlePatron.bind(this);
        this.verifyPatron = this.verifyPatron.bind(this);
        this.handleDatechange = this.handleDatechange.bind(this);
        this.handleTypeChange = this.handleTypeChange.bind(this);
        this.followLink = this.followLink.bind(this);
        this.doSearch =  this.doSearch.bind(this);
        this.addDefaultSrc = this.addDefaultSrc.bind(this);
        this.state = {reviewOffset: 1, nameArray: [], reviewArray: [], photoArray: [], allPageArray: this.props.pageArray, patronTally: this.props.patronTally, burlArray: [], btnTxtArray: [], reviewSet: 0, showSpinner: true, username: this.props.username, date: new Date(), patronLocation: '', preBtn: true, nextBtn: false, going: false, type: 'page', lastNo: 10, pageNo: 1, total: this.props.total, totalFound: 0, noOnPage: this.props.page, pageOffset: this.props.offset, term: this.props.term, city: this.props.city, state: this.props.state}}
 
componentDidMount(){
     var date = this.state.date;
     this.setState({showSpinner: true});
     if (Auth.isUserAuthenticated())
     {//should not be authenticated without a password
         //if username is '', then logout.
     if (this.state.username == '') {browserHistory.push('/logout');
                                    // no longer in React Router V4
                                   }
       else{
    var username = encodeURIComponent(this.state.username);
    var searchData = encodeURIComponent(JSON.stringify({term:''}));
    return fetch('/api/v1/getdata?username='+ username, {
      method: 'GET',
      //credentials: this.props.credentials,
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) =>  response.json())
       .then((responseJson) => {var nop;  if (responseJson.page > responseJson.total) nop= responseJson.total; else nop = responseJson.page;
           this.setState({total: responseJson.total, noOnPage: nop, offset: responseJson.offset}); 
    this.doSearch(username, searchData);
    this.props.onTermUpdate({term: responseJson.term, city: responseJson.city, state: responseJson.state});
    this.props.onPresUpdate({total: responseJson.total, page: responseJson.page, offset: responseJson.offset});
    });   
     }}
      //if not authenticated:
     else {username = '';
           //OK but not required
          this.setState({username: ''});
          this.props.updateUsername('');
          var username = encodeURIComponent(username);
        //get search data from option pages
         var searchData = encodeURIComponent(JSON.stringify({term:this.props.term, city: this.props.city, state: this.props.state, total: this.props.total, offset: this.props.offset}));  
    this.doSearch(username, searchData);
        }    
}
    
addDefaultSrc(ev){
  ev.target.src = {noImage};
}
    
doSearch(username, searchData){
return fetch('/api/v1/search?username='+ username + '&limit=' + this.state.total +  '&offset=' + this.state.offset + '&searchData=' + searchData + '&date=' + moment(new Date()).format('MMMM Do YYYY'), {
      method: 'GET',
      //credentials: this.props.credentials,
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) =>  response.json())
       .then((responseJson) => {this.setState({busIdArray: responseJson.busIdArray, nameArray: responseJson.nameArray, reviewArray: responseJson.reviewArray, photoArray: responseJson.photoArray, patronTally: responseJson.patronTally, burlArray: responseJson.burlArray, totalFound:(responseJson.nameArray).length }); 
    var btnTxtArray = [];
    btnTxtArray.length = 0;                                      
    for (var i = 0; i< this.state.totalFound; i++)
          { var index = this.state.patronTally.findIndex(item => item.location === this.state.nameArray[i]); 
        btnTxtArray.push(String(this.state.patronTally[index].busCount) + ' Going');}                           var pagelg = this.state.noOnPage;
        var allPageArray= [];
        allPageArray.length = 0;                     
        for (var i = 0; i< pagelg; i++)
           {allPageArray.push({nameArray: this.state.nameArray[i], reviewArray: this.state.reviewArray[i], photoArray: this.state.photoArray[i], burlArray: this.state.burlArray[i], btnTxtArray: btnTxtArray[i]});}  
this.setState({btnTxtArray: btnTxtArray, allPageArray: allPageArray, showSpinner: false});});}  
       
followLink(burl){
    window.open(burl, "_blank");}
    
handleTypeChange(event) {
    var value = event.target.value;
    this.setState({type:value});
if (value == 'page')
{if (this.state.pageNo > 1) this.setState({preBtn:false});
 else this.setState({preBtn:true});  
 if ((this.state.pageNo) * (this.state.noOnPage) < this.state.totalFound) this.setState({nextBtn:false});
 else this.setState({nextBtn:true}); } 
 else {
var RA0Lg = this.state.reviewArray[0].length;
if (RA0Lg > 2)
{var setno = this.state.reviewSet;
if (setno <2)
    this.setState({nextBtn: false});
   else this.setState({nextBtn: true});
if (setno > 0)
 this.setState({preBtn: false});
   else this.setState({preBtn: true});  
}
else this.setState({preBtn: true, nextBtn: false}); 
 }     
  }
    
handleDatechange(event,date){
    var tso = new Date().getTimezoneOffset();
    var ms2 = date.getTime();
    var d = new Date();
    d = d.setUTCHours(0,0,0,0) + 1000*60*tso;
    //disable going button if user clicks on date prior to today's date.
    if (d <= ms2) this.setState({going: false}); else this.setState({going: true});
    this.setState({showSpinner: true});
    this.setState({date: date}) 
    date = moment(date).format('MMMM Do YYYY');
    var arrayLg = (this.state.nameArray).length;
    let result = querystring.stringify(this.state.nameArray);
    var namestring = JSON.stringify(this.state.nameArray);
    var busNames = querystring.stringify('busNames': namestring);
   
return fetch('/api/v1/search2?username='+ this.state.username + '&date=' + date + '&busNameslg='+ arrayLg + '&' + result, {
      method: 'GET',
      //credentials: this.props.credentials,
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) =>  response.json())
       .then((responseJson) => { this.setState({patronTally: responseJson.patronTally}); var data = responseJson.patronTally; 
this.props.updateTally(data);
                               }) 
.then(() => {var btnTxtArray = []; btnTxtArray.length = 0;
for (var i = 0; i< this.state.totalFound; i++)
          {var index = this.state.patronTally.findIndex(item => item.location === this.state.nameArray[i]);  
            btnTxtArray.push(String(this.state.patronTally[index].busCount) + ' Going');}
var pagelg = this.state.noOnPage;
           var allPageArray= [];
           allPageArray.length = 0;
           for (var i = 0; i< pagelg; i++)
           {allPageArray.push({nameArray: this.state.nameArray[i], reviewArray: this.state.reviewArray[i], photoArray: this.state.photoArray[i], burlArray: this.state.burlArray[i], btnTxtArray: btnTxtArray[i]});}      
        
this.setState({btnTxtArray: btnTxtArray, allPageArray: allPageArray});  
this.setState({showSpinner: false});
});}
    
handlePatron(mNum){
    if (mNum == 3)
    {
         browserHistory.push('/signlog'); // no longer in React Router V4
    }    
    else {
    var total = this.state.totalFound;
    var action;
    var i = 0;
    if (mNum == 1) action = 'add';
    else action = 'remove';
    var username = encodeURIComponent(this.state.username);
    var date = this.state.date;
    date = moment(date).format('MMMM Do YYYY');
    var business = encodeURIComponent(this.state.patronLocation);
return fetch('/api/v1/patron?username='+ username + '&date=' + date + '&business=' + business + '&action=' + action, {
method: 'GET',
headers: {'Content-Type': 'application/json'}
}).then((response) =>  response.json())
  .then((responseJson) => {   
  var newValue = responseJson.pTally;
var business = responseJson.business;
var data = this.state.patronTally;
var index = this.state.patronTally.findIndex(item => item.location === business);  
data[index]={location: business, busCount: newValue};
this.setState({patronTally: data}); 
this.props.updateTally(data);
       
var btnTxtArray = [];
btnTxtArray.length = 0;
for (i = 0; i< total; i++)
          {var index = this.state.patronTally.findIndex(item => item.location === this.state.nameArray[i]);  
            btnTxtArray.push(String(this.state.patronTally[index].busCount) + ' Going');}
 var pagelg = this.state.noOnPage;
           var allPageArray= [];
           allPageArray.length = 0;
           for (var i = 0; i< pagelg; i++)
           {allPageArray.push({nameArray: this.state.nameArray[i], reviewArray: this.state.reviewArray[i], photoArray: this.state.photoArray[i], burlArray: this.state.burlArray[i], btnTxtArray: btnTxtArray[i]});}       
this.setState({btnTxtArray: btnTxtArray, allPageArray: allPageArray});    
});}}
    
verifyPatron(e){
    if (Auth.isUserAuthenticated())
    {
    var username = encodeURIComponent(this.state.username);
    var date = this.state.date;
    date = moment(date).format('MMMM Do YYYY');
    var business = encodeURIComponent(e);
return fetch('/api/v1/verify?username='+ username + '&date=' + date + '&business=' + business, {
method: 'GET',
headers: {'Content-Type': 'application/json'}
}).then((response) =>  response.json())
       .then((responseJson) => {   
//Has the user already clicked to attend this site on this date?
if (responseJson.found == false) {   
    swal({
  title: "Confirm to submit!",
  text: "Please confirm that you will be attending " + e + " on " + date + ".",
  buttons: [true, "Confirm"]
}).then((confirm) => {
  if (confirm) {this.handlePatron(1);}});
 this.setState({patronLocation: e});}
else {
    swal({
  title: "Confirm to submit!",
  text: "You have previously signed up to attend " + e + " on " + date + ".  Would you like to remove your name from the list of those attending this restaurant on this date?",
  buttons: [true, "Confirm"]
}).then((confirm) => {
  if (confirm) {this.handlePatron(2);}});
 this.setState({patronLocation: e});}});}
    else {   
swal({
  title: "Login Required!",
  text: "After logging in, you will be able to modify your 'going' status.",
  icon: "info",
  buttons: [true, "Login"]
}).then((login) => {
  if (login) {this.handlePatron(3);}});}}
      
handleNext(){
if (this.state.type == 'review'){
var RA0Lg = this.state.reviewArray[0].length;
if (RA0Lg > 2)
{
var setno = this.state.reviewSet;
if (setno <2)  
{setno++;     
this.setState({reviewSet: setno, preBtn: false, nextBtn: false});
 if (setno == 2)
 {this.setState({preBtn: false, nextBtn: true});}}}
else
{this.setState({showSpinner: true});
    return fetch('/api/v1/reviews?busIdArray='+ this.state.busIdArray, {
method: 'GET',
headers: {'Content-Type': 'application/json'}
}).then((response) =>  response.json())
       .then((responseJson) => {

var arraySet2 = responseJson.reviewArray;
this.setState({reviewArray: arraySet2});
var btnTxtArray = [];
btnTxtArray.length = 0;

for (var i = 0; i< this.state.totalFound; i++)
          {var index = this.state.patronTally.findIndex(item => item.location === this.state.nameArray[i]); 
           btnTxtArray.push(String(this.state.patronTally[index].busCount) + ' Going');}
    
var max;
var pn = this.state.pageNo;
var min = Math.max(0,(pn-1))*(this.state.noOnPage);
if (pn >= np){max = this.state.totalFound;}
else 
if (pn <=1){max = Math.min(this.state.noOnPage, this.state.totalFound)}
else {max = Math.min((this.state.noOnPage)* pn, this.state.totalFound);} 
           var allPageArray= [];
           allPageArray.length = 0;
           for (var i = min; i< max; i++)
           {allPageArray.push({nameArray: this.state.nameArray[i], reviewArray: this.state.reviewArray[i], photoArray: this.state.photoArray[i], burlArray: this.state.burlArray[i], btnTxtArray: btnTxtArray[i]});}         
                       
setno = 1; 
this.setState({btnTxtArray: btnTxtArray, allPageArray: allPageArray, reviewSet: setno, showSpinner: false, preBtn: false, reviewOffset: 3});
});}}
else
//go to next page if more businesses are available to display.
{ var min, max;
 var np = Math.ceil((this.state.totalFound)/(this.state.noOnPage));
 var pn = this.state.pageNo;
if (pn <np)  
{pn++; this.setState({pageNo: pn, preBtn: false, nextBtn: false});  
 min = (pn-1)*(this.state.noOnPage)
if (pn >= np){this.setState({preBtn: false, nextBtn: true});
    max = this.state.totalFound;}
else {max = (this.state.noOnPage)* pn;}
var allPageArray= [];
allPageArray.length = 0;
for (var i = min; i< max; i++)
 {allPageArray.push({nameArray: this.state.nameArray[i], reviewArray: this.state.reviewArray[i], photoArray: this.state.photoArray[i], burlArray: this.state.burlArray[i], btnTxtArray: this.state.btnTxtArray[i]});
 }
 this.setState({allPageArray: allPageArray});
 this.props.updatePageArray(allPageArray);
}
else {
// do nothing
}}}
  
handlePre(){
if (this.state.type == 'review'){
var rSize = (this.state.reviewArray).length;
var nSize = (this.state.nameArray).length;
var RA0Lg = this.state.reviewArray[0].length;  
var setno = this.state.reviewSet;
if (setno > 0) {setno--;
this.setState({reviewSet: setno, preBtn: false, nextBtn: false});
if (setno == 0)
 {this.setState({preBtn: true, nextBtn: false});}}
    else {

        this.setState({preBtn: true, nextBtn: false}); 
         }}
else
{var min, max;
 var np = Math.ceil((this.state.totalFound)/(this.state.noOnPage));
 var pn = this.state.pageNo;
if (pn > 1)  
{pn--; this.setState({pageNo: pn, preBtn: false, nextBtn: false});  
 min = Math.max(0,(pn-1))*(this.state.noOnPage)
if (pn <=1){this.setState({preBtn: true, nextBtn: false});
    max = this.state.noOnPage;}
else {max = (this.state.noOnPage)* pn;}
var allPageArray= [];
allPageArray.length = 0;
for (var i = min; i< max; i++)
 {allPageArray.push({nameArray: this.state.nameArray[i], reviewArray: this.state.reviewArray[i], photoArray: this.state.photoArray[i], burlArray: this.state.burlArray[i], btnTxtArray: this.state.btnTxtArray[i]});
 }
 this.setState({allPageArray: allPageArray});
 this.props.updatePageArray(allPageArray);
}
else {
// do nothing
}}}
    
render() {
const alertStyle = {
    width: '250px',
    height: '100px'
}
         
const rsStyle = {
  backgroundColor: 'lightgrey',
  marginLeft: '450px',
  width: '60px',
  height: '60px',
  borderRadius: "5px",
  border: "1px solid black"
} 

const btnStyle = {
  marginLeft: '20px'    
}

const btn2Style = {
  marginLeft: '0px',
  marginTop: '5px',
  height: '25px'
}

const btn3Style = {
  marginLeft: '20px',
  marginTop: '5px',
  height: '25px'
}

const btn4Style = {
  marginLeft: '20px',
  marginTop: '5px',
  height: '25px'
}

const aStyle = {
   color: 'green',
   width: '50px'
}

const aStyle2 = {
   fontStyle: 'italic'
}

const imgStyle = {
  position: 'relative',
  width: '60px',
  height: '60px',
  left: '20px',
  top: '80px',
  border: "1px solid black",
  borderRadius: "5px"
}

const div3Style = {
  backgroundColor: "lightgrey",
  width: "200px",
  margin: "auto",
  padding: "10px",
  borderRadius: "5px",
  border: "1px solid black"
}

var Page = 'Page ' + this.state.pageNo + ' of ' +  Math.ceil((this.state.totalFound)/(this.state.noOnPage));
var Review = 'Review ' + (this.state.reviewSet + 1) + ' of 3' ;
      
let content = !!this.state.showSpinner ?
    (
<div  style={rsStyle}><RingSpinner />
        </div>      
    ) :
    ( <div style={div3Style}> 
        <form>
          <select value={this.state.type} onChange={this.handleTypeChange}>  
            <option value="page">{Page}</option>
            <option value="review">{Review}</option>
          </select>
       </form>
<button style={btn2Style} disabled={this.state.preBtn} onClick={this.handlePre}>&laquo; Previous</button> 
<button style={btn4Style} disabled={this.state.nextBtn} onClick={this.handleNext}>Next &raquo;</button>  </div>);     
      
const divStyle2 = {
  backgroundColor: 'lightblue',
  width: '680px',
  height: '80px',
  border: "2px solid red",
  borderRadius: "5px",
  paddingLeft: '80px',
  margin: '10px'
}; 
      
const divStyle4 = {
  borderRadius: "5px",
  border: "1px solid black",
  width: "140px",
  height: "20px",
  position: "relative",
  top: "15px"
}
      
const divStyle3 = {
  width: '680px',
  height: '100px',
};    
      
const dateStyle = {
  width: '160px',
  height: '20px',
  margin: '0px',
  padding: '0px',
  position: 'relative',
  top: '7px',
  left: '20px',
  display: 'inline-block',
  backgroundColor: '#e7e7e7',
  border: '1px solid grey',
  width: "160px",
  cursor: "pointer"
}; 
      
const style1 ={
   position: 'relative',
   top: '-15px',
   left: '5px'
}

const style2 ={
   width: "160px",
   cursor: "pointer",
   fontStyle: "normal",
   fontWeight: "lighter",
   fontSize: "14px"
}
      
    return (
      <div>
        {content}
        {this.state.allPageArray.map((item,i) => <div key={i} style={divStyle3}><img onError={this.addDefaultSrc} style ={imgStyle} src ={item.photoArray} alt="business" />
        <div style={divStyle2}>     
       <a onClick={this.followLink.bind(this,item.burlArray)}>
        <input type="text" value={item.nameArray} style= {{width: '300px',readonly: 'readonly', border: '0', color: 'green', backgroundColor: 'lightblue', cursor: 'pointer'}}/></a>
            <button style={btn3Style} disabled={this.state.going}
        onClick={this.verifyPatron.bind(this, item.nameArray)}>{item.btnTxtArray}</button>
        <a style={dateStyle}>    
        <DatePicker 
        textFieldStyle = {style2}
        style = {style1}
        formatDate={(date) => moment(date).format('MMMM Do YYYY')}
        autoOk={true}
  hintText="Select Date"
  value={this.state.date}
  onChange={this.handleDatechange}
  container="inline" />
      </a><div></div>  
          <div style={{marginRight: '10px'}}>
          <a style= {aStyle2} href={item.reviewArray[this.state.reviewOffset + this.state.reviewSet]} target="_blank">{item.reviewArray[this.state.reviewSet]}</a></div>   
        </div></div>
    )  
        }
      </div>
    );   
  }
}

SearchPage.defaultProps = {
  credentials: PropTypes.oneOf(['omit', 'same-origin', 'include']),
};

export default SearchPage;
