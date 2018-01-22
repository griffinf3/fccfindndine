import React from 'react';
import {browserHistory} from 'react-router';
import {RegionDropdown} from 'react-country-region-selector';

class TermSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {country: 'United States', region: 'Georgia', username: this.props.username, type: this.props.term, city: this.props.city, state: this.props.state};
      this.handleTypeChange = this.handleTypeChange.bind(this);
      this.handleCityChange = this.handleCityChange.bind(this);
      this.selectRegion = this.selectRegion.bind(this);
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
        this.props.onTermUpdate({term: responseJson.term, city: responseJson.city, state: responseJson.state});
})}}

handleTypeChange(event) {
 this.props.onTermUpdate({term: event.target.value, city: this.state.city, state: this.state.state});
     this.setState({type: event.target.value});
  }
    
handleCityChange(event) {
 this.props.onTermUpdate({term: this.state.type, city: event.target.value, state: this.state.state});
    this.setState({city: event.target.value});
  }
    
selectRegion (val) {
  this.props.onTermUpdate({term: this.state.type, city: this.state.city, state: val});
  this.setState({state: val});
  }

  handleSubmit(event) {
    this.props.onClose();
    event.preventDefault();
    if (this.state.username !== ''){
    var data = {term: this.state.type, city: this.state.city, state: this.state.state};
    data = encodeURIComponent(JSON.stringify(data));
    var username = encodeURIComponent(this.state.username);
    return fetch('/api/v1/searchdata?username='+ username + '&data='+ data, {
      method: 'GET',
      //credentials: this.props.credentials,
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(() => {
        browserHistory.push('/search');});  
   }
  else {browserHistory.push('/search');}
  }
    
handleClose(){
  this.props.onClose();
}

  render() {
        const { country, region } = this.state;
    return (
      <form onSubmit={this.handleSubmit}>
        <button type="button" className="close" aria-label="Close" onClick={this.handleClose}>
  <span aria-hidden="true">&times;</span></button>
        <label>
          Please select the type of restuarant you would like to visit:&nbsp;
          <select defaultValue={this.state.type} onChange={this.handleTypeChange}>
            <option value="caribbean">Caribbean</option>
            <option value="chinese">Chinese</option>
            <option value="colombian">Colombian</option>
            <option value="ethiopian">Ethiopian</option>
            <option value="french">French</option>
            <option value="german">German</option>
            <option value="italian">Italian</option>
            <option value="greek">Greek</option>
            <option value="international">International</option>
            <option value="indian">Indian</option>
            <option value="japanese">Japanese</option>
            <option value="peruvian">Peruivan</option>
            <option value="mexican">Mexican</option>
            <option value="vietnamese">Vietnamese</option>
          </select>
        </label>
        <div>
        <label>City:&nbsp;
          <input type="text" defaultValue = {this.state.city} onChange={this.handleCityChange} />
        </label>
        </div>
        <div>
        <RegionDropdown 
          style={{width: '200px', backgroundColor: 'red'}}
          defaultOptionLabel={'US State'}
          country={'United States'}
          value={this.state.state}
          onChange={(val) => this.selectRegion(val)} />
        </div>
        <div style={{marginTop: '10px'}}>
        <input type="submit" value="Submit" />
        </div>
      </form>
    );
  }
}

export default TermSelect;