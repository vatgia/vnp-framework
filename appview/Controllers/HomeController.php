<?php

namespace AppView\Controllers;


use VatGia\Auth\Facade\Auth;

class HomeController extends FrontEndController
{

    public function render()
    {

        return view('welcome')->render();
    }

}