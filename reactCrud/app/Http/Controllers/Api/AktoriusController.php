<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AktoriusRequest;
use App\Models\Aktorius;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class AktoriusController extends Controller
{
    // this should be implemented in lab3
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function index()
    {
        return response()->json(
            Aktorius::all()->toArray()
        );
        // More laravel way of writing return are displayed below the above is adapted to React App created with .Net as backend in mind
        // return AktoriusResource::collection(Aktorius::all());
    }

    public function store(AktoriusRequest $request)
    {
        $kategorijos = Aktorius::create($request->validated());

        return response()->json([
            'status' => 'success',
            'kategorijos' => $kategorijos,
        ]);
    }

    public function show(Request $request)
    {
        $id = $request->query('id');
        try{
            $aktorius = Aktorius::findOrFail($id);
            return response()->json($aktorius);
        } catch(ModelNotFoundException $e){
            return abort(500, 'aktorius not found');
        }

    }

    public function update(AktoriusRequest $request)
    {
        $id = $request->id;
        try {
            $aktorius = Aktorius::findOrFail($id);
            $aktorius->update($request->validated());
            return response()->json([
                'status' => 'success'
            ]);
        }
        catch(ModelNotFoundException $e){
            return abort(500, 'aktorius not found');
        }


    }

    public function destroy(Request $request)
    {
        $id = $request->query('id');
        try {
            $kategorijos = Aktorius::findOrFail($id);

            $kategorijos->delete();

            return response()->json([
                'status' => 'success',
            ]);
        } catch(ModelNotFoundException $e){
            return abort(500, 'aktorius not found');
        }

    }
}
