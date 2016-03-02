var movieListIndex = 0;

var movieInfoContainer = [];

var listMovie = "";
var i = 0;

var isMovies = false;

// LOAD PREVIEW MOVIES LIST
DBoxTvApp.prototype.createMoviesList = function(movies){

    if(currentSession != 'home')
      currentSession = 'movies';

      //CLEAR PREVIUS MOVIELIST
      if(moviePagination == 0){
          i = 0;
      }

      $('#list').empty();
      $('#list').removeClass('video-list');
      $('#list').removeClass('home-list');
      $('#list').removeClass('apps-list');
      $('#list').removeClass('parental-control');
      $('#list').addClass('movie-list');

      var category = movies.title;
      var code = movies.code;
      var total = movies.total;

      //this.moviesList = movies.movies;

      var loadMoreButton = '';
      
      //CREATE PLAYLIST
      var movieInfoBallon = "<div class='description'><img id='poster-placeholder' src='' width='100' height='157'><h1 id='movie-title'>loading...</h1><span id='year'>loading...</span><span id='runtime'>loading...</span><span id='tags'>loading...</span><h4 id='movie-description'>loading...</h4></div>";
      $('#list').append(movieInfoBallon);

      var jsonItemBlocked = getParentalStorage();

      var scrollName = 'scroll' + moviePagination;
      listMovie += "<ul id='" + scrollName + "' >";

      $.each( movies.movies, function( key, value ) {

          var movieObject = {
          'active':value.active,
          'exibitiondate':value.exibitiondate,
          'lenght':value.lenght,
          'thumb':value.thumb,
          'description':value.description,
          'url':value.url,
          'title':value.title,
          'tags':value.tags,
          'id':value.id };

          var id = movieObject.title.replace(/\s+/g, '-').toLowerCase();
        
          var att = ( i == (moviePagination * limitPage) )?'nv-el-current':'';   

          var blockedItens = (jsonItemBlocked.movies)?jsonItemBlocked.movies.objects:parentalControlObjects['movies'];   
          var isBlocked = jQuery.inArray( value._id, blockedItens ) > -1;
          var classisBlocked = (isBlocked)?'disabled':'enabled';     

          listMovie += "<li type='movies' blocked='"+ isBlocked +"' class='"+ classisBlocked +"' id='" + id + "' nv-el " + att + " index='" + i + "' data-href='" + movieObject.url + "' ><div class='bar'></div><img class='play-movie' src='images/play-movie.png'/><div class='poster'><img  src='"+ image_path + movieObject.thumb + "' width='200px' height='313px'></div><h3>" + movieObject.title + "</h3></li>";

          i++;

          movieListIndex++;

          movieInfoContainer.push(movieObject);

      });
     
      listMovie += "</ul>";
      $('#list').append(listMovie);

      if(movieListIndex != total){
          loadMoreButton = "<li nv-el id='load-more-movies-button' code='" + code + "' data='getmoviebycategory' tag='" + category + "' action='load_more_movies'><div class='load-more'><img src='images/more.png'/></div></li><li id='movieListFinal'></li>";
      }else{
          loadMoreButton = "<li id='movieListFinal'></li>";
      }

      $('#scroll' + moviePagination).append(loadMoreButton);
      
   
      navigation.refresh();
      navigation.changeScope('list');


      changeTitle(category);
      changeBackground('images/backgrounds/movies.jpg');


      DBoxTV.showDescritionMovie();  

      $('#menu-controller').show();  

      iniMoviesBind('#list');

}


function resetMovieList(){
    moviePagination = 0;
    movieListIndex = 0;
    movieInfoContainer = [];
    listMovie = '';
    i = 0;
    $('#list').scrollTop(0);
}

function setButtonLoadMoreMovies(_scroll, _code, _category){

  loadMoreButton = "<li nv-el code='" + _code + "' data='getmoviebycategory' tag='" + _category + "' action='load_more_movies'><div class='load-more'><img src='images/more.png'/></div></li><li id='movieListFinal'></li>";
  $(_scroll).append(loadMoreButton);

}
 

// SHOW DESCRIPTION MOVIE
DBoxTvApp.prototype.showDescritionMovie = function(){

  $('.description').hide();
  $('.bar').hide();

  clearInterval(movieDescription);

          if(navigation.getCurrentScope().getCurrentElement().getAttribute('data-href')){

                $('.bar').show();

                var position  = $(navigation.getCurrentScope().getCurrentElement()).offset();
                var index     = navigation.getCurrentScope().getCurrentElement().getAttribute('index');
               
                if(index){

                    var top   = ($('.movie-list').scrollTop() - position.top) + 360;
                    var left  = position.left - 63;

                    var movieObject = movieInfoContainer[index];

                    if(left > 900)
                        left -=  76;

                    $('.description').css({
                      position: 'absolute',
                      top: top + 'px',
                      left: left + 'px'
                    });

                    var titleMovie    = movieObject.title;
                    var poster        = image_path + movieObject.thumb;
                    var exibitiondate = movieObject.exibitiondate;
                    var lenght        = movieObject.lenght;
                    var tags          = movieObject.tags;
                    var description   = movieObject.description;

                    movieDescription  = setInterval(function(){

                          var formattedDate = new Date(exibitiondate);
                          var y = formattedDate.getFullYear();

                          $('#movie-title').html(titleMovie);
                          $('#year').html("Year: (" + y +")<br/>");
                          $('#runtime').html("Duration: "+ lenght +" minutes<br/>");
                          $('#tags').html(tags + "<br/>");
                          $('#movie-description').html(description);

                          $('#poster-placeholder').attr("src",poster);
                          
                          $('.description').show();

                          clearInterval(movieDescription);
                          
                          index = null;
                          movie = null;

                    }, timerToShowMovieDiscription);
                }
          }
  
}


function iniMoviesBind(_element){

    $(_element).bind('nv-up', function() {

        var index = parseInt(DBoxTV.getPrevElementWith( 'index' ));

        if(index < 5){
           $('#parental-control').attr('nv-el-current',true);
           navigation.changeScope('top');
        }
        
    });

    $(_element).bind('nv-left nv-right nv-down nv-up', function() {
      var _isblocked  = navigation.getCurrentScope().getCurrentElement().getAttribute('blocked');
      if( _isblocked == 'false' ){
        DBoxTV.showDescritionMovie();
      }else{
        $('.description').hide();
        $('.bar').hide();

        clearInterval(movieDescription);
      }
         
    });

    $(_element).bind('nv-back', function() {

      if(currentSession == 'home'){
              location.reload(true);
              return
      }

      if(currentSession == 'movies' ){
          GLOBAL_BLOCKED_ITEM = false;

          

          $('#menu-container').show();
          $('#sub-menu').show();
         

          navigation.changeScope('sub-menu');

          DBoxTV.stopPreviewVideo( $currentVideo );
         
          //CLEAR MOVIE DESCRIPTION 
          clearInterval(movieDescription);
          $('.description').hide();
      }

    });

    $(_element).bind('nv-enter', function() {

    if(currentSession == 'movies' ){

              var isBlocked = DBoxTV.currentNavigation().getAttribute('blocked');

              if(isBlocked != null){
                  if( isBlocked == 'false' ){
                      if(DBoxTV.currentNavigation().getAttribute('action') == 'load_more_movies'){

                              var tag = DBoxTV.currentNavigation().getAttribute('tag');
                              var nextURL = DBoxTV.currentNavigation().getAttribute('data');
                              var code = DBoxTV.currentNavigation().getAttribute('code');
                              moviePagination += 1;
                              var query = {name:tag, nexturl:nextURL, code: code, pg_index:moviePagination, pg_limit:limitPage};

                              DBoxTV.start(encrypter(DBoxTV.jsonFormat(query)));

                      }else{

                              var videoURL = DBoxTV.currentNavigation().getAttribute('data-href');

                              if(videoURL){
                                  DBoxTV.toggleFullScreen( null, videoURL );
                                  isfullscreen = true;
                                  isMovies = true;
                                 $('.description').hide();
                              }else{
                                 showBlockedMessage(DBoxTV.currentNavigation().getAttribute('id'));
                              }

                      }
                 }else{
                    
                       GLOBAL_BLOCKED_ITEM    = true;
                       GLOBAL_UNBLOCKED_ITEM  = false;
                       GLOBAL_BLOCKED_ITEM_ID = DBoxTV.currentNavigation().getAttribute('id');
                       showBlockedMessage();
                
                 }
              }

        }

    });
}




