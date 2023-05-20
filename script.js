$(document).ready(function() {
    var currentDate = dayjs().format("MM/DD/YYYY");
    var latitude = "";
    var longitude = "";
    var citySearch = $("#city-search");
    var citySearchButton = $("#city-search-button");
    var apiKey = ("72259a8e3e7d5079c23171b6153aa99");
  
    // clears localStorage
    function deleteItems() {
      localStorage.clear();
    }
  
    // shows weather after clicking search button
    citySearchButton.on("click", displayWeather);
  
    // currentWeather function
    function displayWeather(event) {
      event.preventDefault();
      if (citySearch.val().trim() !== "") {
        var city = citySearch.val().trim();
        getCoordinates(city, function() {
          currentWeather(city);
        });
        console.log(event);
      }
    }
  
    // retrieves coordinates (latitude and longitude) 
    function getCoordinates(city, callback) {
      const apiKey = "672259a8e3e7d5079c23171b6153aa99";
      var geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
  
      $.ajax({
        url: geocodingUrl,
        method: "GET",
      }).then(function(data) {
        if (data.length > 0) {
          latitude = data[0].lat;
          longitude = data[0].lon;
          callback();
        } else {
          console.log("City not found");
        }
      });
    }
  
    // current weather for searched city
    function currentWeather(city) {
      const apiKey = "672259a8e3e7d5079c23171b6153aa99";
      var queryUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`;
  
      $.ajax({
        url: queryUrl,
        method: "GET",
      }).then(function(weatherData) {
        var weathericon = weatherData.weather[0].icon;
        var iconurl = `https://openweathermap.org/img/wn/${weathericon}@2x.png`;
        var cityElement = $("#current-city");
        cityElement.html(`${weatherData.name} (${currentDate}) <img src="${iconurl}">`);
        var temp = $("#temperature");
        temp.text(`Temperature: ${weatherData.main.temp} °F`);
        var humidity = $("#humidity");
        humidity.text(`Humidity: ${weatherData.main.humidity}%`);
        var wind = $("#wind-speed");
        wind.text(`Wind Speed: ${weatherData.wind.speed} MPH`);
  
        latitude = weatherData.coord.lat;
        longitude = weatherData.coord.lon;
  
        // UV data and icon color based on number retrieved
        var queryUv = `https://api.openweathermap.org/data/2.5/uvi?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
      
        $.ajax({
          url: queryUv,
          method: "GET",
        }).then(function(uvIndexData) {
          var uvIndex = $("#uv-index");
          uvIndex.text(`UV Index: ${uvIndexData.value}`);
  
          var uvText = uvIndexData.value;
          if (uvText <= 2) {
            uvIndex.attr("class", "badge bg-success");
          } else if (uvText <= 6) {
            uvIndex.attr("class", "badge bg-warning");
          } else if (uvText > 6) {
            uvIndex.attr("class", "badge bg-danger");
          }
        });
    });
}
  
// create 5 day forecast weather cards
var forecastUrl =
  "https://api.openweathermap.org/data/2.5/forecast?lat=" +
  latitude +
  "&lon=" +
  longitude +
  "&appid=" +
  apiKey;

$.ajax({
  url: forecastUrl,
  method: "GET",
}).then(function(forecastData) {
  $("#forecast").empty();

  for (var i = 1; i < 6; i++) {
    var forecastIndex = (i * 8) - 1;

    // forecast card element
    var forecastCard = document.createElement("div");
    forecastCard.classList.add("col-lg-2", "bg-light", "mr-2");

    // appends card forecast card
    var forecastDate = document.createElement("p");
    forecastDate.textContent =
      "Date: " + forecastData.list[forecastIndex].dt_txt;
    forecastCard.appendChild(forecastDate);

    document.getElementById("forecast").appendChild(forecastCard);
  }
});
})
