<?php

foreach(glob(dirname(__FILE__) . '/*.php') as $helper) {
    if($helper != __FILE__) {
        require_once $helper;
    }
}