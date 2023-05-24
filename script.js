$(document).ready(function() {
  var apiKey = "672259a8e3e7d5079c23171b6153aa99";

//Function to populate current weather data
function populateCurrentWeather(currentWeather) {
  $("#current-city").text(currentWeather.name);
  $("#current-temperature").text("Temperature: " + currentWeather.main.temp + " °F");
  $("#current-humidity").text("Humidity: " + currentWeather.main.humidity + "%");
  $("#current-wind-speed").text("Wind Speed: " + currentWeather.wind.speed + " MPH");
  //Displays weather icons
  var weatherIconUrl = "https://openweathermap.org/img/wn/" + currentWeather.weather[0].icon + ".png";
  var weatherIcon = $("<img>").attr("src", weatherIconUrl).addClass("weather-icon");
  $("#current-weather-icon").empty().append(weatherIcon);
}
  //Function to get current weather data for latitude/longitude
  function getCurrentWeather(lat, lon) {
    var url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
    $.ajax({
      url: url,
      method: "GET",
    }).then(function(data) {
      populateCurrentWeather(data);
    });
  }
  //Function to populate forecast data
  function makeForecast(forecastData) {
    for (var i = 0; i < forecastData.length; i++) {
      var forecast = forecastData[i];
      console.log("Forecast data for day", i + 1, ":", forecast);
      console.log("Temperature:", forecast.main.temp);

      var forecastTemperatureId = "#forecast-temperature-" + (i + 1);
      var forecastHumidityId = "#forecast-humidity-" + (i + 1);
      var forecastWindSpeedId = "#forecast-wind-speed-" + (i + 1);
      var forecastIconId = "#forecast-icon-" + (i + 1);

      $(forecastTemperatureId).text("Temperature: " + forecast.main.temp + " °F");
      $(forecastHumidityId).text("Humidity: " + forecast.main.humidity + "%");
      $(forecastWindSpeedId).text("Wind Speed: " + forecast.wind.speed + " MPH");
      $(forecastIconId).attr("src", "https://openweathermap.org/img/wn/" + forecast.weather[0].icon + ".png");
      $(forecastIconId).show();
    }
  }
  //Function to get forecast data for latitude/longitude
  function getForecast(lat, lon) {
    var url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`
    $.ajax({
      url: url,
      method: "GET",
    }).then(function(data) {
      makeForecast(data.list);
    });
  }
  //Save a city to the search history
  function saveCityToHistory(city) {
    var searchedCities = JSON.parse(localStorage.getItem("searchedCities")) || [];
    var index = searchedCities.indexOf(city);
    if (index !== -1) {
      searchedCities.splice(index, 1);
    }
    searchedCities.unshift(city);
    searchedCities = searchedCities.slice(0, 8);

    //Save search history to local storage
    localStorage.setItem("searchedCities", JSON.stringify(searchedCities));

    displaySearchHistory();
  }
  function displaySearchHistory() {
    var searchedCities = JSON.parse(localStorage.getItem("searchedCities")) || [];

    $("#searched-cities").empty();

    //Iterate over the search history and create clickable links
    for (var i = 0; i < searchedCities.length; i++) {
      var city = searchedCities[i];
      var listItem = $("<li>").addClass("list-group-item").text(city);
      listItem.attr("data-city", city);
      $("#searched-cities").append(listItem);
    }
  }
  //Event listener for city search button
  $("#city-search-button").on("click", function(event) {
    event.preventDefault();

    var city = $("#city-search").val().trim();
    if (city !== "") {
      $("#city-search").val("");

      //Gets the latitude/longitude for entered city
      var geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
      $.ajax({
        url: geocodingUrl,
        method: "GET",
      }).then(function(data) {
        if (data.length > 0) {
          var lat = data[0].lat;
          var lon = data[0].lon;
          getCurrentWeather(lat, lon);
          getForecast(lat, lon);
          //Save the city to the search history
          saveCityToHistory(city);
        } else {
          alert("City not found. Please enter a valid city name.");
        }
      });
    }
  });
  //Event listener for search history links
  $(document).on("click", "#searched-cities li", function() {
    var city = $(this).attr("data-city");
    // Retrieve the latitude and longitude for the selected city
    var geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
    $.ajax({
      url: geocodingUrl,
      method: "GET",
    }).then(function(data) {
      if (data.length > 0) {
        var lat = data[0].lat;
        var lon = data[0].lon;
        getCurrentWeather(lat, lon);
        getForecast(lat, lon);
      } else {
        alert("City not found. Please enter a valid city name.");
      }
    });
  });
  // Display the search history on page load
  displaySearchHistory();
});