## Các bước tạo repository

- Tạo config trong file Repositories/config.php
        
        'categories/get_all' => [
                'title' => 'Lấy danh sách danh mục',
                'versions' => [
                    'v2' => [
                        'repo' => 'categories/v2/test_get_category'
                    ],
                    'v3' => [
                        'repo' => 'categories/v3/test_get_category'
                    ]
                ]
            ],

    - title: Tiêu đề repository
    - versions: Nếu repository có nhiều version thì định nghĩa tại đây. 
    - versions.repo: đường dẫn file repository tương ứng. Nếu không định nghĩa thì mặc định theo tên repository
- Tạo file repository tương ứng với config

- Ở Controller muốn chỉ định rõ là sử dụng version repository nào thì sử dụng như sau

        $data = model()->loadModel([
                    'version' => 'v2',
                ],
                    'categories/get_all'
                );

## Sử dụng Model (Class VatGia\Model\ModelBase)

- Tạo 1 Model cho bảng categories_multi

        namespace App\Models\Categories;
        
        
        use VatGia\Model\ModelBase;
        
        class CategoriesMulti extends ModelBase
        {
            public $table = 'categories_multi';
            protected $prefix = 'cat';
        }
        
- Sử dụng Model
        
        $categories = (new \App\Models\Categories\CategoriesMulti())->select_all();
        
- Các hàm thông dụng của class Model

    - public function useMaster(): ```Sử dụng db master``` 
    - public function useServer($force_server = null): ```Chỉ dịnh rõ là sử dụng db nào```
    - public function distinct($field = null): ```Lấy distince 1 trường```
    - public function fields(): ```Chỉ định các fields sẽ select```
            
            $model->fields('id, name', 'description');

    - public function sum($fields, $as = 'total'): ```Sum 1 trường```
    - public function from($table): ```Select từ table cụ thể```
    - public function inner_join($table, $conditions)
    - public function left_join($table, $conditions)
    - public function straight_join($table, $conditions)
    - public function where(): ```Điều kiện lấy dữ liệu```
    - public function group_by()
    - public function having()
    - public function order_by($field, $type = 'ASC')
    - public function limit($start, $size = null)
    - public function pagination($page_no = 1, $size = 10)
    - public function select($conditions = null): ``` Lấy 1 bản ghi```
    - public function select_all($conditions = null, $start = null, $size = null): ``` Lấy tất cả các bản ghi```
    - public function count(): ``` Đếm tổng số bản ghi```
    - public function find($conditions = null): ``` Lấy 1 bản ghi. Nhưng trả về dạng active record```
    - public function findByID($id): ``` Lấy 1 bản ghi theo ID trả về dạng active record```
    - public function insert($array_values = null, $insert_type = 'INTO'): ``` Thêm mới 1 hoặc nhiều bản ghi```
    - public function replace($array_values = null)
    - public function insert_ignore($array_values = null)
    - public function insert_multi($values, $insert_type = 'INTO'): ``` Insert nhiều bản ghi 1 lúc```
    - public function insertUpdate($insertData = null, $updateData = null): ``` Insert nếu đã tồn tại bản ghi thì update```
    - public function update($array_values = null, $conditions = null)
    - public function delete($conditions = null)
    
- Ví dụ:

        $news = new \App\Models\News();
             $items = $news
             ->fields('new_id, new_title, new_brief, new_content', 'new_view + new_review AS new_point')
             ->from('news')
             ->inner_join('categories', 'new_cat_id = cat_id')
             ->left_join('new_stat', 'new_id = nst_new_id')
             ->where('new_cat_id = 5')
             ->where('new_active = 1', 'new_admin_create = 5')
             ->where('new')
             ->having('new_point > 100')
             ->order_by('new_hot DESC', 'new_create_time DESC')
             ->select_all();
             
        