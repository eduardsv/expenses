<?php

use Illuminate\Database\Seeder;
use App\Expenses;

class ExpensesTableSeeder extends Seeder
{
	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run()
	{
		$faker = Faker\Factory::create();
		$limit = 200;
		DB::table('expenses')->delete();
		for ($i = 0; $i < $limit; $i++) {
			Expenses::create([
				'user_id' => rand(1, 3),
				'date' => $faker->date(),
				'time' => $faker->time(),
				'description' => $faker->sentence(),
				'amount' => $faker->randomFloat(2, 1, 500),
				'comment' => $faker->sentence()
			]);
		}
	}
}
