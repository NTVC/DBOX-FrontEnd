var hc = "#content";
var hi = "#opacity";
var hs = "#source";
var hd = "#date";
var hp = "#bar";

var array = new Array();
var animateTimer = 15476;

$(document).ready(function(){
      
    var location = window.parent.GLOBAL_CUSTOMER_CITY;
    var language = window.parent.GLOBAL_CUSTOMER_LANGUAGE; 

    getNews(location, language);
   
});

function getNews(location, language){
     
     $.ajax({
        url:'https://ajax.googleapis.com/ajax/services/search/news?v=1.0&q='+location+'&rsz=5&hl=' + language,
        type:"GET",
        dataType: 'jsonp',
        success:function (data) {
            
            if(data.responseData.results.length == 0){
                getNews('news', language);
            }
            else{
                
                $.each( data.responseData.results, function( key, value ) {
                    
                    array.push({
                        content: strip(value.content),
                        publisher: value.publisher,
                        // url: value.image.url,
                        date: formatDate(value.publishedDate)
                    })
                    
                });
                
                animate(0);
            }
        }
    });
}

function strip(html)
{
    return html.replace(/<(?:.|\n)*?>/gm, '');
}

function animate(index){
    
    if(index >= array.length){
        index = 0;
    }
    $(hc).html(array[index].content);
    $(hs).html(array[index].publisher);
    $(hd).html(array[index].date);
    //$('body,html').css('background-image', 'url(' + array[index].url + '?ticks=' + new Date().getMilliseconds() + ')');
    
    index += 1;
    
    $(hc).scrollTop(0);
    $(hp).attr('max', animateTimer);
    
    setTimeout(function(){animate(index);}, animateTimer);
    overFlow();
}


function overFlow(){
    
    var timer = animateTimer - 200;
    $(hc).scrollTop(0);
    
    $(hc).animate({
        scrollTop: $(hc)[0].scrollHeight - 50
    },
    timer);
    
    $(hp).width('0');
    $(hp).animate({
        width: '100%'
    },
    timer);
    
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('.');
}