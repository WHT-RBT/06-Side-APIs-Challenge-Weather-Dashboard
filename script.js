$(function() {
  var currentDate = dayjs().format("MM/DD/YYYY");
  var citySearch = $("#city-search");
  var apiKey = "672259a8e3e7d5079c23171b6153aa99";

  // function deleteItems() {
  //   localStorage.removeItem("searchedCitiesObjects");
  //   loadSearchedCities();
  // }

  // $("#clear-history-button").on("click", deleteItems);

  //displays the weather
    function displayWeather(event) {
      event.preventDefault();
      if (citySearch.val().trim() !== "") {
        var city = citySearch.val().trim();
        getCoordinates(city)
        citySearch.val("")
      }
    }

  // //event listener for "Enter" key press
  // citySearch.on("keypress", function(event) {
  //   if (event.key === "Enter") {
  //     console.log("Enter key pressed");
  //     // event.preventDefault(); 
  //     displayWeather();
  //   }
  // });
  

  //displays current weather for the searched city
  function displayCityInCurrentWeather(city, data) {
    console.log("Displaying weather for city: " + city);
    console.log("Data:", data);
  }

  //retrieves coordinates (latitude and longitude)
  function getCoordinates(city) {
    // const apiKey = "f5630d10f0a469ac2577259780e2df96";
    console.log("getCoordinates is running")
    var geocodingUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
    console.log(geocodingUrl)
    $.ajax({
      url: geocodingUrl,
      method: "GET",
    }).then(function(data) {
      console.log("GOT MY DATA FROM AJAX")
      console.log(data)
      if (data.length > 0) {
        var latitude = data[0].lat;
        var longitude = data[0].lon;
        currentWeather(latitude,longitude)
        getForecast(latitude,longitude)
      } else {
        console.log("City not found");
      }
    });
  }

  function getForecast(lat,lon){
    console.log('I AM GOING TO FETCH THE FORECAST!')
    console.log(lat,lon)
    var url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`
    $.ajax({
      url: url,
      method: "GET",
    }).then(function(data) {
      console.log("GOT MY DATA FROM AJAX FOR THE FORECAST")
      console.log(data)
      makeForecast(data.list)
      
    });
  }

  function makeForecast(forecastData){
    console.log("GOT MY FORECAST DATA! LET ME MAKE MY FORECAST")
    console.log(forecastData)
  }

  function makeCurrentWeather(weatherData){
    console.log(weatherData)
    return
    var weathericon = weatherData.current.weather[0].icon;
    var iconurl = `https://openweathermap.org/img/wn/${weathericon}.png`;
    var cityElement = $("#current-city");
    cityElement.html(`${weatherData.timezone} (${currentDate}) <img src="${iconurl}">`);
    var temp = $("#current-temperature");
    temp.text(`Temperature: ${weatherData.current.temp} °F`);
    var humidity = $("#current-humidity");
    humidity.text(`Humidity: ${weatherData.current.humidity}%`);
    var wind = $("#current-wind-speed");
    wind.text(`Wind Speed: ${weatherData.current.wind_speed} MPH`);
  }

  //current weather for the searched city
  function currentWeather(lat,lon) {
    console.log("CURRENT WEATHER RUNNING")
    // const apiKey = "f5630d10f0a469ac2577259780e2df96";
    var queryWeather = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

    $.ajax({
      url: queryWeather,
      method: "GET",
    }).then(function(weatherData) {
      console.log(weatherData)
      makeCurrentWeather(weatherData)
      //UV info
      // var uvIndex = $("#uv-index");
      // uvIndex.text(`UV Index: ${weatherData.current.uvi}`);

      // var uvText = weatherData.current.uvi;
      // if (uvText <= 2) {
      //   uvIndex.attr("class", "badge bg-success");
      // } else if (uvText <= 6) {
      //   uvIndex.attr("class", "badge bg-warning");
      // } else {
      //   uvIndex.attr("class", "badge bg-danger");
      // }
    }).catch(function(error) {
      console.log("Failed to fetch weather data:", error);
    });
  }

  //5-day forecast weather cards
  function createForecastCards(forecastData) {
    $("#forecast").empty();

    for (var i = 0; i < 5; i++) {
      var forecastIndex = i;
      var forecastItem = forecastData.daily[forecastIndex];

      var forecastCard = $("<div>").addClass("card forecast-card");

      var forecastDate = $("<p>").text("Date: " + forecastItem.dt);
      forecastCard.append(forecastDate);

      var forecastTemperature = $("<p>").text("Temperature: " + forecastItem.temp.day);
      forecastCard.append(forecastTemperature);

      var forecastHumidity = $("<p>").text("Humidity: " + forecastItem.humidity);
      forecastCard.append(forecastHumidity);

      var forecastWindSpeed = $("<p>").text("Wind Speed: " + forecastItem.wind_speed);
      forecastCard.append(forecastWindSpeed);

      var forecastIcon = $("<img>").attr("src", "https://openweathermap.org/img/wn/" + forecastItem.weather[0].icon + ".png");
      forecastCard.append(forecastIcon);

      $("#forecast").append(forecastCard);
    }
  }

  //saves the searched city
  // function saveSearchedCity(city) {
  //   var citiesSearchedObjectsArray = [];

  //   if (localStorage.getItem("searchedCitiesObjects")) {
  //     citiesSearchedObjectsArray = JSON.parse(localStorage.getItem("searchedCitiesObjects"));
  //   }
  //   var existingCityIndex = citiesSearchedObjectsArray.findIndex(function(object) {
  //     return object.city === city;
  //   });
  //   if (existingCityIndex !== -1) {
  //     citiesSearchedObjectsArray.splice(existingCityIndex, 1);
  //   }
  //   var cityObject = {
  //     city: city,
  //     data: null 
  //   };
  //   citiesSearchedObjectsArray.unshift(cityObject);
  //   if (citiesSearchedObjectsArray.length > 8) {
  //     citiesSearchedObjectsArray.pop();
  //   }

  //   var citiesSearchedObjectsArrayString = JSON.stringify(citiesSearchedObjectsArray);
  //   localStorage.setItem("searchedCitiesObjects", citiesSearchedObjectsArrayString);
  // }

  //loads weather for a city
  function loadWeatherForCity(city) {
    getCoordinates(city)
    }

  //click event for searched cities
  function handleSearchedCityClick(event) {
    var clickedCity = $(event.target).text();
    loadWeatherForCity(clickedCity);
  }

  //event listener for searched city click
  $("#city-search-button").on("click", displayWeather);

  //loads the searched cities from local storage and updates in HTML
  // function loadSearchedCities() {
  //   var citiesSearchedObjectsArray = [];

  //   if (localStorage.getItem("searchedCitiesObjects")) {
  //     citiesSearchedObjectsArray = JSON.parse(localStorage.getItem("searchedCitiesObjects"));
  //   }
  //   var searchedCitiesElement = $("#searched-cities");

  //   searchedCitiesElement.empty();

  //   //shows list of searched cities
  //   if (citiesSearchedObjectsArray) {
  //     citiesSearchedObjectsArray.forEach(function(object) {
  //       var city = object.city;

  //       //creates a list element for the searched city
  //       var listItem = $("<li>")
  //         .addClass("list-group-item")
  //         .text(city);

  //       //click event listener to load weather for clicked city
  //       listItem.on("click", function() {
  //         loadWeatherForCity(city);
  //       });

  //       searchedCitiesElement.append(listItem);
  //     });
  //   }
  // }

  //loads searched cities on page load
  // loadSearchedCities();
});