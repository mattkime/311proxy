var fetch = require('node-fetch'),
	cookie = require('cookie'),
	FormData = require('form-data'),
	http = require('http');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

//var url311 = 'https://www1.nyc.gov/apps/311universalintake/form.htm'
//this is for working with charles proxy
var url311 = 'https://localhost:60103/apps/311universalintake/form.htm'

fetch( url311 + '?serviceName=TLC%20Taxi%20Driver%20Unsafe%20Driving%20Non-Passenger')
	.then( res => {
		console.log(res);
		console.log(res.status);
		var cookies = res.headers.get('set-cookie'),
			{ JSESSIONID } = cookie.parse(cookies);

		if( res.status != 200 ){ console.log('ERROR'); }

		var formData = new FormData();
		formData.append('formFields.X_CHAR1_1','__No');
		formData.append('formFields.Vehicle Type','__Yellow');
		formData.append('formFields.Affidavit','__Yes');
		formData.append('formFields.Hearing','__Yes');
		formData.append('_target1','START');

		var reqCookie = cookie.serialize('JSESSIONID',JSESSIONID);

		fetch( url311, {
			method: 'post',
			headers: {
				'Cookie': reqCookie,
				'Content-Length' : formData.getLengthSync(),
				'user-agent' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.109 Safari/537.36'
			},
			body : formData
		}).then( res => {
			console.log(res.status);
			res.text().then( body => {
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
		});



		console.log( JSESSIONID );


		return res.text()
	} )
	//.then( body => console.log(body) );
