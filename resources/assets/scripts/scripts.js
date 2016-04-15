jQuery(document).ready(function($){
	console.log('Hello from jQuery!');

	$.ajaxSetup({ headers: {
		'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
		'Authorization': 'Bearer ' + $('meta[name="jwt-token"]').attr('content')
	}});

	$('#my_entries_tab').click(function(){ getMyEntries(); });
	$('#all_entries_tab').click(function(){ getAllEntries(); });
	$('#users_tab').click(function(){ getUsers(); });

	function getMyEntries() {
		$('#main-nav li').removeClass('active');
		$('#my_entries_tab').parent().addClass('active');
		$('.content-table').hide();
		$('.header-buttons').hide();
		$('#my-entry-buttons').show();
		$('#ajax-loading').show();
		$.get('/api/v1/expenses/my', function(data) {
			$('#ajax-loading').hide();
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
						'<td>' + v.date + '</td>' +
						'<td>' + v.time + '</td>' +
						'<td>' + v.amount.toFixed(2) + ' &euro;</td>' +
						'<td>' + v.description + comment + '</td>' +
						'<td>' +
							'<button type="button" class="btn btn-default btn-edit-entry btn-xs" data-id="' + v.id + '">Edit</button>' +
							'<button type="button" class="btn btn-danger btn-xs btn-delete-entry" data-id="' + v.id + '">Delete</button>' +
						'</td>' +
					'</tr>');
			});
		});
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
				}
			});
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

	// Initializing
	if (window.location.hash == '#my_entries_tab') { getMyEntries(); }
	else if (window.location.hash == '#all_entries_tab') { getAllEntries(); }
	else if (window.location.hash == '#users_tab') { getUsers(); }
	else if (logged == true) { getMyEntries(); }
});