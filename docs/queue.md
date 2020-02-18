Cách sử dụng Queue

- Install
    
        composer require vatgia/queue

- Copy config từ đường dẫn ```vendor/vatgia/queue/config/queue.php``` vào thư mục ```config```

- Thêm Queue service provider trong file ```config/app.php```

        'providers' => [
            ...
            \VatGia\Queue\QueueServiceProvider::class,
        ],
        
- Config queue trong .env

        'QUEUE_DRIVER' => 'database',
        
- Thêm database

        CREATE TABLE `queue` (
          `que_id` int(11) NOT NULL AUTO_INCREMENT,
          `que_name` varchar(255) DEFAULT NULL,
          `que_payload` text,
          `que_created_at` datetime DEFAULT NULL,
          `que_updated_at` datetime DEFAULT NULL,
          `que_running` tinyint(1) DEFAULT '0',
          `que_running_at` int(11) DEFAULT '0',
          `que_attempts` int(11) DEFAULT NULL,
          `que_can_run_at` int(11) DEFAULT NULL,
          `que_can_run_local` tinyint(1) DEFAULT '0',
          PRIMARY KEY (`que_id`),
          KEY `que_name_index` (`que_name`),
          KEY `can_run_at_index` (`que_can_run_at`),
          KEY `running_index` (`que_running`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

## Sử dụng

1. Thêm 1 job vào queue
        
        use VatGia\Queue\Facade\Queue;
        
        //Thêm 1 queue default
        Queue::push(UpdateCategoryAllChildWorker::class, ['category_id' => $category_id]);
        
        //Thêm 1 queue cụ thể
        Queue::pushOn('category_queue', UpdateCategoryAllChildWorker::class, ['category_id' => $category_id]);
        
        //Thêm 1 queue chạy sau 1 khoảng thời gian: $delay tính bằng giây
        Queue::later($delay, $worker, $data)
        
        //Thêm 1 queue cụ thể chạy sau 1 khoảng thời gian
        Queue::laterOn($queue_name, $delay, $worker, $data)
        
2. Chạy queue

        //Chạy queue default
        vendor/bin/vnp queue:work 
        
        //Chạy queue cụ thể
        vendor/bin/vnp queue:work queue_name
    
        
    