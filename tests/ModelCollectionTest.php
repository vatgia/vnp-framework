<?php
/**
 * Created by ntdinh1987.
 * User: ntdinh1987
 * Date: 12/8/16
 * Time: 3:05 PM
 */

class ModelCollectionTest extends \PHPUnit\Framework\TestCase
{

    public $model;

    public function setUp()
    {
        $this->model = new \VatGia\Model\ModelBase('migrations');
        $this->model->useCollection();
    }

    public function tearDown()
    {
        unset($this->model);
    }

    public function testCollectionModelItemSelectAll()
    {
        $collection = $this->model->limit(2)->select_all();
        $this->assertInstanceOf(\VatGia\Helpers\Collection::class, $collection);

        foreach($collection as $item)
        {
            $this->assertInstanceOf(\VatGia\Model\ModelBase::class, $item);
        }
    }

    public function testCollectionModelSelect()
    {
        $collection = $this->model->select();
        $this->assertInstanceOf(\VatGia\Model\ModelBase::class, $collection);
    }

}