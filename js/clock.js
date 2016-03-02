
  var canplay = false;

  function startClock(){

      var d = new Date();
      var hours = d.getHours();
      var mins = d.getMinutes();

      if(hours > 12){
          var hour = (hours == 0)?hours=12:(hours - 12);
          var ampm = "PM";
      }
      else{
          var hour = (hours == 0)?hours=12:hours;
          var ampm = "AM";
      }
      if(mins < 10){
          mins = "0" + mins;
      }

      var time = hour + ":" + mins + " <span id='ampm'>" + ampm + "</div>";
      $(".clock").html(time);

      window.setTimeout(startClock, 30000);

  }

  

    



