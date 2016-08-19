var fetch = require('node-fetch'),
	cookie = require('cookie'),
	FormData = require('form-data'),
	http = require('http'),
	jsdom = require('jsdom'),
	Rx = require('rxjs'),
	beautify = require('js-beautify').html;

var objToFormData = ( obj ) => {
	let data = new FormData();

	Object.keys( obj ).forEach( k => data.append( k, obj[k] ) );
	return data;
};

var reqCookie = '';

module.exports = function(){

if( process.env.NODE_ENV == 'dev'){
	//for working with charles proxy
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
	url311 = 'https://localhost:60103/apps/311universalintake/form.htm';
}
	var url311 = 'https://www1.nyc.gov/apps/311universalintake/form.htm',
		userAgent= 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.109 Safari/537.36';

	let formSubmit = function(formData, url){
		return Rx.Observable.create(function(ob){
			let config = {
				host: 'www1.nyc.gov',
				path: '/apps/311universalintake/form.htm',
				protocol: 'https:',
				headers: {
					'Cookie': reqCookie,
					'user-agent': userAgent
				}
			};

			objToFormData( formData ).submit( config, (err, res) => {
				if( err ){
					ob.error( err );
				} else {
					let body = '';
					res.on('data', chunk => body += chunk );
					res.on('end', () => {
						ob.next(body);
						ob.complete();
					});
				}
			});
		});
	};

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
		//config.headers['Content-Length'] = formData.getLengthSync();
	}

	console.log( url );
	console.log( config );
	return fetch( url, config);
};
	let initialRequest = function(serviceName){
		let promise = fetch311( url311 + `?serviceName=${serviceName}`);
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
		postData : function(data){
		let justTheForm =  function( text ){
			let document = jsdom.jsdom( text ),
				formId = document.querySelectorAll("table[width=\"900\"]:not([class=\"outer_table\"])"),
				formHtml;

				if( formId.length ){
					formHtml = formId[0].outerHTML;
				} else {
					formHtml = text;
				}

				return require('js-beautify').html( formHtml.replace(/\n/g, ""), { "preserve_newlines": true, "indent_size": 0 } );
			};
		let justTheSrNumber =  function( text ){
			let document = jsdom.jsdom( text ),
				formId = document.getElementById("sr_number"),
				formHtml;

				if( formId ){
					formHtml = formId.innerHTML;
				} else {
					formHtml = text;
				}

				return formHtml;
			};
			return Rx.Observable.create(function(ob){
				var i = 0;
				var getUrl = function(data, last){
					//todo set url, convert to formdata....set cookie?
					return formSubmit( data, url311 )
						.do( () => console.log("\n\n\nPage:", i) )
						.do( val => console.log( justTheForm(val).replace(/\n/g, "")) )
						.do( val => { if( last){ console.log( justTheSrNumber(val).trim() ) }});
					};

				var sub = getUrl(data[i++], i === data.length);
				sub.subscribe(subscribe);

				function subscribe(x) {
						ob.next(x);
						if(i < data.length){
						  getUrl(data[i++], i === data.length).subscribe(subscribe);
						}else{
						  ob.complete();
						}
				}
			});
		},
		getSession : function(serviceName){
			return Rx.Observable.create(function (ob) {
				//this should set sessionId or return error. no need to return value
				initialRequest.call(this, serviceName)
					.map( val => {
						this.sessionId = val;
						return val;
					}).subscribe(function(val){
						let data$ = Rx.Observable.create(function (ob) {
							data.forEach(function(item){

							});

						})
						ob.next( val ); //todo - remove
						ob.complete();
					});
			});
		},
		report : function( serviceName, data ){
			var postData = this.postData;
			return this.getSession(serviceName).flatMap(() => postData(data));
		}
	};
}
