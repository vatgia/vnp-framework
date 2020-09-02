<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>ACECrm - <?= trans('register_new_account', 'Đăng ký tài khoản mới') ?></title>
    <!-- Tell the browser to be responsive to screen width -->
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- Font Awesome -->
    <link rel="stylesheet" href="<?= asset('adminlte/plugins/fontawesome-free/css/all.min.css') ?>">
    <!-- Ionicons -->
    <link rel="stylesheet" href="https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css">
    <!-- icheck bootstrap -->
    <link rel="stylesheet" href="<?= asset('adminlte/plugins/icheck-bootstrap/icheck-bootstrap.min.css') ?>">
    <!-- Theme style -->
    <link rel="stylesheet" href="<?= asset('adminlte/dist/css/adminlte.min.css') ?>">
    <!-- Google Font: Source Sans Pro -->
    <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700" rel="stylesheet">
</head>
<body class="hold-transition register-page">
<div class="register-box">
    <div class="register-logo">
        <a href="<?= url('index') ?>"><b>VNP</b>Framewrok</a>
    </div>

    <div class="help-block show_err">
        <?php
            \VatGia\Helpers\Facade\FlashMessage::display();
        ?>
    </div>

    <div class="card">
        <div class="card-body register-card-body">
            <p class="login-box-msg"><?= trans('register_new_membership', 'Đăng ký tài khoản mới') ?></p>

            <form method="post">
                <div class="input-group mb-3">
                    <input required name="name" type="text" class="form-control"
                           placeholder="<?= trans('label.fullname', 'Họ và tên') ?>">
                    <div class="input-group-append">
                        <div class="input-group-text">
                            <span class="fas fa-user"></span>
                        </div>
                    </div>
                </div>
                <div class="input-group mb-3">
                    <input name="email" type="email" class="form-control" placeholder="Email">
                    <div class="input-group-append">
                        <div class="input-group-text">
                            <span class="fas fa-envelope"></span>
                        </div>
                    </div>
                </div>
                <div class="input-group mb-3">
                    <input required name="phone" type="text" class="form-control"
                           placeholder="<?= trans('label.phone', 'Số điện thoại') ?>">
                    <div class="input-group-append">
                        <div class="input-group-text">
                            <span class="fas fa-phone"></span>
                        </div>
                    </div>
                </div>
                <div class="input-group mb-3">
                    <input required name="password" type="password" class="form-control"
                           placeholder="<?= trans('label.password', 'Mật khẩu') ?>">
                    <div class="input-group-append">
                        <div class="input-group-text">
                            <span class="fas fa-lock"></span>
                        </div>
                    </div>
                </div>
                <div class="input-group mb-3">
                    <input required name="retype_password" type="password" class="form-control"
                           placeholder="<?= trans('label.retype_password', 'Nhập lại mật khẩu') ?>">
                    <div class="input-group-append">
                        <div class="input-group-text">
                            <span class="fas fa-lock"></span>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-8">
                        <div class="icheck-primary">
                            <input type="checkbox" id="agreeTerms" name="terms" value="agree">
                            <label for="agreeTerms">
                                <?= trans('i_agree_to_the', 'Tôi đồng ý với') ?>
                                <a href="#"><?= trans('terms', 'điều khoản người dùng') ?></a>
                            </label>
                        </div>
                    </div>
                    <!-- /.col -->
                    <div class="col-4">
                        <button type="submit"
                                class="btn btn-primary btn-block"><?= trans('label.register', 'Đăng ký') ?></button>
                    </div>
                    <!-- /.col -->
                </div>
            </form>

            <div class="social-auth-links text-center">
                <p>- OR -</p>
                <a href="#" class="btn btn-block btn-primary">
                    <i class="fab fa-facebook mr-2"></i>
                    Sign up using Facebook
                </a>
                <a href="#" class="btn btn-block btn-danger">
                    <i class="fab fa-google-plus mr-2"></i>
                    Sign up using Google+
                </a>
            </div>

            <a href="<?= url('login') ?>"
               class="text-center"><?= trans('i_already_have_a_membership', 'Tôi đã có tài khoản') ?>?</a>
        </div>
        <!-- /.form-box -->
    </div><!-- /.card -->
</div>
<!-- /.register-box -->

<!-- jQuery -->
<script src="<?= asset('adminlte/plugins/jquery/jquery.min.js') ?>"></script>
<!-- Bootstrap 4 -->
<script src="<?= asset('adminlte/plugins/bootstrap/js/bootstrap.bundle.min.js') ?>"></script>
<!-- AdminLTE App -->
<script src="<?= asset('adminlte/dist/js/adminlte.min.js') ?>"></script>
</body>
</html>
