<?php
/**
 * Created by PhpStorm.
 * User: apple
 * Date: 5/7/18
 * Time: 23:19
 */

namespace AppView\Repository;


class SettingRepository
{

    public function all()
    {
        $result = model('settings/all')->load();

        return collect_recursive($result['vars']);
    }
}