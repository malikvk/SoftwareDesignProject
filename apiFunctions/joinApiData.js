//This is a function to combine all the data we get from all the apis into one piece of data to export

const spotify = require("./newSpotify.js");
const billboard = require("./billboard.js");
const googletrends = require("./googletrends.js");

//Grabs song names from billboard, finds their spotify data, scores them
function getSongData(callback) {
	billboard.getSongs(function(songs){
		spotify.batchSongs(songs, function(songsWithSpotifyData) {
			googletrends.getBatchScoresTracksAndAlbums(songsWithSpotifyData, function(final){
				callback(final);
			});
		});
	});
}

//Grabs album names from billboard, finds their spotify data, scores them
function getAlbumData(callback) {
	billboard.getAlbums(function(songs){
		spotify.batchAlbums(songs, function(songsWithSpotifyData) {
			googletrends.getBatchScoresTracksAndAlbums(songsWithSpotifyData, function(final){
				callback(final);
			});
		});
	});
}

//Grabs artist names from billboard, finds their spotify data, scores them
function getArtistData(callback) {
	billboard.getArtists(function(songs){
		spotify.batchArtists(songs, function(songsWithSpotifyData) {
			googletrends.getBatchScoresArtist(songsWithSpotifyData, function(final){
				callback(final);
			});
		});
	});
}

module.exports = { getSongData, getAlbumData, getArtistData };