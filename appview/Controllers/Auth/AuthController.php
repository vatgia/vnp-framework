<?php
/**
 * Created by PhpStorm.
 * User: ntdinh1987
 * Date: 4/24/2017
 * Time: 2:44 PM
 */

namespace AppView\Controllers\Auth;


use AppView\Repository\UserRepository;
use VatGia\ControllerBase;
use VatGia\Helpers\Facade\FlashMessage;
use VatGia\Helpers\IDVGHelpers;

/**
 * Class AuthController
 * @package AppView\Controllers\Auth
 */
class AuthController extends ControllerBase
{

    protected $useOAuth2 = true;

    protected $idvgHelper;

    /**
     * AuthController constructor.
     *
     * Mặc định VNP Framework sẽ login bằng id.vatgia.com
     */
    public function __construct()
    {
        $this->idvgHelper = new IDVGHelpers(config('auth.idvg'));
    }

    /**
     * @return string
     */
    public function showLoginForm()
    {
        if (property_exists($this, 'useOAuth2') && $this->useOAuth2 == true) {
            return redirect($this->idvgHelper->loginRedirectLink('/'));
        }

        return view('auth/login')->render();
    }

    public function loginCallback()
    {
        $accessCode = getValue('access_code', 'str');

        if (!$accessCode) {
            return redirect('/');
        }

        $accessToken = $this->idvgHelper->getAccessTokenFromAccessCode($accessCode);

        if (!$accessToken) {
            return redirect('/login');
        }

        $loginCheck = model('login/login_with_idvg_access_token')->load([
            'access_token' => $accessToken
        ]);

        if (true === $loginCheck['vars']['success']) {
            return redirect('/');
        } else {
            return redirect('/');
        }

    }

    public function logout()
    {
        app('user')->logout();

        return redirect($this->idvgHelper->logoutLink());
    }

    public function showProfile()
    {
        return redirect('https://id.vatgia.com/v2/thiet-lap');
    }


    public function register()
    {

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
            redirect(url('dashboard.index'));
        } catch (\Exception $e) {
            return FlashMessage::error($e->getMessage(), url_back());
        }

    }

}