<?php
/**
 * Created by ntdinh1987.
 * User: ntdinh1987
 * Date: 12/2/16
 * Time: 11:58 PM
 */

define('IS_API_CALL', true);

try {

    require_once dirname(__FILE__) . '/../../bootstrap/bootstrap.php';

    if (config('app.env') == 'production') {
        exit;
    }

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
