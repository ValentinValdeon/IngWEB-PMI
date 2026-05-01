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
            'titulo'      => 'required|string|max:150', // obligatorio, stirng, max caracteres 150
            'descripcion' => 'nullable|string',
            'precio'      => 'required|numeric|min:0',
            'rubro_id'    => 'required|exists:rubros,id', // que exista

            // ORIGINAL (descomentar cuando el front siempre mande subrubro_id):
            // 'subrubro_id' => 'required|exists:subrubros,id',
            // TEMPORAL: subrubro es opcional porque el rubro puede no tener subrubros
            'subrubro_id' => 'nullable|exists:subrubros,id',

            // ORIGINAL (descomentar cuando el front siempre mande imagen):
            // 'imagen' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048',
            // TEMPORAL: imagen opcional para facilitar pruebas sin archivo
            'imagen'      => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ];
    }
}
