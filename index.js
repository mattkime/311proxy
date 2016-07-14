var fetch = require('node-fetch'),
	cookie = require('cookie'),
	FormData = require('form-data'),
	http = require('http'),
	jsdom = require('jsdom'),
	Rx = require('rxjs'),
	beautify = require('js-beautify').html;

require('source-map-support').install();

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


/*
function sendData(){
	//todo return errors
	newSession()
		.then( setSessionId )
		.then( secondRequest )
		.then( processSecondResponse )
		.then( thirdRequest )
		.then( processSecondResponse )
};
*/
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
		let promise = fetch311( url311 + '?serviceName=TLC%20Taxi%20Driver%20Unsafe%20Driving%20Non-Passenger');
		return Rx.Observable.fromPromise(promise).flatMap(setSessionId);
	};

	var setSessionId = res => {
		let cookies = res.headers.get('set-cookie'),
			{ JSESSIONID } = cookie.parse(cookies);

		if( res.status != 200 ){ console.log('ERROR'); }

		reqCookie = cookie.serialize('JSESSIONID',JSESSIONID);

		console.log( 'session id:', JSESSIONID );

		return Rx.Observable.fromPromise( res.text() )
			.map(function(value){
				//nextPage
				let document = jsdom.jsdom( value ),
					formId = document.querySelectorAll("#formId"),
					formIdExists = formId.length === 1,
					nextPage = document.querySelectorAll("#nextPage"),
					nextPageExists = false;

				if( nextPage
					&& nextPage.length === 1
					&& nextPage[0].getAttribute("name") === "_target1" ){
						nextPageExists = true;
				}
				console.log("formId present:", formId.length === 1 );
				console.log("#nextPage:", nextPage[0].getAttribute("name"));
				return formIdExists && nextPageExists ? JSESSIONID : null;
			});
	};

	return {
		sessionId : 12345,
		page : 0,
		sendData : function(data){
			return Rx.Observable.create(function(ob){
				var i = 0;
				var getUrl = function(url){
					//todo set url, convert to formdata....set cookie?
					return Rx.Observable.fromPromise( fetch(url))
						.flatMap(function(res){
							return Rx.Observable.fromPromise(res.text())
						})
					};

				var sub = getUrl(data[i++]);
				sub.subscribe(subscribe);

				function subscribe(x) {
						console.log('Next: ' + x.length);
						ob.onNext(x);
						if(i < urls.length){
						  getUrl(urls[i++]).subscribe(subscribe);
						}else{
						  ob.onCompleted();
						}
				}
			});
		},
		getSession : function(){
			return Rx.Observable.create(function (ob) {
				let that = this;
					//this should set sessionId or return error. no need to return value
					//observ = newSession.call(this)
					newSession.call(this)
						.map( val => {
							this.sessionId = val;
							return val;
						}).subscribe(function(val){
							let data$ = Rx.Observable.create(function (ob) {
								data.forEach(function(item){

								});

							})
							console.log("inner subscribe");
							console.log(val);
							ob.next( val );
							ob.complete();
						});
				//return observ;
			});
		},
		report : function(data){
			var sendData = this.sendData;
			return this.getSession().flatMap(() => sendData(data));
		}
	};
}

var data = [{
		'formFields.X_CHAR1_1': '__No',
		'formFields.Vehicle Type': '__Yellow',
		'formFields.Affidavit': '__Yes',
		'formFields.Hearing': '__Yes',
		'_target1': 'START',
	}, {
		'formFields.Complaint Type' : '1-6VL-135',
		'formFields.Descriptor 1' : '1-6VN-327',
		'formFields.Descriptor 2': '1-6VO-1637',
		'formFields.Taxi Driver Name': '',
		'formFields.Taxi License Number':'',
		'formFields.Taxi Medallion Number':'5J18',
		'formFields.Complaint Details': 'taxi parked in bike lane',
		'formFields.Date/Time of Occurrence':'02/19/2016 09:50:29 AM',
		'_target2':'',
	}, {
		'formFields.Location Type': 'Street',
		'formFields.Address Type': '__Intersection',
		'formFields.Incident Borough 5': '1-2ZP',
		'formFields.On Street':'Bedford Ave',
		'formFields.Cross Street 1': 'Willoughby Ave',
		'formFields.Location Details':'just north of intersection',
		'_target3':'',
	}, {
		'formFields.Personal Email Address' : '',
		'formFields.Contact First Name' :'',
		'formFields.Contact Last Name' :'',
		'formFields.Contact Business Phone': '',
		'formFields.Contact Borough':'1-4X9-314',
		'formFields.Contact Address Number': '',
		'formFields.Contact Street Name':'',
		'formFields.Contact Apartment Number':'',
		'_target4':''
	}
	];

reporter().report(data).subscribe((val) => console.log(val))
