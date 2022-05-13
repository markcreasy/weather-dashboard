
//////////////////////////////
// API URL Samples:
// One Call API: https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid=
// GeoCoderAPI: http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
///////////////////////////////
var openWeatherAPIKey = "aa73a952cd3ffc3c1bb66791a553f2ee";
var searchBtn = document.querySelector("#citySearchBtn");
var cityInput = document.querySelector("#city_search");
var recentSearchList = document.querySelector("#recentSearchList");
var currentLocationSpan = document.querySelector("#currentLocation");
var currentWeatherInfoEl = document.querySelector("#current-weather-info");
var fiveDayForecastEl = document.querySelector("#five-day-forecast");
var recentSearch = [];
var currentCityState = {};
var today = new Date();

var buildCardEl = function(weatherData,numDaysInFuture){

  var cardContainerEl = document.createElement("div");
  cardContainerEl.classList = "col s12 m6 l2";
  var cardEl = document.createElement("div");
  cardEl.classList = "card-content amber";

  // create card title (date)
  var cardTitleEl = document.createElement("span");
  cardTitleEl.classList = "card-title";
  var date = new Date(weatherData.dt * 1000);
  var dd = String(date.getDate()).padStart(2, '0');
  var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = date.getFullYear();
  var date = mm + '/' + dd + '/' + yyyy;
  cardTitleEl.textContent = date;

  // create weather icon and add to current location span
  var weatherIcon = document.createElement("img");
  weatherIcon.src = "http://openweathermap.org/img/wn/" + weatherData.weather[0].icon + "@2x.png";

  // create temp info
  var tempInfoEl = document.createElement("p");
  tempInfoEl.textContent = "Temp: " + weatherData.temp.day;

  // create wind info
  var windInfoEl = document.createElement("p");
  windInfoEl.textContent = "Wind: " + weatherData.wind_speed;

  // create humidity info
  var humidityInfoEl = document.createElement("p");
  humidityInfoEl.textContent = "Humidity: " + weatherData.humidity;

  // build card
  cardEl.appendChild(cardTitleEl);
  cardEl.appendChild(weatherIcon);
  cardEl.appendChild(tempInfoEl);
  cardEl.appendChild(windInfoEl);
  cardEl.appendChild(humidityInfoEl);
  cardContainerEl.appendChild(cardEl);

  return cardContainerEl;
}

var updateCurrentWeather = function(weatherData){

  // format today's date
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  var todaysDate = mm + '/' + dd + '/' + yyyy;

  // set current weather header
  currentLocationSpan.textContent = currentCityState.name + ", " + currentCityState.state + " " + todaysDate + " ";

  // create weather icon and add to current location span
  var weatherIcon = document.createElement("img");
  weatherIcon.src = "http://openweathermap.org/img/wn/" + weatherData.current.weather[0].icon + "@2x.png";
  currentLocationSpan.appendChild(weatherIcon);

  while(currentWeatherInfoEl.firstChild){
    currentWeatherInfoEl.removeChild(currentWeatherInfoEl.firstChild);
  }

  // create temp info
  var tempInfoEl = document.createElement("p");
  tempInfoEl.textContent = "Temp: " + weatherData.current.temp;
  currentWeatherInfoEl.appendChild(tempInfoEl);

  // create wind info
  var windInfoEl = document.createElement("p");
  windInfoEl.textContent = "Wind: " + weatherData.current.wind_speed;
  currentWeatherInfoEl.appendChild(windInfoEl);

  // create humidity info
  var humidityInfoEl = document.createElement("p");
  humidityInfoEl.textContent = "Humidity: " + weatherData.current.humidity;
  currentWeatherInfoEl.appendChild(humidityInfoEl);

  // create UV index info
  var uvInfoEl = document.createElement("p");
  uvInfoEl.classList = "left-align";
  uvInfoEl.textContent = "UV Index: ";
  var uvSpanEl = document.createElement("span");
  uvSpanEl.textContent = weatherData.current.uvi;
  if(weatherData.current.uvi < 5){
    uvSpanEl.classList = "green lighten-1 uv-span";
  }else if(weatherData.current.uvi > 5 && weatherData.current.uvi < 8){
    uvSpanEl.classList = "orange accent-2 uv-span";
  }else{
    uvSpanEl.classList = "red uv-span";
  }
  uvInfoEl.appendChild(uvSpanEl);
  currentWeatherInfoEl.appendChild(uvInfoEl);

  // create 5 day Forecast
  while(fiveDayForecastEl.firstChild){
    fiveDayForecastEl.removeChild(fiveDayForecastEl.firstChild);
  }

  for (var i = 1; i < 6; i++) {
    var cardEl = buildCardEl(weatherData.daily[i]);
    fiveDayForecastEl.appendChild(cardEl);
  }
}

var updateLocalStorage = function(){
  localStorage.setItem("currentCityState",JSON.stringify(currentCityState));
  localStorage.setItem("recentSearch", JSON.stringify(recentSearch));
}

var getWeatherData = function(city){

  var testGeocoderURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + ",US&limit=1&appid=" + openWeatherAPIKey;

  fetch(testGeocoderURL).then(function(geocoderResponse){
    if(geocoderResponse.ok){
      geocoderResponse.json().then(function(geocoderData){
        // update recents
        currentCityState = geocoderData[0];
        updateRecentSearchList(geocoderData[0].name, geocoderData[0].state);

        var openWeatherOneCallAPI = "https://api.openweathermap.org/data/2.5/onecall?lat=" + geocoderData[0].lat + "&lon=" + geocoderData[0].lon + "&exclude=minutely,hourly,alerts&units=imperial&appid=" + openWeatherAPIKey;

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
  }else{
    var cityIndex = recentSearch.indexOf(cityState);
    recentSearch.splice(cityIndex,1);
    recentSearch.unshift(cityState);
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
  currentCityState = JSON.parse(localStorage.getItem("currentCityState"));

  if(recentSearch != null && currentCityState != null){
    getWeatherData(currentCityState.name + "," + currentCityState.state);
  }

}

var recentSearchHandler = function(event){
  var city = event.target.textContent;
  getWeatherData(city.trim().replace(" / ",","));
}

var searchHandler = function(event){
  // get text input value
  var city = cityInput.value.trim();
  getWeatherData(city);
}

resumeState();

searchBtn.addEventListener("click", searchHandler);
recentSearchList.addEventListener("click", recentSearchHandler);
