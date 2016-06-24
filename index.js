var fetch = require('node-fetch'),
	cookie = require('cookie'),
	FormData = require('form-data'),
	http = require('http'),
	jsdom = require('jsdom'),
	jquery = require('jquery'),
	beautify = require('js-beautify').html;


if( process.env.NODE_ENV == 'dev'){
	//for working with charles proxy
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
	url311 = 'https://localhost:60103/apps/311universalintake/form.htm';
}

var objToFormData = ( obj ) => {
	let data = new FormData();

	Object.keys( obj ).forEach( k => data.append( k, obj[k] ) );
	return data;
};

var startFormData = objToFormData({
	'formFields.X_CHAR1_1': '__No',
	'formFields.Vehicle Type': '__Yellow',
	'formFields.Affidavit': '__Yes',
	'formFields.Hearing': '__Yes',
	'_target1': 'START'
});

var thirdFormData = objToFormData({
	'formFields.Complaint Type' : '1-6VL-135',
	'formFields.Descriptor 1' : '1-6VN-327',
	'formFields.Descriptor 2': '1-6VO-1637',
	'formFields.Taxi Driver Name': '',
	'formFields.Taxi License Number':'',
	'formFields.Taxi Medallion Number':'5J18',
	'formFields.Complaint Details': 'taxi parked in bike lane',
	'formFields.Date/Time of Occurrence':'02/19/2016 09:50:29 AM',
	'_target2':''
});

//todo - create functions that compose fetches and return promises
// create declarative language for speaking with server.
/*
funnction startRequest(){

}
*/

var reqCookie = '';

var processSecondResponse = function( res ){
	console.log(res.status);
	console.log( "second item" );
	console.log( 'done first meaningless form' );
	return res.text();
};

var secondRequest = function(){
	return fetch311( startFormData );
};

var thirdRequest = function(){
	return fetch311( thirdFormData );
};



function sendData(){
	//todo return errors
	newSession()
		.then( setSessionId )
		.then( secondRequest )
		.then( processSecondResponse )
		.then( thirdRequest )
		.then( processSecondResponse )
};

//sendData();

function reporter(){
	var url311 = 'https://www1.nyc.gov/apps/311universalintake/form.htm',
		userAgent= 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.109 Safari/537.36';

	let fetch311 = function( formData, url = url311){
		let config = {
			method: 'post',
			headers: {
				'Cookie': reqCookie,
				'user-agent': userAgent
			}
		};

	//only a convenince for single arg with url call
	if( typeof formData === 'string' ){
		url = formData;
		formData = null;
	}

	if( formData ){
		config.body = formData;
		config.headers['Content-Length'] = formData.getLengthSync();
	}

	return fetch( url, config);
};
	let newSession = function(){
		return fetch311( url311 + '?serviceName=TLC%20Taxi%20Driver%20Unsafe%20Driving%20Non-Passenger')
			.then(setSessionId);
	};

	var setSessionId = function( res ){
		let cookies = res.headers.get('set-cookie'),
			{ JSESSIONID } = cookie.parse(cookies);

		if( res.status != 200 ){ console.log('ERROR'); }

		reqCookie = cookie.serialize('JSESSIONID',JSESSIONID);

		console.log( 'session id:', JSESSIONID );
		res.text().then(function(text){
			console.log('text');
			let document = jsdom.jsdom(text);
			let formId = document.querySelectorAll("#formId");
			console.log( formId.length );
		});

		return res.text();
	}

	return {
		report : function(){
			newSession()
		}
	};
}

reporter().report();
