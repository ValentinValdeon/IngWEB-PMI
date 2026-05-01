<?php

namespace App\Http\Requests;
# php artisan make:request
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class AlmacenarProductoRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'titulo'      => 'required|string|max:150',
            'descripcion' => 'nullable|string',
            'precio'      => 'nullable|numeric|min:0',
            'rubro_id'    => 'required|exists:rubros,id',
            'subrubro_id' => 'nullable|exists:subrubros,id',
            'imagen'      => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
        ];
    }
}
