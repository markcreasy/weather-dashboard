
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
var currentCityState = {};

var updateCurrentWeather = function(weatherData){

}

var updateLocalStorage = function(){
  localStorage.setItem("currentCityState",JSON.stringify(currentCityState));
  localStorage.setItem("recentSearch", JSON.stringify(recentSearch));
}

var getWeatherData = function(){
  // get text input value
  var city = cityInput.value.trim();
  var testGeocoderURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + ",US&limit=1&appid=" + openWeatherAPIKey;

  fetch(testGeocoderURL).then(function(geocoderResponse){
    if(geocoderResponse.ok){
      geocoderResponse.json().then(function(geocoderData){
        // update recents
        currentCityState = geocoderData[0];
        updateRecentSearchList(geocoderData[0].name, geocoderData[0].state);

        var openWeatherOneCallAPI = "https://api.openweathermap.org/data/2.5/onecall?lat=" + geocoderData[0].lat + "&lon=" + geocoderData[0].lon + "&exclude=minutely,hourly,alerts&appid=" + openWeatherAPIKey;

        fetch(openWeatherOneCallAPI).then(function(oneCallAPIResponse){
          if(oneCallAPIResponse.ok){
            oneCallAPIResponse.json().then(function(weatherData){
              updateCurrentWeather(weatherData);
              updateLocalStorage();
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

var updateRecentSearchList = function(city, state){

  var cityState = city + " / " + state;

  // update recents
  if(!recentSearch.includes(cityState)){
    // add search term to beginning of array
    recentSearch.unshift(cityState);
    // if more than 5 recent search, trim array
    if(recentSearch.length > 5){
      recentSearch.pop();
    }
  }

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

var resumeState = function(){
  recentSearch = JSON.parse(localStorage.getItem("recentSearch"));
  console.log("recentsearch",recentSearch);
  currentCityState = JSON.parse(localStorage.getItem("currentCityState"));
  console.log("currentCityState", currentCityState);

  if(recentSearch != null && currentCityState != null){
    updateRecentSearchList(currentCityState.name, currentCityState.state);
  }

}

resumeState();

searchBtn.addEventListener("click", getWeatherData);
