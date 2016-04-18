<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Response;
use App\User;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Hash;

class HomeController extends Controller
{
	public function __construct()
	{
		// $this->middleware('auth');
	}

	public function index()
	{
		if (Auth::check()) {
			$user = Auth::user();
			$token = JWTAuth::fromUser($user);
			return view('home')
				->with('jwt_token', $token)
				->with('user', $user)
				->with('allUsers', User::get());
		} else {
			return view('auth.login');
		}
	}

	public function app()
	{
		if (Auth::check()) {
			$user = Auth::user();
			$token = JWTAuth::fromUser($user);
			return view('ajax.home')
				->with('jwt_token', $token)
				->with('user', $user)
				->with('allUsers', User::get());
		} else {
			return Response::make('Forbidden', 403);
		}
	}

	public function getLogin() { return view('auth/ajax/login'); }
	public function getRegister() { return view('auth/ajax/register'); }

	public function postLogin(Request $request)
	{
		if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
			$user = Auth::user();
			$token = JWTAuth::fromUser($user);
			return Response::make($token);
		} else {
			return Response::make('error', 400);
		}
	}

	public function postRegister()
	{
		$credentials = Input::only('email', 'password', 'name');
		$credentials['password'] = Hash::make($credentials['password']);
		if (sizeof(User::where('email','=',Input::get('email'))->get()) > 0) {
			return Response::make(['error' => 'User email exists'], 409);
		} elseif (empty(Input::get('name'))) {
			return Response::make(['error' => 'Name cannot be empty'], 400);
		} else{
			$user = User::create($credentials);
			Auth::attempt(['email' => Input::get('email'), 'password' => Input::get('password')]);
			return Response::make('success');
		}
	}
}