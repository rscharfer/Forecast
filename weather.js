// Load required packages and modules
var https = require('https');
// Node.js Google Maps API Wrapper https://github.com/moshen/node-googlemaps
var gmaps = require('googlemaps');

//API KEY for Forecast.io /* Insert you personal key */
var API_KEY = "e4fec0a55bc8ac271616f9477dff1f15";
// Takes one US Zip Code, City, or Address input
var zipcode = process.argv.slice(2);

// Use the getGoogleZip function, and pass in an anonymous callback function with the returned 
// latitude and longitude coordinates to use with the getForecast function, which is passed into
// the url
getGoogleZip(zipcode, function(latlng) {
	getForecast(latlng);
});

// Console output function
printCurrentWeather = function (summary, temperature, apparentTemperature, windSpeed) {
	console.log(summary + ", " + temperature + " degrees Farenheit, " + "feels like " + apparentTemperature + ", with wind speeds at " + windSpeed + "mph");
}

function getGoogleZip (zipcode, latlng) {
	gmaps.geocode(zipcode, function (error, result) {
		if (error) {
			console.error(error.message);
		}
		else if (result.status === "OK"){
			// Add [0] add the end of results, which specfies the index vaule, since results returns an array
			latlng(result.results[0].geometry.location.lat + "," + result.results[0].geometry.location.lng);
			console.log(result.results[0].formatted_address);
		}
	});
}

function getForecast (latlng) {
	var request = https.get("https://api.forecast.io/forecast/" + API_KEY + "/" + latlng, function (response) {
		var body = "";
		response.on('data', function (bulk) {
			body += bulk;
		});
		response.on('end', function () {
			var report = JSON.parse(body);
			printCurrentWeather(report.currently.summary, report.currently.temperature, report.currently.apparentTemperature, report.currently.windSpeed);
		});
	});

	request.on("error", function (error) {
		console.error(error.message);
	})
}