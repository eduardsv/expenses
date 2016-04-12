<?php
Route::auth();
Route::get('/', 'HomeController@index');

Route::any('api/v1/users/getToken', 'UsersApiController@getToken');
Route::post('api/v1/users', 'UsersApiController@store');

Route::group(['prefix' => 'api/v1', 'middleware' => 'api'], function() {
	Route::get('expenses/my', 'ExpensesApiController@getMyEntries');
	Route::get('expenses/all', 'ExpensesApiController@getAllEntries');
	Route::resource('users', 'UsersApiController');
	Route::resource('expenses', 'ExpensesApiController');
});

Route::any('test', 'ExpensesApiController@test');