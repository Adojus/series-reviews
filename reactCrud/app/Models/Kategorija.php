<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kategorija extends Model
{
    public $table = 'kategorijos';
    use HasFactory;
    public $timestamps = false;
    protected $fillable = ['pavadinimas'];

}