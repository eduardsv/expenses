<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateExpensesTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('expenses', function (Blueprint $table) {
			$table->increments('id');
			$table->integer('user_id');
			$table->date('date');
			$table->time('time');
			$table->text('description')->nullable();
			$table->float('amount');
			$table->text('comment')->nullable();
			$table->timestamps();
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('expenses');
	}
}
