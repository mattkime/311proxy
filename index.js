var fetch = require('node-fetch'),
	cookie = require('cookie'),
	FormData = require('form-data'),
	http = require('http');

//also charles proxy
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

//var url311 = 'https://www1.nyc.gov/apps/311universalintake/form.htm'
//this is for working with charles proxy
var url311 = 'https://localhost:60103/apps/311universalintake/form.htm',
	userAgent= 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.109 Safari/537.36';

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

//todo - create functions that compose fetches and return promises
// create declarative language for speaking with server.
/*
funnction startRequest(){

}
*/

var reqCookie = '';

var processSecondResponse = function( res ){
	console.log(res.status);
	res.text().then( body => {
		console.log( "second item" );
		//console.log( body );
		console.log( 'done first meaningless form' );
		/*
		fetch( url311, {
			method: 'post',
			headers: {
				'Cookie': reqCookie,
			}
		});
		*/
	})
};

var secondRequest = function(){
	fetch( url311, {
		method: 'post',
		headers: {
			'Cookie': reqCookie,
			'Content-Length' : startFormData.getLengthSync(),
			userAgent
		},
		body : startFormData
	}).then( processSecondResponse );
};

fetch( url311 + '?serviceName=TLC%20Taxi%20Driver%20Unsafe%20Driving%20Non-Passenger')
	.then( res => {
		console.log(res.status);
		var cookies = res.headers.get('set-cookie'),
			{ JSESSIONID } = cookie.parse(cookies);

		if( res.status != 200 ){ console.log('ERROR'); }

		reqCookie = cookie.serialize('JSESSIONID',JSESSIONID);
		secondRequest();

		console.log( JSESSIONID );

		return res.text()
	});
