var fetch = require('node-fetch'),
	cookie = require('cookie');

fetch('https://www1.nyc.gov/apps/311universalintake/form.htm?serviceName=TLC%20Taxi%20Driver%20Unsafe%20Driving%20Non-Passenger')
	.then( res => { console.log(res.status);
		var cookies = res.headers.get('set-cookie'),
			{ JSESSIONID } = cookie.parse(cookies);

		console.log( JSESSIONID );
		//console.log(res.headers.get('set-cookie'));
		return res.text()
	} )
	//.then( body => console.log(body) );
