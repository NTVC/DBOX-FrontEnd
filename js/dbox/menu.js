
var subMenus = [];

//MENU
DBoxTvApp.prototype.createMenu = function( menuContainer ){

    if( menuContainer.length >0 ){
   
        var obj = "";
        var i = 0;

        var nextURLs = [];

        var content = '<img style="opacity:.1;" src="images/logo-overlay.png"/><ul>';

        $.each( menuContainer, function( key, value ) {
          
            var prop = (i==0)?'nv-el-current':'';i = null;
            var id_prop = value.title.replace(/\s+/g, '-');
            var haveSubmenu = value.submenu;

            content += '<li onclick="javascript:openSubMenu(this);" nv-el indice="'+ key +'" id="'+ id_prop.toLowerCase() +'" tag="'+ value.title +'" '+prop+' _id="'+ value._id +'"" data="'+ value.nexturl +'"" sub-menu="'+ haveSubmenu +'">'+value.title+'</li>';
            
            nextURLs.push( value.nexturl );

            obj = id_prop.toLowerCase();
          
        });
        
        content += '</ul>';

        $("#menu").html( content );


        getSubMenuFromApi(nextURLs, 0);


        //HIDEN MAIN PLAYER
        $('#main_player').hide();

        content = null;

        initMenuBind();

        return true;

    }

    return null;
}


function getSubMenuFromApi( _nextURLs, _index ){

    
        if( _nextURLs.length > _index ){

            var query = { nexturl:_nextURLs[_index] };
         
            var data = encrypter(DBoxTV.jsonFormat(query));

            var response = $.ajax({
                type: "POST",
                url: app_url,
                data: { data:data.toString() },
                cache: false,
             }).done(function(data){
                subMenus[ _index ] = data.informationReturn;
                getSubMenuFromApi( _nextURLs, _index+1 );
             });
           
        }
   
}


DBoxTvApp.prototype.createSubMenu = function( _index ){

    if( _index==0 ){
        $("#sub-menu").hide(); 
        return;
    }  

    var content = '<ul>';
    
    $.each( subMenus[_index].submenu, function( key, value ) {

        var id_prop = value.name.replace(/\s+/g, '-').toLowerCase();

        var prop = ( key == 0 ) ?'nv-el-current':'';
        var _id  = ( value._id ) ?value._id:'';
        var nexturl = subMenus[_index].nexturl;
        
        content += '<li id="' + id_prop + '" code="' + value.code + '" videoId="' + _id + '" tag="' + value.name + '" data="' + nexturl + '" nv-el ' + prop + ' onclick="javascript:subMenuAction();">' + value.name + '</li>';

     });

     content += '</ul>';

     $("#sub-menu").html(content);
     $("#sub-menu").show();

}

// START SUB MENU ON SCREEN
DBoxTvApp.prototype.iniSubMenu = function(){

    if( DBoxTV.hasSubMenu() ){
      
        $menu_item_id = navigation.getCurrentScope().getCurrentElement().id;
        $menu_data = navigation.getCurrentScope().getCurrentElement().getAttribute('data');

        //request to sub-menu
        this.start( encrypter(DBoxTV.jsonFormat({nexturl: $menu_data})) );

    }else{
        return null;
    }

}

//HAS SUBMENU
DBoxTvApp.prototype.hasSubMenu = function(){
    return navigation.getCurrentScope().getCurrentElement().getAttribute('sub-menu'); 
}

function openSubMenu(value){

      $('#sub-menu').hide();

      if(DBoxTV.hasSubMenu() == 'true')
         DBoxTV.iniSubMenu();

}


function subMenuAction(){

      $('#menu-container').hide();
      $('#menu-controller').show();

      $('#video_player').src = '';

      $('#sub-menu').hide();

      currentSession = 'playlist';

      current_menu   = currentMenu[0];

      //clear home timeout
      stopHomeTimeOut();

      //reset movies
      resetMovieList();

      var tag     =   DBoxTV.currentNavigation().getAttribute('tag');
      var nextURL =   DBoxTV.currentNavigation().getAttribute('data');
      var code    =   DBoxTV.currentNavigation().getAttribute('code');

      var query = { name:tag, nexturl:nextURL, code: code, pg_index:0, pg_limit:limitPage };

      DBoxTV.start( encrypter(DBoxTV.jsonFormat(query)) );

}

function initMenuBind(){

        //******* BIND MENU ****** 
        $('#menu').bind('nv-back nv-left', function() {
            $('#sub-menu').hide();
            $('#menu-container').hide();
            navigation.refresh();
            navigation.changeScope('list');
        });

        $('#menu').bind('nv-enter nv-down nv-up', function() {
            DBoxTV.createSubMenu( DBoxTV.currentNavigation().getAttribute('indice') );
        });

        $('#menu').bind('nv-enter nv-right', function() {

               $('#menu-controller').hide();

                if(DBoxTV.currentNavigation().getAttribute('indice') == '0'){
                    loader('show');
                    location.reload( true );

                }else{
                    navigation.refresh();
                    navigation.changeScope('sub-menu');
                }

                // $('#top ul li i').css("color","white");

        });

        //******* BIND SUB-MENU ****** 

        $('#sub-menu').bind('nv-enter nv-right', function() {
            currentSession = null;
            subMenuAction();
        });

        $('#sub-menu').bind('nv-back', function() {  
            $('#sub-menu').hide();
            navigation.changeScope('menu');
        });

        $('#sub-menu').bind('nv-left', function() {
            navigation.changeScope('menu');
        });

}



 


// //CREATE SUB MENU
// DBoxTvApp.prototype.createSubMenuWithId = function( obj ){
    
//     var id = "menu-" + $menu_item_id;
//     var content = '<ul id="' + id + '">';
    
//     $.each( obj.submenu, function( key, value ) {
        
//         var id_prop = value.name.replace(/\s+/g, '-').toLowerCase();

//         var prop = ( key == 0 ) ?'nv-el-current':'';
//         var _id  = ( value._id ) ?value._id:'';
//         var nexturl = obj.nexturl;
        
//         content += '<li id="' + id_prop + '" code="' + value.code + '" videoId="' + _id + '" tag="' + value.name + '" data="' + nexturl + '" nv-el ' + prop + ' onclick="javascript:subMenuAction();">' + value.name + '</li>';

//      });

//      content += '</ul>';

//      $("#sub-menu").html(content);
//      $("#sub-menu").show();

// }

