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

### Đọc thêm

  [PhpRoute](https://github.com/mrjgreen/phroute)