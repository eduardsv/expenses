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
	@if (Auth::check())
		<script>var logged = true;</script>
	@else
		<script>var logged = false;</script>
	@endif
	<script src="/js/js.js"></script>
</head>
<body id="app-layout">
	@include('layouts.body')
</body>
</html>