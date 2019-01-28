import React, { Component } from 'react';
import './App.css';
import queryString from 'query-string'
import $ from 'jquery'

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
    this.playlist = React.createRef
    

    this.doit = this.doit.bind(this)
    this.searchArtist = this.searchArtist.bind(this)
  }


  doit() {
    let apiUrl = 'https://api.spotify.com/v1'
    let parsed = queryString.parse(window.location.search)
    let accessToken = parsed.access_token //user access token

    document.getElementById('search-form').addEventListener('submit', function (e) {
      e.preventDefault();
      let artists = document.getElementById('query').value
      artists = artists.split(',') //parses through input


      let artistSearch = artists.map(artistName => 
        $.ajax({ //search for artist objects
          url: apiUrl.concat('/search'),
          headers: {'Authorization': 'Bearer ' + accessToken},
          method:'GET',
          dataType: 'json',
          data: {
            q: artistName,
            type: 'artist'
          }
        })
      )

      $.when(...artistSearch).then((...artist) => {
        artist = artist.map(artistInfo => artistInfo[0].artists.items[0].id) //gets artist ids
        .map(artistId => 
          
          $.ajax({ //gets artists top-tracks
            url: apiUrl.concat('/artists/',artistId,'/top-tracks'),
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
          tracks = tracks.reduce((previous, current) => [...previous, ...current], []).map(item => item.uri) //flattens multiple arrays into one array

          let userInfo = $.ajax({ //obtains the user's information(name, email, id, etc...) 
            url: apiUrl.concat('/me'),
            headers: {'Authorization': 'Bearer ' + accessToken},
            method:'GET',
            dataType: 'json',
          })

          $.when(userInfo).then((...results) => {
            let userId = results[0].id //obtains the spotify user id

            let newPlayist = $.ajax({ //creates a new empty private playlist
              url: apiUrl.concat('/users/',userId,'/playlists'),
              headers: {'Authorization': 'Bearer ' + accessToken,
              'Content-Type': 'application/json'},
              method:'POST',
              dataType: 'json',
              data: JSON.stringify({
                name: 'My new playlist',
                public: 'false'
              })
            })

            $.when(newPlayist).then((...results) => {
              let playlistId = results[0].id
              let playlistExternalUrl = 'https://open.spotify.com/playlist/'.concat(playlistId)
              $.ajax({ //inserts top-tracks into empty playlist
                url: apiUrl.concat('/playlists/',playlistId,'/tracks'),
                headers: {'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json'},
                method:'POST',
                dataType: 'json',
                data: JSON.stringify({
                  uris: tracks //a comma separated array of all the track uris
                })
              })

              //$(this.playlist).html(<iframe src="https://open.spotify.com/embed/user/ryanpro2008/playlist/5tkn7BbZIV8wrL1aiXbVpA" height='400'></iframe>)
            })

          })
          
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

  flattenTopTracks(artist) {
    $.when(...artist).then((...tracks) => {
      tracks = tracks.map(topTracks => topTracks[0].tracks) //obtains multiple arrays of top tracks
      tracks = tracks.reduce((previous, current) => [...previous, ...current], []) //flattens multiple arrays into one array
    })
  }

  getUserId(userinfo) {
    $.when(userinfo).then((...results) => {
      let id = results[0].id
      return id
    })
  }

  buildPlaylist(userid) {
    let parsed = queryString.parse(window.location.search)
    let accessToken = parsed.access_token
    $.ajax({
      url: 'https://api.spotify.com/v1/users/'.concat(userid,'/playlists'),
      headers: {'Authorization': 'Bearer ' + accessToken,
      'Content-Type': 'application/json'},
      method:'POST',
      dataType: 'json',
      data: JSON.stringify({
        name: 'My new playlist',
        public: 'false'
      })
    })
  }

  insertTopTracks(trackURIS, playlist_id) {
    let parsed = queryString.parse(window.location.search)
    let accessToken = parsed.access_token
    $.ajax({
      url: 'https://api.spotify.com/v1/playlists/'.concat(playlist_id,'/tracks'),
      headers: {'Authorization': 'Bearer ' + accessToken,
      'Content-Type': 'application/json'},
      method:'POST',
      dataType: 'json',
      data: JSON.stringify({
        uris: trackURIS
      })
    })
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
              name: data.display_name,
              id: data.id
            }
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
          <h1 style={{...setStyle, 'fontSize': '50px', padding: '10px'}}>
          {this.state.user.name}'s Playlists

          </h1>
            <NumberOfPlaylists playlists={playlistsToRender}/>
            <NumberOfHours playlists={playlistsToRender}/>
            <Filter onTextChange={text => this.setState({filterString: text})}/>
          {
            playlistsToRender.map(playlist => 
              <Playlist playlist={playlist}/>
              )}

          <h2 style={{...setStyle, 'fontSize': '20px'}}>Welcome to Ryan's playlist generator. To create a playlist, input 2-10 artist names(comma seperated) and press create!</h2>

          <div className="form" id="search-form" ref={this.form}>
              <form action="">
                <input type="search" id="query" ref = {this.search} value={this.search.val}/>
                <input type="submit" id="but" ref={this.submit} value="Create" onClick={this.doit}/>
              </form>
          </div>
          <div className="playlist" id ="play" ref={this.playlist}>
            
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
