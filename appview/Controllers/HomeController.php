<?php

namespace AppView\Controllers;


class HomeController extends FrontEndController
{

    public function render()
    {

        return view('welcome')->render();
    }

}