var top_menu	=  	"<ul>";
	top_menu  	+= 	"<li id='logo_ntvc'><img src='images/golive-ntvc-1.svg'/></li>";        
	top_menu 	+= 	"<li id='parental-control' nv-el><a href='javascript:parentalControl();'><i class='fa fa-child'></i></a></li>"; 
	top_menu 	+= 	"<li id='folder' nv-el><a href='javascript:explorerV();'><i class='fa fa-folder-open'></i></a></li>"; 
	top_menu 	+= 	"<li id='support' nv-el><a href='javascript:support();'><i class='fa fa-phone'></i></a></li>"; 
	top_menu 	+= 	"<li id='settings' nv-el><a href='javascript:checkWifi();'><i class='fa fa-cog'></i></a></li>"; 
	//top_menu 	+= 	"<li id='help' nv-el><a href='javascript:checkWifi();'><i class='fa fa-question'></i></a></li>"; 
	top_menu 	+= 	"<li id='wifi' nv-el><a href='javascript:checkWifi();'><i id='wifi-icon' class='fa fa-wifi'></i></a></li>"; 
	top_menu 	+= 	"<li id='time'><div class='clock'></div></li>";
	top_menu	+= 	"</ul>";

$('#top').append( top_menu );

initTop();

function initTop(){

	$('#top').bind('nv-enter', function() {

		 var element = DBoxTV.currentNavigation().getAttribute('id');

	     if( element == 'parental-control' ){
	     	parentalControl();
	     }else if( element == 'folder' ){
	     	explorerV();
	     }else if( element == 'support' ){
	     	support();
	     }else if( element == 'help' ){
	     	checkWifi();
	     }else if( element == 'settings' ){
	     	checkWifi();
	     }else if( element == 'wifi' ){
	     	checkWifi();
	     }

	});

	$('#top').bind('nv-down', function() {
		  $('#parental-control').removeAttr('nv-el-current');
		  $('#folder').removeAttr('nv-el-current');
		  $('#support').removeAttr('nv-el-current');
		  $('#settings').removeAttr('nv-el-current');
		  $('#wifi').removeAttr('nv-el-current');

	      navigation.changeScope('list');

	      if(currentSession == 'playlist'){
	      	DBoxTV.showPreviewVideo();
	      }
	      		
	});

	$('#top').bind('nv-back', function() {

          navigation.changeScope('list');
         
          //CLEAR MOVIE DESCRIPTION 
          clearInterval(movieDescription);
          $('.description').hide();
     });
	
}