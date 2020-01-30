		console.log('inside script');
		if (typeof my_client_id == "undefined") {
			console.log("hey idiot, my_client_id must have a value, check static/auth_data.js");
		}
		if (typeof my_url == "undefined") {
			console.log("hey idiot, my_url must have a value, check static/auth_data.js");
		}

		console.log('client_id=' + my_client_id + '; auth_url=' + my_url);
		function initSignin() {
			console.log('inside init');
			gapi.load('auth2', function() {
				gapi.auth2.init(my_client_id).then(function(){
					console.log('finished initializing');
					renderButton();
					setLogin();
				}, 
				function() {console.log('error initializing');
			});
			console.log('init: gapi is null after initialization?' + typeof gapi);
  			});
		}
		function renderButton() {
                 	gapi.signin2.render('signinButton',
                		{
                    		'scope': 'profile email',
                    		'width': 240,
                    		'height': 40,
                    		'longtitle': true,
                    		'theme': 'dark',
                    		'onsuccess': onSignin,
                    		'onfailure': () => {}
                		}
			);
    		}
		function isSignedIn() {
			var auth = gapi.auth2.getAuthInstance();
			console.log('isSignedIn: auth is null?' + typeof auth);
			console.log('isSignedIn: auth =' + auth);
			return auth.isSignedIn.get();
		}
		function setLogin() {
			console.log('setlogin: gapi is null?' + typeof gapi);
			document.getElementById('result').innerHTML = "logged in = " + isSignedIn() + "<br>";
		}
      var onSignin = function (googleUser) {
        // Useful data for your client-side scripts:
        var profile = googleUser.getBasicProfile();
        console.log("ID: " + profile.getId()); // Don't send this directly to your server!
        console.log('Full Name: ' + profile.getName());
        console.log('Given Name: ' + profile.getGivenName());
        console.log('Family Name: ' + profile.getFamilyName());
        console.log("Image URL: " + profile.getImageUrl());
        console.log("Email: " + profile.getEmail());

        // The ID token you need to pass to your backend:
        var id_token = googleUser.getAuthResponse().id_token;
        console.log("ID Token: " + id_token);
	var xhr = new XMLHttpRequest();
	//xhr.open('POST', 'https://signin-testbed-1571421143767.appspot.com/signin');
	xhr.open('POST', my_url + 'signin');
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr.onload = function() {
	  console.log('Signed in as: ' + xhr.responseText);
	};
	xhr.send('idtoken=' + id_token);
	document.getElementById('result').innerHTML = "logged in = " + isSignedIn() + "<br>";
      }
	function signOut() {
		var auth2 = gapi.auth2.getAuthInstance();
		auth2.signOut().then(function () {
			console.log('User signed out.');
			document.getElementById('result').innerHTML = "logged in = " + isSignedIn() + "<br>";
		});
	}
