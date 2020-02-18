# API for Vật Giá Framework [![Build Status](https://travis-ci.org/harrydeluxe/php-liquid.svg?branch=develop)](https://travis-ci.org/harrydeluxe/php-liquid)

Vật Giá Framework API là class giúp xây dựng hệ thống APi từ core Vật Giá Framework:

 * Hỗ trợ wrapper giúp biến tất cả repository trong app thành API


## Installing

Config composer repositories from vatgia private repositories

    "repositories": {
        {
            "type": "vcs",
            "url": "ssh://git@gitlab.hoidap.vn:2012/vatgia/api.git"
        } 
    }
   
Then, you can install this lib via [composer](https://getcomposer.org/):

    composer require vatgia/api
    
Or
    
    "require": {
        "vatgia/api": "dev-master"
    }


Copy config file ```vendor/vatgia/api/config/api.php``` to directory ```config```

Add config to .env file. 

    API_APP_REPOSITORY_ENABLE = true
    
- true: Enable mode to make all repositories in app to api 
- false: Disable mode to make all repositories in app to api


Register api service provider in ```config/app.php```

    'providers' => [
        ...    
        \VatGia\Api\ApiServiceProvider::class,
    ]


Or Create controller file ```public/pages/api.php``` with code:

    $controller = new \VatGia\Api\AppRepositoryController();
    echo $controller->process();

And write htaccess point to ```public/pages/api.php```

## Create your Controller 

Create Controller extends \VatGia\Api\AppRepositoryController

```
namespace AppView\Controllers;
        
        
use VatGia\Api\AppRepositoryController;
        
class AppApiController extends AppRepositoryController
{

    public function process()
    {
        ## Your code
    }

}
```
    

## Create api

Create Controller

```
    namespace AppView\Controllers\Api;
            
    use VatGia\Api\ApiController;
            
    class PostDetailController extends ApiController
    {
        
        public function get($id)
        {
            ## Your code
            $detail = model('posts/detail')->load(['id' => (int)$id]);
            
            return $detail['vars'];
        }
    
    }
```

Create route in file ```appview/routes.php```

    app('route')->get('api/posts/{id:\d+}', [\AppView\Controllers\Api\PostDetailController::class, 'process']);

And you can visit this api 

    HTTP GET http://framework.vatgia.com/api/posts/123
    
    
## Requirements

 * PHP 5.6+
 * vatgia/framework

## Issues

Have a bug? Please create an issue here on gitlab!

[http://gitlab.hoidap.vn/vatgia/api/issues](http://gitlab.hoidap.vn/vatgia/api/issues)