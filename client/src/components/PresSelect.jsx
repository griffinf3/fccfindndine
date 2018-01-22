import React from 'react';
import {browserHistory} from 'react-router';

class PresSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {username: this.props.username, total: this.props.total, offset: this.props.offset, page: this.props.page};
    this.handleTotalChange = this.handleTotalChange.bind(this);
    this.handleOffsetChange = this.handleOffsetChange.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
    
componentDidMount(){
    this.setState({username:this.props.username});
    var username= this.state.username;
    if (username != '')
    {//get search data from database for this username.
    var username = encodeURIComponent(username);
    return fetch('/api/v1/getdata?username='+ username, {
      method: 'GET',
      //credentials: this.props.credentials,
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) =>  response.json())
       .then((responseJson) => {  
this.props.onPresUpdate({total: responseJson.total, page: responseJson.page, offset: responseJson.offset});
    this.setState({total: responseJson.total, offset: responseJson.offset, page: responseJson.page});
});}}

handleTotalChange(event) {
    var nop;
    if (event.target.value < this.state.page)
        nop = event.target.value; else nop = this.state.page;
    this.props.onPresUpdate({total: event.target.value, page: nop, offset: this.state.offset});
    this.setState({total: event.target.value, page: nop});
  }
    
handleOffsetChange(event) {
    this.props.onPresUpdate({total: this.state.total, page: this.state.page, offset: event.target.value});
    this.setState({offset: event.target.value});
  }
    
 handlePageChange(event) {
    var val;
    if (event.target.value > this.state.total)
    {val = this.state.total;}
    else {val = event.target.value;}
    this.props.onPresUpdate({total: this.state.total, page: val, offset: this.state.offset});
     this.setState({page: val});
  }
    
handleClose(){
  this.props.onClose();
}

  handleSubmit(event) {
    this.props.onClose();
    event.preventDefault();
    if (this.state.username !== ''){
    var data = {value1: this.state.total, offset: this.state.offset, value2: this.state.page}
    data = encodeURIComponent(JSON.stringify(data)); 
    var username = encodeURIComponent(this.state.username);
  
    return fetch('/api/v1/searchdata2?username='+ username + '&data='+ data, {
      method: 'GET',
      //credentials: this.props.credentials,
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(() => {browserHistory.push('/search');});
  }
  else {browserHistory.push('/search');}
  }

  render() {
    return (  
       <form onSubmit={this.handleSubmit}>
        <button type="button" className="close" aria-label="Close" onClick={this.handleClose}>
  <span aria-hidden="true">&times;</span></button>
        <div>
        <label>
          Total number of restaurants to return:&nbsp;
          <select value={this.state.total} onChange={this.handleTotalChange}>
            <option value="05">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
            <option value="25">25</option>
            <option value="30">30</option>
            <option value="35">35</option>
            <option value="40">40</option>
            <option value="45">45</option>
            <option value="50">50</option>>
          </select>
        </label>
        </div><div>
         <label>
          Number of restaurants to display per page:&nbsp;
          <select value={this.state.page} onChange={this.handlePageChange}>
            <option value="05">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
            <option value="25">25</option>
            <option value="30">30</option>
            <option value="35">35</option>
            <option value="40">40</option>
            <option value="45">45</option>
            <option value="50">50</option>>
          </select>
         </label>
         </div><div>
          <label>
          Search Offset:&nbsp;
          <select value={this.state.offset} onChange={this.handleOffsetChange}>
            <option value="00">0</option>
            <option value="05">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
            <option value="25">25</option>
            <option value="30">30</option>
            <option value="35">35</option>
            <option value="40">40</option>
            <option value="45">45</option>
          </select>
        <span style={{display: "inline", fontStyle: 'italic', fontWeight: 'lighter'}}>&nbsp;(Increase the offset to return restaurants further down in the Yelp database.)</span>
        </label></div>
        <div>
        <input type="submit" value="Submit" />
         </div>
      </form>
    );
  }
}

export default PresSelect;