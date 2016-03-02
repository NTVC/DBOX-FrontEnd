

var app_url = environment.api;
var image_path = environment.imagesPath;

// DEFAULT VALUES TO PREVIEW VIDEO LIST
var $prevVideo,$currentVideo,$prevVideoContainer,$indice = null;
var videoIntervalToPlay,mainVideoClear,movieDescription = null;
var listVideosLength = 0;
var titleChannel = "";
var clearMainVideo = 3600000; // TIMER TO CLEAN BUFFER MAIN VIDEO LOADING THE SAME VIDEO WITH ANOTHER URL
var timerToShowMovieDiscription = 2000;
var moviesList,moviesInfo = [];
var isplaying = false;
var jsonEncrypt = {};
var lines = 0;
var globalloaded = false;
var model = '';
var uid = '';
var wMac = '';
var ethMac = '';
var blockedPCItens = "blockedParentalControlItens";
var GLOBAL_BLOCKED_ITEM = null;
var GLOBAL_UNBLOCKED_ITEM = null;
var GLOBAL_BLOCKED_ITEM_ID = null;


$('#pc-controller').hide();

//D-BoxTV
var DBoxTvApp = function(){
if(DBoxTvApp.instance){
    return DBoxTvApp.instance;
}

DBoxTvApp.instance = this;
    return DBoxTvApp.instance;
};

DBoxTvApp.prototype.initialize = function() {
    return this;
};

//GET CURRENT NAVIGATION
DBoxTvApp.prototype.currentNavigation = function(){
    return navigation.getCurrentScope().getCurrentElement();
}

//GET PREVIOUS NAVIGATION
DBoxTvApp.prototype.previousNavigation = function(){
    return navigation.getPrevScope().getCurrentElement();
}

//GET PREVIOUS NAVIGATION
DBoxTvApp.prototype.getPrevElementWith = function( _att ){
    return navigation.getPrevElementWith(_att);
}

//LOAD SESSIONS
DBoxTvApp.prototype.loadSession = function(session){
    $('#list').empty();
    if( session.length > 0 ){
       var page = session.replace(/\s+/g, '-').toLowerCase();
       changeBackground(page);
       request( page );
    }
}

function loader(status){
    var loader = "<div class='showbox'><div class='loader'><svg class='circular' viewBox='25 25 50 50'><circle class='path' cx='50' cy='50' r='20' fill='none' stroke-width='6' stroke-miterlimit='10'/></svg></div></div>"
    if(status == 'show')
      $('#container_loader').html(loader);
    else
      $('#container_loader').empty();
}

function loader_player(status){
    var loader = "<div class='showbox'><div class='loader_player'><svg class='circular' viewBox='25 25 50 50'><circle class='path' cx='50' cy='50' r='20' fill='none' stroke-width='6' stroke-miterlimit='10'/></svg></div></div>"
    if(status == 'show')
      $('#loader').html(loader);
    else
      $('#loader').empty();
}

var DBoxTV = new DBoxTvApp();

window.main = function () {
    return DBoxTV.initialize();
}();

