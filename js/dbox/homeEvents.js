var bannerTopTimerOut;
var bannerDownTimerOut;
var widgetsTimerOut;

var indexTopBanner      = 0;
var indexDownBanner     = 0;
var indexWidgets        = 0;

var upBannerLength      = 0;
var downBannerLength    = 0;

var upBannerTimer       = 0;
var downBannerTimer     = 0;

var banner_top_id       = "";
var banner_down_id      = "";

//START TOP BANNER TIMER
function startTopBanner(_length, _timerBannerTop){

    upBannerTimer  = _timerBannerTop;
    upBannerLength = _length;

    if(_length == 1){
        clearTimeout(bannerTopTimerOut);
        return;
    }

    $(banner_top_id).hide();

    if(indexTopBanner >= _length){
      indexTopBanner = 0;
    }
    
    banner_top_id = "#banner_top_"+indexTopBanner;

    $(banner_top_id).show();

    indexTopBanner++;

    bannerTopTimerOut = setTimeout(
      function(){
        startTopBanner(upBannerLength , upBannerTimer);
      }, upBannerTimer);

}

function pauseUpBanner(){
   console.log('pauseUp');
   clearTimeout(bannerTopTimerOut);
}

function resumeUpBanner(){
    console.log('resumeUp');
    clearTimeout(bannerTopTimerOut);
    startTopBanner(upBannerLength, upBannerTimer);
}

//START DOWN BANNER TIMER
function startDownBanner(_length , _timerBannerDown){

   downBannerTimer  = _timerBannerDown;
   downBannerLength = _length;

   if(_length == 1){
        clearTimeout(bannerDownTimerOut);
        return;
    }

    $(banner_down_id).hide();

    if(indexDownBanner >= _length){
      indexDownBanner = 0;
    }
    
    banner_down_id = "#banner_down_"+indexDownBanner;

    $(banner_down_id).show();

    indexDownBanner++;

    bannerDownTimerOut = setTimeout(
      function(){
        startDownBanner(_length , _timerBannerDown);
      }, _timerBannerDown);

}

function pauseDownBanner(){
   clearTimeout(bannerDownTimerOut);
}

function resumeDownBanner(){
    clearTimeout(bannerDownTimerOut);
    startDownBanner(downBannerLength, downBannerTimer);
}

//START WIDGETS TIMER
function startWidgets(_widgets){

    if(_widgets.length == 1){
        clearTimeout(widgetsTimerOut);
        return;
    }

    if(indexWidgets >= _widgets.length){
      indexWidgets = 0;
    }
   
    changeWidget(_widgets[indexWidgets]);
    indexWidgets++;

    widgetsTimerOut = setTimeout(
      function(){
        startWidgets(_widgets);
      }, 15000);

}

//CHANGE TOP BANNER
function changeTopBanner(_bannertop){
    $('#img_banner_middle').attr("src", image_path + _bannertop.banner );
    $('#banner_top').attr("invoke", _bannertop.invoke );
    $('#banner_top').attr("parameter", _bannertop.parameter );
}

//CHANGE DOWN BANNER
function changeDownBanner(_bannerdown){
    $('#img_banner_down').attr("src", image_path + _bannerdown.banner );
    $('#banner_down').attr("invoke", _bannerdown.invoke );
    $('#banner_down').attr("parameter", _bannerdown.parameter );
}

//CHANGE WIDGETS BANNER
function changeWidget(_widget){
    $('#mini-banner').empty();
    $('#mini-banner').html( _widget.html );
}

//STOP ALL HOME TIMEOUT
function stopHomeTimeOut(){
    clearTimeout( bannerTopTimerOut );
    clearTimeout( bannerDownTimerOut );
    clearTimeout( widgetsTimerOut );
}


