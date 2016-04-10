<?php

use Illuminate\Database\Seeder;
use App\User;

class UsersTableSeeder extends Seeder
{
	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run()
	{
		DB::table('users')->delete();

		User::create([
			'id' => 1,
			'name' => 'Eduards Vigulis',
			'email' => 'dascoder@gmail.com',
			'password' => Hash::make('password'),
			'is_admin' => 2
		]);

		User::create([
			'id' => 2,
			'name' => 'Test User',
			'email' => 'test@example.com',
			'password' => Hash::make('password'),
			'is_admin' => 0
		]);

		User::create([
			'id' => 3,
			'name' => 'User Manager',
			'email' => 'manager@example.com',
			'password' => Hash::make('password'),
			'is_admin' => 1
		]);
	}
}
