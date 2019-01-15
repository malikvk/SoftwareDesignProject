//This is where we pull the song, album, and artist data in to find the dataset that we will be sorting

const billboard = require("billboard-top-100").getChart;

//Displays the top 100 songs
function getSongs(callback) {
	billboard('hot-100', function(err, songs) {
	    if (err) console.log(err);
	    let result = [];
	    for(let i=0; i<songs.length; i++) {
	    	let song = {name:songs[i].title, artist:songs[i].artist};
	    	result.push(song);
	    }
	    callback(result);
	    return;
	});
}

//Displays the top 200 albums
function getAlbums(callback) {
	let albums = billboard('billboard-200', function(err, albums) {
		if (err) console.log(err);
		let result = [];
		for(let i=0; i<albums.length; i++) {
			let album = {name:albums[i].title, artist:albums[i].artist};
			result.push(album);
		}
		callback(result);
		return;
	});
}

//Displays the top 100 artists
function getArtists(callback) {
	let artists = billboard('artist-100', function(err, artists) {
		if (err) console.log(err);
		let result = [];
		for(let i=0; i<artists.length; i++) {
			result.push(artists[i].title);
		}
		callback(result);
	});
}
//Export all of our functions
module.exports = { getSongs, getAlbums, getArtists };
