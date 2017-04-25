<?php
/**
 * Created by ntdinh1987.
 * User: ntdinh1987
 * Date: 12/2/16
 * Time: 11:58 PM
 */
try {

    if (!isset($_SERVER['PHP_AUTH_USER'])) {
        header('WWW-Authenticate: Basic realm="My Realm"');
        header('HTTP/1.0 401 Unauthorized');
        echo 'Authen Account is require.';
        exit;
    } else {
        $development_accounts = require_once dirname(__FILE__) . '/../../app/development_account.php';
        if (
            !array_key_exists($_SERVER['PHP_AUTH_USER'], $development_accounts)
            || !$_SERVER['PHP_AUTH_PW'] == $development_accounts[$_SERVER['PHP_AUTH_USER']]['password']
        ) {
            echo 'Authen Account is wrong. Please config in .env';
            exit;
        }
    }

    if (config('app.env') == 'production') {
        exit;
    }

    define('IS_API_CALL', true);

    require_once dirname(__FILE__) . '/../../bootstrap/bootstrap.php';

    $body = json_decode(file_get_contents('php://input'), true);

    if ('POST' !== strtoupper($_SERVER['REQUEST_METHOD'])) {
        throw new Exception('API Method require POST', 400);
    }

    if (!$body || !is_array($body)) {
        throw new Exception('Body is empty');
    }

    $modelDrive = new \VatGia\LoadDirectModel();

    $model = new \VatGia\Model($modelDrive);

    $data = $model->loadModel($body, $body['modelName']);

    echo serialize($data);
    return;
} catch (Exception $e) {
    echo serialize($e);
    return;
}
