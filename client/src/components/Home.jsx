import React from 'react';
import fccLogo from '../img/fcc.jpg';
 
class Home extends React.Component {
    
  constructor(props) {
    super(props);
    this.state = {show: this.props.showHome};
    this.handleClose = this.handleClose.bind(this);
  }
    
handleClose(){
    this.props.onHideHome();
}
  
  render() {
      
  const divStyle = {
      color: 'black',
      backgroundColor: 'lightblue',
      margin: '20px',
      padding: '2em',
      width: '700px',
      margin: 'auto',
      border: '1px solid black',
      borderRadius: '5px',
      textAlign: "center",
      verticalAlign: "middle",
      fontFamily: "Helvetica Neue",
      fontStyle: 'normal',
	  fontVariant: 'normal',
	  fontWeight: '500',
	  lineHeight: '26.4px'
}
  
    return (
        <div>{ this.props.showHome ? <div style={divStyle}>
        <button type="button" className="close" aria-label="Close" onClick={this.handleClose}> <span aria-hidden="true">&times;</span></button>       
      <span style={{fontFamily: "Cooper Black"}}>  
 <h2>Find-n-Dine, </h2></span><h3>a Free Code Camp <a href="https://www.freecodecamp.org/griffinf3" target="_blank">
<img alt="FreeCodeCamp profile" src = {fccLogo}
      style = {{ border: 0, width: 30, height: 30 }}/>
</a> coding project by Franklin Griffin.</h3>
        <h4>This site makes use of the <a href="https://www.yelp.com/fusion" target="_blank">Yelp Fusion</a> search engine to locate restuarants in your area.  Both registered and non-registered users can view Yelp reviews and the number of registered users attending a given venue on a given date.</h4>
        <h5></h5></div> : null }

      </div>
    )
  }
}

export default Home;