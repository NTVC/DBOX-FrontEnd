	
	var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
	var eventer = window[eventMethod];
	var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";



	var exibithion = [];

	var canplay = false;

	//Listen message from android
	eventer( messageEvent,function(e) {

		var video = dbox.getVideo();

		if( e.data[0] == "activate" ){
			
			validate = e.data[1];

			uid = e.data[2][0];
			ethMac = e.data[2][2];
			wMac = e.data[2][1];

			USER_MESSAGE.NOT_AUTHORIZED = "<img src='images/no-authorized.jpg'><h2>Whoops!</h2><h4>This app is not authorized! Please contact our support.</h4><h3 id='product_id'>PID:" + uid + " - EID:" + ethMac + " - WID:" + wMac + "</h3>";
			
            DBoxTV.start(encrypter(DBoxTV.jsonFormat({nexturl: 'gethomescreenmenu'})));

		}else if( e.data == "online" ){

		    $('#wifi-icon').css('color','white');

			resumeThreads();

		}else if(e.data == "offline"){

			 $('#wifi-icon').css('color','red');
		     $('.description').hide();

			pauseThreads();

		}else if(e.data == "resume"){

			resumeThreads();

		}else if(e.data == "pause"){

			pauseThreads();

		}

	}, false);

	function resumeThreads(){

		loader('hide');

		if(currentSession == 'home'){
			location.reload();
			// $('#video_sponsor').load();
			// $('#video_sponsor').play();
		}
		
		if(video.id){
            if(!dbox.onCanPlay){
	              if(canplay){
	                video.load();
	                video.play();
	                canplay = false;
	              }
            }
        }

	}

	function pauseThreads(){

			canplay = true;
			video.pause();
			dbox.onCanPlay = false;
			$('#video_player').src = '';

			var video_sponsor = document.getElementById('video_sponsor');
			video_sponsor.pause();
			video_sponsor.src = '';
	}

	function displayId(args){
			var arr = args.replace('||', '');
			return arr;
	}

	// var chunks = function(array, size) {
	//   var results = [];
	//   while (array.length) {
	//     results.push(array.splice(0, size));
	//   }
	//   return results;
	// };
	


	