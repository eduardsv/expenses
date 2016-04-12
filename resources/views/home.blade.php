@extends('layouts.app')

@section('content')
<div class="container">
	<div class="row">
		<div class="col-md-10 col-md-offset-1">
			<div class="panel panel-default">
				{{--<div class="panel-heading">Dashboard</div>--}}
				<div class="panel-body">
					<div id="ajax-loading"><img src="/img/loading.gif" alt="Loading..."></div>
					{{--You are logged in!--}}
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
