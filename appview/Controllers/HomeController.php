<?php

namespace AppView\Controllers;


class HomeController extends FrontEndController
{

    public function __construct()
    {
        parent::__construct();
    }

    public function render()
    {
        return $this->renderView('welcome');
    }

}