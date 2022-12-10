<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users')->insert([
            'name' => 'test',
            'email' => 'test@ktu.com',
            'password' => Hash::make('Testing1'),
        ]);

        DB::table('entities')->insert([
            'name' => 'TEntity',
            'date'  => '2022-01-01',
            'condition' => 1,
            'deletable' => 0
        ]);
    }
}
