<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Serialas extends Model
{
    public $table = 'serialai';
    use HasFactory;
    public $timestamps = false;
    protected $fillable = ['pavadinimas','data', 'salis', 'sezonusk','epizodusk','fk_kategorijos_id'];

}