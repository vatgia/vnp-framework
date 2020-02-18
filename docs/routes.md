# Routes

Routes được tạo ra để handle request đến từ phía client và chuyển nó đến Controller để xử lý

Hỗ trợ các Http method phổ biến: GET, PUT, POST, PATCH, DELETE

`GET`

    Route::get('http://example.com', [ExampleController::class, 'index]);
    //Or
    Route::get(['http://example.com', 'post'], [ExampleController::class, 'index']);

`POST`

    Route::post('http://example.com', [ExampleController::class, 'index]);
    //Or
    Route::post(['http://example.com', 'post'], [ExampleController::class, 'index']);

`PUT`

    Route::put('http://example.com', [ExampleController::class, 'index]);
    //Or
    Route::put(['http://example.com', 'post'], [ExampleController::class, 'index']);

`PATCH`

    Route::patch('http://example.com', [ExampleController::class, 'index]);
    //Or
    Route::patch(['http://example.com', 'post'], [ExampleController::class, 'index']);

`DELETE`

    Route::delete('http://example.com', [ExampleController::class, 'index]);
    //Or
    Route::delete(['http://example.com', 'post'], [ExampleController::class, 'index']);

### Tạo route

#### Viết ngắn gọn

    Route::get('/',[\AppView\Controllers\HomeController::class, 'render']);

#### Viết đầy đủ

    // index là tên route
    Route::get(['/', 'index'],[\AppView\Controllers\HomeController::class, 'render']);

### Filter

  Route cung cấp 1 cơ chế filter Request trước khi triệu gọi `Controllers`

#### Định nghĩ Filter

    Route::filter('auth', function () {
      if (!app('user')->logged) {
          return redirect('/login');
      }
      return null;
    });

#### Sử dụng Filter

    Route::get(['/profile', 'profile'],[\AppView\Controllers\ProfileController::class, 'getProfile'], ['before' => 'auth']);

#### Name Route

    app('route')->route($routeName, $routeParams)
    
#### Dependency injection in Controller

    <?php
    /**
     * Created by PhpStorm.
     * User: Stephen Nguyen
     * Date: 4/27/2017
     * Time: 5:10 PM
     */
    
    namespace AppView\Controllers;
    
    
    use AppView\Repository\PostRepository;
    use AppView\Repository\PostRepositoryInterface;
    use VatGia\Cache\Facade\Cache;
    use VatGia\Phroute\Phroute\RouteCollector;
    
    class PostController extends FrontEndController
    {
    
        /**
         * @var PostRepositoryInterface
         */
        protected $post;
    
        /**
         * PostController constructor.
         * @param PostRepositoryInterface $post
         */
        public function __construct(PostRepositoryInterface $post)
        {
    
            parent::__construct();
            $this->post = $post;
        }
    
        /**
         * @param $slug
         * @param $id
         * @return mixed|string
         */
        public function detail($slug, $id, PostRepositoryInterface $post)
        {
    
            $detail = $post->getByID($id);
    
            return view('posts/detail')->render([
                'item' => $detail
            ]);
        }
    }

### Đọc thêm

  [PhpRoute](https://github.com/mrjgreen/phroute)