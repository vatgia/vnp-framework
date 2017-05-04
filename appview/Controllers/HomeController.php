<?php

namespace AppView\Controllers;


use VatGia\ControllerBase;
use VatGia\Model;

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