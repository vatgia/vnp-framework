<?php
/**
 * Created by PhpStorm.
 * User: ntdinh1987
 * Date: 4/24/2017
 * Time: 2:44 PM
 */

namespace AppView\Controllers\Auth;


use AppView\Repository\UserRepository;
use VatGia\Auth\Facade\Auth;
use VatGia\ControllerBase;
use VatGia\Helpers\Facade\FlashMessage;

/**
 * Class AuthController
 * @package AppView\Controllers\Auth
 */
class AuthController extends ControllerBase
{

    protected $idvgHelper;

    /**
     * @return string
     */
    public function showLoginForm()
    {
        if(Auth::isLogged())
        {
            redirect(url_back());
        }

        return view('auth/login')->render();
    }

    public function postLogin(UserRepository $repository)
    {

        $username = getValue('username', 'str', 'POST', '');
        $password = getValue('password', 'str', 'POST', '');
        $remember = getValue('remember', 'int', 'POST', 0);
        if ($repository->login($username, $password, $remember)) {
            return FlashMessage::success('Đăng nhập thành công', url('index'));
        } else {
            return FlashMessage::error('Đăng nhập lỗi', url_back());
        }
    }

    public function logout()
    {
        return Auth::logout();
    }

    public function showProfile()
    {

    }


    public function register()
    {

        if(Auth::isLogged())
        {
            redirect(url_back());
        }

        return view('auth/register')->render();
    }

    public function postRegister(UserRepository $userRepository)
    {

        $name = getValue('name', 'str', 'POST');
        $email = getValue('email', 'str', 'POST');
        $phone = getValue('phone', 'str', 'POST');
        $password = getValue('password', 'str', 'POST');
        $retype_password = getValue('retype_password', 'str', 'POST');
        try {
            $userRepository->register($name, $email, $phone, $password, $retype_password);
            redirect(url('index'));
        } catch (\Exception $e) {
            return FlashMessage::error($e->getMessage(), url_back());
        }

    }

}