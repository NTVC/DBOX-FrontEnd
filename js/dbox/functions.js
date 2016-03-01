
  
  var temporaryParentalControl = null;

  function checkWifi(){

      loader('show');
      var settingsmbox = intentApp.settings;
      window.parent.postMessage(settingsmbox,"*");

  }

  function startApp(){

      var startapp = "startApp";
      window.parent.postMessage(startapp,"*");

  }

  function explorerV(){

      loader('show');
      var explorerView = intentApp.folder;
      window.parent.postMessage(explorerView,"*");

  }

  function startSplashVideo(){

      var splash = "startSplashVideo";
      window.parent.postMessage(splash,"*");

  }

  function updateAPK(){

      loader('show');
      var update = intentApp.updateAPK;
      window.parent.postMessage( update,"*" );

  }

  function support(){

      $('#conexion-message').show();

      $('#message').html( message );

      navigation.refresh();
      navigation.changeScope('conexion-message');

  }

  function openTVMenu(){

      $('#menu-container').show();
      navigation.refresh();
      navigation.changeScope('menu');

  }

  function openMenu(value){

      $('#menu-controller').hide();

      if(value == 'home'){
          loader('show');
          currentSession = 'home';
          //DBoxTV.start(encrypter(DBoxTV.jsonFormat({nexturl: 'gethomescreenmenu'})));//reload home api
          location.reload(true);//reload home

      }else{

          currentMenu[0] = value;//DBoxTV.currentNavigation().id;

          navigation.refresh();
          navigation.changeScope('sub-menu');

      }
  }



  //GET ALL PARENTAL ITENS
  function parentalControl(){

    pass();
    
    if(!existParentalControl() ){ 
        $('#title').html( PARENTAL_CONTROL_MESSAGES.FIRST_TIME );
    }else{
         $('#title').html( PARENTAL_CONTROL_MESSAGES.DEFAULT );
    }

  }

  function pc_itens(){

      var addParentalControllToAppId = DBoxTV.currentNavigation().getAttribute('id');

      var block = DBoxTV.currentNavigation().getAttribute('block');

      var type = DBoxTV.currentNavigation().getAttribute('type');


      if( block == 'null' || block == 'on'){
          disable(addParentalControllToAppId);

          parentalControlObjects[type].push(addParentalControllToAppId);
          temporaryParentalControl[type].objects.push(addParentalControllToAppId);
      }

      if( block == 'off' ){
          enable(addParentalControllToAppId);
          parentalControlObjects[type].remove(addParentalControllToAppId,true);
          temporaryParentalControl[type].objects.remove(addParentalControllToAppId,true);
      }

      addParentalControllToAppId = null;
      block = null;
      type = null;

  }

  function enable(_element){

      var element = document.getElementById(_element);
      var ic = DBoxTV.currentNavigation().getAttribute('id')+"_ic";
      var ic_element = document.getElementById(ic);

      $(element).removeClass('disabled');
      $(element).addClass('enabled');
      $(element).attr( "block", "on" );

      $(ic_element).removeClass('fa-lock');
      $(ic_element).addClass('fa-unlock');

  }

  function disable(_element){

      var element = document.getElementById(_element);
      var ic = DBoxTV.currentNavigation().getAttribute('id') + "_ic";
      var ic_element = document.getElementById(ic);

      $(element).removeClass('enabled');
      $(element).addClass('disabled');
      $(element).attr( "block", "off" );

      $(ic_element).removeClass('fa-unlock');
      $(ic_element).addClass('fa-lock');

  }

  function saveParentalControl(_elements){

      var obj = { password:'' , status:true };

      $.each( _elements, function( key, value ) {
          obj[key] = {
            isBlocked: false,
            objects: value
          }
      });

      var query = { nexturl:'setparentalcontrol', ParentalControl:obj };
      DBoxTV.start(encrypter(DBoxTV.jsonFormat(query)));

  }

  function saveParentalControlOnLocalStorage( _parentalControlObjects ){

      if( typeof(Storage) !== "undefined" ) {
      
        localStorage.removeItem( blockedPCItens );

        getParentalStorage();

        var blockedParentalControlItens = localStorage.getItem( blockedPCItens );

        if(blockedParentalControlItens){
          location.reload(true);
        }

      } else {
        alert("Sorry! No Web Storage support..");
      }   

  }

  function showBlockedMessage( _id ){
    
      quickPass();
      // var element = document.getElementById( _id );
      
      // var icon = "<i id='ic_blocked' style='float:left;display:none;width:100%;height:100%;margin:0 auto;text-align:center;color:white;position:absolute;top:10%;left:0;background:none;font-size: 5rem;' class='fa fa-lock'></i>";
      
      // $( element ).append( icon );

      // var icon_id = '#ic_blocked_' + _id;

      // $('#ic_blocked').fadeIn( 1, function() {
      //    $('#ic_blocked').fadeOut( "2", function() {
      //       $('#ic_blocked').remove();
      //    });
      // })
  }

  function getParentalStorage(){

      var JsonLocalStore = JSON.parse( localStorage.getItem( blockedPCItens ) );

      if( JsonLocalStore == null ){

           var query = { nexturl:'getparentalcontrol' };
           var data = encrypter(DBoxTV.jsonFormat(query));

           JsonLocalStore =  $.ajax({
              type:   "POST",
              url:    app_url,
              data:   { data: data.toString() },
              cache:  false,
              async:  false
           }).responseText;

           JsonLocalStore = JSON.parse( JsonLocalStore );

           JsonLocalStore = JsonLocalStore.informationReturn;

           localStorage.setItem( blockedPCItens , JSON.stringify( JsonLocalStore ));

           if( JsonLocalStore == null ){
             return [];
           }

      }
        
      return JsonLocalStore;
  
  }


  function parental_control_password( _value ){

      var element = '';
      var default_value = '_';

      $('#title').css('background','');

      var v1 = $('#val1').html();
      var v2 = $('#val2').html();
      var v3 = $('#val3').html();
      var v4 = $('#val4').html();

      switch (default_value) {
         case v1:
           parental_control_pwd += _value;
           v1 = _value;
           $('#val1').html(_value);
           element = $('#val1');
         break;
          case v2:
          parental_control_pwd += _value;
           v2 = _value;
           $('#val2').html(_value);
            element = $('#val2');
         break;
          case v3:
          parental_control_pwd += _value;
           v3 = _value;
           $('#val3').html(_value);
            element = $('#val3');
         break;
          case v4:
          parental_control_pwd += _value;
           v4 = _value;
           $('#val4').html(_value);
            element = $('#val4');
            $('#title').html( PARENTAL_CONTROL_MESSAGES.OK );
         break;
      }

      var loader_container = setTimeout( function(){
          element.html( '*' );
          clearTimeout( loader_container );
      }, 300);

  }

  function back_password(){

      var element = '';

      var v1 = $('#val1').html();
      var v2 = $('#val2').html();
      var v3 = $('#val3').html();
      var v4 = $('#val4').html();

      var default_value = '*';

      if(v4 == default_value){
        v4        = '_';
        element   = $('#val4');
      }else if(v3 == default_value){
        v3 = '_';
        element   = $('#val3');
      }else if(v2 == default_value){
        v2 = '_';
        element   = $('#val2');
      }else if(v1 == default_value){
        v1        = '_';
        element   = $('#val1');
      }

      $('#title').html( PARENTAL_CONTROL_MESSAGES.DEFAULT );

      element.html( '_' );

      if(parental_control_pwd.length > 0){
          parental_control_pwd =  parental_control_pwd.substring(0, parental_control_pwd.length - 1);
      }

  }

  function setPassWord(){

         loader('show');

         var query = { nexturl:'setpasswordparentalcontrol', password: parental_control_pwd };
     
         var data = encrypter(DBoxTV.jsonFormat(query));

         var response =  $.ajax({
            type: "POST",
            url: app_url,
            data: { data:data.toString() },
            cache: false,
            async: false
         }).responseText;

         loader('hide');

        return ( JSON.parse(response).systemmessage.status == 100 );
      
  }

  function authenticateParentalControl(){

        loader('show');
  
        var query = { nexturl:'authenticateparentalcontrol', password: parental_control_pwd };
     
        var data = encrypter(DBoxTV.jsonFormat(query));

        var response = $.ajax({
            type: "POST",
            url: app_url,
            data: { data:data.toString() },
            cache: false,
            async: false
         }).responseText;

        loader('hide');

        return JSON.parse(response).authenticated;
      
  }

  function existParentalControl(){

        loader('show');
    
        var query = { nexturl:'existparentalcontrol' };
     
        var data = encrypter(DBoxTV.jsonFormat(query));

        var response = $.ajax({
            type: "POST",
            url: app_url,
            data: { data:data.toString() },
            cache: false,
            async: false
         }).responseText;

        loader('hide');

        return JSON.parse(response).exist;
      
  }

  function ReEnterPassword(){

        $('#title').css('background','orange');
        resetTextField( PARENTAL_CONTROL_MESSAGES.CONFIRM_PASSWORD );
        parental_control_pwd = '';

  }

  function resetPassword(){
    
        loader('show');

        var query = { nexturl:'resetparentalcontrol', password: parental_control_pwd };
     
        var data = encrypter( DBoxTV.jsonFormat( query ) );

        var response =  $.ajax({
            type: "POST",
            url: app_url,
            data: { data:data.toString() },
            cache: false,
            async: false
        }).responseText;

        loader('hide');

        user_email = JSON.parse(response).mail;

        return ( JSON.parse(response).systemmessage.status == 100 && user_email != null );
  }

  function resetTextField( _message ){

      $('#title').html(_message);
      $('#val1').html('_');
      $('#val2').html('_');
      $('#val3').html('_');
      $('#val4').html('_');

  }


  function openBlockedItemOneTime(){
     //2 movies
     //4 community
     //1 live
     //3 tv-series
     //5 youtubers

    var type = document.getElementById(GLOBAL_BLOCKED_ITEM_ID).getAttribute("type");
    
    switch( type ) {

        case "apps":

             var intent = document.getElementById(GLOBAL_BLOCKED_ITEM_ID).getAttribute('data-intent');

             loader('show');
             window.parent.postMessage( intent.split(","), "*" );
             currentSession = 'home';

        break;

        case "highlights":

              var nextURL    = document.getElementById(GLOBAL_BLOCKED_ITEM_ID).getAttribute('nexturl');
              var datahref   = document.getElementById(GLOBAL_BLOCKED_ITEM_ID).getAttribute('data-href');
              var source     = document.getElementById(GLOBAL_BLOCKED_ITEM_ID).getAttribute('source');

              if(source == '2' || source == '1'){

                    isfullscreen = true;

                    $currentVideoContainer = document.getElementById('video_player');
                    DBoxTV.toggleFullScreen( $currentVideoContainer, datahref );

                    var video_sponsor = document.getElementById('video_sponsor');
                    video_sponsor.pause();
                    video_sponsor.src = '';  

              }else{

                    var query = { nexturl:nextURL, search:datahref };
                    DBoxTV.start( encrypter( DBoxTV.jsonFormat( query ) ) );

              }
            
        break;

        case "live":

             var preview = document.getElementById(GLOBAL_BLOCKED_ITEM_ID).getAttribute('preview');

              if( preview )
                DBoxTV.fullScreen();

        break;

        case "ondemand":

             var preview = document.getElementById(GLOBAL_BLOCKED_ITEM_ID).getAttribute('preview');

              if( preview )
                DBoxTV.fullScreen();

        break;

        case "movies":

              var preview = document.getElementById( GLOBAL_BLOCKED_ITEM_ID ).getAttribute('preview');
              var videoURL = document.getElementById( GLOBAL_BLOCKED_ITEM_ID ).getAttribute('data-href');

              if( videoURL ){
                  DBoxTV.toggleFullScreen( null, videoURL );
                  isfullscreen = true;
                  isMovies = true;
                 $('.description').hide();
              }

        break;

    }

  }




