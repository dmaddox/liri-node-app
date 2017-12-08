// require external libraries / nodes
var fs = require("fs"); 
var keys = require("./keys.js");
var request = require('request');
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');

// check node input command
var command = process.argv[2];
var value = process.argv.slice(3);
value = value.join(" ");

delegate(command);

function delegate(command) {
	switch(command) {
		case "my-tweets": 
			twitter();
			break;
		case "spotify-this-song": 
			spotify(value);
			break;
		case "movie-this": 
			movie(value);
			break;
		case "do-what-it-says": 
			dwis();
			break;
	}
};


// twitter function
function twitter() {
	var client = new Twitter(keys.twitterKeys);

	var params = { screen_name: 'dmxatx', count: 20 };
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
	  if (!error) {
	  	for (i = 0; i < tweets.length; i ++) {
		    console.log("\"" + tweets[i].text + "\"");
		    console.log("     - " + tweets[i].created_at);
		};
	  }
	});
};


// Spotify function
function spotify(value) {
	if (value) {
		value = value;
		var queryURL = 'https://api.spotify.com/v1/search?q=track:' + value + '&type=track&limit=1';
	} else {
		value = "The Sign";
		var artist = "Ace of Base";
		var queryURL = 'https://api.spotify.com/v1/search?q=track:' + value +'%20artist:' + artist + '&type=track&limit=1';
	};	
	console.log("Searching " + value + "...");
 	
 	var spotify = new Spotify(keys.spotifyKeys);

 	// spotify request
	spotify
  	.request(queryURL)
	  .then(function(data) {
	    // console.log(data.tracks); 
	    // bandName
	    var bandName = data.tracks.items[0].artists[0].name; 
		console.log("Artist(s): " + bandName);
		console.log("Song: " + value);
	    // previewLink
	    var previewLink = data.tracks.items[0].preview_url; 
		console.log("Preview: " + previewLink);
		// albumName
		var albumName = data.tracks.items[0].album.name; 
		console.log("Album: " + albumName);
	  })
	  .catch(function(err) {
	    console.error('Error occurred: ' + err); 
	  });
}; // End Spotify function


// Movie function
function movie(value) {
	if (!value) {value = "Mr. Nobody"} 

	var url =
	  "http://www.omdbapi.com/?t=" + value + "&apikey=trilogy";
	request.get(url, (error, response, body) => {
	  var body = JSON.parse(body);
	  console.log("   Movie: " + body.Title);
	  console.log("   Year: " + body.Year);
	  console.log("   IMDB Rating: " + body.Ratings[0].Value);
	  console.log("   Rotten Tomatoes Rating: " + body.Ratings[1].Value);
	  console.log("   Produced in: " + body.Country);
	  console.log("   Language: " + body.Language);
	  console.log("   Plot: " + body.Plot);
	  console.log("   Actors: " + body.Actors);
	});
}; // end movie function


// Do-what-it-says function
function dwis() {
	// Read the keys.js file
	fs.readFile("random.txt", "UTF8", function(err, data){
		// if there is an error
		if(err){
			console.log(err);
		};
		// upon success
		var dataArray = data.split(",");
		value = dataArray[1];
		delegate(dataArray[0]);
		});
}; // end do-what-it-says function