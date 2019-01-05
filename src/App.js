import React, { Component } from 'react';
import './App.css';
import queryString from 'query-string'
import SpotifyWebApi from 'spotify-web-api-js'
import $ from 'jquery'
import { promised } from 'q';

const spotifyApi = new SpotifyWebApi();

let setStyle = {color: '#fff'};
// let fakeServerData = {
//   user: {
//     name: 'Ryan',
//     playlists: [
//       {
//         name: 'My go-to playlist',
//         songs: [
//           {name: 'Photograph', duration: 150000}, 
//           {name: 'Motiv8', duration: 150000}, 
//           {name: 'KOD', duration: 150000}
//         ]
//       },
//       {
//         name: 'Jam Out',
//         songs: [
//         {name: 'Solita', duration: 150000}, 
//         {name: 'Te bote', duration: 150000}, 
//         {name: 'Soy peor', duration: 150000}
//       ]
//       },
//       {
//         name: 'Vibes',
//         songs: [
//         {name: 'Navajo', duration: 150000}, 
//         {name: 'Tadow', duration: 150000}, 
//         {name: 'Kevins Hart', duration: 150000}
//       ]
//       },
//       {
//         name: 'Working-Out',
//         songs: [
//         {name: 'Run', duration: 150000}, 
//         {name: 'Swervin', duration: 150000}, 
//         {name: 'ATM', duration: 150000}
//       ]
//       }
//     ]
//   }
// };


class App extends Component {
  
  constructor() {
    super();
    this.state = {serverData: {},
    filterString: ''
    }
    let apiUrl = 'https://api.spotify.com/v1'
    let artistName;

  }

  componentDidMount() {
     let parsed = queryString.parse(window.location.search)
    //  if(parsed.access_token) {
    //    spotifyApi.setAccessToken(parsed.access_token)
    //  }
    //  else {
    //    return;
    //  }
     let accessToken = parsed.access_token

     if(!accessToken) 
       return; //FIX UP
     
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
      }).then(response => 
      response.json()).then(playlistData => {
        let playlists = playlistData.items
        let trackDataPromises = playlists.map(playlist => { 
          let responsePromise = fetch(playlist.tracks.href, {
            headers: {'Authorization': 'Bearer ' + accessToken}
          })
        let trackDataPromise = responsePromise
          .then(response => response.json())
        return trackDataPromise
      })
      let allTracksDatasPromises = Promise.all(trackDataPromises)
      let playlistPromise = allTracksDatasPromises.then(trackDatas => {
          trackDatas.forEach((trackData, i) => {
            playlists[i].trackDatas = trackData.items.map(item => item.track).map(trackData => ({
              name: trackData.name,
              duration: trackData.duration_ms
          }))
        })
        return playlists
      })
      return playlistPromise
    })
    .then(playlists => 
        this.setState({
            playlists: playlists.map(item => {
              return {
                name: item.name,
                image: item.images[0].url,
                songs: item.trackDatas.slice(0,3)
              }
            })
        })
      )

      // fetch('https://api.spotify.com/v1/artists/search', {
      //   headers: {'Authorization': 'Bearer ' + accessToken}
      // }).then((response) => 
      // response.json()).then(data => 
      //   this.setState({
      //     artists: data.items.map(item => {
      //       return {
      //         artistName: item.name,

      //       }
      //     })
      //   }))
        
      
}


// getArtists() {
//   (artistName) => {
//     $.ajax({
//       url: 'https://api.spotify.com/v1/search',
//       method: 'GET',
//       datatype: 'json',
//       data: {
//         q: artistName
//       }
//     })
//   }
// }
  getArtistTopTracks(artistName) {
    //spotifyApi.artists.
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

          <div class="form">
              <form action="">
                <input type="search" id="searchBar" value=""/>
                <button type="button" value="submit" onClick=""/>
              </form>
          </div>

        </div> : <button onClick = {() => {
          window.location = window.location.href.includes('localhost') ? 
          'http://localhost:8888/login' : 'https://more-features-backend.herokuapp.com/login'
        }
      }
         style={{padding: '10px', 'font-size': '30px', 'margin-top': '20px'}}>Login With Spotify</button>
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
        <h2 style = {setStyle}> {(totalDuration/1000/60/60).toFixed(1)} hours </h2>
      </div> //Math.floor or Math.round if you want to remove decimals
    )
  }
}

export default App;
