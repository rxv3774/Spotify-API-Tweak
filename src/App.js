import React, { Component } from 'react';
import './App.css';

let setStyle = {color: '#fff'};
let fakeServerData = {
  user: {
    name: 'Ryan',
    playlists: [
      {
        name: 'My go-to playlist',
        songs: [
          {name: 'Photograph', duration: 150000}, 
          {name: 'Come Through and Chill', duration: 150000}, 
          {name: 'KOD', duration: 150000}
        ]
      },
      {
        name: 'Jam Out',
        songs: [
        {name: 'Photograph', duration: 150000}, 
        {name: 'Come Through and Chill', duration: 150000}, 
        {name: 'KOD', duration: 150000}
      ]
      },
      {
        name: 'Vibes',
        songs: [
        {name: 'Photograph', duration: 150000}, 
        {name: 'Come Through and Chill', duration: 150000}, 
        {name: 'KOD', duration: 150000}
      ]
      },
      {
        name: 'Working-Out',
        songs: [
        {name: 'Photograph', duration: 150000}, 
        {name: 'Come Through and Chill', duration: 150000}, 
        {name: 'KOD', duration: 150000}
      ]
      }
    ]
  }
};


class App extends Component {
  constructor() {
    super();
    this.state = {serverData: {}}
  }
  componentDidMount() {
    setTimeout(() => {
    this.setState({serverData: fakeServerData});
    },
    1000);

  }
  render() {
    let name = 'Ryan'
    let headerStyle = {...setStyle, 'fontsize': '40px'}
    return (
      <div className="App">
      
        {this.state.serverData.user ?
        <div>
          <h1 style={{...setStyle, 'font-size': '50px'}}>
          {this.state.serverData.user.name}'s Playlists

          </h1>
            <NumberOfPlaylists playlists={this.state.serverData.user.playlists}/>
            <NumberOfHours playlists={this.state.serverData.user.playlists}/>

          <Filter/>
          <Playlist/>
          <Playlist/>
          <Playlist/>
        </div> : <h1 style={setStyle}>Loading...</h1>
        }
      </div>
    );
  }
}

class NumberOfPlaylists extends Component {
  render() {
    return (
      <div style={{width: "50%", display: 'inline-block'}}>
        <h2 style = {setStyle}> {this.props.playlists && this.props.playlists.length} playlists</h2>
      </div>
    )
  }
}

class NumberOfHours extends Component {
  render() {
    let allSongs = this.props.playlists.reduce((songs, individPlaylist) => {
      return songs.concat(individPlaylist.songs)
    }, [])
    let totalDuration = allSongs.reduce((sum, individSong) => {
      return sum + individSong.duration 
    }, 0)
    return (
      <div style={{width: "50%", display: 'inline-block'}}>
        <h2 style = {setStyle}> {totalDuration/1000/60/60} hours </h2>
      </div> //Math.floor if you want to remove decimals
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
