<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SizeChart extends Model
{
    use HasFactory;
    // If your table name is not the plural form of your model, specify it like this
    protected $table = 'sizecharts';

    // Mass assignable attributes
    protected $fillable = ['sizechart_data', 'image_url', 'shop_name'];

    // ... other model properties and methods
}
