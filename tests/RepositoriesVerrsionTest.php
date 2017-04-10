<?php

/**
 * Created by ntdinh1987.
 * User: ntdinh1987
 * Date: 12/6/16
 * Time: 8:38 AM
 */
class RepositoriesVerrsionTest extends \PHPUnit\Framework\TestCase
{

    /**
     * @var \VatGia\Model
     */
    private $model;
    
    public function setUp()
    {
        //config('app.app_dir', 'tests/app');
        $this->model = new \VatGia\Model();
    }

    public function tearDown()
    {
        unset($this->model);
    }

    public function testRepositoryNotDefineVersion()
    {
        $this->model->loadModel($input = [], $key = 'test/test_no_version');
    }

}