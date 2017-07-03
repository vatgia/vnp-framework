<?php
/**
 * Created by vatgia-framework.
 * Date: 6/28/2017
 * Time: 11:54 AM
 */

namespace AppView\Repository;


interface PostRepositoryInterface
{
    public function getByID($id);

    public function all();

}