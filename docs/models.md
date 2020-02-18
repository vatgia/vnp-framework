# Models

Models là những đối tượng Php đại diện cho các bảng trong CSDL

### Khai báo một model

    namespace App\Models;

    use Exception;
    use VatGia\Helpers\Collection;
    use VatGia\Model\Model;

    class Product extends Model
    {
      public $table = 'products'; //Bắt buộc khai báo
      public $prefix = 'pro'; //Bắt buộc khai báo
      public $id_field = 'id'; //Có thể khai báo hoặc không
      
    }

Model cần `extends` từ `VatGia\Model\Model` và phải khai báo 3 thuộc tính sau:

  - `$table`: Tên bảng
  - `$prefix`: Tiền tố tên trường
  - `$id_field`: Khóa chính ( Không ghi tiền tố  )

Model được viết theo cấu trúc ActiveRecord vì vậy các mệnh đề  đều có thể trỏ liên tục cho đến khi gọi `all()` hoặc `first()` để lấy dữ liệu

    Product::where('id > 10')
          ->where('category_id = 100')
          ->fields('id', 'name', 'category_id')
          ->order_by('id', 'DESC')
          ->all();

### Sử dụng Model để truy vấn CSDL

#### SELECT

Nếu muốn lấy nhiều bản ghi sử dụng `all()`, nếu muốn lấy chỉ một bản ghi đầu tiên sử dụng `first()`.

Nếu tồn tại các bản ghi phù hợp tiêu chi `all()` sẽ return ra một `Collection` chứa nhiều thể hiện của `Model`. Trong ví dụ này `Model` là `Product`. Ngược lại sẽ return một `Collection` rỗng.

`first()` sẽ return ra `Model` nếu tìm thấy trong CSDL ngược lại sẽ return `null`

    // Nếu muốn lấy bản ghi có id = 10
    Product::where('id = 10')->first();

    // Nếu muốn lấy id và name
    Product::fields('id', 'name')->all();

    // Nếu muốn lấy tất các trường
    Product::all();

Lấy dữ liệu sau khi gọi câu `all()`

    $products = Product::all();

    // $item sẽ là một thể hiện của model Product
    foreach ($products as $item) {
      echo $item->id;
      echo $item->name;
    }

Lấy dữ liệu sau khi gọi câu `first()`

    $product = Product::where('id = 10')->first();
    if ( null !== $product ) {
      echo $product->id;
      echo $product->name;
    }

#### FROM

Tùy chọn lấy dữ liệu từ bảng nào, mặc định sẽ lấy tên class lowercase làm tên bảng

    // Gọi kiểu static
    Product::from('products_1')->all();

    // Gọi trong nội hàm class
    class Product {
        public function getAll() {
            return $this->from('products_1')->all();
        }
    }

    // Gọi ngoài
    $product = new Product();
    $product->from('products_1')->all();


#### WHERE

    // Lấy các sản phẩm có id > 10
    Product::where('id', '>', 10)->all();

    // Lấy sản phẩm có name là Alibaba
    Product::where('name', 'Alibaba')->first();
    Product::where('name', '=', 'Alibaba')->first();

    // Lấy các sản phẩm có id > 10 và user_id = 100
    Product::where('id', '>', 10)->where('user_id', 100)->all();

#### ORDER BY

    Product::order_by('id', 'desc')
          ->order_by('name', 'asc')

#### HAVING

    Product::having('user_id > 5')

#### JOIN

    Product::inner_join('categories', 'pro_id = cat_id')
      ->inner_join('users', 'pro_user_id = use_id')

#### INSERT

`insert` sẽ trả về  id của bản ghi vừa insert

    $productId = Product::insert([
      'id' => 1,
      'name' => 'Alibaba'
    ]);


#### UPDATE

  Câu lệnh `update` bắt buộc phải có điều kiện `where`

    $affected_row = Product::where('id=10')->update([
      'name' => 'Black Bear'
    ]);

#### DELETE

  Câu lệnh `delete` bắt buộc phải có điều kiện `where`

    Product::where('id', 10)->delete();
    

# Relationship
Quan hệ giữa các model. Hỗ trợ lấy dữ liệu quan hệ nhanh gọn bằng cách config relationship trong model class

## Quan hệ 1 - 1

Quan hệ dạng 1 - 1: Ví dụ ta có bảng news có quan hệ 1 - 1 với bảng users. 
Tức là 1 tin tức thuộc 1 users. Ta định nghĩa quan hệ trong News Model như sau

    public function user()
    {
        return $this->hasOne(
            __FUNCTION__, //Tên quan hệ, trùng với tên function
            Users::class, //Model quan hệ,
            'use_id', //Key của bảng quan hệ (users)
            'new_user_id' //Key của users trong bảng hiện tại (news)
        );
    }
    
Cách dùng:

    $new = News::with(['user'])->findById(1);
    
    dd($new->user);
    
Hoặc có thể lazyload bằng cách gọi sau:

    $new = News::findById(1);
    
    dd($new->user);
    
## Quan hệ 1 - n

Quan hệ dạng 1 - nhiều: Ví dụ ta có quan hệ 1 danh mục có nhiều danh mục con. Ta viết trong Category Model như sau:

    
    public function childs()
    {
        return $this->hasMany(
            __FUNCTION__,
            static::class,
            'cat_parent_id',
            'cat_id'
        );
    }