<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AktoriusRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    // this should check if user is allowed to perform any action with API
    public function authorize()
    {
        return True;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'vardas' => ['required', 'string','max:255'],
            'pavarde' => ['required', 'string','max:255'],
            'gimimo_data' => ['required', 'string','max:255'],
            'lytis' => ['required', 'string','max:255'],
            'salis' => ['required', 'string','max:50'],
        ];
    }
}