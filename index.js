var reporter = require('./lib/reporter'),
	inquirer = require('inquirer'),
	complaint_info = require('./lib/complaint-dsl.js');

require('source-map-support').install();

inquirer.prompt([
	{'name':'complaint_type',
	'message': 'complaint type',
	'type':'list',
	choices: complaint_info.map( item => item.name )}]).then( answers => 
	console.log(answers));

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
	}, /*{
		'formFields.Personal Email Address' : '',
		'formFields.Contact First Name' :'',
		'formFields.Contact Last Name' :'',
		'formFields.Contact Business Phone': '',
		'formFields.Contact Borough':'1-4X9-314',
		'formFields.Contact Address Number': '',
		'formFields.Contact Street Name':'',
		'formFields.Contact Apartment Number':'',
		'_target4':''
	} */
	];

//reporter().report('TLC%20Taxi%20Driver%20Unsafe%20Driving%20Non-Passenger', data).subscribe((val) => console.log('hi'))
//
var data = [{
	'_target1' : 'START'
	}, {
		'formFields.Complaint Type': '1-6VL-207',
		'formFields.Descriptor 1': '1-6VN-6', //from dropdown
		'formFields.Complaint Details': 'pickup truck parked in \'never park here\' zone in front of rei on lafayette st',
		'formFields.Date/Time of Occurrence': '06/30/2016 09:36:12 AM',
		'formFields.ATTRIB_46': 'this is a daily problem',
		'_target2':''
	}, {
		'formFields.Location Type': '1-6VO-1630',
		'formFields.Address Type': '__Street',
		'formFields.Incident Borough 6': '1-4X9-316',
		'formFields.Incident Address Number': '303',
		'formFields.Incident Street Name': 'Lafayette St',
		'formFields.Location Details': '',
		'_target3': ''
	}, {
		'formFields.Personal Email Address': 'matt@mattki.me',
		'formFields.Contact First Name': 'Matt',
		'formFields.Contact Last Name': 'Kime',
		'formFields.Contact Business Phone': '616-666-6561',
		'formFields.Contact Home Phone': '616-666-6561',
		'formFields.Contact Borough': '1-4X9-314',
		'formFields.Contact Address Number': '167',
		'formFields.Contact Street Name': 'Quincy St.',
		'formFields.Contact Apartment Number': '2',
		'_target4' : ''
	}, {
		'replace_target': '',
		'_finish': 'SUBMIT FORM'
	}
	];

//reporter().report('NYPD+Parking', data).subscribe((val) => console.log('hi'))
