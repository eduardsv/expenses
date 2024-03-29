var loaded;
jQuery(document).ready(function($) {

	var entries = new Array();
	var users = new Array();
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

	$(document).on('submit', '#addNewUserForm', function(event) {
		event.preventDefault();
		$.post($(this).attr('action'), $(this).serialize())
			.done(function(data) {
				if (data.errors) {
					$('#newUserModal .errors').empty();
					$.each(data.errors, function(k, v) {
						$('#newUserModal .errors').append('<p class="bg-danger">' + v + '</p>');
					});
					$('#newUserModal .errors').show();
				} else {
					$('#newUserModal .errors').hide();
					$('#newUserForm').trigger('reset');
					$('#newUserModal').modal('hide');
					getUsers();
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

	$(document).on('click', '.btn-delete-user', function(event) {
		event.preventDefault();
		var button = $(this);
		bootbox.confirm("Are you sure?", function(result) {
			if (result == true) {
				button.parent().parent().addClass('danger');
				$.ajax({
					url: '/api/v1/users/' + button.attr('data-id'),
					type: 'DELETE',
					success: function (result) {
						button.parent().parent().remove();
					}
				});
			}
		});
	});

	$(document).on('click', '.btn-weekly-report', function() {
		var button = $(this);
		$.get('/api/v1/expenses/report', function(data) {
			$('#reportModal .modal-body').empty();
			$.each(data, function(index, v) {
				if (!$('#reportModal .modal-body .year-' + v.year).length) {
					$('#reportModal .modal-body').append('<fieldset class="year-' + v.year + '">' +
						'<legend>Year: ' + v.year + '</legend>' +
						'Week: ' + v.week + ' (' + v.week_start + ' - ' + v.week_end + ')' +
						' --- SUM: ' + v.sum.toFixed(2) + ' AVG: ' + v.avg.toFixed(2) +
						'</fieldset>')
				} else {
					$('#reportModal .modal-body .year-' + v.year).append('<br>' +
						'Week: ' + v.week + ' (' + v.week_start + ' - ' + v.week_end + ')' +
						' --- SUM: ' + v.sum.toFixed(2) + ' AVG: ' + v.avg.toFixed(2));
				}
			});
		});
		$('#reportModal').modal('show');
	});

	$(document).on('click', '.btn-edit-entry', function() {
		var button = $(this);
		entry_id = button.parent().parent().attr('data-id');
		entry_data = entries[entry_id];
		// change form action //
		$('#editEntryForm').attr('action', '/api/v1/expenses/' + entry_id);
		$('#editEntryModal').modal('show');
		$('#editEntryForm select[name=user_id]').val(entry_data.user_id);
		$('#editEntryForm input[name=entry_id]').val(entry_id);
		$('#editEntryForm #dateInput').val(entry_data.date);
		$('#editEntryForm #timeInput').val(entry_data.time);
		$('#editEntryForm #amountInput').val(entry_data.amount.toFixed(2));
		$('#editEntryForm #descriptionInput').val(entry_data.description);
		$('#editEntryForm #commentInput').val(entry_data.comment);
		// $('#editEntryForm').trigger('reset');
	});

	$(document).on('click', '.btn-edit-user', function() {
		var button = $(this);
		entry_id = button.parent().parent().attr('data-id');
		entry_data = users[entry_id];
		$('#editUserForm').attr('action', '/api/v1/users/' + entry_id);
		$('#editUserModal').modal('show');
		$('#editUserForm').trigger('reset');
		$('#editUserForm select[name=user_id]').val(entry_data.user_id);
		//$('#editUserForm #nameInput').val(entry_data.name);
		//$('#editUserForm #emailInput').val(entry_data.email);
	});

	$(document).on('submit', '#editEntryForm', function(event) {
		var form = $(this);
		var formData = form.serialize();
		event.preventDefault();
		$.ajax({
			type: "PUT",
			url: form.attr('action'),
			data: formData,
			success: function(data) {
				console.log(data);
				$('#editEntryModal').modal('hide');
				getMyEntries();
			},
			error: function(data) {
				console.log(data);
				getMyEntries();
			}
		});
		// $('#editEntryForm').trigger('reset');
	});

	$(document).on('submit', '#editUserForm', function(event) {
		var form = $(this);
		var formData = form.serialize();
		event.preventDefault();
		$.ajax({
			type: "PUT",
			url: form.attr('action'),
			data: formData,
			success: function(data) {
				// console.log(data);
				if (data.errors) {
					$('#editUserModal .errors').empty();
					$.each(data.errors, function(k, v) {
						$('#editUserModal .errors').append('<p class="bg-danger">' + v + '</p>');
					});
					$('#editUserModal .errors').show();
				} else {
					$('#editUserModal .errors').hide();
					$('#editUserForm').trigger('reset');
					$('#editUserModal').modal('hide');
					getUsers();
				}
				getUsers();
			},
			error: function(data) {
				console.log(data);
				getUsers();
			}
		});
		// $('#editEntryForm').trigger('reset');
	});

	$(document).on('click', '#logout_link', function(event) {
		event.preventDefault();
		$.get('/logout', function(data) {
			bootbox.alert('You are logged out.');
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
		$('.header-buttons').hide();
		$('#user-buttons').show();
	}

	function getMyEntries(date) {
		date_url = '';
		$('.filter-date').removeClass('btn-success').addClass('btn-primary');
		if (typeof date == 'undefined') {
			$('.filter-date').pickmeup('clear');
		}
		if (typeof date !== 'undefined' && date[0] != date[1]) {
			date_url = '?from=' + date[0] + '&to=' + date[1];
			$('.filter-date-my-entries').removeClass('btn-primary').addClass('btn-success');
		} else if (typeof date !== 'undefined') {
			return false;
		}
		$('#main-nav li').removeClass('active');
		$('#my_entries_tab').parent().addClass('active');
		$('.header-buttons').hide();
		$('.content-table').hide();
		$('#ajax-loading').show();
		$.get('/api/v1/expenses/my' + date_url, function(data) {
			$('#ajax-loading').hide();
			showMyEntriesButtons();
			$('#table-my-entries tbody').empty();
			$('#table-my-entries').show();
			$.each(data, function(index, v) {
				entries[v['id']] = v;
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
		if (typeof date == 'undefined') {
			$('.filter-date').pickmeup('clear');
		}
		if (typeof date !== 'undefined' && date[0] != date[1]) {
			date_url = '?from=' + date[0] + '&to=' + date[1];
			$('.filter-date-all-entries').removeClass('btn-primary').addClass('btn-success');
		} else if (typeof date !== 'undefined') {
			return false;
		}
		$('#main-nav li').removeClass('active');
		$('#all_entries_tab').parent().addClass('active');
		$('.header-buttons').hide();
		$('.content-table').hide();
		$('#ajax-loading').show();
		$.get('/api/v1/expenses/all' + date_url, function(data) {
			$('#ajax-loading').hide();
			$('#table-all-entries tbody').empty();
			showAllEntriesButtons();
			$('#table-all-entries').show();
			$.each(data, function(index, v) {
				entries[v['id']] = v;
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
		$('.filter-date').removeClass('btn-success').addClass('btn-primary');
		$('.filter-date').pickmeup('clear');
		$('#main-nav li').removeClass('active');
		$('#users_tab').parent().addClass('active');
		$('.header-buttons').hide();
		$('.content-table').hide();
		$('#ajax-loading').show();
		$.get('/api/v1/users', function(data) {
			$('#ajax-loading').hide();
			showUsersButtons();
			$('#table-users tbody').empty();
			$('#table-users').show();
			$.each(data, function(index, v) {
				users[v['id']] = v;
				$('#table-users tbody').append(
					'<tr data-id="' + v.id + '">' +
					'<td>' + v.id + '</td>' +
					'<td>' + v.name + '</td>' +
					'<td>' + v.email + '</td>' +
					'<td>' +
						'<button type="button" class="btn btn-default btn-edit-user btn-xs" data-id="' + v.id + '">Edit</button>' +
						'<button type="button" class="btn btn-danger btn-xs btn-delete-user" data-id="' + v.id + '">Delete</button>' +
					'</td>' +
				'</tr>');
			});
			$.bootstrapSortable(false);
		});
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