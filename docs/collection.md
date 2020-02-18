# Collection

Collection là một đối tượng chứa nhiều đối tượng khác. Nói một cách khác nó được sử dụng như một mảng hướng đối tượng.

## Tạo một collection

    use VatGia\Helpers\Collection;

    $data = array($item1, $item2, $item3);
    $collection = new Collection($data);
    
hoặc

    $collection = collect($data);
    
Tạo collection đệ quy. Tức là tạo collection cho array nhiều cấp

    $data = [
        [
            'key' => 'value'
        ],
        [
            'key' => 'value'
        ],
        ...
    ];
    
    $collection = collect_recursive($data);

## Helpers

`first`: Lấy item đầu tiên của collection

    $item = $collection->first();

`last`: Lấy item cuối cùng của collection

    $item = $collection->last();

`all`: Lấy tất cả items trong collection

    $items = $collection->all();

`count`: Đếm số lượng item trong một collection

    $countItem = $collection->count();

`toArray`: Chuyển các đối tượng trong collection thành mảng

    $itemArray = $collection->toArray();
    
Trong trường hợp `$collection` là 1 collection chứa các `Model`, khi ta gọi `$collection->toArray()` thì các `Model` trong cũng được gọi `toArray`
Hàm `toArray` của `Model` khi được gọi sẽ trả về 1 mảng với các keys là các column trong bảng đã được remove prefix. Muốn không remove prefix ta gọi như sau

    $items = $collection->toArray(false);

`filter`: Lọc các item theo một điều kiện nào đấy

    $collection->filter(function ($item) {
      return $item > 0
    });
    
    
*Còn nhiều hàm của collection nhưng chưa bắt chước hết trong cái colleciton của Laravel. Ai rảnh thì bổ xung đi :))*
Tham khảo: https://github.com/illuminate/support/blob/master/Collection.php