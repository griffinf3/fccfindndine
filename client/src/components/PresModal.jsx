import React from 'react';
import Modal from 'react-modal';
import PresSelect from './PresSelect.jsx';
 
class PresModal extends React.Component {
    
  constructor(props) {
    super(props);
    this.state = {showModal: this.props.modal, username: this.props.username, total: this.props.total, page: this.props.page, offset: this.props.offset}
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.presUpdate = this.presUpdate.bind(this);
  }
  
  handleCloseModal () {
  this.props.onClose();
  } 
    
 presUpdate(data){
     this.props.updatePres(data); 
  }
   
  render() {
      
  const pmStyle = {
      content:  {backgroundColor: 'papayawhip',
                height: '200px', width: '700px', margin: 'auto'}
}
      
return (
      <div>
        <Modal
  ariaHideApp={false}
  isOpen={this.props.modal}
  contentLabel="Modal"
  style={pmStyle}>
  <PresSelect onPresUpdate = {this.presUpdate}  username={this.props.username}  onClose = {this.handleCloseModal} total={this.props.total} page={this.props.page} offset={this.props.offset}/>
  <p></p>
         <button onClick={this.handleCloseModal}>Close</button>
</Modal>
      </div>
    )
  }
}

export default PresModal;