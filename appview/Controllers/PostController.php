<?php
/**
 * Created by PhpStorm.
 * User: Stephen Nguyen
 * Date: 4/27/2017
 * Time: 5:10 PM
 */

namespace AppView\Controllers;


use AppView\Repository\PostRepository;

class PostController
{

    /**
     *
     * Chứa các hàm thao tác với posts repository
     * @var PostRepository
     *
     */
    protected $post;

    public function __construct(PostRepository $post)
    {
        $this->post = $post;
    }

    public function detail($slug, $id)
    {
        $detail = $this->post->getByID($id);

        return view('posts/detail')->render([
            'item' => $detail
        ]);
    }
}