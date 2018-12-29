import React, { Component } from 'react';
import './App.css';

let setStyle = {color: '#fff'};
class App extends Component {
  render() {
    let name = 'Ryan'
    let headerStyle = {...setStyle, 'fontsize': '40px'}
    return (
      <div className="App">
        <h1 style={{...setStyle, 'font-size': '50px'}}>Title</h1>
        <Aggregate/>
        <Aggregate/>
        <Filter/>
        <Playlist/>
        <Playlist/>
        <Playlist/>
      </div>
    );
  }
}

class Aggregate extends Component {
  render() {
    return (
      <div style={{width: "50%", display: 'inline-block'}}>
        <h2 style = {setStyle}> Number Text</h2>
      </div>
    )
  }
}

class Filter extends Component {
  render() {
    return(
      <div style={setStyle}>
        <img/>
        <input type="text"/>
      </div>
    )
  }
}

class Playlist extends Component {
  render() {
    return (
      <div style={{...setStyle, width: '30%', display: 'inline-block'}}>
        <img />
        <h3>Playlist Name</h3>
        <ul><li>Song 1</li><li>Song 2</li><li>Song 3</li></ul>
      </div>
    )
  }
}

export default App;
