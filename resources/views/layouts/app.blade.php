<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="csrf-token" content="{{ csrf_token() }}" />
	@if (isset($jwt_token))
		<meta name="jwt-token" content="{{ $jwt_token }}" />
	@endif
	<title>EV.Expenses</title>
	<link rel="stylesheet" href="/css/css.css">
</head>
<body id="app-layout">
	{{--@include('modals.new_entry')--}}
	{{--@include('modals.new_user')--}}
	<nav class="navbar navbar-default navbar-static-top">
		<div class="container">
			<div class="navbar-header">
				<!-- Collapsed Hamburger -->
				<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#app-navbar-collapse">
					<span class="sr-only">Toggle Navigation</span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
				</button>

				<!-- Branding Image -->
				<span class="navbar-brand">
					EV.Expenses
				</span>
			</div>

			<div class="collapse navbar-collapse" id="app-navbar-collapse">
				<!-- Left Side Of Navbar -->
				@if (Auth::check())
					<ul class="nav navbar-nav" id="main-nav">
						<li class="active"><a href="#my_entries_tab" id="my_entries_tab">My entries</a></li>
						@if ($user->is_admin > 1)
							<li><a href="#all_entries_tab" id="all_entries_tab">All entries</a></li>
						@endif
						@if ($user->is_admin > 0)
							<li><a href="#users_tab" id="users_tab">User management</a></li>
						@endif
					</ul>
				@endif

				<!-- Right Side Of Navbar -->
				<ul class="nav navbar-nav navbar-right">
					<!-- Authentication Links -->
					@if (Auth::guest())
						<li><a href="{{ url('/login') }}">Login</a></li>
						<li><a href="{{ url('/register') }}">Register</a></li>
					@else
						<li class="dropdown">
							<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">
								{{ Auth::user()->name }} <span class="caret"></span>
							</a>

							<ul class="dropdown-menu" role="menu">
								<li><a href="{{ url('/logout') }}"><i class="fa fa-btn fa-sign-out"></i>Logout</a></li>
							</ul>
						</li>
					@endif
				</ul>
			</div>
		</div>
	</nav>

	@yield('content')

	@if(Auth::check())
		<script>{{ 'var logged = true;' }}</script>
	@else
		<script>{{ 'var logged = false;' }}</script>
	@endif
	<script src="/js/js.js"></script>
</body>
</html>