var reporter = require('./lib/reporter'),
	inquirer = require('inquirer'),
	complaint_info = require('./lib/complaint-dsl.js'),
	config = require('./config.json');

require('source-map-support').install();
/*
inquirer.prompt([
	{'name':'complaint_type',
	'message': 'complaint type',
	'type':'list',
	choices: complaint_info.map( item => item.name )}]).then( answers => 
	console.log(answers));
*/

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
	}, {
		'formFields.Location Type': 'Street',
		'formFields.Address Type': '__Intersection',
		'formFields.Incident Borough 5': '1-2ZP',
		'formFields.On Street':'',
		'formFields.Cross Street 1': '',
		'formFields.Location Details':'',
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

var carserviceData = [{
		'formFields.X_CHAR1_1':'__Within the 5 Boroughs of New York City',
		'formFields.License Type':'1-B3X-3', //Vehicle License Plate
		'formFields.Affidavit': '__Yes',
		'formFields.Hearing': '__Yes',
		'_target1': 'START',
	}, {
		'formFields.Complaint Type' : '1-B3X-15',
		'formFields.Descriptor 1' : '1-B3Y-2', //i have no idea what these fields mean
		'formFields.Descriptor 2': '1-B3Z-6',
		'formFields.Taxi License Number': '',
		'formFields.Vehicle Type' : '1-B3X-7',
		'formFields.Complaint Details': 'cab blocking bike lane',
		'formFields.Date/Time of Occurrence':'06/19/2016 10:02:00 AM',
		'_target2':'',
	},{
		'formFields.Location Type': 'Street',
		'formFields.Address Type': '__Intersection',
		'formFields.Incident Borough 5': '1-2ZR', // bronx - 1-2ZN, brooklyn - 1-2ZP, manhattan - 1-2ZR, queens - 1-2ZT, staten island - 1-2ZV// bronx 1-4X9-313, brooklyn 1-4X9-314, manhattan 1-4X9-316, queens 1-4X9-315, staten island 1-4X9-318
		'formFields.On Street':'Chrystie St',
		'formFields.Cross Street 1': 'Hester  St',
		'formFields.Location Details':'',
		'_target3':'',
	}, {
		...config.contact_info,
		'_target4':''
	}, {
		'replace_target': '',
		'file1': require('fs').createReadStream(''),
		'_finish': 'SUBMIT FORM'
	}
	];

//reporter().report('TLC%20Taxi%20Driver%20Unsafe%20Driving%20Non-Passenger', data).subscribe((val) => console.log('hi'))
//todo - print val, return document.queryElementsById('#sr_number').innerHtml
reporter().report('TLC%20FHV%20Driver%20Unsafe%20Driving', carserviceData).subscribe(() => {})
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
