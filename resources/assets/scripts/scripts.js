var loaded;
jQuery(document).ready(function($) {

	(new Image()).src = '/img/loading.gif';
	$('.dropdown-toggle').dropdown();

	$.ajaxSetup({ headers: {
		'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
		'Authorization': 'Bearer ' + $('meta[name="jwt-token"]').attr('content')
	}});

	$(document).on('click', '#my_entries_tab', function(){ if (!$(this).parent().hasClass('active')) getMyEntries(); });
	$(document).on('click', '#all_entries_tab', function(){ if (!$(this).parent().hasClass('active')) getAllEntries(); });
	$(document).on('click', '#users_tab', function(){ if (!$(this).parent().hasClass('active')) getUsers(); });

	$(document).on('submit', '#addNewEntryForm', function(event) {
		event.preventDefault();
		$.post($(this).attr('action'), $(this).serialize())
			.done(function(data) {
				if (data.errors) {
					$('#newEntryModal .errors').empty();
					$.each(data.errors, function(k, v) {
						$('#newEntryModal .errors').append('<p class="bg-danger">' + v + '</p>');
					});
					$('#newEntryModal .errors').show();
				} else {
					$('#newEntryModal .errors').hide();
					$('#newEntryForm').trigger('reset');
					$('#newEntryModal').modal('hide');
					getMyEntries();
				}
			});
	});

	$(document).on('click', '.btn-delete-entry', function(event) {
		event.preventDefault();
		var button = $(this);
		bootbox.confirm("Are you sure?", function(result) {
			if (result == true) {
				button.parent().parent().addClass('danger');
				$.ajax({
					url: '/api/v1/expenses/' + button.attr('data-id'),
					type: 'DELETE',
					success: function (result) {
						button.parent().parent().remove();
					}
				});
			}
		});
	});

	$(document).on('click', '#logout_link', function(event) {
		event.preventDefault();
		$.get('/logout', function(data) {
			bootbox.alert('You are logged out.', function() {

			});
		});
	});

	$(document).on('click', '#login_link', function(event) {
		event.preventDefault();
		showLoading();
		$.get('/login', function (data) {
			hideLoading();
			$('#content').html(data);
		});
	});

	$(document).on('click', '#register_link', function(event) {
		event.preventDefault();
		showLoading();
		$.get('/register', function (data) {
			hideLoading();
			$('#content').html(data);
		});
	});

	$(document).on('submit', '#login_form', function(event) {
		var form = $(this);
		var formData = form.serialize();
		event.preventDefault();
		showLoading();
		$.ajax({
			type: "POST",
			url: form.attr('action'),
			data: formData,
			success: function(data) {
				$('head').append('<meta name="jwt-token" content="' + data + '">');
				$.ajaxSetup({ headers: {
					'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
					'Authorization': 'Bearer ' + data
				}});
				$.get('/app', function(data){
					$('body').html(data);
					logged = true;
					appInit();
				});
			},
			error: function(data) {
				hideLoading();
				$('input[name=email]').addClass('btn-danger');
				$('input[name=password]').addClass('btn-danger');
			}
		});
	});

	$(document).on('submit', '#register_form', function(event) {
		var form = $(this);
		var formData = form.serialize();
		event.preventDefault();
		showLoading();
		$.ajax({
			type: "POST",
			url: form.attr('action'),
			data: formData,
			error: function(data) {
				hideLoading();
				if (data.responseJSON.error) {
					$('#register_form .errors').show();
					$('#register_form .errors .alert-text').html(data.responseJSON.error)
				}
			},
			success: function(data){
				$.get('/', function(data){
					$('body').html(data);
				});
			}
		});
	});

	function showMyEntriesButtons() {
		$('.header-buttons').hide();
		$('#my-entry-buttons').show();
	}
	function showAllEntriesButtons() {
		$('.header-buttons').hide();
		$('#all-entry-buttons').show();
	}
	function showUsersButtons() {
		console.log('showUsersButtons()');
	}

	function getMyEntries(date) {
		date_url = '';
		$('.filter-date').removeClass('btn-success').addClass('btn-primary');
		if (typeof date !== 'undefined' && date[0] != date[1]) {
			date_url = '?from=' + date[0] + '&to=' + date[1];
			$('.filter-date-my-entries').removeClass('btn-primary').addClass('btn-success');
		} else if (typeof date !== 'undefined') {
			return false;
		}
		$('#main-nav li').removeClass('active');
		$('#my_entries_tab').parent().addClass('active');
		$('.content-table').hide();
		$('#ajax-loading').show();
		$.get('/api/v1/expenses/my' + date_url, function(data) {
			$('#ajax-loading').hide();
			showMyEntriesButtons();
			$('#table-my-entries tbody').empty();
			$('#table-my-entries').show();
			$.each(data, function(index, v) {
				comment = v.comment ? ' <button type="button" ' +
				'data-balloon="' + escapeHtml(v.comment) + '" ' +
				'data-balloon-pos="up" ' +
				'data-balloon-length="xlarge" ' +
				'class="btn btn-default btn-xs btn-cursor-info">' +
				'<i class="fa fa-info" aria-hidden="true"></i>' +
				'</button>':'';
				$('#table-my-entries tbody').append(
					'<tr data-id="' + v.id + '">' +
					'<td data-dateformat="YYYY-MM-DD">' + v.date + '</td>' +
					'<td>' + v.time.replace(/(:\d{2}| [AP]M)$/, "") + '</td>' +
					'<td data-value="' + v.amount.toFixed(2) + '"> ' + v.amount.toFixed(2) + ' &euro;</td>' +
					'<td>' + v.description + comment + '</td>' +
					'<td>' +
					'<button type="button" class="btn btn-default btn-edit-entry btn-xs" data-id="' + v.id + '">Edit</button>' +
					'<button type="button" class="btn btn-danger btn-xs btn-delete-entry" data-id="' + v.id + '">Delete</button>' +
					'</td>' +
					'</tr>');
			});
			$.bootstrapSortable(false);
		});
	}

	function getAllEntries(date) {
		date_url = '';
		$('.filter-date').removeClass('btn-success').addClass('btn-primary');
		if (typeof date !== 'undefined' && date[0] != date[1]) {
			date_url = '?from=' + date[0] + '&to=' + date[1];
			$('.filter-date-my-entries').removeClass('btn-primary').addClass('btn-success');
		} else if (typeof date !== 'undefined') {
			return false;
		}
		$('#main-nav li').removeClass('active');
		$('#all_entries_tab').parent().addClass('active');
		$('.content-table').hide();
		$('#ajax-loading').show();
		$.get('/api/v1/expenses/all' + date_url, function(data) {
			$('#ajax-loading').hide();
			$('#table-all-entries tbody').empty();
			showAllEntriesButtons();
			$('#table-all-entries').show();
			$.each(data, function(index, v) {
				user_balloon = '<button type="button"' +
					'data-balloon="User: ' + v.user_name + '" ' +
					'data-balloon-pos="right" ' +
					'class="btn btn-default btn-xs btn-user-info">' +
					'<i class="fa fa-user" aria-hidden="true"></i> : ' + v.user_id +
					'</button>';
				comment = v.comment ? ' <button type="button" ' +
				'data-balloon="' + escapeHtml(v.comment) + '" ' +
				'data-balloon-pos="up" ' +
				'data-balloon-length="xlarge" ' +
				'class="btn btn-default btn-xs btn-cursor-info">' +
				'<i class="fa fa-info" aria-hidden="true"></i>' +
				'</button>':'';
				$('#table-all-entries tbody').append(
					'<tr data-id="' + v.id + '">' +
					'<td data-value="' + v.user_id + '">' + user_balloon + '</td>' +
					'<td data-dateformat="YYYY-MM-DD">' + v.date + '</td>' +
					'<td>' + v.time.replace(/(:\d{2}| [AP]M)$/, "") + '</td>' +
					'<td data-value="' + v.amount.toFixed(2) + '">' + v.amount.toFixed(2) + ' &euro;</td>' +
					'<td>' + v.description + comment + '</td>' +
					'<td>' +
					'<button type="button" class="btn btn-default btn-edit-entry btn-xs" data-id="' + v.id + '">Edit</button>' +
					'<button type="button" class="btn btn-danger btn-xs btn-delete-entry" data-id="' + v.id + '">Delete</button>' +
					'</td>' +
					'</tr>');
			});
			$.bootstrapSortable(false);
		});
	}

	function getUsers() {
		console.log('getUsers()');
		showUsersButtons();
	}

	function showLoading() {
		$('.container').css('opacity', '0.3');
		$('body').append('<div id="login_loading"><img src="/img/loading.gif" alt="Loading..."></div>');
	}

	function hideLoading() {
		$('.container').css('opacity', '1');
		$('#login_loading').remove();
	}

	function appInit() {
		console.log(logged);
		if (window.location.hash == '#my_entries_tab') { getMyEntries(); }
		else if (window.location.hash == '#all_entries_tab') { getAllEntries(); }
		else if (window.location.hash == '#users_tab') { getUsers(); }
		else if (logged == true) { getMyEntries(); }

		$('.filter-date-my-entries').pickmeup({
			format : 'Y-m-d',
			mode : 'range',
			position : 'left',
			hide_on_select : true,
			separator : ':',
			change : function(date){
				getMyEntries(date);
			}
		});

		$('.filter-date-all-entries').pickmeup({
			format : 'Y-m-d',
			mode : 'range',
			position : 'left',
			hide_on_select : true,
			separator : ':',
			change : function(date){
				getAllEntries(date);
			}
		});
	}
	appInit();
});

var entityMap = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': '&quot;', "'": '&#39;', "/": '&#x2F;' };
function escapeHtml(string) {
	return String(string).replace(/[&<>"'\/]/g, function (s) {
		return entityMap[s];
	});
}