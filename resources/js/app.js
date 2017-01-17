$(function(){

	var WEATHER_API_KEY = "06253b1c77dc377a175cb9460e747f06";

	// Define variables & Defaults
	var is_ready = false,
		temperature = -273.15, //kelvin
		temperature_measurement = "c",
		$temp = $("#temp"),
		$condition = $("#condition"),
		$locality = $("#locality"),
		$country = $("#country"),
		$humidity = $("#humidity"),
		$wind = $("#wind"),
		$sunrise = $("#sunrise"),
		$sunset = $("#sunset");


	/**
		Check if it's "Hot" and add a class accordingly to reflect the heat.
	**/
	function isHot(){
		console.log(temperature_measurement);
		if((temperature >= 8 && temperature_measurement === "c") || (temperature >= 46.4 && temperature_measurement === "f")){
			$('table').addClass('glow');
		}
	}

	/**
		Convert Timestamp to Hours/Minutes
		@param timestamp(timestamp) - timestamp to convert to H:m
	**/
	function convertUnixTime(timeStamp){
		var date = new Date(timeStamp*1000);
		var hours = date.getHours();
		var minutes = "0" + date.getMinutes();
		return(hours + ":" + minutes);
	}

	/**
		Convert Temperature Unit of Measurment
		@param celcius(double) - celcius in degrees to convert to fahrenheight;
	**/
	function celciusToFahrenheight(celcius){
		return(Math.round(celcius * 9 / 5 + 32));
	}

	function fahrenheightToCelcius(fahrenheight){
		return(Math.round((fahrenheight-32)*5/9));
	}

	/**
	**/
	function updateTemp(temp){
		temperature = temp;
		$temp.html(temp + "&deg;" + temperature_measurement);
	}	
	
	/**
		Get the current user's location. Once retrieved, get their localised weather.
	**/
	function getLocation() {
	    if (navigator.geolocation) {
	        navigator.geolocation.getCurrentPosition(getWeather);
	    } else {
	        alert("Geolocation is not supported by this browser.");
	    }
	}

	/**
		Get weather data based on a supplied location using the Open Weather Map API.
		@param position(object) - browser-supplied geo-location data.
	**/
	function getWeather(position){
		var $location = {'appid': WEATHER_API_KEY, 'lat' : position.coords.latitude, 'lon': position.coords.longitude};
		$.ajax({
			type:'GET',
			url:'http://api.openweathermap.org/data/2.5/weather',
			data:$location,
			success: function(weather){
				temperature = (temperature + weather.main.temp); //convert temp(kelvin) to celcius.

				$weather={
					"temperature" : temperature,
					"temperature_measurement" : temperature_measurement,
					"condition" : weather.weather[0].main,
					"locality" : weather.name,
					"country" : weather.sys.country,
					"humidity" : weather.main.humidity,
					"wind" : weather.wind.speed,
					"sunrise" : convertUnixTime(weather.sys.sunrise),
					"sunset" : convertUnixTime(weather.sys.sunset),
				};

				updateCache($weather);
				updateUi($weather);
			},
			error:function(){
				alert('error retrieving data');
			},
		});	
	}
	
	/**
		Update the cache with fresh data.
		@param weather(object) - an object containing all the normalised weather data.
		@return - true if there is the data was cached, false if it wasn't possible.
	**/
	function updateCache(weather){
		var result=false;
		if (typeof(Storage) !== "undefined") {
			result=true;
			localStorage.temperature=weather.temperature;
			localStorage.temperature_measurement=weather.temperature_measurement;
			localStorage.condition=weather.condition;
			localStorage.locality=weather.locality;
			localStorage.country=weather.country;
			localStorage.humidity=weather.humidity;
			localStorage.wind=weather.wind;
			localStorage.sunrise=weather.sunrise;
			localStorage.sunset=weather.sunset;
		} else {
			console.log("No Web Storage support..");
		}
		return(result);
	}
	
	/**
		Check the cache for cached data. If there is cached data, update the UI, otherwise return false.
		@return - true if there is cached data, false if there isn't any.
	**/
	function checkCache(){
		var result=false;
		if (typeof(Storage) !== "undefined") {
			if(localStorage.temperature && localStorage.temperature>0){
				result=true;

				$weather={
					"temperature" : localStorage.temperature,
					"temperature_measurement" : localStorage.temperature_measurement,
					"condition" : localStorage.condition,
					"locality" : localStorage.locality,
					"country" : localStorage.country,
					"humidity" : localStorage.humidity,
					"wind" : localStorage.wind,
					"sunrise" : localStorage.sunrise,
					"sunset" : localStorage.sunrise,
				};
				
				updateUi($weather);
			}
		} else {
			console.log("No Web Storage support..");
		}
		return(result);
	}

	/**
		Update UI with values from JSON Object
		@param weather(object) - an object containing all the normalised weather data.
	**/
	function updateUi(weather){
		is_ready=true;
		
		temperature=weather.temperature;
		temperature_measurement=weather.temperature_measurement;

		/** Check to see if the temp is over 8 degrees, if so apply hot animation */
		isHot();

		condition = weather.condition;
		locality = weather.locality;
		country = weather.country;
		humidity = weather.humidity;
		wind = weather.wind;
		sunrise = weather.sunrise;
		sunset = weather.sunset;		

		//update field values
		$temp.html(temperature+"&deg;"+temperature_measurement);
		$condition.html(condition);
		$locality.html(locality);
		$country.html(country);
		$humidity.html(humidity + "%");
		$wind.html(wind + " M/S");
		$sunrise.html(sunrise + " am");
		$sunset.html(sunset + " pm");
	}

	/**
		Toggle button to change temperature measurement between Celcius and Fahrenheight
	**/
	function setupUi(){

		$("#fcToggle").on("click",function(){

			var $this = $(this),	
				currentTemp = temperature,
				btnState = $this.data("measurement");

			if(is_ready){
				if(btnState === "f"){
					temperature_measurement="c";
					$this.text('Fahrenheight');
					$this.data('measurement', 'c');
					updateTemp(fahrenheightToCelcius(currentTemp));
				}
				else if(btnState === "c"){
					temperature_measurement="f";
					$this.text('Celcius');
					$this.data('measurement', 'f');
					updateTemp(celciusToFahrenheight(currentTemp));
				}
			}else{
				alert("Sorry, we're still fetching data...");
			}

		});

		if(!checkCache()){
			getLocation();
		}
	}

	//init
	setupUi();
});