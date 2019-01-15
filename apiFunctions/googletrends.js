const googleTrends = require('google-trends-api');
const async = require("async");

function findInterestOverTime(data, finalArray, callback) {
	googleTrends.interestOverTime({keyword: data.name, startTime: new Date(Date.now() - (7 * 24 * 60 * 60 * 1000)), category: 35})
	.then(function(results){
		let average = 0;
		for(let i=0; i < JSON.parse(results).default.timelineData.length; i++) {
			average += JSON.parse(results).default.timelineData[i].value[0];
		}
		average = average / JSON.parse(results).default.timelineData.length;
		data.score = average;
		finalArray.push(data);
		callback(finalArray);
	})
	.catch(function(err){
		console.error('Error', err);
	});
}

function findInterestInRegion(artistName, callback) {
	googleTrends.interestByRegion({keyword: artistName, startTime: new Date(Date.now() - (7 * 24 * 60 * 60 * 1000)), geo: 'US-CA', category: 35})
	.then(function(res){
		let artistWithRegions = {name:artistName, geoScores:[]};
		res = JSON.parse(res).default.geoMapData;
		for(let i=0; i<res.length; i++) {
			let geodata = {name:res[i].geoName, geoCode:res[i].geoCode, score:res[i].value[0]};
			artistWithRegions.geoScores.push(geodata);
		}
		callback(artistWithRegions);
	})
	.catch((err) => {
	  console.log('Error', err);
	});
}

function findRelatedQueries(artistName, callback) {
	googleTrends.relatedQueries({keyword: artistName, startTime: new Date(Date.now() - (7 * 24 * 60 * 60 * 1000)), category: 35})
	.then(function(res){
		let artistWithQueries = {name:artistName, scores:[]};
		res = JSON.parse(res).default.rankedList[0].rankedKeyword;
		for(let i=0; i<res.length; i++) {
			let score = {query:res[i].query, score:res[i].value};
			artistWithQueries.scores.push(score);
		}
		callback(artistWithQueries);
	})
	.catch(function(err){
		console.error('Error', err);
	});
}

function getBatchScoresArtist(data, callback) {
	let scored = [];
	for(let i=0; i<data.length; i++) {
		findInterestOverTime(data[i], scored, function(res) {
			if(scored.length == data.length) {
				scored.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
				callback(scored);
			}
		})
	}
}

function getBatchScoresTracksAndAlbums(data, callback) {
	let scored = [];
	for(let i=0; i<data.length; i++) {
		findInterestOverTime(data[i], scored, function(res) {
			if(scored.length == data.length) {
				scored.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
				callback(scored);
			}
		})
	}
}

//Export all of our functions
module.exports = { findInterestOverTime, findInterestInRegion, 
findRelatedQueries, getBatchScoresArtist, getBatchScoresTracksAndAlbums };

