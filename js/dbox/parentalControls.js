
var parental_control_pwd = '';
var tempPass = null;
var user_email = '';

var PARENTAL_CONTROL_MESSAGES = {
	'FIRST_TIME':'Before you start, set your password',
	'OK':'Press ok',
	'SET_PASSWORD':'Create your password',
	'DEFAULT':'Put your password',
	'VALIDATION_MESSAGE':'At least 4 numbers',
	'INCORRECT_PASSWORD':'Incorrect Password',
	'CONFIRM_PASSWORD':'Reenter your password',
	'RESET_PASSWORD':'Please, check your email to proceed.<br/>',
	'RESET_ERROR_EMAIL_NOT_FOUND':'<div style="margin: -6rem -.5rem;width:100%;">We are missing you email.<br/>To proceed with it contact us by support.</div>'
}

var pc_content = [];

var parentalControlObjects = new Object();

//CREATE PARENTAL MENU LIST

DBoxTvApp.prototype.parentalControl = function(_content){

		currentSession = "parental-control";

		pc_content = _content;

		//CLEAR PREVIUS SESSION
		$('#list').empty();
		$('#password-window').empty();
		$('#pc-menu').empty();
		$('#list').removeClass('movie-list');
		$('#list').removeClass('video-list');
		$('#list').removeClass('app-list');
		$('#list').removeClass('home-list');
		$('#pc-menu').addClass('parental-control');

		$('#sub-menu').hide();
		$('#menu-container').hide();
		$('#menu-controller').hide();

		var parental_control = "";

		var index = 0;

		parental_control = "<div nv-scope='pc-menu' id='pc-menu'><ul>";

		var allBlockedObjects = getParentalStorage();

		$.each( _content, function( key, value ) {

			parentalControlObjects[key] = allBlockedObjects[key].objects;

			pc_content[key].type = key;

			var att = ( index == 0 )?'nv-el-current':'';index++;
			( value.length > 0 )?parental_control += "<li "+ att +" item='"+ key +"' nv-el><h2>"+key+"</h2></li>":'';

		});

		parental_control += "</ul></div><div id='pc-contents' class='pc-contents' nv-scope='pc-itens'></div>";

		$('#list').append( parental_control );

		changeTitle("Parental control");

		$('#menu-controller').show();

		createParentalItens( pc_content['apps'] );

		actionParentalController();

		$('#pc-controller').show();

		iniPCBinds('pc-menu');

}

//CREATE PARENTAL ITENS LIST
function createParentalItens( _content ){


		$('#pc-contents').empty();
		$('#pc-contents').scrollLeft(0);

		var parental_control = "<ul id='pc-itens'>";

		var index = 0;

		var jsonAppsBlocked = null;

		if(temporaryParentalControl == null){
				jsonAppsBlocked = getParentalStorage();
				temporaryParentalControl = jsonAppsBlocked;
		}else{
				jsonAppsBlocked = temporaryParentalControl;
		}


		$.each( _content, function( _key, _value ) {

			var att = (index==0)?'nv-el-current':'';index++;

			var blocked = (jsonAppsBlocked[_content.type])?jsonAppsBlocked[_content.type].objects:parentalControlObjects[_content.type];

		    var isBlocked = jQuery.inArray( _value._id, blocked ) > -1;

		    //Temporary blockeds
		    if( !isBlocked ){
		    	 isBlocked = jQuery.inArray( _value._id, parentalControlObjects[_content.type] ) > -1;
		    }

            var classisBloacked = (isBlocked)?'disabled':'enabled';

			var locked = (isBlocked)?'off':'on';

			parental_control += "<li class='"+ classisBloacked +"' type='"+ _content.type +"' "+ att +" block='"+ locked +"' nv-el id='"+ _value._id +"' title='"+ (_value.name || _value.title) +"'><img src='"+ image_path + _value.thumb +"' onError='this.onerror=null;this.src=\"../images/apps/default.png\";'/><span><i id='"+ _value._id +"_ic' class='fa "+ ((isBlocked)?'fa-lock':'fa-unlock') +" pc-itens'></i>"+ (_value.name || _value.title) +"</span></li>";
		
		});

		parental_control += "</ul>";

		$('#pc-contents').append( parental_control );

		iniPCItens();

}

function actionParentalController(){
		
		var controller_itens_block = "<div id='button-controller'><ul nv-scope='pc-controller' id='pc-controller'><li nv-el nv-el-current>Save</li></ul></div>";
		$('#list').append( controller_itens_block );
}

function pass(){
//alert('pass');
		GLOBAL_BLOCKED_ITEM = false;

		parental_control_pwd = '';
		tempPass = null;

		//CLEAR PREVIUS SESSION
		$('#list').empty();
		$('#pc-menu').empty();
		$('#list').removeClass('movie-list');
		$('#list').removeClass('video-list');
		$('#list').removeClass('app-list');
		$('#list').removeClass('home-list');
		$('#pc-menu').removeClass('parental-control');
		$('#list').removeClass('apps-list');
		$('#pc-menu').addClass('keyboard');

		parental_control_pwd = '';
		tempPass = null;

		$('#pc-menu').addClass('keyboard');

		$('#sub-menu').hide();
		$('#menu-container').hide();
		$('#menu-controller').show();

		var keyBoardValues = ['0','1','2','3','4','5','6','7','8','9','del','cancel','ok','reset password'];

		var passWindow = "<div id='password-window' nv-scope='password-window' ><div class='pass-window'><div id='title'>password</div><div id='val1'>_</div><div id='val2'>_</div><div id='val3'>_</div><div id='val4'>_</div></div>";

		var keyBoard = passWindow + "<ul id='keyboard' class='keyboard'>";

		$.each( keyBoardValues, function( key, value ) {
			var att = (key == 0)?'nv-el-current':'';
	     	keyBoard += "<li class='keys' id='key_"+ value +"' value='"+ value +"'"+ att +" nv-el>"+value+"</li>";
		});

		keyBoard += "</ul></div>";

		$('#keyboard_container').append( keyBoard );

		iniPCBinds('password-window');

}

function quickPass( _id ){
//alert('quickPass');
		//CLEAR PREVIUS SESSION
		// $('#list').empty();
		// $('#pc-menu').empty();
		// $('#list').removeClass('movie-list');
		// $('#list').removeClass('video-list');
		// $('#list').removeClass('app-list');
		// $('#list').removeClass('home-list');
		// $('#pc-menu').removeClass('parental-control');
		//$('#list').removeClass('apps-list');

		parental_control_pwd = '';
		tempPass = null;

		$('#pc-menu').addClass('keyboard');

		$('#sub-menu').hide();
		$('#menu-container').hide();
		$('#menu-controller').show();

		//Movies description
		$('.description').hide();
		$('.bar').hide();

		var keyBoardValues = ['0','1','2','3','4','5','6','7','8','9','del','cancel','ok','reset password'];

		var passWindow = "<div id='password-window' nv-scope='password-window' ><div class='pass-window'><div id='title'>password</div><div id='val1'>_</div><div id='val2'>_</div><div id='val3'>_</div><div id='val4'>_</div></div>";

		var keyBoard = passWindow + "<ul id='keyboard' class='keyboard'>";

		$.each( keyBoardValues, function( key, value ) {
			var att = (key == 0)?'nv-el-current':'';
	     	keyBoard += "<li class='keys' id='key_"+ value +"' value='"+ value +"'"+ att +" nv-el>"+value+"</li>";
		});

		keyBoard += "</ul></div>";

		$('#keyboard_container').append( keyBoard );

		iniPCBinds('password-window');

}

function iniPCItens(){
	//PARENTAL CONTROL ITENS
	$('#pc-itens').bind('nv-enter', function() {
		//alert('#pc-itens');
	      pc_itens(); 
	});

	$('#pc-itens').bind('nv-up', function() {
	      navigation.changeScope('pc-menu'); 
	});

	$('#pc-itens').bind('nv-back', function() {
	      navigation.changeScope('pc-menu'); 
	});

	$('#pc-itens').bind('nv-golive', function() {
	     location.reload(true);
	});

	$('#pc-itens').bind('nv-down', function() {
	     navigation.changeScope('pc-controller'); 
	});
}

function iniPCBinds(_element){

	navigation.refresh();
	navigation.changeScope(_element);
		//PARENTAL CONTROL MENU
	$('#pc-menu').bind('nv-enter nv-down', function() {
	     navigation.refresh();
	     navigation.changeScope('pc-itens'); 
	});

	$('#pc-menu').bind('nv-back nv-golive', function() {
	    location.reload(true);
	});

	$('#pc-menu').bind('nv-right nv-left', function() {
	     var parentalItem = DBoxTV.currentNavigation().getAttribute('item');
	     createParentalItens( pc_content[ parentalItem ] );
	});

	//PARENTAL CONTROL
	$('#pc-controller').bind('nv-up nv-back', function() {
	     navigation.changeScope('pc-itens'); 
	});

	$('#pc-controller').bind('nv-enter', function() {

	     saveParentalControl( parentalControlObjects );
	});

	$('#password-window').bind('nv-enter', function() {

	    var value = DBoxTV.currentNavigation().getAttribute('value');

	    if(value == 'del') {
	        back_password();
	    }else if(value == 'cancel'){
	        //location.reload(true);

	    }else if( value == 'ok'){
	        
				if( parental_control_pwd.length != 4 ){
					  $('#title').html( PARENTAL_CONTROL_MESSAGES.VALIDATION_MESSAGE );
					  $('#title').css('background','#fd4302');
					  return;
				}

				//OPEN BLOCKED ITEM
				if( GLOBAL_BLOCKED_ITEM ){
					if( authenticateParentalControl() ){
					  	GLOBAL_UNBLOCKED_ITEM = true;
					  	GLOBAL_BLOCKED_ITEM = false;
					  	$('#keyboard_container').empty();
					  	$('#menu-controller').show();
					  	navigation.refresh();
					  	navigation.changeScope('list');
					  	$('.description').hide();
					  	openBlockedItemOneTime();
					  	return;
					}else{
						parental_control_pwd = '';
						resetTextField( PARENTAL_CONTROL_MESSAGES.INCORRECT_PASSWORD );
						$('#title').css('background','#fd4302');
					}

				}

				if( existParentalControl() ){ 

					  if( authenticateParentalControl() ){
					      DBoxTV.start( encrypter( DBoxTV.jsonFormat( {nexturl: 'getobjectsparentalcontrol'}) ) );
					  }else{
					      parental_control_pwd = '';

					      resetTextField( PARENTAL_CONTROL_MESSAGES.INCORRECT_PASSWORD );

					      $('#title').css('background','#fd4302');
					  }

				}else{
					   if( tempPass == null ){

					       tempPass = parental_control_pwd;
					       ReEnterPassword();

					   }else if(tempPass != parental_control_pwd){

					       ReEnterPassword();

					   }else if(parental_control_pwd == tempPass){

					      if(setPassWord()){
					        DBoxTV.start(encrypter(DBoxTV.jsonFormat({nexturl: 'getobjectsparentalcontrol'})));
					      } 

					    }else{
					        
					  }
				}
				

	    }else if( value == 'reset password'){  

		      if( resetPassword() ){
		         $('#title').html( PARENTAL_CONTROL_MESSAGES.RESET_PASSWORD + user_email );
		      }else{
		      	 $('#title').html( PARENTAL_CONTROL_MESSAGES.RESET_ERROR_EMAIL_NOT_FOUND );
		      }
		      $('#title').css('background','orange');

	    }else{
	        parental_control_password( value );
	    }
	});

	$('#password-window').bind('nv-back nv-golive', function() {

        $('#menu-controller').show();

		if( currentSession == 'home' || currentSession == ''){
			$('#menu-controller').hide();
		}

		if( GLOBAL_BLOCKED_ITEM ){
			GLOBAL_BLOCKED_ITEM = false;
		  	$('#keyboard_container').empty();
		  	navigation.refresh();
		  	$('.description').hide();
		  	navigation.changeScope('list');
		}else{
			location.reload(true);
		}
	    
	});

	$('#password-window').bind('nv-left nv-right nv-up nv-down', function(){
		$('.description').hide();
	});


}










