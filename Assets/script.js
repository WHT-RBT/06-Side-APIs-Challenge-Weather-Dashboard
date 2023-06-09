$(document).ready(function() {
  var apiKey = "672259a8e3e7d5079c23171b6153aa99";

  //Function to populate current weather
  function populateCurrentWeather(currentWeather) {
    $("#current-city").text(currentWeather.name);
    
    //Gets current date
    var currentDate = new Date();
    var formattedDate = currentDate.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    $("#current-date").text(formattedDate);
    $("#current-temperature").text("Temp: " + currentWeather.main.temp + " °F");
    $("#current-humidity").text("Humidity: " + currentWeather.main.humidity + "%");
    $("#current-wind-speed").text("Wind Speed: " + currentWeather.wind.speed + " MPH");
    //Displays weather icon
    var weatherIconUrl = "https://openweathermap.org/img/wn/" + currentWeather.weather[0].icon + ".png";
    var weatherIcon = $("<img>").attr("src", weatherIconUrl).addClass("weather-icon");
    $("#current-weather-icon").empty().append(weatherIcon);
  }
  //Function to get current weather for latitude/longitude
  function getCurrentWeather(lat, lon) {
    var url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
    $.ajax({
      url: url,
      method: "GET",
    }).then(function(data) {
      populateCurrentWeather(data);
    });
  }
    //Function to populate forecast
  function makeForecast(forecastData) {
    for (var i = 0; i < forecastData.length; i++) {
      var forecast = forecastData[i];
      console.log("Forecast data for day", i + 1, ":", forecast);
      console.log("Temperature:", forecast.main.temp);

      var forecastTemperatureId = "#forecast-temperature-" + (i + 1);
      var forecastDateId = "#forecast-date-" + (i + 1);
      var forecastDate = new Date(forecast.dt * 1000); 
      var formattedDate = forecastDate.toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "2-digit"
      });
      var forecastHumidityId = "#forecast-humidity-" + (i + 1);
      var forecastWindSpeedId = "#forecast-wind-speed-" + (i + 1);
      var forecastIconId = "#forecast-icon-" + (i + 1);

      $(forecastTemperatureId).text("Temp: " + forecast.main.temp + " °F");
      $(forecastDateId).text(formattedDate);
      $(forecastHumidityId).text("Humidity: " + forecast.main.humidity + "%");
      $(forecastWindSpeedId).text("Wind: " + forecast.wind.speed + " MPH");
      $(forecastIconId).attr("src", "https://openweathermap.org/img/wn/" + forecast.weather[0].icon + ".png");
      $(forecastIconId).show();
    }
  }
  //Function to get forecast for latitude/longitude
  function getForecast(lat, lon) {
    var url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`
    $.ajax({
      url: url,
      method: "GET",
    }).then(function(data) {
      makeForecast(data.list);
    });
  }
  //Function to save a city to the search history
  function saveCityToHistory(city) {
    var searchedCities = JSON.parse(localStorage.getItem("searchedCities")) || [];
    var index = searchedCities.indexOf(city);
    if (index !== -1) {
      searchedCities.splice(index, 1);
    }
    searchedCities.unshift(city);
    searchedCities = searchedCities.slice(0, 8);

    //Saves search history to local storage
    localStorage.setItem("searchedCities", JSON.stringify(searchedCities));
    displaySearchHistory();
  }
  //Function to display search history
  function displaySearchHistory() {
    var searchedCities = JSON.parse(localStorage.getItem("searchedCities")) || [];

    $("#searched-cities").empty();

    //Makes search history clickable links
    for (var i = 0; i < searchedCities.length; i++) {
      var city = searchedCities[i];
      var listItem = $("<li>").addClass("list-group-item").text(city);
      listItem.attr("data-city", city);
      $("#searched-cities").append(listItem);
    }
    if (searchedCities.length > 0) {
      $("#clear-history-button").show();
    } else {
      $("#clear-history-button").hide();
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
          //Saves the city to the search history
          saveCityToHistory(city);
        } else {
          alert("City not found. Please enter a valid city name.");
        }
      });
    }
  });
  //Event listener for search history to become usable links
  $(document).on("click", "#searched-cities li", function() {
    var city = $(this).attr("data-city");
    //Gets the latitude/longitude for the selected city
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
  //Displays the search history on page load
  displaySearchHistory();

  $("#clear-history-button").on("click", function() {
    localStorage.removeItem("searchedCities");
    displaySearchHistory();
  });
});