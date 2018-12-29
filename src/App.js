import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

let textColor = '#fff';
let setStyle = {color: textColor};
class App extends Component {
  render() {
    let name = 'Ryan'
    let setColor = '#FF2212'
    let headerStyle = {...setStyle, 'fontsize': '40px'}
    return (
      <div className="App">
        <h1>Title</h1>
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
