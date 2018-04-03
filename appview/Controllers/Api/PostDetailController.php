<?php
/**
 * Created by vatgia-framework.
 * Date: 6/26/2017
 * Time: 5:31 PM
 */

namespace AppView\Controllers\Api;


use AppView\Repository\PostRepository;
use VatGia\Api\ApiController;

class PostDetailController extends ApiController
{

    protected $postRepository;

    public function __construct(PostRepository $postRepository)
    {
        $this->postRepository = $postRepository;
        parent::__construct();
    }

    public function get($id)
    {
//        throw new \Exception('Hỏng rồi', 400);
        $detail = $this->postRepository->getByID($id);
        if (!$detail) {
            throw new \Exception('This post is not found', 404);
        }

        return $detail;
    }

}