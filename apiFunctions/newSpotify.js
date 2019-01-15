const SpotifyWebApi = require('spotify-web-api-node');

//create spotify Object
var spotifyApi = new SpotifyWebApi({
  clientId: 'YOUR_ID',
  clientSecret: 'YOUR_SECRET',
  redirectUri: 'http://localhost:8888/callback'
});

//set refresh token
spotifyApi.setRefreshToken('REFRESH_TOKEN');

//this function returns an artist's 'unique' ID and a Spotify link
function findArtistIdAndLink(artistName, finalArray, callback) {
  spotifyApi.clientCredentialsGrant()
  .then(function(data){
    spotifyApi.setAccessToken(data.body['access_token']);
    return spotifyApi.searchArtists(artistName);           
  })
  .then(function(data){
    data = data.body.artists.items[0];
    let artistData = {name:data.name, id:data.id, url:data.external_urls.spotify, image:data.images[2].url, score:0};
    finalArray.push(artistData);
    callback(finalArray);
  }, function(err) {
      console.error(err);
    });
}
//this function returns a Track ID and a Spotify link to the track
function findTrackIdAndLink(trackName, artistName, finalArray, callback) {
  spotifyApi.clientCredentialsGrant()
  .then(function(data){
    spotifyApi.setAccessToken(data.body['access_token']);
    return spotifyApi.searchTracks("track:" + trackName + " artist:" + artistName);           
  })
  .then(function(data){
    data = data.body.tracks.items[0];
    let trackData = {name:data.name, artist:data.artists[0].name, id:data.id, image:data.album.images[2].url, url:data.external_urls.spotify, score:0};
    finalArray.push(trackData);
    callback(finalArray);
  }, function(err) {
      console.error(err);
    });
}

//this function returns an artist's album ID and a Spotify link
function findAlbumIdAndLink(albumName, artistName, finalArray, callback) {
  spotifyApi.clientCredentialsGrant()
  .then(function(data){
    spotifyApi.setAccessToken(data.body['access_token']);
    return spotifyApi.searchArtists(artistName);           
  })
  .then(function(data){
    data = data.body.artists.items[0].uri.split(":")[2];
    return spotifyApi.getArtistAlbums(data);
  })
  .then(function(data){
    data = data.body.items;
    //this loop searches and for the correct album and reurns it.
    for(i=0; i<data.length; i++) {
      if(data[i].name == albumName) {
        let urlWithId = {name:data[i].name, artist:data[i].artists[0].name, id:data[i].id, url:data[i].external_urls.spotify, image:data[i].images[2].url, score:0};
        finalArray.push(urlWithId);
        i = data.length;
        callback(finalArray);
        //Return statement to ensure that the second failsafe callback does not run if we find the album
        return;
      }
    }
    //Failsafe to return the populated array if we do not find the album
    callback(finalArray);
  }, function(err) {
      console.error(err);
    });
}

//Gets an array of artists and returns an array of data
function batchArtists(artistNames, callback){
  let finalArray = [];
  for(let i=0; i<artistNames.length; i++) {
    findArtistIdAndLink(artistNames[i], finalArray, function(res){
       if(finalArray.length == artistNames.length){
        callback(finalArray);
       }
    });
  }
}

//Gets an array of tracks and returns an array of data
function batchSongs(songs, callback) {
  let finalArray = [];
  for(let i=0; i<songs.length; i++)
  findTrackIdAndLink(songs[i].name, songs[i].artist, finalArray, function(res){
     if(finalArray.length == songs.length){
        finalArray.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
        callback(finalArray);
      }
   });
}

//Gets an array of albums and returns an array of data
function batchAlbums(albums, callback) {
  let finalArray = [];
  for(let i=0; i<albums.length; i++) {
    findAlbumIdAndLink(albums[i].name, albums[i].artist, finalArray, function(res){
      if(i == albums.length-1){
        finalArray.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
        callback(finalArray);
      }
    });
  }
}

//export all functions
module.exports= { findArtistIdAndLink, findTrackIdAndLink, findAlbumIdAndLink, batchSongs, batchAlbums, batchArtists };
