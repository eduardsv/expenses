<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Auth;

class HomeController extends Controller
{
	public function __construct()
	{
		$this->middleware('auth');
	}

	public function index()
	{
		$user = Auth::user();
		$token = JWTAuth::fromUser($user);
		return view('home')
			->with('jwt_token', $token)
			->with('user', $user);
	}
}