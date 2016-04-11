jQuery(document).ready(function($){
	console.log('Hello from jQuery!');

	$.ajaxSetup({ headers: {
		'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
		'Authorization': 'Bearer ' + $('meta[name="jwt-token"]').attr('content')
	}});
});