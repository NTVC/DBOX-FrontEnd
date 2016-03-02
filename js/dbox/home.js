

var message                   = '';
var GLOBAL_CUSTOMER_CITY      = 'Toronto';
var GLOBAL_CUSTOMER_LANGUAGE  = 'en';

DBoxTvApp.prototype.home = function(_home){

     //CLEAR PREVIUS PLAYLIST
     $('#list').empty();
     $('#list').removeClass('movie-list');
     $('#list').removeClass('video-list');
     $('#list').removeClass('app-list');
     $('#list').addClass('home-list');

     $('#sub-menu').hide();
     $('#menu-container').hide();
     $('#menu-controller').hide();

     var itens_menu      =    _home.menu;
     var apps            =    _home.apps;
     var banners         =    _home.banners;
     var sponsors        =    ( _home.sponsors || [] );
     var highlights      =    _home.highlights;
     var widgets         =    _home.widgets;
     var customer        =    _home.customer;
     var background      =    _home.background;

     var support         =    _home.support;

     var banner_top      =    [];
     var timer_top;

     var banner_down     =    [];

     var timer_down;

     // var city = (customer.address.city || 'Toronto');
     // alert(JSON.stringify(customer));

     var homeContainer  = "";

     var jsonItemBlocked = getParentalStorage();

     if( DBoxTV.createMenu( itens_menu ) ){

          //APPS
          homeContainer =  "<ul id='apps'>";

          homeContainer += '<li index="0" type="apps" id="livetv" nv-el nv-el-current data-intent="" onclick="javascript:openTVMenu();"><img src="images/apps/menu.png"></li>';

          $.each( apps, function( key, value ) {

               var id       =  value.name;
               var thumb    =  ( value.thumb || '../images/apps/default.png' );
               var intent   =  value.intent;
               var index    =  key + 1;

               var blockedApps = [];

               blockedApps = ( jsonItemBlocked.apps )?jsonItemBlocked.apps.objects:parentalControlObjects[ 'apps' ];
              
               var isBlocked = jQuery.inArray( value._id, blockedApps ) > -1;

               var classisBloacked = (isBlocked)?'disabled':'enabled';

               homeContainer += "<li blocked='"+ isBlocked +"' index='"+ index +"' class='"+ classisBloacked +"' type='apps' id='"+ id +"' nv-el data-intent='"+ intent +"'><div><img src='"+ image_path + thumb +"' onError='this.onerror=null;this.src=\"../images/apps/default.png\";'/></li>";

          });

          homeContainer += "<li type='apps' id='more-apps' nv-el><img src='images/apps/more.png'/></li></ul>";
      
          //BANNERS
          homeContainer += "<ul id='banners'>";

          var top_banner_length  = 0;
          var down_banner_length = 0;

          $.each( banners, function( key, value ) {

               var bannerId  = (key == 0)?'top':'down';

               (key == 0)?top_banner_length = value.list.length:down_banner_length=value.list.length;

               (key == 0)?timer_top = value.timer:timer_down = value.timer;

               $.each( value.list, function( _key, _value ) {

                    var display  = (_key == 0)?'':'none';
                    
                    homeContainer += "<li style='display:"+ display +"' model='"+ bannerId +"' id='banner_"+ bannerId + "_" + _key +"' nv-el type='banner' data-intent='' invoke='"+ _value.invoke +"' parameter='"+ _value.parameter +"'><img id='img_banner_middle' src='"+ image_path + _value.banner +"' onError='this.src=\"../images/apps/default.png\";'/></li>";
               
               });
          
          });
 
          //start top banner
          startTopBanner(top_banner_length, timer_top);
          //start down banner
          startDownBanner(down_banner_length, timer_down);

          homeContainer += "</ul>";

          var sponsors_poster =  (sponsors != '')?sponsors[0].poster:'../images/backgrounds/default.jpg';
          var sponsors_url    =  (sponsors != '')?sponsors[0].url:'';

          //SPONSOR VIDEO
          homeContainer += "<ul id='show'>";
          homeContainer += "<li id=''><div id='video_container'><video id='video_sponsor' autoplay width='360' height='240' loop preload='auto' poster='" + sponsors_poster +"' src='"+ sponsors_url +"' ></video></div></li>";
          //homeContainer += "<li id=''><div id='video_container'><iframe width='100%' height='100%' src='http://192.168.1.11/video_teste.html'></iframe></div></li>";

          //WIDGET
          GLOBAL_CUSTOMER_CITY          = ( widgets.address.city || 'toronto');
          GLOBAL_CUSTOMER_LANGUAGE      = ( widgets.language || 'en');
          homeContainer                 += "<li id='mini-banner' data='menu' style='background:black;'>"+ widgets.widgets[0].html +"</li>";
          homeContainer                 += "</ul>";

          //start widgets
          startWidgets(widgets.widgets);

          //HIGHLIGHTS
          $.each( highlights, function( key, value ) {

               var title = ( value.title || value.name ); 
               var id = title.replace(/\s+/g, '-').toLowerCase();
               var first = (key == 0)?'first':'';
               var source = value.source;
               var nexturl = ( value.nexturl || "video" );

               var source = value.source;
              
               homeContainer += "<ul id='highlights"+key+"' class='highlights "+ first +"'>";
               homeContainer += "<h2 class=''>"+ title +"</h2>";

               var objParentalControl = '';

               if( source == '4' )
                   objParentalControl   = 'communities'; 
               else if( source == '2' )
                   objParentalControl   = 'movies'; 

              
               $.each( value.list, function( key_list, value_list ) {

                    var cover = ( value_list.cover || value_list.thumb );
                    var id = value_list._id;
                    var url = (value_list.url || value_list._id);

                    var blockedItens = ( jsonItemBlocked[ objParentalControl ] )?jsonItemBlocked[ objParentalControl ].objects:parentalControlObjects[ objParentalControl ];
                    var isBlocked = jQuery.inArray( value_list._id, blockedItens ) > -1;
                    var classisBlocked = (isBlocked)?'disabled':'enabled';  

                    homeContainer += "<li blocked='"+ isBlocked +"' class='"+ classisBlocked +"' source='"+source+"' id='"+ id +"' nv-el type='highlights' nexturl='"+ nexturl +"' data-href='"+ url +"'><img src='"+ image_path + cover +"' onError='this.onerror=null;this.src=\"../images/apps/default.png\";'/></li>";
                    homeContainer += ( key_list ==  2)?"<li id='' source='"+source+"' type='highlights' nexturl='"+ nexturl +"' class='load-more-button' nv-el tag='' data-href='more'><img src='images/icons/ic_menu.png' onError='this.onerror=null;this.src=\"../images/apps/default.png\";'></li>":"";
               
               });
 
               homeContainer += "</ul>";
          
          });
          
          $('#list').append( homeContainer );

     }

     message = '<h2>' + support.title + '</h2><h4>' + support.message + '</h4><h1>' + support.phone + ' - ' + support.email + '</h1><br/><h3>PID:' + uid + ' - EID:' + ethMac + ' - WID:' + wMac + '</h3>'; 

     changeTitle('') ;

     changeBackground( image_path + background );

     itens_menu      =  null;
     apps            =  null;
     banners         =  null;
     sponsors        =  null;
     highlights      =  null;
     widgets         =  null;
     customer        =  null;

     banner_top      =  null;
     timer_top       =  null;

     banner_down     =  null;
     timer_down      =  null;

     sponsors_poster =  null;
     sponsors_url    =  null;

     navigation.refresh();
     navigation.changeScope('list'); 

     initHomeBind();

     startClock();

}


function supportMessage(args){
     return '<h2>'+support.title+'</h2>';
}


function initHomeBind(){

     $('#list').bind('nv-golive', function() {
          location.reload(true);
     });

     $('#apps').bind('nv-up', function() {
          var index = parseInt(DBoxTV.getPrevElementWith( 'index' ));
          if( index < 2 ){
               $('#parental-control').attr('nv-el-current',true);
               navigation.changeScope('top');
          }
     });

     $('#apps').bind('nv-enter', function() {

             if(DBoxTV.currentNavigation().getAttribute('id') == 'livetv'){
               //OPEN MENU LIVE
                openTVMenu();

             }else if(DBoxTV.currentNavigation().getAttribute('id') == 'more-apps'){

                // currentSession = 'playlist';

                $('#menu-controller').show();

                var query = { nexturl:'getallapps' };
                DBoxTV.start(encrypter(DBoxTV.jsonFormat(query)));

             }else{
               
                //OPEN APPS
                var _isblocked = DBoxTV.currentNavigation().getAttribute('blocked');
                    
                if( _isblocked != 'true' ){
                     loader('show');
                     var intent = DBoxTV.currentNavigation().getAttribute('data-intent');

                     window.parent.postMessage( intent.split(","), "*" );
                     currentSession = 'home';
                 }else{
                     GLOBAL_BLOCKED_ITEM    = true;
                     GLOBAL_UNBLOCKED_ITEM  = false;
                     GLOBAL_BLOCKED_ITEM_ID = DBoxTV.currentNavigation().getAttribute('id');
                     showBlockedMessage();
                 }

                 _isblocked = null;
             }
     });

     $('#banners').bind('nv-enter', function() {

               loader('show');

               var invoke = DBoxTV.currentNavigation().getAttribute('invoke');
               var parameter = DBoxTV.currentNavigation().getAttribute('parameter');

               if( invoke == 'url' ){

                    window.parent.postMessage(["url", parameter], "*");

               }else if( invoke == 'video' ){
                
                    var video_sponsor = document.getElementById('video_sponsor');
                    video_sponsor.pause();
                    video_sponsor.src = '';

                    DBoxTV.toggleFullScreen( null, parameter );

                    loader('hide');

               }
     });

     $('#banners').bind('nv-up', function() {
            if( DBoxTV.getPrevElementWith( 'model' ) == 'top' ){
                $('#parental-control').attr('nv-el-current',true);
                navigation.changeScope('top');
            }
     });

     $('#highlights0, #highlights1').bind('nv-enter', function() {
    
               var nextURL    = DBoxTV.currentNavigation().getAttribute('nexturl');
               var datahref   = DBoxTV.currentNavigation().getAttribute('data-href');
               var source     = DBoxTV.currentNavigation().getAttribute('source');
               var _isblocked = DBoxTV.currentNavigation().getAttribute('blocked');
          

               currentSession = 'home';
               
               //2 movies
               //4 community
               //1 live
               //3 tv-series
               //5 youtubers

               if(source == '2' || source == '1'){

                     if(datahref == 'more'){

                          var tag = '';

                          var query = { name:tag, nexturl:nextURL, pg_index:0, pg_limit:0 };

                          DBoxTV.start( encrypter( DBoxTV.jsonFormat( query ) ) );

                      }else{
                           if(_isblocked != 'true'){

                               isfullscreen = true;

                               $currentVideoContainer = document.getElementById('video_player');
                               DBoxTV.toggleFullScreen( $currentVideoContainer, datahref );
                           
                               var video_sponsor = document.getElementById('video_sponsor');
                               video_sponsor.pause();
                               video_sponsor.src = '';  

                          }else{

                               GLOBAL_BLOCKED_ITEM    = true;
                               GLOBAL_UNBLOCKED_ITEM  = false;
                               GLOBAL_BLOCKED_ITEM_ID = DBoxTV.currentNavigation().getAttribute('id');
                               showBlockedMessage();

                          }
                      } 

               }else{

                    

                    if(_isblocked != 'true'){

                          if(datahref == 'more'){
                               datahref = '';
                          }

                        var query = { nexturl:nextURL, search:datahref };
                        DBoxTV.start( encrypter( DBoxTV.jsonFormat( query ) ) );

                     }else{

                         GLOBAL_BLOCKED_ITEM    = true;
                         GLOBAL_UNBLOCKED_ITEM  = false;
                         GLOBAL_BLOCKED_ITEM_ID = DBoxTV.currentNavigation().getAttribute('id');
                         showBlockedMessage();

                     }

               }

     });

     $('#main_player').bind('nv-back', function() {

          if(isfullscreen){
               isfullscreen = false;

               DBoxTV.destroyMainPlayer();
               navigation.refresh();
               navigation.changeScope('list');

          }else if(currentSession != 'home'){
               location.reload(true);
          }else{
              
          }
     });

     //PAUSE MAIN VIDEO
     $('#main_player').bind('nv-enter', function(event) {
           DBoxTV.checkIsPlaying();
     });

     $('#main_player').bind('nv-right', function() {
          dbox.forward();
     });

     $('#main_player').bind('nv-left', function() {
          dbox.reward();
     });

     //MESSAGES
     $('#conexion-message').bind('nv-enter nv-back', function(event) {
           $('#conexion-message').hide();
           navigation.changeScope('top'); 
     });

}



