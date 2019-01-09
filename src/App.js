import React, { Component } from 'react';
import './App.css';
import queryString from 'query-string'
import SpotifyWebApi from 'spotify-web-api-js'
import $ from 'jquery'
import { promised, when } from 'q';

const spotifyApi = new SpotifyWebApi();

let setStyle = {color: '#fff'};

class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {serverData: {},
    filterString: ''
    }

    this.form = React.createRef
    this.search = React.createRef
    this.submit = React.createRef
    
    let apiUrl = 'https://api.spotify.com/v1'
    let api_artist_url = 'https://api.spotify.com/v1/search?q=Daft+Punk&type=artist'

    this.test = this.test.bind(this)
    this.searchArtist = this.searchArtist.bind(this)
  }

  test() {
    let parsed = queryString.parse(window.location.search)
    let accessToken = parsed.access_token

    document.getElementById('search-form').addEventListener('submit', function (e) {
      e.preventDefault();
      let artists = document.getElementById('query').value
      artists = artists.split(',') //parses through input


      let artistSearch = artists.map(artistName => 
        $.ajax({
          url: 'https://api.spotify.com/v1/search',
          headers: {'Authorization': 'Bearer ' + accessToken},
          method:'GET',
          dataType: 'json',
          data: {
            q: artistName,
            type: 'artist'
          }
        })
      )

      let allTracks = []
      $.when(...artistSearch).then((...artist) => {
        artist = artist.map(artistInfo => artistInfo[0].artists.items[0].id)
        .map(artistId => 
          
          $.ajax({
            url: 'https://api.spotify.com/v1/artists/'.concat(artistId,'/top-tracks'),
            headers: {'Authorization': 'Bearer ' + accessToken},
            method:'GET',
            dataType: 'json',
            data: {
              country: 'US',
              type: 'artist'
            }
          })

  
        )

        $.when(...artist).then((...tracks) => {
          tracks = tracks.map(topTracks => topTracks[0].tracks) //obtains multiple arrays of top tracks
          tracks = tracks.reduce((previous, current) => [...previous, ...current], []) //flattens multiple arrays into one array
          console.log(tracks)
        })
     
      })
      }, false);
  }

  searchArtist(artistName) { 
    let parsed = queryString.parse(window.location.search)
    let accessToken = parsed.access_token
    $.ajax({
      url: 'https://api.spotify.com/v1/search',
      headers: {'Authorization': 'Bearer ' + accessToken},
      method:'GET',
      dataType: 'json',
      data: {
        q: artistName,
        type: 'artist'
      }
    })
  }

  getArtistTopTracks(artistId) {
    let parsed = queryString.parse(window.location.search)
    let accessToken = parsed.access_token
    $.ajax({
      url: 'https://api.spotify.com/v1/artists/'.concat(artistId,'/top-tracks'),
      headers: {'Authorization': 'Bearer ' + accessToken},
      method:'GET',
      dataType: 'json',
      data: {
        country: 'US',
        type: 'artist'
      }
    })
  }

  buildPlaylist(tracks) {
    let parsed = queryString.parse(window.location.search)
    let accessToken = parsed.access_token
    $.when(...tracks).then(userID =>
      $.ajax({
        url: 'https://api.spotify.com/v1/users/'.concat(userID,'/playlists'),
        headers: {'Authorization': 'Bearer ' + accessToken},
        method:'GET',
        dataType: 'json',
        data: {
          country: 'US',
          type: 'artist'
        }
      })

    )
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
          <h1 style={{...setStyle, 'fontSize': '50px'}}>
          {this.state.user.name}'s Playlists

          </h1>
            <NumberOfPlaylists playlists={playlistsToRender}/>
            <NumberOfHours playlists={playlistsToRender}/>
            <Filter onTextChange={text => this.setState({filterString: text})}/>
          {
            playlistsToRender.map(playlist => 
              <Playlist playlist={playlist}/>
              )}

          <div className="form" id="search-form" ref={this.form}>
              <form action="">
                <input type="search" id="query" ref = {this.search} value={this.search.val}/>
                <input type="submit" id="but" ref={this.submit} value="Create" onClick={this.test}/>
              </form>
          </div>

        </div> : <button onClick = {() => {
          window.location = window.location.href.includes('localhost') ? 
          'http://localhost:8888/login' : 'https://more-features-backend.herokuapp.com/login'
        }
      }
         style={{padding: '10px', 'fontSize': '30px', 'marginTop': '20px'}}>Login With Spotify</button>
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
