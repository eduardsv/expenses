<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Expenses;
use Illuminate\Support\Facades\Response;
use App\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class ExpensesApiController extends Controller
{
	public function __construct()
	{
		$this->middleware('jwt.auth');
		\Debugbar::disable();
	}

	public function test(Request $request)
	{
		return Response::make($request->time);
	}

	public function index(Request $request)
	{
		if (User::getAdminStatus() > 0) {
			$this->getAllEntries($request);
		} else {
			$this->getMyEntries($request);
		}
	}

	public function getMyEntries(Request $request)
	{
		return Expenses::getEntries($request, false);
	}

	public function getAllEntries(Request $request)
	{
		if (User::getAdminStatus() > 0) {
			return Expenses::getEntries($request, true);
		} else {
			return Response::make('Forbidden', 403);
		}
	}

	public function store(Request $request)
	{
		$this->user = Auth::user();
		if ($request->user_id != $this->user->id && User::getAdminStatus() < 1) {
			return Response::make('Forbidden', 403);
		}
		$validator = Validator::make($request->all(), [
			'user_id' => 'integer|exists:users,id|required',
			'date' => 'date|date_format:Y-m-d|required',
			'time' => 'required|regex:/^\d*(\:\d{2})?$/',
			'amount' => 'required|regex:/^\d*(\.\d{2})?$/'
		]);
		if ($validator->fails()) {
			return ['errors' => $validator->errors()->all()];
		} else {
			return ['success' => Expenses::create([
				'user_id' => $request->user_id,
				'date' => $request->date,
				'time' => $request->time,
				'description' => $request->description,
				'amount' => $request->amount,
				'comment' => $request->comment
			])];
		}
	}

	public function show($id)
	{
		$this->user = Auth::user();
		$data = Expenses::where('id', intval($id))->first();
		if (empty($data)) {
			return Response::make('Entry not found', 404);
		}
		if (User::getAdminStatus() > 0 || $this->user->id == $data->user_id) {
			return $data;
		} else {
			return Response::make('Forbidden', 403);
		}
	}

	public function update(Request $request, $id)
	{
		$this->user = Auth::user();
		$data = $this->show($id);
		if ($data->original == 'Entry not found') {
			return Response::make('Entry not found', 404);
		}
		if ($data->original == 'Forbidden' || ($data->user_id != $this->user->id && User::getAdminStatus() < 1)) {
			return Response::make('Forbidden', 403);
		}
		$validator = Validator::make($request->all(), [
			'user_id' => 'integer|exists:users,id',
			'date' => 'date|date_format:Y-m-d',
			'time' => 'regex:/^\d*(\:\d{2})?$/',
			'amount' => 'regex:/^\d*(\.\d{2})?$/'
		]);
		if ($validator->fails()) {
			return ['errors' => $validator->errors()->all()];
		} else {
			// Probably not the best decision, but I'll keep it for now
			if (User::getAdminStatus() > 0) {
				if (!empty($request->user_id)) { DB::table('expenses')->where('id', intval($id))->update(['user_id' => $request->user_id]); }
			}
			if (!empty($request->date)) { DB::table('expenses')->where('id', intval($id))->update(['date' => $request->date]); }
			if (!empty($request->time)) { DB::table('expenses')->where('id', intval($id))->update(['time' => $request->time]); }
			if (!empty($request->description)) { DB::table('expenses')->where('id', intval($id))->update(['description' => $request->description]); }
			if (!empty($request->amount)) { DB::table('expenses')->where('id', intval($id))->update(['amount' => $request->amount]); }
			if (!empty($request->comment)) { DB::table('expenses')->where('id', intval($id))->update(['comment' => $request->comment]); }
			return Response::make('Success', 200);
		}
		return Response::make('Forbidden', 403);
	}

	public function destroy($id)
	{
		$this->user = Auth::user();
		$data = $this->show($id);
		if ($data->original == 'Entry not found') {
			return Response::make('Entry not found', 404);
		}
		if ($data->original == 'Forbidden') {
			return Response::make('Forbidden', 403);
		}
		if ($data->user_id != $this->user->id && User::getAdminStatus() < 1) {
			return Response::make('Forbidden', 403);
		} else {
			DB::table('expenses')->where('id', intval($id))->delete();
			return Response::make('Success', 200);
		}
	}
}