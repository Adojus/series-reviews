<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vertinimas extends Model
{
    public $table = 'vertinimai';
    use HasFactory;
    public $timestamps = false;
    protected $fillable = ['komentaras','data',
     'ivertinimas', 'fk_naudotojo_id','fk_serialo_id'];

}