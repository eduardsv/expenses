@extends('layouts.body')
@section('content')
	<div class="container">
		<div class="row">
			<div class="col-md-10 col-md-offset-1">
				<div class="panel panel-default">
					{{--<div class="panel-heading">Dashboard</div>--}}
					<div class="panel-body">

						<!-- Buttons -->
						<div id="header-buttons">
							<div id="my-entry-buttons" class="header-buttons">
								<button type="button" data-toggle="modal" data-target="#newEntryModal" class="btn btn-primary btn-add-new-entry">Add new entry</button>
								@if (isset($jwt_token))
									<a class="btn btn-primary btn-my-export" href="/api/v1/expenses/export?token={{ $jwt_token }}" target="_blank">Show weekly report</a>
								@endif
								<button type="button" class="btn btn-primary filter-date filter-date-my-entries fa fa-calendar pull-right"></button>
							</div>
							<div id="all-entry-buttons" class="header-buttons">
								<button type="button" data-toggle="modal" data-target="#newEntryModal" class="btn btn-primary btn-add-new-entry">Add new entry</button>
								<button type="button" class="btn btn-primary filter-date filter-date-all-entries fa fa-calendar pull-right"></button>
							</div>
							<div id="user-buttons" class="header-buttons">
								{{--<button type="button" data-toggle="modal" data-target="#newUserModal" class="btn btn-primary btn-add-new-user">Add new user</button>--}}
							</div>
						</div>
						<!-- /Buttons -->

						<div id="ajax-loading"><img src="/img/loading.gif" alt="Loading..."></div>

						<table class="table content-table table-my-entries sortable" id="table-my-entries">
							<thead>
							<tr>
								<th data-defaultsort="desc">Date</th>
								<th data-defaultsort='disabled'>Time</th>
								<th>Amount</th>
								<th data-defaultsort='disabled'>Description</th>
								<th data-defaultsort='disabled'>Actions</th>
							</tr>
							</thead>
							<tbody>
							</tbody>
						</table>

						<table class="table content-table table-all-entries sortable" id="table-all-entries">
							<thead>
							<tr>
								<th></th>
								<th data-defaultsort="desc">Date</th>
								<th data-defaultsort='disabled'>Time</th>
								<th>Amount</th>
								<th data-defaultsort='disabled'>Description</th>
								<th data-defaultsort='disabled'>Actions</th>
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