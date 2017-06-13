<?php
/**
 * Auto build with command build:config
 */
return [
      'app' => include dirname(__FILE__) . '/app.php',
      'auth' => include dirname(__FILE__) . '/auth.php',
      'command' => include dirname(__FILE__) . '/command.php',
      'database' => include dirname(__FILE__) . '/database.php',
      'development' => include dirname(__FILE__) . '/development.php',
      'view' => include dirname(__FILE__) . '/view.php',
];
