
 var logos = [];
 var loader_container = null;
 var current_play_list = null;
 var timerToPlay = 1000; // TIMER TO START THE PREVIEW VIDEO default 3000


DBoxTvApp.prototype.createPlayList = function(listVideos){

        //CLEAR PREVIUS PLAYLIST
        $('#list').empty();
        $('#list').removeClass('movie-list');
        $('#list').removeClass('home-list');
        $('#list').removeClass('apps-list');
        $('#list').removeClass('parental-control');
        $('#list').addClass('video-list');
        
        var index = 0;

        lines = 0;
       
        //CREATE LIVE PLAYLIST 
     
            var title = listVideos.title;
            var background = listVideos.background;
            
            var listVideo = "<ul id='scroll"+ lines + "' title='"+title+"'>";

            var jsonAppsBlocked = getParentalStorage();

            $.each( listVideos.lives, function( key, value ) {
              
                var channel         =   value.name;
                var videoSrc        =   value.url;
                var previewSrc      =   value.url;
                var logos           =   value.thumb;
                var currentProgram  =   "Watch now";
                var nextProgram     =   "Next program";

                var id  = channel.replace(/\s+/g, '-').toLowerCase();
                var att = (index==0 && key==0)?'nv-el-current':'';
                var haslogo = (logos.length<=0)?'none':'';

                var blockedItens = (jsonAppsBlocked.lives)?jsonAppsBlocked.lives.objects:parentalControlObjects['lives'];
                var isBlocked = jQuery.inArray( value._id, blockedItens ) > -1;
                var classisBlocked = (isBlocked)?'disabled':'enabled';
               

                listVideo += "<li type='live' blocked='"+ isBlocked +"' id='"+ id +"' nv-el "+ att +" indice='"+lines+"' preview='"+ previewSrc +"'><div class='player'><div class='channel'><img src='"+ image_path + logos +"' style='display:"+haslogo+";' onError='this.onerror=null;this.src=\"../images/player/no-logo.png\";'><h3>"+ channel +"</h3></div><div class='video-obj' id='"+ id +"-live'></div><div class='live-current' style='"+ ((!isBlocked)?'border-bottom: 3px solid #5ddb00;':'border-bottom: 3px solid red;') +"'><img src='images/player/play.png'><h3>"+ ((!isBlocked)?currentProgram:'Blocked Channel') +"</h3></div><div class='live-next'><h4>"+ nextProgram +"</h4></div></div></li>";

            });
           
            listVideo += "</ul>";

            $('#list').append(listVideo);

            listVideo = null;

            navigation.refresh();
            navigation.changeScope('list');

            changeBackground(image_path + background);

            changeTitle(title);

            DBoxTV.showPreviewVideo();

            $('#menu-controller').show();

            $('#list').scrollTop(0);
            $('#list').scrollLeft(0);

            loader('hide');

            current_play_list = 'live';

            initListBind('#scroll0');

}

DBoxTvApp.prototype.createPlayListOndemand = function(listVideos, render){

            //CLEAR PREVIUS PLAYLIST
            $('#list').empty();
            $('#list').removeClass('movie-list');
            $('#list').removeClass('home-list');
            $('#list').removeClass('apps-list');
            $('#list').removeClass('parental-control');
            $('#list').addClass('video-list');

            if(listVideos.data.length == 0){
                return;
            }
              
            var listVideo = "";

            logos = [];

            lines = 0;

            var elementsArray = [];

            var jsonAppsBlocked = getParentalStorage();

            var session = session_menu;

            var element = "";


            if( render == 'community' ){
               session = 'communities';
            }else if( render == 'youtuber' || render == 'youtubers' || render == 'youtube' ){
               session = 'youtubers';
            }
               
            $.each( listVideos.data, function( key, value ) {

                var name  = value.title;
                var channel_id = value._id;

                $.each( value.list, function( key_list, value_list ) {
                      
                      logos.push(value_list.thumb);

                      var blockedItens = ( jsonAppsBlocked[session] )?jsonAppsBlocked[session].objects:parentalControlObjects[session];
                      var isBlocked = jQuery.inArray( channel_id, blockedItens ) > -1;
                      var classisBlocked = (isBlocked)?'disabled':'enabled';

                      // var finalLine = (lines < listVideos.data.length)?", ":"";
                      // element += "#scroll" + lines + finalLine;
                      element = "#scroll" + lines;
                      elementsArray.push(element);

                      //CREATE PLAYLIST
                      listVideo += "<ul id='scroll" + lines + "' title='" + value_list.title + "' bg='" + image_path + value.background + "'>";

                      lines += 1;

                      $.each( value_list.video, function( key_video, value_video ) {
                       
                              var name = value_video.title;
                              var description = value_video.description;
                              var url = value_video.url;

                              var id = name.replace(/\s+/g, '-').toLowerCase();
                              var att = (key == 0 && key_video==0 && key_list==0)?'nv-el-current':'';
                              var _description = (description.length>0)?'description_content':'';
                        
                              listVideo += "<li type='ondemand' blocked='"+ isBlocked +"' id='"+ id +"' nv-el "+ att +" indice='"+lines+"' preview='"+ url +"'><div class='player'><div class='channel'><h3>"+ name +"</h3></div><div class='video-obj' id='"+ id +"-live'></div><div class='live-current' style='"+ ((!isBlocked)?'border-bottom: 3px solid #5ddb00;':'border-bottom: 3px solid red;') +"'><img src='images/player/play.png'><h3>"+ ((!isBlocked)?(description || 'Watch now'):'Blocked Channel') +"</h3></div></div></li>";
                      
                      });

                      listVideo += "</ul>";

                });
               
            });

            $('#list').append(listVideo);

            navigation.refresh();
            navigation.changeScope('list');

            var bg = document.getElementById('scroll0').getAttribute('bg');
            
            changeBackground(bg);
           
            if( lines > 1 ){
                $('#list').append("<div id='next-program' style='display:block;'></div>");
                $('#list').append("<div id='in-count' style='display:block;'>1/" + lines + "</div>");
                $('#list').append("<div id='in-down' style='display:block;'><img src='images/in-down-large.png'/></div>");
                $('#list').append("<div id='in-up' style='display:block;'><img src='images/in-up-large.png'/></div>");
            }

            DBoxTV.showPreviewVideo();
            
            var titleChannel = "<img src='"+ image_path + logos[0] +"' style='width:7%;position:absolute;top:8rem;left:8rem;' onError='this.onerror=null;this.src=\"../images/player/no-logo.png\";'>"+" <span style='margin-left:4rem;'> "+document.getElementById('scroll0').getAttribute('title') +"</span>";
         
            changeTitle( titleChannel );

            $('#menu-controller').show();

            $('#list').scrollTop(0);
            $('#list').scrollLeft(0);

            loader('hide');

             current_play_list = 'on-demand';


            var el = String(elementsArray);

            initListBind(el);
     
}

// CREATE PREVIEW VIDEO OF CHANNEL
DBoxTvApp.prototype.showPreviewVideo = function(){

        if(videoIntervalToPlay != null){
            clearInterval(videoIntervalToPlay);
        }
        
        clearTimeout(loader_container);

        $currentVideoContainer = navigation.getCurrentScope().getCurrentElement().children[0].children[1];

        var preview     = navigation.getCurrentScope().getCurrentElement().getAttribute('preview');
        var _isblocked  = navigation.getCurrentScope().getCurrentElement().getAttribute('blocked');

        var loader = "<div id='container_player_loader'><div class='showbox'><div class='loader'><svg class='circular' viewBox='25 25 50 50'><circle class='path' cx='50' cy='50' r='20' fill='none' stroke-width='6' stroke-miterlimit='10'/></svg></div></div></div>";

        if( _isblocked == 'true' ){
          loader = "<i id='ic_blocked' style='opacity:.5;width:100%;height:100%;margin:0 auto;margin-top:18%;text-align:center;color:white;position:absolute;top:0;left:0;background:none;font-size: 4rem;' class='fa fa-lock'></i>";
        }
     
        $videoTag = $( loader + "<video autobuffer id='video_player' preload='none' width='320' height='180' data-preview='' data-href='"+ preview +"'></video>" );
        
        $( $currentVideoContainer ).html( $videoTag );

        $currentVideo = $currentVideoContainer.querySelector( "#video_player" );

        // //Clear loader
        loader_container = setTimeout(function(){
          $('#container_player_loader').empty();
        }, 4000);


        if( $currentVideo ){

              if( $prevVideo != null && $prevVideoContainer != $currentVideoContainer ){
                  $prevVideo.pause();
                  $prevVideo.src = '';
                  $($prevVideoContainer).empty();
              }

              $currentVideo.src = preview;
              
              if( _isblocked == 'true' ){
                  $currentVideo.pause();
              }else{
                  $currentVideo.load();
              }

              dbox.onCanPlay = false;

              //SET A TIMER TO WATCH PLEVIEW
              videoIntervalToPlay = setInterval(function(){
        
                  if( dbox.onCanPlay ){
                      if( _isblocked == 'false' ){
                        
                        $currentVideo.play();
                      }
                      clearInterval( videoIntervalToPlay );
                      $('#loader').hide();
                  }

              }, timerToPlay);

              $prevVideo = $currentVideo;
              $prevVideoContainer = $currentVideoContainer;
                                  
              dbox.setVideo($currentVideo);
       }

   
  //FORCE TO CLEAN
  preview = null;
  $currentVideoContainer = null;
  $videoTag = null;

}

// CALL MAIN VIDEO PLAYER 
DBoxTvApp.prototype.fullScreen = function() {

      clearInterval(videoIntervalToPlay);
      clearInterval(movieDescription);


      var main_video = document.getElementById('video_player');
      dbox.setVideo(main_video);
      main_video.setAttribute("controls","controls"); 

      var _isblocked  = navigation.getCurrentScope().getCurrentElement().getAttribute('blocked');

      if( _isblocked == 'false' || _isblocked == null){
          main_video.play();
          isplaying = true;

          isfullscreen = true;
      }
      if( GLOBAL_UNBLOCKED_ITEM ){
          main_video.load();
          main_video.play();
          isplaying = true;

          isfullscreen = true;
      }

      $('ul').addClass('fullscreen');

      var w = $(window).width();
      var h = $(window).height();
      $('ul').width(w);
      $('ul').height(h);




      //  if (  typeof(main_video.webkitEnterFullscreen) != "undefined" ) {
      //     // This is for Android Stock.
      //     main_video.webkitEnterFullscreen();
      // } else if ( typeof(main_video.webkitRequestFullscreen)  != "undefined" ) {
      //     // This is for Chrome.
      //     main_video.webkitRequestFullscreen();
      // } 

        
}

// CALL MAIN VIDEO PLAYER 
DBoxTvApp.prototype.toggleFullScreen = function(preview,src) {

      clearInterval(videoIntervalToPlay);
      clearInterval(movieDescription);

      if(preview){
        //prevvideo preview stop
        preview.pause();
        preview.src = '';
      }

      if(src != null)
        this.initMainPlayer(src);
}

// STOP PREV VIDEO  
DBoxTvApp.prototype.stopPreviewVideo = function(preview) {

      clearInterval(videoIntervalToPlay);
      clearInterval(movieDescription);

      if(preview){
        //prevvideo preview stop
        preview.pause();
        preview.src = '';
      }

}

// SHOW MAIN VIDEO OF CHANNEL
DBoxTvApp.prototype.initMainPlayer = function(srcvideo){

        $('#main_player').show();

        clearInterval(mainVideoClear);

        var main_video = document.getElementById('main_video');
        dbox.setVideo(main_video);
        main_video.src = srcvideo;
        main_video.load();
        main_video.play();

        //if(current_menu == 'movies'){
        main_video.setAttribute("controls","controls"); 
        // }else{
        //    main_video.setAttribute("no-controls","no-controls") 
        // }

        // mainVideoClear = setInterval(function(){

        //        if(!isplaying){
        //           try {
        //             main_video.src = noCache(srcvideo);
        //             main_video.load();
        //             main_video.play();
        //           }catch (ex) {
        //             console.error("outer", ex.message);
        //             destroyMainPlayer();
        //             navigation.refresh();
        //             navigation.changeScope('list');
        //           }
        //         }
        //         alert('clearMainVideo');

        // }, clearMainVideo);

        navigation.refresh();
        navigation.changeScope('main_player');

}

// REMOVE MAIN VIDEO OF CHANNEL AND BACK TO PREVIEW CHANNELS
DBoxTvApp.prototype.destroyMainPlayer = function(){ 
      clearInterval(mainVideoClear);
      $('#main_player').hide();
      var main_video = document.getElementById('main_video');
      main_video.pause();
      main_video.src = "";
      main_video = null;
}

//ISPLAYING MAIN VIDEO
DBoxTvApp.prototype.checkIsPlaying = function(){

        var video = document.getElementById('video_player');
        var movie = document.getElementById('main_video');
       
        isplaying = (isplaying)?false:true;

        if(isplaying){ 
          if(video)
            video.play();
          if(movie)
            movie.play();
         }else{ 
          if(video)
            video.pause(); 
          if(movie)
            movie.pause();
        }

}

DBoxTvApp.prototype.videoIndicatorNav = function(){

        var _ind = navigation.getCurrentScope().getCurrentElement().getAttribute('indice');

        var scrollElement = document.getElementById('scroll'+(_ind-1));

        var title = '';

        if(scrollElement){
            title = scrollElement.getAttribute('title');
        }
         
        var titleChannel = "<img src='"+ image_path + logos[(_ind-1)] +"' style='width:7%;position:absolute;top:8rem;left:8rem;' onError='this.onerror=null;this.src=\"../images/player/no-logo.png\";'>"+" <span style='margin-left:4rem;'> "+ title +"</span>";
           

        if(_ind >= 1){
          changeBackground(scrollElement.getAttribute('bg'));
          changeTitle(titleChannel);
        }

        $('#in-count').html(_ind+'/'+lines);

        if(_ind == lines){
            $('#in-down').css('opacity', '0.1');
        }else{
            $('#in-down').css('opacity', '1');
        }
        if(_ind == 1){
            $('#in-up').css('opacity', '0.1');
        }else{
            $('#in-up').css('opacity', '1');
        }

        var season = navigation.getCurrentScope().getCurrentElement().getAttribute('season');

        if(season)
          changeTitle(titleChannel+' <div id="seasontitle">Season '+season+' - </div>');

        // $('#scroll'+ (_ind-1) + ' li:eq(0)').attr('nv-el-current',true);
        // navigation.changeScope('list');
        // $('#list').scrollLeft(0);

        //scrollElement = null;
}


function initListBind( _element ){

      //******* BIND LIST PREVIEW CHANNELS ****** 

      $('#scroll0').bind('nv-up', function() {
          if( !isfullscreen ){
             $('#parental-control').attr('nv-el-current',true);
              navigation.changeScope('top');
              $currentVideo.pause();
          }
      });

      $(_element).bind('nv-up nv-down', function() {
        
            if(!isfullscreen){
                DBoxTV.showPreviewVideo();
                DBoxTV.videoIndicatorNav();

            }
          
      });

      $(_element).bind('nv-left nv-right', function() {
        
            if(!isfullscreen){
                DBoxTV.showPreviewVideo();
             }
          
      });

      //ENTER FULLSCREEN MODE
      $(_element).bind('nv-enter', function() {

          var _isblocked  = navigation.getCurrentScope().getCurrentElement().getAttribute('blocked');

          if( !isfullscreen ){

              if( _isblocked == 'true' ){

                   GLOBAL_BLOCKED_ITEM    = true;
                   GLOBAL_UNBLOCKED_ITEM  = false;
                   GLOBAL_BLOCKED_ITEM_ID = DBoxTV.currentNavigation().getAttribute('id');

                   showBlockedMessage();

              }else{
                   DBoxTV.fullScreen();
              }
                   
          }else{
                DBoxTV.checkIsPlaying();
          }

      });

     $(_element).bind('nv-back', function() {

         
          //CLEAR MOVIE DESCRIPTION 
          clearInterval(movieDescription);
          $('.description').hide();

          if( isfullscreen ){

              $('ul').removeClass('fullscreen');

              var main_video = document.getElementById('video_player');
              main_video.removeAttribute("controls");

              $('ul').removeAttr('style');
             

              //main_video.webkitExitFullScreen();

              if( GLOBAL_UNBLOCKED_ITEM ){
                 DBoxTV.stopPreviewVideo( $currentVideo );
                 GLOBAL_UNBLOCKED_ITEM = false;
               }

              isfullscreen = false;
              $('#menu-controller').show();
              // return;

          }else{
              $('#menu-container').show();
              $('#sub-menu').show();
              navigation.changeScope('sub-menu');
          }

          if(currentSession == 'home'){
              location.reload(true);
              return;
          }
         

    });

    $(_element).bind('nv-right', function() {

        if(current_play_list == 'live'){return;}

        if(isfullscreen){
          dbox.forward();
        }
    });

    $(_element).bind('nv-left', function() {

       if(current_play_list == 'live'){return;}

       if(isfullscreen){
          dbox.reward();
        }
    });

}


