module.exports = [{
	'name': 'Illegal Parking',
	'serviceName': 'NYPD+Parking',
	'fields': [[
		{ 'name': '_target',
		'value': 'START',
		'type': 'prefilled'
		} ],[ {
			'name': 'formFields.Complaint Type',
			'value': '1-6VL-207',
			'type': 'prefilled'
		}, {
			'name':'formFields.Descriptor 1',
			'type':'list',
			'choices': [
			{ value:"1-6VN-316", text:"Blocked Hydrant"},
			{ value:"1-6VN-317", text:"Blocked Sidewalk"},
			{ value:"1-6VN-370", text:"Commercial Overnight Parking"},
			{ value:"1-6VN-372", text:"Detached Trailer"},
			{ value:"1-6VN-373", text:"Double Parked Blocking Traffic"},
			{ value:"1-6VN-374", text:"Double Parked Blocking Vehicle"},
			{ value:"1-6VN-28", text:"Overnight Commercial Storage"},
			{ value:"1-6VN-6", text:"Posted Parking Sign Violation"},
			{ value:"1-6VN-3", text:" Unauthorized Bus Layover"}, 
		]
		}
		]
		]
}, {
	'name': 'Cab complaint',
	'serviceName': 'TLC%20Taxi%20Driver%20Unsafe%20Driving%20Non-Passenger'
}]

var data = [{
	'_target1' : 'START'
	}, {
		'formFields.Complaint Type': '1-6VL-207',
		'formFields.Descriptor 1': '1-6VN-6', //from dropdown
		'formFields.Complaint Details': '',
		'formFields.Date/Time of Occurrence': '07/15/2016 09:36:12 AM', // dateformat( new Date(), 'mm/dd/yyyy hh:mm:ss TT')
		'formFields.ATTRIB_46': '',
		'_target2':''
	}, {
		'formFields.Location Type': '1-6VO-1630',
		'formFields.Address Type': '__Street',
		'formFields.Incident Borough 6': '1-4X9-316', //todo - which dropdowns?
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

//todo - Descriptor from dropdown
