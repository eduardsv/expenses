<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class Expenses extends Model
{
	public $table = 'expenses';
	protected $fillable = ['user_id', 'date', 'time', 'description', 'amount', 'comment'];

	public static function getEntries($request, $all = false)
	{
		// error_log('Expenses::getEntries()');
		$user = Auth::user();
		$return = DB::table('expenses')->orderBy('date', 'desc')->orderBy('time', 'desc');
		if ($request->from) { $return->where('date', '>', date("Y-m-d", strtotime($request->from))); }
		if ($request->to) { $return->where('date', '<', date("Y-m-d", strtotime($request->to))); }
		if ($all == true) {
			return $return
				->join('users', 'users.id', '=', 'expenses.user_id')
				->select('users.name as user_name', 'expenses.*')
				->get(); // joi
		} else {
			return $return->where('user_id', intval($user->id))->get();
		}
	}
}
