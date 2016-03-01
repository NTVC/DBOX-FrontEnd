var g,
GLoc = {

    settings: {
        geoButton: $('#geo-button'),
        geoErrorMessage: $('#geo-error-message'),
        startPos: '',
        searchQuery: '',
        closeButton: $('#close-error')
    },

    init: function() {
        g = this.settings;
    },

    getGeoLocation: function(numToGet) {
        navigator.geolocation.getCurrentPosition(GLoc.geoSuccess, null);
    },

    geoSuccess: function(position) {

        // Do magic with the location
        g.startPos = position;
        g.searchQuery = 'http://api.openweathermap.org/data/2.5/weather?lat=' + g.startPos.coords.latitude + '&lon=' + g.startPos.coords.longitude + '&appid=0596fe0573fa9daa94c2912e5e383ed3' +'';

        $.getJSON(g.searchQuery, function(data) {
            WeatherInfo.setWeatherData(data);
        });
    }
};

var w,
WeatherInfo = {

    settings: {
        weather: $('#weather'),
        weatherInfo: $('#weather-info'),
        location: $('#location'),
        weatherDescription: $('#weather-description'),
        temperature: $('#temperature'),
        tempNumber: '',
        fahrenheit: $('#fahrenheit'),
        celsius: $('#celsius'),
        wind: $('#wind'),
        speedUnit: $('#speed-unit'),
        windSpeed: '',
        windDirection: $('#wind-direction'),
        windDegree: '',
        dayOrNight: ''
    },

    init: function() {
        w = this.settings;
        WeatherInfo.getWeatherData( window.parent.GLOBAL_CUSTOMER_CITY );
    },
    getWeatherData: function(searchQuery) {
        w.searchQuery = 'http://api.openweathermap.org/data/2.5/weather?q=' + searchQuery + '&appid=0596fe0573fa9daa94c2912e5e383ed3';
     
        $.getJSON(w.searchQuery, function(data) {
            WeatherInfo.setWeatherData(data);
        });
    },

    setWeatherData: function(data) {
        w.weather.removeClass('hide');
        w.location.text(data.name + ', ' + data.sys.country);
        w.weatherDescription.text(data.weather[0].description);
        w.tempNumber = data.main.temp;
        w.windSpeed = data.wind.speed;
        w.windDegree = data.wind.deg;
        WeatherInfo.getWeatherDirection();
        WeatherInfo.changeTempUnit('celsius');
        var time = Date.now() / 1000;
        WeatherInfo.getDayOrNight(time, data.sys.sunrise, data.sys.sunset);
        CanvasBackground.chooseBackground(data.weather[0].main);
        
    },

    getWeatherDirection: function() {
        if (w.windDegree > 337.5 || w.windDegree <= 22.5) {
            w.windDirection.text('N');
        } else if (22.5 < w.windDegree <= 67.5) {
            w.windDirection.text('NE');
        } else if (67.5 < w.windDegree <= 112.5) {
            w.windDirection.text('E');
        } else if (112.5 < w.windDegree <= 157.5) {
            w.windDirection.text('SE');
        } else if (157.5 < w.windDegree <= 202.5) {
            w.windDirection.text('S');
        } else if (202.5 < w.windDegree <= 247.5) {
            w.windDirection.text('SW');
        } else if (247.5 < w.windDegree <= 292.5) {
            w.windDirection.text('W');
        } else if (292.5 < w.windDegree <= 337.5) {
            w.windDirection.text('NW');
        }

    },

    changeTempUnit: function(unit) {
        var newTemp = w.tempNumber - 273.15;
        if (unit === 'celsius') {
            w.celsius.addClass('checked');
            w.fahrenheit.removeClass('checked');
            w.temperature.addClass('celsius-degree');
            w.temperature.removeClass('fahrenheit-degree');
            w.temperature.html(Math.round(newTemp));
            WeatherInfo.changeSpeedUnit('km');
        } else if (unit === 'fahrenheit') {
            w.temperature.html(Math.round(9/5 * newTemp + 32));
            w.celsius.removeClass('checked');
            w.fahrenheit.addClass('checked');
            w.temperature.removeClass('celsius-degree');
            w.temperature.addClass('fahrenheit-degree');
            WeatherInfo.changeSpeedUnit('m');
        }
    },

    changeSpeedUnit: function(unit) {
        if (unit === 'km') {
            w.wind.text('' + Math.round(w.windSpeed * 3.6));
            w.speedUnit.text('km/h');
        } else if (unit === 'm') {
            w.wind.text('' + Math.round(w.windSpeed * 2.23694185194));
            w.speedUnit.text('mph');
        }
    },

    getDayOrNight: function(time, sunrise, sunset) {

        if (time >= sunrise && time < sunset) {
            w.dayOrNight = 'daytime';
        } else if (time < sunrise) {
            if (time < sunset - 86400) {
                w.dayOrNight = 'daytime';
            } else {
                w.dayOrNight = 'nighttime';
            }
        } else if (time > sunset) {
            if (time < sunrise + 86400) {
                w.dayOrNight = 'nighttime';
            } else {
                w.dayOrNight = 'daytime';
            }
        }
    }
};

var c,
CanvasBackground = {
    settings: {
        weatherBackground: $('#weather-background'),
        weatherCanvas: $('#weather-canvas')[0],
        weatherCTX: $('#weather-canvas')[0].getContext('2d'),
        rainCanvas: $('#rain-canvas')[0],
        rainCTX: $('#rain-canvas')[0].getContext('2d'),
        cloudCanvas: $('#cloud-canvas')[0],
        cloudCTX: $('#cloud-canvas')[0].getContext('2d'),
        timeCanvas: $('#time-canvas')[0],
        timeCTX: $('#time-canvas')[0].getContext('2d'),
        lightningCanvas: $('#lightning-canvas')[0],
        lightningCTX: $('#lightning-canvas')[0].getContext('2d'),
        bgChoice: '',
        iconColor: {
            defaultWeather: '#9AD4E0',
            thunderstorm: '#717F8E',
            drizzle: '#63A6CC',
            rain: '#63A6CC',
            snow: '#B5B9BB',
            atmosphere: '#CED1DD',
            clouds: '#6AB7E3',
            extremeWeather: '#D3746B',
            clearsky: '#9AD4E0',
        },
        requestRain: '',
        requestCloud: '',
        requestWeather: '',
        requestTime: '',
        refreshIntervalID: ''
    },

    init: function() {
        c = this.settings;
        CanvasBackground.resizeBackground();
        CanvasBackground.chooseBackground();
    },
    resizeBackground: function() {                 
        /* Resize the canvas to occupy the full page, 
           by getting the widow width and height and setting it to canvas*/
        
        c.weatherCanvas.width  = window.innerWidth;
        c.weatherCanvas.height = window.innerHeight;
        c.rainCanvas.width  = window.innerWidth;
        c.rainCanvas.height = window.innerHeight;
        c.cloudCanvas.width  = window.innerWidth;
        c.cloudCanvas.height = window.innerHeight;
        c.timeCanvas.width  = window.innerWidth;
        c.timeCanvas.height = window.innerHeight;
        c.lightningCanvas.width = window.innerWidth;
        c.lightningCanvas.height = window.innerHeight;
    },

    chooseBackground: function(condition) {
        c.bgChoice = condition;

        c.weatherBackground.removeClass();
        c.weatherBackground.addClass(w.dayOrNight);
        CanvasBackground.clearAllCanvases();
        
        switch (condition) {
          case 'Thunderstorm':
            c.weatherBackground.addClass('thunderstorm');
            color_var = c.iconColor.thunderstorm;
            CanvasBackground.animateRain('rain');
            CanvasBackground.animateClouds();
            CanvasBackground.animateLightning();
            break;
          case 'Drizzle':
            c.weatherBackground.addClass('drizzle');
            color_var = c.iconColor.drizzle;
            CanvasBackground.animateRain('drizzle');
            CanvasBackground.animateClouds();
            break;
          case 'Rain':
            c.weatherBackground.addClass('rain');
            color_var = c.iconColor.rain;
            CanvasBackground.animateRain('rain');
            break;
          case 'Snow':
            c.weatherBackground.addClass('snow');
            color_var = c.iconColor.snow;
            CanvasBackground.animateSnow();
            break;
          case 'Fog' :
          case 'Haze' :
          case 'Mist' :
          case 'Sand' :
          case 'Dust' :
          case 'Smoke':
          case 'Volcanic Ash' :
            c.weatherBackground.addClass('atmosphere');
            color_var = c.iconColor.atmosphere;
            CanvasBackground.animateAtmosphere();
            break;
          case 'Clouds':
            c.weatherBackground.addClass('clouds');
            color_var = c.iconColor.clouds;
            CanvasBackground.animateClouds();
            break;
          case 'Clear':
            c.weatherBackground.addClass('clearsky');
            break;
          case 'Extreme':
            c.weatherBackground.addClass('extreme-weather');
            color_var = c.iconColor.extremeWeather;
            CanvasBackground.animateExtreme();
            break;
          default:
            c.weatherBackground.addClass('default-weather');
            color_var = c.iconColor.defaultWeather;
            CanvasBackground.getRandomBackground();
            break;
        }
    },

    getRandomBackground: function() {
        
        var possibleAnimations = [CanvasBackground.animateSnow, CanvasBackground.animateRain, CanvasBackground.animateClouds];
        var randomAnimation = Math.round(Math.random() * (possibleAnimations.length - 1));
        return possibleAnimations[randomAnimation]();
    },

    clearAllCanvases: function() {
        
        c.weatherCTX.clearRect(0,0,c.weatherCanvas.width,c.weatherCanvas.height);
        c.timeCTX.clearRect(0,0,c.timeCanvas.width,c.timeCanvas.height);
        c.rainCTX.clearRect(0,0,c.rainCanvas.width,c.rainCanvas.height);
        c.cloudCTX.clearRect(0,0,c.cloudCanvas.width,c.cloudCanvas.height);
        c.lightningCTX.clearRect(0,0,c.lightningCanvas.width,c.lightningCanvas.height);
    },

    animateRain: function(condition) {
        var rainSvg = '<svg width="28px" height="39px" viewBox="0 0 28 39" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns"><title>rain</title><desc>Created with Sketch.</desc><defs></defs><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage"><g id="rain" sketch:type="MSLayerGroup" transform="translate(-10.000000, -6.000000)" fill="' + color_var + '"><g id="Page-1" sketch:type="MSShapeGroup"><path d="M33.5,33.5 C33.5,40.1273333 28.1266667,45.5 21.5,45.5 C14.8726667,45.5 9.5,40.1273333 9.5,33.5 C9.5,21.5 21.5,3.50000001 21.5,3.50000001 C21.5,3.50000001 33.5,21.5 33.5,33.5 L33.5,33.5 L33.5,33.5 Z" id="rain" transform="translate(21.500000, 24.500000) rotate(-30.000000) translate(-21.500000, -24.500000) "></path></g></g></g></svg>';


        var params;
        var rainDrops = [],
            spacing = 50,
            n = parseInt(innerWidth / spacing),
            sizes = [[28,39], [24, 33], [20, 28]];
            

            if (condition === 'drizzle') {
                rainSvg = '<svg width="28px" height="39px" viewBox="0 0 28 39" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns"><title>rain</title><desc>Created with Sketch.</desc><defs></defs><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage"><g id="rain" sketch:type="MSLayerGroup" transform="translate(-10.000000, -6.000000)" fill="' + color_var + '"><g id="Page-1" sketch:type="MSShapeGroup"><path d="M33.5,33.5 C33.5,40.1273333 28.1266667,45.5 21.5,45.5 C14.8726667,45.5 9.5,40.1273333 9.5,33.5 C9.5,21.5 21.5,3.50000001 21.5,3.50000001 C21.5,3.50000001 33.5,21.5 33.5,33.5 L33.5,33.5 L33.5,33.5 Z" id="rain" transform="translate(21.500000, 24.500000) rotate(0.000000) translate(-21.500000, -24.500000) "></path></g></g></g></svg>';
                spacing = 10;
                n = innerWidth / spacing;
                sizes = [[10, 14], [15, 20.8]];
            }

        // Create a Data URI.
        var rainSrc = 'data:image/svg+xml;base64,' + window.btoa(rainSvg);
         
        // Load up our image.
        var rainSource = new Image();
        rainSource.src = rainSrc;
            
        params = {n:n, sizes:sizes, obj: c.weatherCanvas, img: rainSource, animation: (condition === 'drizzle' ? true : false)};
        rainDrops = getArrayWeather(params);
        
        params = {
            arr: rainDrops,
            obj: c.rainCanvas,
            CTX: c.rainCTX,
            condition:{type:'raindrops', animation:'drizzle', src: rainSource},
            n: n
        };
        
        drawRect(params);

    },

    animateClouds: function() {
        var cloudSvg = '<svg width="100px" height="55px" viewBox="0 0 100 55" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns"><title>Group</title><desc>Created with Sketch.</desc><defs></defs><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage"><g id="cloud" sketch:type="MSLayerGroup" fill="' + color_var + '"><g id="Group" sketch:type="MSShapeGroup"><path d="M83.336,20.018 C81.412,13.644 75.501,9 68.5,9 C66.193,9 64.013,9.518 62.046,10.421 C57.008,4.074 49.232,0 40.5,0 C26.11,0 14.31,11.053 13.108,25.132 C5.719,26.064 0,32.358 0,40 C0,48.284 6.716,55 15,55 L83,55 C92.389,55 100,47.165 100,37.5 C100,27.952 92.568,20.204 83.336,20.018 L83.336,20.018 Z" id="Shape"></path><path d="M15,51 C8.935,51 4,46.065 4,40 C4,34.478 8.131,29.792 13.609,29.101 L16.819,28.696 L17.094,25.473 C18.122,13.432 28.403,4 40.5,4 C47.708,4 54.419,7.247 58.913,12.908 L60.864,15.366 L63.716,14.056 C65.241,13.355 66.851,13 68.5,13 C73.528,13 78.054,16.361 79.507,21.173 L80.347,23.958 L83.255,24.017 C90.283,24.158 96,30.207 96,37.5 C96,44.944 90.168,51 83,51 L15,51 L15,51 Z" id="Shape"></path></g></g></g></svg>';
         
        // Create a Data URI.
        var cloudSrc = 'data:image/svg+xml;base64,'+window.btoa(cloudSvg);
         
        // Load up our image.
        var cloudSource = new Image();
        cloudSource.src = cloudSrc;
        
        var params;
        var cloudArray = [],
            spacing = 100,
            n = parseInt(innerWidth / spacing),
            sizes = [[100,55], [90, 49.5], [80, 44]];
            
        params = {n:n, sizes:sizes, obj: c.cloudCanvas, img: cloudSource};
        cloudArray = getArrayWeather(params);
        
        params = {
            arr: cloudArray,
            obj: c.cloudCanvas,
            CTX: c.cloudCTX,
            condition:{type:'cloud', animation:'', src: cloudSource},
            n: n
        };
        
        drawRect(params);
    },
    animateLightning: function() {
        var lightningSVG = '<svg width="165px" height="478px" viewBox="0 0 165 478" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns"><title>Shape</title><desc>Created with Sketch.</desc><defs></defs><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage"><path d="M100.879903,-8.99765934 L90.162516,133.004374 L100.879903,133.004374 L64.9851657,491.002341 L79.4836165,214.81442 L63.3793211,214.814428 L85.7571545,-8.99765934 L100.879903,-8.99765934 Z" id="Shape" fill="#FFFFFF" sketch:type="MSShapeGroup" transform="translate(82.129612, 241.002341) rotate(15.000000) translate(-82.129612, -241.002341) "></path></g></svg>';

        // Create a Data URI.
        var lightningSrc = 'data:image/svg+xml;base64,'+window.btoa(lightningSVG);
         
        // Load up our image.
        var lightningIMG = new Image();
        lightningIMG.src = lightningSrc;

        thunderDraw();
        
        function thunderDraw(){
            var i;
            c.lightningCTX.clearRect(0,0,c.lightningCanvas.width,c.lightningCanvas.height);

            function flash() {

                c.lightningCTX.fillStyle = 'rgba(255,255,255,.7)';
                c.lightningCTX.fillRect(0,0,c.lightningCanvas.width, c.lightningCanvas.height);

                var locx = Math.random() * (c.lightningCanvas.width - 165);
                var locy = Math.random() * (c.lightningCanvas.height- 478);
                c.lightningCTX.drawImage(lightningIMG, locx, locy);
                


                function flashOff() {
                    c.lightningCTX.clearRect(0,0,c.lightningCanvas.width,c.lightningCanvas.height);
                }

                setInterval(flashOff, 100);

            }

            c.refreshIntervalID = setInterval(flash, 5000);
            
        }
    },

    animateAtmosphere: function() {
        var atmosphereSvg = '<svg width="96px" height="84px" viewBox="0 0 96 84" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns"><title>Shape</title><desc>Created with Sketch.</desc><defs></defs><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage"><g id="smoke" sketch:type="MSLayerGroup" transform="translate(-2.000000, 0.000000)" fill="' + color_var + '" fill-opacity=".5"><path d="M95.117,29.243 C97.344,27.148 97.949,23.727 96.388,20.943 C94.552,17.664 90.386,16.49 87.105,18.329 L86.942,18.42 C85.658,17.878 84.293,17.539 82.895,17.417 C83.716,14.407 83.501,11.099 82.026,8.082 C78.8,1.481 70.802,-1.263 64.202,1.962 C62.176,2.953 60.464,4.417 59.187,6.217 C54.886,2.788 48.852,2.013 43.736,4.512 C36.756,7.924 33.731,16.227 36.765,23.289 C34.461,24.777 32.927,27.152 32.445,29.772 C32.317,29.935 32.175,30.084 32.056,30.253 C27.755,26.823 21.72,26.048 16.604,28.548 C9.626,31.96 6.6,40.263 9.634,47.326 C6.615,49.274 4.907,52.743 5.171,56.297 C2.832,58.262 2.032,61.644 3.434,64.51 C3.82,65.301 4.343,65.976 4.955,66.534 C3.606,71.46 5.152,76.941 9.347,80.379 C15.031,85.035 23.446,84.196 28.1,78.515 C29.53,76.769 30.475,74.725 30.886,72.556 C34.082,73.35 37.446,73.011 40.408,71.671 C43.547,72.414 46.958,72.044 49.986,70.346 C51.954,69.244 53.58,67.687 54.753,65.816 C59.239,69 65.309,69.432 70.275,66.651 C73.293,64.956 75.467,62.338 76.655,59.349 C79.565,59.654 82.574,59.098 85.261,57.59 C91.673,53.996 94.297,46.234 91.66,39.58 C93.289,37.766 94.366,35.546 94.824,33.185 C95.184,31.921 95.293,30.579 95.117,29.243 L95.117,29.243 Z" id="Shape" sketch:type="MSShapeGroup"></path></g></g></svg>';
         
        // Create a Data URI.
        var atmosphereSrc = 'data:image/svg+xml;base64,'+window.btoa(atmosphereSvg);
         
        // Load up our image.
        var atmosphereSource = new Image();
        atmosphereSource.src = atmosphereSrc;

        var params;
        var atmosphereArray = [],
            spacing = 20,
            n = parseInt( innerWidth / spacing ),
            sizes = [[200,150], [300, 200]];
            
        params = {n:n, sizes:sizes, obj: c.weatherCanvas, img: atmosphereSource};
        atmosphereArray = getArrayWeather(params);
        
        params = {
            arr: atmosphereArray,
            obj: c.weatherCanvas,
            CTX: c.weatherCTX,
            condition:{type:'cloud', animation:'', src: atmosphereSource},
            n: n
        };
        
        drawRect(params);
         
    },

    animateSnow: function() {
        var snowSvg = '<svg width="89px" height="100px" viewBox="0 0 89 100" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns"><title>Shape</title><desc>Created with Sketch.</desc><defs></defs><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage"><g id="Artboard" sketch:type="MSArtboardGroup" fill="'+ color_var + '"><path d="M36.786,50.287 L40.741,56.128 L48.106,56.128 L51.504,50.287 L47.924,44.067 L40.545,44.067 L36.786,50.287 L36.786,50.287 Z M39.819,97.261 L39.819,84.054 L32.44,88.204 L28.681,86.052 L28.681,81.399 L39.624,75.179 L39.624,66.499 L31.685,71.601 L31.685,62.405 L24.096,66.779 L24.096,79.247 L19.945,81.819 L16.437,79.498 L16.437,71.142 L4.919,77.64 L0,75.57 L0,70.3 L12.089,63.691 L4.528,59.89 L4.528,55.068 L8.819,52.719 L19.664,59.105 L27.197,54.759 L27.015,54.62 L19.314,50.203 L26.791,45.563 L19.286,41.217 L8.442,47.589 L4.374,45.563 L4.374,40.755 L11.713,36.632 L0,30.272 L0,25.003 L4.5,22.684 L16.044,29.35 L16.044,20.853 L19.524,18.505 L23.788,20.965 L23.76,33.683 L31.516,38.113 L31.489,29.127 L39.623,33.502 L39.623,24.822 L28.68,18.589 L28.68,13.977 L32.439,11.797 L39.818,15.948 L39.818,2.768 L44.04,0 L48.301,2.768 L48.301,15.948 L55.947,11.713 L59.792,14.257 L59.792,18.408 L48.47,24.822 L48.47,33.502 L56.214,28.778 L56.214,38.226 L64.193,33.878 L64.193,20.28 L68.037,18.491 L72.075,20.28 L72.075,28.974 L83.954,22.558 L88.107,25.088 L88.107,30.007 L76.506,36.604 L83.76,40.67 L83.76,45.367 L80,47.45 L68.862,40.867 L61.16,45.759 L68.609,50.401 L60.936,54.817 L68.862,58.967 L80,52.746 L83.578,55.276 L83.578,59.763 L76.59,63.69 L87.716,70.3 L87.716,75.488 L83.006,77.64 L72.075,71.419 L72.075,79.651 L68.148,81.845 L64.305,79.651 L64.305,67.155 L56.213,62.544 L56.213,71.224 L48.469,66.499 L48.469,75.179 L59.413,81.399 L59.413,86.319 L55.637,88.205 L48.3,84.055 L48.3,97.262 L44.04,100 L39.819,97.261 L39.819,97.261 Z" id="Shape" sketch:type="MSShapeGroup"></path></g></g></svg>';
         
        // Create a Data URI.
        var snowSrc = 'data:image/svg+xml;base64,'+window.btoa(snowSvg);
         
        // Load up our image.
        var snowSource = new Image();
        snowSource.src = snowSrc;

        var params;
        var snowArray = [],
            spacing = 50,
            n = parseInt(innerWidth / spacing),
            sizes = [[89,100],[50,56.18],[70,78.65]];
            
        params = {n:n, sizes:sizes, obj: c.weatherCanvas, img: snowSource};
        snowArray = getArrayWeather(params);
        
        params = {
            arr: snowArray,
            obj: c.weatherCanvas,
            CTX: c.weatherCTX,
            condition:{type:'snow', animation:'', src: snowSource},
            n: n
        };
        
        drawRect(params);
            
    },

    animateExtreme: function() {
        var extremeSvg = '<svg width="80px" height="75px" viewBox="0 0 80 75" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns"><title>warning</title><desc>Created with Sketch.</desc><defs></defs><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage"><g id="Artboard" sketch:type="MSArtboardGroup" fill="' + color_var + '"><g id="warning" sketch:type="MSLayerGroup"><path d="M35.59,2.789 L1.406,64.359 C-1.438,69.543 -0.23,74.5 7.457,74.5 L72.539,74.5 C80.244,74.5 81.435,69.543 78.59,64.359 L43.699,2.953 C42.992,1.57 41.965,0.042 39.785,0.062 C37.467,0.104 36.316,1.406 35.59,2.789 L35.59,2.789 Z M35.5,22.5 L43.5,22.5 L43.5,50.5 L35.5,50.5 L35.5,22.5 L35.5,22.5 Z M35.5,56.5 L43.5,56.5 L43.5,64.5 L35.5,64.5 L35.5,56.5 L35.5,56.5 Z" id="Shape" sketch:type="MSShapeGroup"></path></g></g></g></svg>';
         
        // Create a Data URI.
        var extremeSrc = 'data:image/svg+xml;base64,'+window.btoa(extremeSvg);
         
        // Load up our image.
        var extremeSource = new Image();
        extremeSource.src = extremeSrc;
        
        var params;
        var extremeArray = [],
            spacing = 50,
            n = parseInt(innerWidth / spacing),//innerWidth / spacing,
            sizes = [[89,100],[50,56.18],[70,78.65]];
            
        params = {n:n, sizes:sizes, obj: c.weatherCanvas, img: extremeSource};
        extremeArray = getArrayWeather(params);
        
        params = {
            arr: extremeArray,
            obj: c.weatherCanvas,
            CTX: c.weatherCTX,
            condition:{type:'extreme', animation:'', src: extremeSrc},
            n: n
        };
        
        drawRect(params);
            
    }

};

// GENERATE THE POSITIONS TO SET OBJECTS SUCH AS CLOUDS, RAIN DROPS AND SO ON
function getArrayWeather (params){
    
    var array = new Array();
    for (var i = 0; i < params.n; i++){
        for(var x=0;x< params.sizes.length;x++) {
            array.push({
                x: Math.round(Math.random()*params.obj.width),
                y: Math.round(Math.random()*params.obj.height),
                width: (params.animation ? Math.round(Math.random()*(innerWidth/10)) :2 ),
                height:(params.animation ? 1 : Math.round(Math.random()*(innerHeight/10))),
                imgWidth: params.sizes[x][0],
                imgHeight: params.sizes[x][1],
                img: params.img
            });
        } 
    }
    
    return array;
}

// BIND THE CANVAS AT THE USER INTERFACE
function drawRect(params){
     
    params.CTX.clearRect(0,0, params.obj.width, params.obj.height);
    
    for (var i = 0; i < params.n; i++){
        
        if(params.condition.type === "raindrops"){
           
            params.CTX.drawImage(params.condition.src,  params.arr[i].x, params.arr[i].y, params.arr[i].imgWidth, params.arr[i].imgHeight);
            if(params.condition.animation === "drizzle"){
                params.arr[i].y += params.arr[i].speed;
                params.arr[i].x = params.arr[i].x;
                if (params.arr[i].y > params.obj.height) {
                    params.arr[i].y = 0 - params.arr[i].height;
                    params.arr[i].x = Math.random() * params.obj.width;
                }
            } else {
                params.arr[i].y += params.arr[i].speed;
                params.arr[i].x += params.arr[i].speed/2;                   
                if (params.arr[i].y > params.obj.height) 
                    params.arr[i].y = 0 - params.arr[i].height;

                if (params.arr[i].x > params.obj.width)
                    params.arr[i].x = 0;
            }
        
        }
        else{
            // cloud || Volcanic Ash || snow
            params.CTX.drawImage(params.arr[i].img, params.arr[i].x, params.arr[i].y, params.arr[i].imgWidth, params.arr[i].imgHeight);
            params.arr[i].y = params.arr[i].y;
            
            if (params.arr[i].y > params.obj.height)
                params.arr[i].y = 0 - params.arr[i].height;

            if (params.arr[i].x > params.obj.width)
                params.arr[i].x = 0 - 100;
            
        }
    }
}

$(function() {
    $('#front-page-description').addClass('hide');
    GLoc.init();
    WeatherInfo.init();
    CanvasBackground.init();
});
