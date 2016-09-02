var reporter = require('./lib/reporter'),
	prompt = require('./lib/prompt'),
	complaint_info = require('./lib/complaint-dsl.js'),
	config = require('./config.json');

require('source-map-support').install();


/*
var yelowData = [{
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
		'formFields.Taxi Medallion Number':'',
		'formFields.Complaint Details': '',
		'formFields.Date/Time of Occurrence':'',
		'_target2':'',
	}
	];
*/
var formatComplaintTypeYellow = function( fields ){
	console.log('start formatComplaintTypeYellow');
	return {
		'formFields.X_CHAR1_1': '__No',
		'formFields.Vehicle Type': '__Yellow',
		'formFields.Affidavit': '__Yes',
		'formFields.Hearing': '__Yes',
		'_target1': 'START',
	};
};

var formatComplaintTypeCarService = function( fields ){
	console.log('start formatComplaintTypeCarService');
	return {
		'formFields.X_CHAR1_1':'__Within the 5 Boroughs of New York City',
		'formFields.License Type':'1-B3X-3', //Vehicle License Plate
		'formFields.Affidavit': '__Yes',
		'formFields.Hearing': '__Yes',
		'_target1': 'START',
	};
};

var formatComplaintDetailsYellow = function( fields ){
	console.log( 'formatComplaintDetailsYellow' );
	var obj = {
		'formFields.Complaint Type' : '1-6VL-135',
		'formFields.Descriptor 1' : '1-6VN-327', //i have no idea what these fields mean
		'formFields.Descriptor 2': '1-6VO-1637',
		'formFields.Taxi Medallion Number': fields.medallion,
		'formFields.Complaint Details': fields.complaint,
		'formFields.Date/Time of Occurrence': fields.date_time,
		'_target2':'',
	};

	if( fields.photo ){ obj['formFields.Complaint Details'] += " - photo attached"; }

	return obj;
};

var formatComplaintDetailsCarService = function( fields ){
	console.log( 'formatComplaintDetailsCarService');
	var obj = {
		'formFields.Complaint Type' : '1-B3X-15',
		'formFields.Descriptor 1' : '1-B3Y-2', //i have no idea what these fields mean
		'formFields.Descriptor 2': '1-B3Z-6',
		'formFields.Taxi License Number': fields.plate,
		'formFields.Vehicle Type' : '1-B3X-7',
		'formFields.Complaint Details': fields.complaint,
		'formFields.Date/Time of Occurrence': fields.date_time,
		'_target2':'',
	};

	if( fields.photo ){ obj['formFields.Complaint Details'] += " - photo attached"; }

	return obj;
};

var formatComplaintLocation = function( fields ){
	console.log( 'formatComplaintLocation');
	return {
		'formFields.Location Type': 'Street',
		'formFields.Address Type': '__Intersection',
		'formFields.Incident Borough 5': fields.borough,
		'formFields.On Street': fields.on_street,
		'formFields.Cross Street 1': fields.cross_street,
		'formFields.Location Details': fields.location_details,
		'_target3':'',
	};
};

var formatComplaintPhoto = function( fields ){
	var obj =  {
		'replace_target': '',
		'_finish': 'SUBMIT FORM'
	};

	if( fields.photo ){
		obj.file1 = require('fs').createReadStream( fields.photo );
	}

	if( fields.photo_2 ){
		obj.file2 = require('fs').createReadStream( fields.photo_2 );
	}

	if( fields.photo_3 ){
		obj.file3 = require('fs').createReadStream( fields.photo_3 );
	}

	return obj;
};

var formatTaxiComplaint = function( fields ){
	console.log('formatTaxiComplaint');
	let complaintData = [];

	if( fields.vehicle_type = "__Yellow" ){
		complaintData.push( formatComplaintTypeYellow() );
		complaintData.push( formatComplaintDetailsYellow( fields ));
	} else {
		complaintData.push( formatComplaintTypeCarService() );
		complaintData.push( formatComplaintDetailsCarService( fields ));
	}

	Array.prototype.push.apply( complaintData, [
		formatComplaintLocation( fields ),
		{
			...config.contact_info,
			'_target4':''
		},
		formatComplaintPhoto( fields )
	]);
	return complaintData;
};

prompt().then( answers => {
	let url_bit = answers.vehicle_type == '__Yellow' ? 'TLC%20Taxi%20Driver%20Unsafe%20Driving%20Non-Passenger' : 'TLC%20FHV%20Driver%20Unsafe%20Driving';
	console.log('then', answers);
	console.log( formatTaxiComplaint( answers) );
	reporter().report( url_bit, formatTaxiComplaint( answers) ).subscribe(() => {})
});

//reporter().report('TLC%20Taxi%20Driver%20Unsafe%20Driving%20Non-Passenger', data).subscribe((val) => console.log('hi'))
//todo - print val, return document.queryElementsById('#sr_number').innerHtml
//
var data = [{
	'_target1' : 'START'
	}, {
		'formFields.Complaint Type': '1-6VL-207',
		'formFields.Descriptor 1': '1-6VN-6', //from dropdown
		'formFields.Complaint Details': '',
		'formFields.Date/Time of Occurrence': '07/15/2016 09:36:12 AM',
		'formFields.ATTRIB_46': '',
		'_target2':''
	}, {
		'formFields.Location Type': '1-6VO-1630',
		'formFields.Address Type': '__Street',
		'formFields.Incident Borough 6': '1-4X9-316',
		'formFields.Incident Address Number': '',
		'formFields.Incident Street Name': '',
		'formFields.Location Details': '',
		'_target3': ''
	}, {
		'formFields.Personal Email Address': '',
		'formFields.Contact First Name': '',
		'formFields.Contact Last Name': '',
		'formFields.Contact Business Phone': '',
		'formFields.Contact Home Phone': '',
		'formFields.Contact Borough': '1-4X9-314',
		'formFields.Contact Address Number': '',
		'formFields.Contact Street Name': '',
		'formFields.Contact Apartment Number': '',
		'_target4' : ''
	}, {
		'replace_target': '',
		'_finish': 'SUBMIT FORM'
	}
	];

//reporter().report('NYPD+Parking', data).subscribe((val) => console.log('hi'))
