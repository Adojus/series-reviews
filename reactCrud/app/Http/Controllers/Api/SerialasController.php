<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\SerialasRequest;
use App\Models\Serialas;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class SerialasController extends Controller
{
    // this should be implemented in lab3
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function index()
    {
        return response()->json(
            Serialas::all()->toArray()
        );
        // More laravel way of writing return are displayed below the above is adapted to React App created with .Net as backend in mind
        // return SerialasResource::collection(Serialas::all());
    }

    public function store(SerialasRequest $request)
    {
        $serialai = Serialas::create($request->validated());

        return response()->json([
            'status' => 'success',
            'serialai' => $serialai,
        ]);
    }

    public function show(Request $request)
    {
        $id = $request->query('id');
        try{
            $serialas = Serialas::findOrFail($id);
            return response()->json($serialas);
        } catch(ModelNotFoundException $e){
            return abort(500, 'serialas not found');
        }

    }

    public function update(SerialasRequest $request)
    {
        $id = $request->id;
        try {
            $serialas = Serialas::findOrFail($id);
            $serialas->update($request->validated());
            return response()->json([
                'status' => 'success'
            ]);
        }
        catch(ModelNotFoundException $e){
            return abort(500, 'serialas not found');
        }


    }

    public function destroy(Request $request)
    {
        $id = $request->query('id');
        try {
            $serialai = Serialas::findOrFail($id);

            $serialai->delete();

            return response()->json([
                'status' => 'success',
            ]);
        } catch(ModelNotFoundException $e){
            return abort(500, 'serialas not found');
        }

    }
}
