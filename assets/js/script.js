
//////////////////////////////
// API URL Samples:
// One Call API: https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid=
// GeoCoderAPI: http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
///////////////////////////////
var openWeatherAPIKey = "aa73a952cd3ffc3c1bb66791a553f2ee";


var getWeatherData = function(city){
  var testGeocoderURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + ",US&limit=1&appid=" + openWeatherAPIKey;

  fetch(testGeocoderURL).then(function(geocoderResponse){
    if(geocoderResponse.ok){
      geocoderResponse.json().then(function(geocoderData){
        var openWeatherOneCallAPI = "https://api.openweathermap.org/data/2.5/onecall?lat=" + geocoderData[0].lat + "&lon=" + geocoderData[0].lon + "&exclude=minutely,hourly,alerts&appid=" + openWeatherAPIKey;

        fetch(openWeatherOneCallAPI).then(function(oneCallAPIResponse){
          if(oneCallAPIResponse.ok){
            oneCallAPIResponse.json().then(function(weatherData){
              console.log(weatherData);
            });
          }else{
            console.log("OneCallAPI HTTP-Error: " + oneCallAPIResponse.status);
          }
        });
      });
    }else{
      console.log("GeocoderAPI HTTP-Error: " + geocoderResponse.status);
    }
  });
}
