
//////////////////////////////
// API URL Samples:
// One Call API: https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid=
// GeoCoderAPI: http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
///////////////////////////////
var openWeatherAPIKey = "aa73a952cd3ffc3c1bb66791a553f2ee";
var searchBtn = document.querySelector("#citySearchBtn");
var cityInput = document.querySelector("#city_search");
var recentSearchList = document.querySelector("#recentSearchList");
var recentSearch = [];


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
              return weatherData;
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

var updateRecentSearchList = function(){

  // remove all recents
  while(recentSearchList.firstChild){
    recentSearchList.removeChild(recentSearchList.firstChild);
  }

  for (var i = 0; i < recentSearch.length; i++) {
    var searchDiv = document.createElement("div");
    searchDiv.classList = "input-field section";
    var searchBtn = document.createElement("button");
    searchBtn.classList = "waves-effect waves-light btn grey lighten-1 col s12";
    searchBtn.textContent = recentSearch[i];
    searchDiv.appendChild(searchBtn);

    recentSearchList.appendChild(searchDiv);
  }
}

var updateWeather = function(event){
  // get text input value
  var city = cityInput.value.trim();

  // get weather data for city input
  var weatherData = getWeatherData(city);

  // update recents
  if(!recentSearch.includes(city)){
    // add search term to beginning of array
    recentSearch.unshift(city);
    // if more than 5 recent search, trim array
    if(recentSearch.length > 5){
      recentSearch.pop();
    }
    // update DOM
    updateRecentSearchList();
  }



}

searchBtn.addEventListener("click", updateWeather);
