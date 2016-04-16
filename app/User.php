<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Response;

class User extends Authenticatable
{
	protected $fillable = ['name', 'email', 'password'];
	protected $hidden = ['remember_token'];

	public static function getAdminStatus()
	{
		if (Auth::check()) {
			$user = Auth::user();
			return $user->is_admin;
		} else {
			return Response::make('Unauthorised', 401);
		}
	}

	public static function getUserId()
	{
		if (Auth::check()) {
			$user = Auth::user();
			return $user->id;
		} else {
			return false;
		}
	}

	public static function getAllUsers()
	{
		if (User::getAdminStatus() > 0) {
			return User::all();
		}
	}
}
