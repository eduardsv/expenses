@extends('layouts.app')

@section('content')
<div class="container">
	<div class="row">
		<div class="col-md-10 col-md-offset-1">
			<div class="panel panel-default">
				{{--<div class="panel-heading">Dashboard</div>--}}
				<div class="panel-body">

					<div id="ajax-loading"><img src="/img/loading.gif" alt="Loading..."></div>

					<!-- Buttons -->
					<div id="header-buttons">
						<div id="my-entry-buttons" class="header-buttons">
							<button type="button" data-toggle="modal" data-target="#newEntryModal" class="btn btn-primary btn-add-new-entry">Add new entry</button>
							{{--<a class="btn btn-primary btn-my-export" href="/exportMyEntries" target="_blank">Export my entries</a>--}}
							<button type="button" class="btn btn-primary filter-date fa fa-calendar pull-right"></button>
						</div>
						<div id="all-entry-buttons" class="header-buttons">
							{{--<a class="btn btn-primary btn-all-export" href="/exportAllEntries" target="_blank">Export all entries</a>--}}
						</div>
						<div id="user-buttons" class="header-buttons">
							{{--<button type="button" data-toggle="modal" data-target="#newUserModal" class="btn btn-primary btn-add-new-user">Add new user</button>--}}
						</div>
					</div>
					<!-- /Buttons -->

					<table class="table content-table table-my-entries" id="table-my-entries">
						<thead>
						<tr>
							<th>Date</th>
							<th>Time</th>
							<th>Amount</th>
							<th>Description</th>
							{{--<th>Comment</th>--}}
							<th>Actions</th>
						</tr>
						</thead>
						<tbody>
						</tbody>
					</table>
				</div>
			</div>
		</div>
		<div class="col-md-10 col-md-offset-1 jwt-token">
			@if (isset($jwt_token))
				JWT Authorization: Bearer {{ $jwt_token }}
			@endif
		</div>
	</div>
</div>
@endsection
