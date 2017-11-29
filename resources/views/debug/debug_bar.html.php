<?php

$arrayDebug = debug()->output();

if (config('app.debug') == true || getValue('debug') == 1) {

    if (getValue('debugbar')) {

        try{
            $debugBar = new \DebugBar\StandardDebugBar();
            $debugBarRender = $debugBar->getJavascriptRenderer();

            debug()->addToDebugBar($debugBar);

            $debugBar['time']->addMeasure('App', APP_START, microtime(true));

            echo $debugBarRender->renderHead();
            echo $debugBarRender->render();
        }catch(Exception $e)
        {

        }catch(Throwable $e)
        {

        }
    }

    $myDebugBar = new \VatGia\Helpers\DebugBar();
    $myDebugBar->addTab(
        "Views",
        ["name" => "View Name", "duration" => "Thời gian xử lý", "file_line" => "File Line"],
        isset($arrayDebug["views"]) ? $arrayDebug["views"] : [],
        "duration"
    );
    $myDebugBar->addTab(
        "Models",
        ["name" => "Model Name", "duration" => "Thời gian xử lý", "file_line" => "File Line"],
        isset($arrayDebug["models"]) ? $arrayDebug["models"] : [],
        "duration"
    );

    if (isset($arrayDebug["queries"])) {
        $myDebugBar->addTab(
            "Queries",
            ["query" => "SQL", "duration" => "Thời gian xử lý", "host" => "Host", "type" => "USE", "file_line" => "File Line"],
            isset($arrayDebug["queries"]) ? $arrayDebug["queries"] : [],
            "duration"
        );
    }

    if (isset($arrayDebug["connect"])) {
        $myDebugBar->addTab(
            "Connect DB",
            ["host" => "Host", "type" => "USE", "duration" => "Thời gian xử lý", "file_line" => "File Line"],
            isset($arrayDebug["connect"]) ? $arrayDebug["connect"] : [],
            "duration"
        );
    }

    $myDebugBar->addTab(
        "Includes",
        ["file" => "File Include"],
        debug()->getIncludeFiles(),
        ""
    );
    echo $myDebugBar->showDebugbar();
}