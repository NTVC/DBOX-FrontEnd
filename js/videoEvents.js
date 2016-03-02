    
  function clearControlsPlayer(){
    var controls = setTimeout(
        function(){
          $('#player-controls').attr("src","");
          clearTimeout(controls);
        }
        , 1000);
  }


  var VideoPlayer = function(){

    if(VideoPlayer.instance){
        return VideoPlayer.instance;
    }

    VideoPlayer.instance = this;

    return VideoPlayer.instance;
  
  };

  VideoPlayer.prototype.forward = function() {
      dbox.video.currentTime += 1;
      //$('#player-controls').attr("src","images/player/ic_forward.png");
      clearControlsPlayer();
  }
  
  VideoPlayer.prototype.reward = function() {
      dbox.video.currentTime -= 1;
      //$('#player-controls').attr("src","images/player/ic_backward.png");
      clearControlsPlayer();
  }

  VideoPlayer.prototype.video = function () {
      return this.video;
  }

  // VideoPlayer.prototype.ended = function(){
  //     alert('finnished ended');
  // }

  // VideoPlayer.prototype.onended = function(e){
  //     alert('finnished onended');
  // }

  VideoPlayer.prototype.onfinished = function(){
      alert('finnished onfinished');
  }

  VideoPlayer.prototype.onCanPlay = false;

  VideoPlayer.prototype.getVideo = function () {
    return this.video;
  }

  VideoPlayer.prototype.setVideo = function (video) {
     this.video = video;

     video.addEventListener('ended', function failed(e) {

        if( isfullscreen ){

              $('ul').removeClass('fullscreen');

              var main_video = document.getElementById('video_player');
              main_video.removeAttribute("controls");

              if( GLOBAL_UNBLOCKED_ITEM ){
                 DBoxTV.stopPreviewVideo( $currentVideo );
                 GLOBAL_UNBLOCKED_ITEM = false;
               }

              isfullscreen = false;
             

          }else{

          }

     }, true);

     video.addEventListener('error', function failed(e) {
       switch (e.target.error.code) {
         case e.target.error.MEDIA_ERR_ABORTED:
           alert('You aborted the video playback.');
           break;
         case e.target.error.MEDIA_ERR_NETWORK:
           alert('A network error caused the audio download to fail.');
           break;
         case e.target.error.MEDIA_ERR_DECODE:
           alert('The audio playback was aborted due to a corruption problem or because the video used features your browser did not support.');
           break;
         case e.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
           //alert('The video audio not be loaded, either because the server or network failed or because the format is not supported.');
           break;
         default:
           alert('An unknown error occurred.');
           break;
       }
     }, true);

     this.video.onplaying = function() {
           //$('#container_player_loader').empty();
     };

     this.video.oncanplay = function() {
           dbox.onCanPlay = true;
     };
    
     this.video.onloadstart = function() {
       //alert(this.buffered.time);
           dbox.onCanPlay = false;
     };

     // this.video.onerror = function(e) {
     //       alert("Error! Something went wrong: "+e.target.error.code+ " : "+this.id);
     // };

     // this.video.onabort = function() {
     //       alert("onabort!");
     // };

     // this.video.oncanplaythrough = function() {
     //   alert(this.buffered.time);
     //       //dbox.onCanPlay = true;
     // };
     // this.video.onemptied = function() {
     //       console.log("onemptied!");
     // };

     // this.video.onwaiting = function() {
     //  alert(this.buffered.time);
     //       alert("onwaiting!");
     // };
  };

  VideoPlayer.prototype.initialize = function() {
        return this;
  };

  // VideoPlayer.prototype.playing = function() {
    
  //       //alert('loadstart');
  // }

  //  display an error message 
  VideoPlayer.prototype.errMessage = function(msg) {
  // displays an error message for 5 seconds then clears it
  alert(msg+" - video player");
  }
  var dbox = new VideoPlayer();
   window.videoEvents = function () {
     return dbox.initialize();
  }();


