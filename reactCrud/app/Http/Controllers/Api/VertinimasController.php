<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\VertinimasRequest;
use App\Models\Vertinimas;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class VertinimasController extends Controller
{
    // this should be implemented in lab3
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function index()
    {
        return response()->json(
            Vertinimas::all()->toArray()
        );
        // More laravel way of writing return are displayed below the above is adapted to React App created with .Net as backend in mind
        // return VertinimasResource::collection(Vertinimas::all());
    }

    public function store(VertinimasRequest $request)
    {
        $vertinimai = Vertinimas::create($request->validated());

        return response()->json([
            'status' => 'success',
            'vertinimai' => $vertinimai,
        ]);
    }

    public function show(Request $request)
    {
        $id = $request->query('id');
        try{
            $vertinimas = Vertinimas::findOrFail($id);
            return response()->json($vertinimas);
        } catch(ModelNotFoundException $e){
            return abort(500, 'vertinimas not found');
        }

    }

    public function update(VertinimasRequest $request)
    {
        $id = $request->id;
        try {
            $vertinimas = Vertinimas::findOrFail($id);
            $vertinimas->update($request->validated());
            return response()->json([
                'status' => 'success'
            ]);
        }
        catch(ModelNotFoundException $e){
            return abort(500, 'vertinimas not found');
        }


    }

    public function destroy(Request $request)
    {
        $id = $request->query('id');
        try {
            $vertinimai = Vertinimas::findOrFail($id);

            $vertinimai->delete();

            return response()->json([
                'status' => 'success',
            ]);
        } catch(ModelNotFoundException $e){
            return abort(500, 'vertinimas not found');
        }

    }
}
