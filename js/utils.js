
function changeBackground( value ){

  var default_background_url = '../images/backgrounds/default.jpg';

  if( checkImageURL( value ) ){
    $('body').css('background-image', 'url('+value+')');
  }else{
     $('body').css('background-image', 'url('+default_background_url+')');
  }
 
}

function IsValidImageUrl(url) {
    var img = new Image();
    img.src = url;
    img.onerror = function() { 
      alert('false');
    }
    img.onload =  function() { 
      alert('true');
    }
}

function checkImageURL(url) {
    return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}

function checkVideoURL(url) {
    return (url.match(/\.(m3u8|mp4|webm|wmv)$/) != null);
}

function changeTitle(title){
    $('#section_title').html(title);
}

//CryptoJS https://code.google.com/p/crypto-js/
function encrypter(jsonEncrypt){
      return CryptoJS.AES.encrypt(JSON.stringify(jsonEncrypt), conf.passPhrase, { mode: CryptoJS.mode.CBC });
}

function decrypter(jsonEncrypt){
      return CryptoJS.AES.decrypt(jsonEncrypt, conf.passPhrase, { mode: CryptoJS.mode.CBC }).toString(CryptoJS.enc.Utf8);
}

//NO CACHE
function noCache(src){
    return src+'?'+Math.random()*9999999999;
}

//REMOVE ALL ACCENTS OF STRING
function removeAccentsOfString(strToReplace) {
    str_accents = "áàãâäéèêëíìîïóòõôöúùûüçÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÖÔÚÙÛÜÇ";
    str_no_accents = "aaaaaeeeeiiiiooooouuuucAAAAAEEEEIIIIOOOOOUUUUC";
    var new_value = "";
    for (var i = 0; i < strToReplace.length; i++) {
        if (str_accents.indexOf(strToReplace.charAt(i)) != -1) {
            new_value += str_no_accents.substr(str_accents.search(strToReplace.substr(i, 1)), 1);
        } else {
            new_value += strToReplace.substr(i, 1);
        }
    }
  return new_value;
}

//LOAD SESSIONS
function m_load( data ){
    var text = jQuery( data );//forcing parser
    $("#list").html( text );  
    navigation.refresh();
    navigation.changeScope('list');
}

function request( file ){
    jQuery.ajax({
      url: file,
      success: function( data )
      {
        m_load( data );
      }
    }); 
}

Array.prototype.remove = function(elem, all) {
  for (var i=this.length-1; i>=0; i--) {
    if (this[i] === elem) {
        this.splice(i, 1);
        if(!all)
          break;
    }
  }
  return this;
};