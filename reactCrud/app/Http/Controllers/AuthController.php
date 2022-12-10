<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login','register']]);
    }

    public function login(Request $request)
    {
        // this is required to move from React authentication naming scheme to Laravel Default.
        // this is only done to keep the same font end uniform for both examples
        // please modify the React call to API in your realization
        $request->merge([
            'email' =>  $request->username,
        ]);
        // fast Login implemented below
        if($request->username === 'a' && $request->password === 'b')
        {
            $credentials = ['email' => 'test@ktu.com','password' =>'Testing1'];
            $token = Auth::attempt($credentials);
            $user = Auth::user();
            return response()->json([
                'jwt' => $token,
                'userTitle'=> $user['name'],
                'userId' => 1,
                'status' => 'success'
            ]);
        }

        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $request->email =  $request->username;

        $credentials = $request->only('email', 'password');

        $token = Auth::attempt($credentials);
        if (!$token) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized',
            ], 401);
        }

        $user = Auth::user();
        return response()->json([
            'jwt' => $token,
            'userTitle'=> $user['name'],
            'userId' => 1,
            'status' => 'success'
        ]);

    }

    public function register(Request $request){
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = Auth::login($user);
        return response()->json([
            'status' => 'success',
            'message' => 'User created successfully',
            'user' => $user,
            'authorisation' => [
                'token' => $token,
                'type' => 'bearer',
            ]
        ]);
    }

    public function logout()
    {
        Auth::logout();
        return response()->json([
            'status' => 'success',
            'message' => 'Successfully logged out',
        ]);
    }

    public function refresh()
    {
        return response()->json([
            'status' => 'success',
            'user' => Auth::user(),
            'authorisation' => [
                'token' => Auth::refresh(),
                'type' => 'bearer',
            ]
        ]);
    }

}
