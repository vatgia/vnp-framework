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
    public function detail($slug, $id)
    {
        $detail = $this->post->getByID($id);

        return view('posts/detail')->render([
            'item' => $detail,
            'abc' => view('welcome')->render()
        ]);
    }
}