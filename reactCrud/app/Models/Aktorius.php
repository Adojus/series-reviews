<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Aktorius extends Model
{
    public $table = 'aktoriai';
    use HasFactory;
    public $timestamps = false;
    protected $fillable = ['vardas', 'pavarde',
     'gimimo_data','lytis','salis'];

}