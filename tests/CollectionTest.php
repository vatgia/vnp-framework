<?php
/**
 * Created by PhpStorm.
 * User: justin
 * Date: 15/12/16
 * Time: 15:19
 */

class CollectionTest extends \PHPUnit\Framework\TestCase {

    public $collection;

    public function setUp()
    {
        $this->collection = new \VatGia\Helpers\Collection();
        $items = [
            ['id' => 1, 'name' => 'Cong', 'age' => 26],
            ['id' => 2, 'name' => 'Binh', 'age' => 28]
        ];

        $this->collection->setItems($items);
    }

    public function tearDown()
    {
        unset($this->collection);
    }

    public function test_lists() {

        $actual = $this->collection->lists('id');
        $expected = [1,2];

        $this->assertEquals($expected, $actual);


        $actual = $this->collection->lists('id', 'name');

        $expected = [1 => 'Cong', 2 => 'Binh'];
        $this->assertEquals($expected, $actual);
    }

    public function test_filter() {
        $callback = function($item) {
            return $item['id'] == 1;
        };

        $actual = $this->collection->filter($callback);

        $expected = array_filter($this->collection->getItems(), $callback);

        $this->assertEquals($expected, $actual);
    }


    public function test_chunk() {
        $actual = $this->collection->chunk(2);

        $expected = array_chunk($this->collection->getItems(), 2);

        $this->assertEquals($expected, $actual);
    }


}