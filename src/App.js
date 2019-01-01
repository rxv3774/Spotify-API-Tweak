import React, { Component } from 'react';
import './App.css';
import queryString from 'query-string'

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
    this.state = {serverData: {},
    filterString: ''
  }
  }
  componentDidMount() {
     let parsed = queryString.parse(window.location.search)
     let accessToken = parsed.access_token

     if(!accessToken) 
       return;
     
     fetch('https://api.spotify.com/v1/me', {
       headers: {'Authorization': 'Bearer ' + accessToken}
      }).then((response) => 
        response.json()).then(data => 
          this.setState({
            user: {
              name: data.display_name}
          })
        )

      fetch('https://api.spotify.com/v1/me/playlists', {
       headers: {'Authorization': 'Bearer ' + accessToken}
      }).then((response) => 
      response.json()).then(data => 
        this.setState({
            playlists: data.items.map(item => {
              return {
                name: item.name,
                image: item.images[0].url,
                songs: []
              }
            })
        })
      )
}
  render() {
    let playlistsToRender = this.state.user && this.state.playlists ? 
    this.state.playlists.filter(playlist => 
      playlist.name.toLowerCase().includes(
        this.state.filterString.toLowerCase())
      ) : []
    return (
      <div className="App">
      
        {this.state.user ?
        <div>
          <h1 style={{...setStyle, 'font-size': '50px'}}>
          {this.state.user.name}'s Playlists

          </h1>
            <NumberOfPlaylists playlists={playlistsToRender}/>
            <NumberOfHours playlists={playlistsToRender}/>
            <Filter onTextChange={text => this.setState({filterString: text})}/>
          {
            playlistsToRender.map(playlist => 
              <Playlist playlist={playlist}/>
              )}

        </div> : <button onClick = {() => {
          window.location = window.location.href.includes('localhost') ? 
          'http://localhost:8888/login' : 'https://more-features-backend.herokuapp.com/login'
        }
      }
         style={{padding: '10px', 'font-size': '30px', 'margin-top': '20px'}}>Sign in with Spotify</button>
        }
      </div> //.map tranfers all elements from the array of playlists and pushes them 
            //into a new empty array and then returns them.
    );
  }
}


class Filter extends Component {
  render() {
    return(
      <div style={setStyle}>
        <img/>
        <input type="text" onKeyUp={
          event => this.props.onTextChange(event.target.value)
          }/>
      </div>
    )
  }
}

class Playlist extends Component {
  render() {
    let playlist = this.props.playlist
    return (
      <div style={{...setStyle, width: '30%', display: 'inline-block'}}>
        <img src={playlist.image} style={{width: '150px'}}/>
        <h3>{playlist.name}</h3>
        <ul>
          {playlist.songs.map(song => <li>{song.name}</li>)}
        </ul>
      </div>
    )
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

export default App;
