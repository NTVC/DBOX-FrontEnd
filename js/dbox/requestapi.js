
var xhr = null;
var timerOut;

var API_STATUS = {
  'OK':100,
  'NOT_FOUND':101,
  'AUTENTICATION_ERROR':300,
  'DATABASE_ERROR':200,
  'COMPRESS_ERROR':400,
  'ERROR_PARSING':500,
  'JSON_ERROR':600,
  'REQUEST_ERROR':999
}

var USER_MESSAGE = {
  'NOT_AUTHORIZED':"<img src='images/no-authorized.jpg'><h2>Whoops!</h2><h4>This app is not authorized! Please contact our support.</h4>",
  'SERVER_UPDATING':"<br/><br/><br/><br/><h2>Whoops!</h2><h4>Please wait while we are updating our servers.</h4>",
  'COMPRESS_ERROR_MESSAGE':"Compress Error",
  'NOT_FOUND':"<br/><br/><br/><br/><h2>Whoops!</h2><h4>Content not foud!</h4>" 
}

DBoxTvApp.prototype.start = function( args ){
   
  loader('show');

  if( xhr != null ) {
        xhr.abort();
        xhr = null;
  }

  $('.loader-menu').show();

   globalloaded = false;

   xhr = $.ajax({
        type: "POST",
        url: app_url,
        data: { data:args.toString() },

        success: function( data ){
          
            loader('hide');

            clearTimeout(timerOut);

            globalloaded = true;

            var dataContent = data;
            var status = dataContent.systemmessage.status;

    
            switch (status) {

                case API_STATUS.OK:
                     
                    $('.loader-menu').hide();
                    $('#conexion-message').hide();

                    var render = dataContent.systemmessage.render;

                    if(render == 'menu'){
                        DBoxTV.home( dataContent.informationReturn );
                    }else if(render == 'sub-menu'){
                        DBoxTV.createSubMenuWithId( dataContent.informationReturn );
                    }else if(render == 'movie'){
                        DBoxTV.createMoviesList( dataContent.informationReturn );
                    }else if(render == 'live'){
                        DBoxTV.createPlayList( dataContent.informationReturn );
                    }else if(render == 'apps'){
                        DBoxTV.apps( dataContent.informationReturn );
                    }else if(render == 'parentalcontrol'){

                       //SAVE OK
                       if( dataContent.informationReturn == null){
                          saveParentalControlOnLocalStorage( parentalControlObjects );
                       }else{
                       //GET ALL ITENS
                          DBoxTV.parentalControl( dataContent.informationReturn );
                       }
                       
                    }else{
                          DBoxTV.createPlayListOndemand( dataContent.informationReturn , render);
                    }

                    break;
                    
                case API_STATUS.NOT_FOUND:
                    $('#conexion-message').show();
                    $('#message').html( USER_MESSAGE.NOT_FOUND );
                    break;
                case API_STATUS.DATABASE_ERROR:
                    console.log('Error in database');
                    break;
                case API_STATUS.AUTENTICATION_ERROR:
                    $('#conexion-message').show();
                    $('#message').html( USER_MESSAGE.NOT_AUTHORIZED );
                    break;
                case API_STATUS.COMPRESS_ERROR:
                    $('#conexion-message').show();
                    $('#message').html( USER_MESSAGE.COMPRESS_ERROR_MESSAGE );
                    break;
                case API_STATUS.ERROR_PARSING:
                    console.log('Error parsing field');
                    break;
                case API_STATUS.JSON_ERROR:
                    console.log('Json validator Error');
                    break;
                case API_STATUS.REQUEST_ERROR:
                    console.log('Error in the requisition'); 
            }

            dataContent = null;
            
        },
        error: function( error ){
         
          if(error){

            if( (error.status === 0 || error.readyState === 0) && (error.statusText != "abort") ){

              loader('show');
              $('#conexion-message').show();
              $('#message').html( USER_MESSAGE.SERVER_UPDATING );

              timerOut = setTimeout(function(){ 

                  xhr.abort();
                  globalloaded = false;

                  DBoxTV.start(encrypter(DBoxTV.jsonFormat({nexturl: 'gethomescreenmenu'})));

               }, 5000);
              
            }

          }    
        }
    }); 
}

DBoxTvApp.prototype.jsonFormat = function( _query ){
      GoliveJSON.DBox.Query = _query;
      GoliveJSON.DBox.Device.validate = validate;
      jsonEncrypt = new Object(GoliveJSON);
      return jsonEncrypt;  
}

