@include('modals.new_entry')
@include('modals.edit_entry')
@include('modals.new_user')
@include('modals.report')

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
						<li><a id="login_link" href="{{ url('/login') }}">Login</a></li>
						<li><a id="register_link" href="{{ url('/register') }}">Register</a></li>
					@else
						<li class="dropdown">
							<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">
								{{ Auth::user()->name }} <span class="caret"></span>
							</a>

							<ul class="dropdown-menu" role="menu">
								<li><a id="logout_link" href="{{ url('/logout') }}"><i class="fa fa-btn fa-sign-out"></i>Logout</a></li>
							</ul>
						</li>
					@endif
				</ul>
		</div>
	</div>
</nav>

<div id="content">
	@yield('content')
</div>