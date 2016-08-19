var reporter = require('./lib/reporter'),
	inquirer = require('inquirer'),
	complaint_info = require('./lib/complaint-dsl.js'),
	config = require('./config.json');

require('source-map-support').install();

inquirer.prompt([
	{'name':'plate',
	'message': 'license plate'},
	{'name':'complaint',
	'message':'complaint'},
	{'name':'date_time',
	'message':'Incident date/time (07/15/2016 09:36:12 AM)'},
	//{'name':'location_type',
	//'message':'location type'},
	{'name':'borough',
	'type':'list',
	'choices':['bronx', 'brooklyn', 'manhattan', 'queens', 'staten island'],
	'message':'borough',
	'filter': str => {
		let val = '';
		switch( str ){
			case 'bronx':
				val = '1-2ZN';
				break;
			case 'brooklyn':
				val = '1-2ZP';
				break;
			case 'manhattan':
				val = '1-2ZR';
				break;
			case 'queens':
				val = '1-2ZT';
				break;
			case 'staten island':
				val = '1-2ZV';
				break;
		}

		return val;
	}},
	{'name':'on_street',
	'message':'on street'},
	{'name':'cross_street',
	'message':'cross street'},
	{'name':'location_details',
	'message':'location details'},
	{'name':'photo',
	'message':'photo',
	'filter': str => str.replace(/\\ /g," ").trim()},
	{'name':'photo_2',
	'message':'photo 2',
	'filter': str => str.replace(/\\ /g," ").trim(),
	'when': function( obj ){ return !!obj.photo }},
	{'name':'photo_3',
	'message':'photo 3',
	'filter': str => str.replace(/\\ /g," ").trim(),
	'when': function( obj ){ return !!obj.photo_2 }}]).then( answers => {
		console.log(answers);
		console.log( formatTaxiComplaint( answers) );
		reporter().report('TLC%20FHV%20Driver%20Unsafe%20Driving', formatTaxiComplaint( answers) ).subscribe(() => {})
	});

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

var formatComplaintType = function( fields ){
	console.log('start formatComplaintType');
	return {
		'formFields.X_CHAR1_1':'__Within the 5 Boroughs of New York City',
		'formFields.License Type':'1-B3X-3', //Vehicle License Plate
		'formFields.Affidavit': '__Yes',
		'formFields.Hearing': '__Yes',
		'_target1': 'START',
	};
};

var formatComplaintDetails = function( fields ){
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
	var carserviceData = [
		formatComplaintType(),
		formatComplaintDetails( fields ),
		formatComplaintLocation( fields ),
		{
			...config.contact_info,
			'_target4':''
		},
		formatComplaintPhoto( fields )
	];
	return carserviceData
};

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
