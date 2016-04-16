jQuery(document).ready(function($){
	console.log('Hello from jQuery!');

	$.ajaxSetup({ headers: {
		'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
		'Authorization': 'Bearer ' + $('meta[name="jwt-token"]').attr('content')
	}});

	$('#my_entries_tab').click(function(){ if (!$(this).parent().hasClass('active')) getMyEntries(); });
	$('#all_entries_tab').click(function(){ if (!$(this).parent().hasClass('active')) getAllEntries(); });
	$('#users_tab').click(function(){ if (!$(this).parent().hasClass('active')) getUsers(); });

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

	$('#addNewEntryForm').submit(function(event){
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

	// Initializing
	if (window.location.hash == '#my_entries_tab') { getMyEntries(); }
	else if (window.location.hash == '#all_entries_tab') { getAllEntries(); }
	else if (window.location.hash == '#users_tab') { getUsers(); }
	else if (logged == true) { getMyEntries(); }
});

var entityMap = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	'"': '&quot;',
	"'": '&#39;',
	"/": '&#x2F;'
};

function escapeHtml(string) {
	return String(string).replace(/[&<>"'\/]/g, function (s) {
		return entityMap[s];
	});
}
