<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\KategorijaRequest;
use App\Models\Kategorija;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class KategorijaController extends Controller
{
    // this should be implemented in lab3
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function index()
    {
        return response()->json(
            Kategorija::all()->toArray()
        );
        // More laravel way of writing return are displayed below the above is adapted to React App created with .Net as backend in mind
        // return KategorijaResource::collection(Kategorija::all());
    }

    public function store(KategorijaRequest $request)
    {
        $kategorijos = Kategorija::create($request->validated());

        return response()->json([
            'status' => 'success',
            'kategorijos' => $kategorijos,
        ]);
    }

    public function show(Request $request)
    {
        $id = $request->query('id');
        try{
            $kategorija = Kategorija::findOrFail($id);
            return response()->json($kategorija);
        } catch(ModelNotFoundException $e){
            return abort(500, 'kategorija not found');
        }

    }

    public function update(KategorijaRequest $request)
    {
        $id = $request->id;
        try {
            $kategorija = Kategorija::findOrFail($id);
            $kategorija->update($request->validated());
            return response()->json([
                'status' => 'success'
            ]);
        }
        catch(ModelNotFoundException $e){
            return abort(500, 'kategorija not found');
        }


    }

    public function destroy(Request $request)
    {
        $id = $request->query('id');
        try {
            $kategorijos = Kategorija::findOrFail($id);

            $kategorijos->delete();

            return response()->json([
                'status' => 'success',
            ]);
        } catch(ModelNotFoundException $e){
            return abort(500, 'kategorija not found');
        }

    }
}
