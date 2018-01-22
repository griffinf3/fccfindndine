import React from 'react';
import Modal from 'react-modal';
import TermSelect from './TermSelect.jsx';
 
class OptModal extends React.Component {
    
  constructor(props) {
    super(props);
    this.state = {showModal: this.props.modal, username: this.props.username, term: this.props.term, city: this.props.city, state: this.props.state}
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.termUpdate = this.termUpdate.bind(this);
  }
    
  termUpdate (data){
     this.props.updateTerm(data); 
  }
  
  handleCloseModal () {
  this.props.onClose();  
  } 
   
  render() {
      
  const omStyle = {
      content:  {backgroundColor: 'papayawhip',
                height: '240px', width: '500px', margin: 'auto'}
}
      
    return (
      <div>
        <Modal
        ariaHideApp={false}
  isOpen={this.props.modal}
  contentLabel="Modal"
  style={omStyle}>
  <TermSelect onTermUpdate = {this.termUpdate} username={this.props.username}  onClose = {this.handleCloseModal} term={this.props.term} city={this.props.city} state={this.props.state}/>
  <p></p>
         <button onClick={this.handleCloseModal}>Close</button>
</Modal>
      </div>
    )
  }
}

export default OptModal;