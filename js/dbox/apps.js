

DBoxTvApp.prototype.apps = function( _apps ){

		currentSession = 'apps';
		 
		$('#list').empty();
		$('#list').removeClass('video-list');
		$('#list').removeClass('home-list');
		$('#list').removeClass('movie-list');
		$('#list').addClass('apps-list');

		var app_list = '';

		//APPS
		app_list = "<ul id='all_apps'>";

		var jsonAppsBlocked = getParentalStorage();

		$.each( _apps, function( key, value ) {

			   var id             =  	value.name;
			   var nv_el_current  =  	(key == 0)?'nv-el-current':'';
			   var thumb          =  	value.thumb;
			   var intent         =  	value.intent;

 			   var blockedItens = (jsonAppsBlocked.apps)?jsonAppsBlocked.apps.objects:parentalControlObjects['apps'];
             
               var isBlocked = jQuery.inArray( value._id, blockedItens ) > -1;

 			   var classisBlocked = (isBlocked)?'disabled':'enabled';

			   app_list += "<li index='"+ key +"' class='"+ classisBlocked +"' type='apps' id='"+ id +"' "+ nv_el_current +" nv-el data-intent='"+ ((!isBlocked)?intent:'') +"'><img src='"+ image_path + thumb +"' onError='this.onerror=null;this.src=\"../images/apps/default.png\";'/></li>";

		});

		app_list += "</ul>";

		$('#list').append( app_list );

		changeTitle('Apps');

		navigation.refresh();
		navigation.changeScope('list'); 

		app_list = null;

        //changeBackground('images/backgrounds/apps.jpg');

		iniMAllAppsBind();

}

function iniMAllAppsBind(){

		$('#all_apps').bind('nv-up', function() {
		  var index = parseInt(DBoxTV.getPrevElementWith( 'index' ));
		  if( index <= 5 ){
		       $('#parental-control').attr('nv-el-current',true);
		       navigation.changeScope('top');
		  }
		});

		$('#all_apps').bind('nv-enter', function() {

		 var intent = DBoxTV.currentNavigation().getAttribute('data-intent');
		        
		 if(intent){
			loader('show');
			//OPEN APPS
			window.parent.postMessage(intent.split(","), "*");
		}else{
			GLOBAL_BLOCKED_ITEM    = true;
			GLOBAL_UNBLOCKED_ITEM  = false;
			GLOBAL_BLOCKED_ITEM_ID = DBoxTV.currentNavigation().getAttribute('id');
			showBlockedMessage();
		}

		});

		$('#all_apps').bind('nv-back', function() {
				location.reload(true);
		});

		$('#all_apps').bind('nv-back', function() {
				location.reload(true);
		});

}