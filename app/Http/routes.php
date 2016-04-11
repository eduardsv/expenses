<?php
Route::group(['middleware' => 'web'], function() {
	Route::auth();
	Route::get('/', 'HomeController@index');
});

Route::get('api/v1/users/getToken', 'UsersApiController@getToken');
Route::post('api/v1/users', 'UsersApiController@store');

Route::group(['prefix' => 'api/v1', 'middleware' => 'api'], function() {
	Route::get('expenses/my', 'ExpensesApiController@getMyEntries');
	Route::get('expenses/all', 'ExpensesApiController@getAllEntries');
	Route::resource('users', 'UsersApiController');
	Route::resource('hours', 'ExpensesApiController');
});