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
          {name: 'Motiv8', duration: 150000}, 
          {name: 'KOD', duration: 150000}
        ]
      },
      {
        name: 'Jam Out',
        songs: [
        {name: 'Solita', duration: 150000}, 
        {name: 'Te bote', duration: 150000}, 
        {name: 'Soy peor', duration: 150000}
      ]
      },
      {
        name: 'Vibes',
        songs: [
        {name: 'Navajo', duration: 150000}, 
        {name: 'Tadow', duration: 150000}, 
        {name: 'Kevins Hart', duration: 150000}
      ]
      },
      {
        name: 'Working-Out',
        songs: [
        {name: 'Run', duration: 150000}, 
        {name: 'Swervin', duration: 150000}, 
        {name: 'ATM', duration: 150000}
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
          {
            this.state.serverData.user.playlists.map(playlist => 
              <Playlist playlist={playlist}/>
              )}
          }

        </div> : <h1 style={setStyle}>Loading...</h1>
        }
      </div> //.map tranfers all elements from the array of playlists and pushes them 
            //into a new empty array and then returns them.
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
      </div> //Math.floor or Math.round if you want to remove decimals
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
    let playlist = this.props.playlist
    return (
      <div style={{...setStyle, width: '30%', display: 'inline-block'}}>
        <img />
        <h3>{playlist.name}</h3>
        <ul>
          {playlist.songs.map(song => <li>{song.name}</li>)}
        </ul>
      </div>
    )
  }
}

export default App;
