<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use App\User;
use App\Expenses;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class UsersApiController extends Controller
{
	public function __construct()
	{
		// $this->middleware('auth.basic', ['only' => 'getToken']);
		$this->middleware('jwt.auth', ['except' => ['getToken', 'store']]);
		\Debugbar::disable();
	}

	public function index()
	{
		if (User::getAdminStatus() > 0) {
			return User::all();
		} else {
			return Response::make('Forbidden', 403);
		}
	}

	public function store(Request $request)
	{
		$validator = Validator::make($request->all(), [
			'name' => 'required',
			'email' => 'required|unique:users,email|email',
			'password' => 'required'
		]);
		if ($validator->fails()) {
			return ['errors' => $validator->errors()->all()];
		} else {
			return ['success' => User::create([
				'name' => $request->name,
				'email' => $request->email,
				'password' => Hash::make($request->password)
			])];
		}
	}

	public function show($id)
	{
		$id = intval($id);
		$this->user = Auth::user();
		if (User::getAdminStatus() > 0 || $this->user->id == $id) {
			$user = User::where('id', $id)->first();
			if (empty($user)) {
				return Response::make('User not found', 404);
			} else {
				return $user;
			}
		} else {
			return Response::make('Forbidden', 403);
		}
	}

	public function update(Request $request, $id)
	{
		$id = intval($id);
		$this->user = Auth::user();
		if (User::getAdminStatus() > 0 || $this->user->id == $id) {
			$validator = Validator::make($request->all(), [
				'email' => 'unique:users,email|email',
			]);
			if ($validator->fails()) {
				return ['errors' => $validator->errors()->all()];
			} else {
				if (!empty($request->name)) { DB::table('users')->where('id', intval($id))->update(['name' => $request->name]); }
				if (!empty($request->email)) { DB::table('users')->where('id', intval($id))->update(['email' => $request->email]); }
				if (!empty($request->password)) { DB::table('users')->where('id', intval($id))->update(['password' => Hash::make($request->password)]); }
				return Response::make('Success', 200);
			}
		} else {
			return Response::make('Forbidden', 403);
		}
	}

	public function destroy($id)
	{
		$id = intval($id);
		$this->user = Auth::user();
		if (User::getAdminStatus() > 0 || $this->user->id == $id) {
			$delete = DB::table('users')->where('id', intval($id))->delete();
			DB::table('expenses')->where('user_id', intval($id))->delete();
			if ($delete == 1) {
				return Response::make('Success', 200);
			} else {
				return Response::make('User not found', 404);
			}
		} else {
			return Response::make('Forbidden', 403);
		}
	}

	public function getToken(Request $request)
	{
		$credentials = $request->only('email', 'password');
		try {
			if (!$token = JWTAuth::attempt($credentials)) {
				return Response::make(['error' => 'invalid_credentials'], 401);
			}
		} catch (JWTException $e) {
			return Response::make(['error' => 'could_not_create_token'], 500);
		}
		return Response::make($token);
	}
}