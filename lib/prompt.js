const inquirer = require('inquirer');

const vehicle_type = {
	'name':'vehicle_type',
	'message':'vehicle type',
	'type':'list',
	'choices':['Yellow Taxi','Car Service / Green Taxi'],
	'filter': str => {
		let val = '';
		switch( str ){
			case 'Yellow Taxi':
				val = '__Yellow';
				break;
			case 'Car Service / Green Taxi':
				val = '__Service';
				break;
		}
		return val;
	}
};

const plate = {
	'name':'plate',
	'message': 'license plate',
	'when' : obj => obj.vehicle_type != '__Yellow'
};

const medallion = {
	'name':'medallion',
	'message': 'medallion #',
	'when' : obj => obj.vehicle_type == '__Yellow'
};

const complaint = {
	'name':'complaint',
	'message': 'complaint',
};

const date_time = {
	'name':'date_time',
	'message':'Incident date/time (07/15/2016 09:36:12 AM)'
};

const location_type = {
	'name':'location_type',
	'message':'location type'
};

const borough = {
	'name':'borough',
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
	}
};

const on_street ={
	'name':'on_street',
	'message':'on street'
};

const cross_street = {
	'name':'cross_street',
	'message':'cross street'
};

const location_details = {
	'name':'location_details',
	'message':'location details'
};

const photo = {
	'name':'photo',
	'message':'photo',
	'filter': str => str.replace(/\\ /g," ").trim()
};

const photo_2 = {
	'name':'photo_2',
	'message':'photo 2',
	'filter': str => str.replace(/\\ /g," ").trim(),
	'when': function( obj ){ return !!obj.photo }
};

const photo_3 = {
	'name':'photo_3',
	'message':'photo 3',
	'filter': str => str.replace(/\\ /g," ").trim(),
	'when': function( obj ){ return !!obj.photo_2 }
};


module.exports = () =>
	inquirer.prompt([
		vehicle_type,
		medallion,
		plate,
		complaint,
		date_time,
		borough,
		on_street,
		cross_street,
		location_details,
		photo,
		photo_2,
		photo_3
	]);
