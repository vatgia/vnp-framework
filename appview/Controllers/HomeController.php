<?php

namespace AppView\Controllers;


use VatGia\ControllerBase;
use VatGia\Model;

class HomeController extends ControllerBase
{

    public function render()
    {
        return $this->renderView('welcome');
    }
}