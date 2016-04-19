<?php
Route::auth();
Route::get('/', 'HomeController@index');
Route::get('app', 'HomeController@app');

Route::any('api/v1/users/getToken', 'UsersApiController@getToken');
Route::post('api/v1/users', 'UsersApiController@store');

Route::group(['prefix' => 'api/v1', 'middleware' => 'api'], function() {
	Route::get('expenses/my', 'ExpensesApiController@getMyEntries');
	Route::get('expenses/all', 'ExpensesApiController@getAllEntries');
	Route::get('expenses/report', 'ExpensesApiController@report');
	Route::resource('users', 'UsersApiController');
	Route::resource('expenses', 'ExpensesApiController');
});

Route::any('test', 'ExpensesApiController@test');

Route::get('login', 'HomeController@getLogin');
Route::get('register', 'HomeController@getRegister');
Route::post('login', 'HomeController@postLogin');
Route::post('register', 'HomeController@postRegister');