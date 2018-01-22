import React, {Component} from 'react';
import MenuNav from './MenuNav.jsx';
import propTypes from 'prop-types';

class Parent extends Component {
    
constructor(props){
        super(props);
        this.state = {username: '', pageArray: [], profileTally: [], pre: true, next: false, setno: 0, modal: false, term: 'greek', city: 'Gainesville', state: 'Georgia', total: 20, page: 5, offset: 0, show:true, showHome: true};
        this.getUser = this.getUser.bind(this);
        this.onUpdateTally = this.onUpdateTally.bind(this);
        this.onUpdatePageArray = this.onUpdatePageArray.bind(this);
        this.handleOpts = this.handleOpts.bind(this);
        this.updateUsername = this.updateUsername.bind(this);
        this.onUpdateTerm = this.onUpdateTerm.bind(this);
        this.onUpdatePres = this.onUpdatePres.bind(this);
        this.hideHelp = this.hideHelp.bind(this);
        this.onShowHelp = this.onShowHelp.bind(this);
        this.hideHome = this.hideHome.bind(this);
        this.onShowHome = this.onShowHome.bind(this);
    }
      
updateUsername(un){
    this.setState({username:un});
}
    
hideHelp(){
    this.setState({show: false});
}
    
hideHome(){
    this.setState({showHome: false});
}
    
onShowHelp(){
    this.setState({show: true});
}
    
onShowHome(){
    this.setState({showHome: true});
}

onUpdateTerm(data){
    this.setState({term: data.term, city: data.city, state: data.state});
}
    
onUpdatePres(data){
    this.setState({total: data.total, page: data.page, offset: data.offset});
}
    
getUser(username){
    if (this.refs.aRef) this.setState({username: username});
}
    
onUpdateTally(data){
    this.setState({profileTally:data});  
}
    
onUpdatePageArray(data){
    this.setState({pageArray:data});  
}
    
handleOpts(){
    this.setState({modal:true});
}

render() {
    var that = this;
    var childrenWithProps = React.Children.map(this.props.children, function(child) {
        return React.cloneElement(child, {onHide: that.hideHelp, onHideHome: that.hideHome, onPresUpdate: that.onUpdatePres, onTermUpdate: that.onUpdateTerm, updatePageArray: that.onUpdatePageArray, updateTally: that.onUpdateTally, getCurrentUser: that.getUser, updateUsername: that.updateUsername, username: that.state.username, term: that.state.term, city: that.state.city, state: that.state.state, total:that.state.total, page: that.state.page, offset: that.state.offset, patronTally: that.state.profileTally, pageArray: that.state.pageArray, modal: that.state.modal, show: that.state.show, showHome: that.state.showHome});
    });
      
    return (
      <div ref="aRef">
        <MenuNav username={this.state.username} showHelp = {this.onShowHelp} showHome = {this.onShowHome} presUpdate={this.onUpdatePres} termUpdate= {this.onUpdateTerm} onHandleOpts = {this.handleOpts} term={this.state.term} city={this.state.city} state={this.state.state} total={this.state.total} page={this.state.page} offset={this.state.offset}/>  
        {childrenWithProps}
      </div>
    );
  }
}

Parent.propTypes = {
  children: propTypes.object.isRequired
};

export default Parent;