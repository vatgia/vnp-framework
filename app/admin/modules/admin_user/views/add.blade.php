@extends('module-master')

@section('content')
    <div class="container-fluid">
        <?php
        $form = new form();
        $form->create_form("add", $fs_action, "post", "multipart/form-data", 'onsubmit="validateForm(); return false;"');
        ?>
        <?php if($fs_errorMsg): ?>
        <div class="row">
            <div class="col-xs-12">
                <div class="alert alert-danger alert-dismissible">
                    <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
                    <h4><i class="icon fa fa-ban"></i> Có lỗi!</h4>
                    {!! $form->errorMsg($fs_errorMsg) !!}
                </div>
            </div>
        </div>
        <?php endif ?>
        <div class="row">
            <div class="col-xs-6">
                <div class="box box-primary">
                    <div class="box-header with-border">
                        <h3 class="box-title">Thông tin user</h3>
                    </div><!-- /.box-header -->
                    <div class="box-body">
                        <?= $form->text("Login name", "adm_loginname", "adm_loginname", $adm_loginname, "Login name", 1, "", "", 255, "", "", "") ?>
                        <?= $form->text("Fullname", "adm_name", "adm_name", $adm_name, "Fullname", 1, "", "", 255, "", "", "") ?>
                        <?= $form->text("Phone", "adm_phone", "adm_phone", $adm_phone, "Phone", 1, "", "", 255, "", "", "") ?>
                        <?= $form->password("Pasword", "adm_password", "adm_password", $adm_password, "Password", 1, "", "", 255, "", "", "") ?>
                        <?= $form->password("Confirm password", "adm_password", "adm_password", $adm_password, "Password", 1, "", "", 255, "", "", "") ?>
                        <?= $form->text("Email", "adm_email", "adm_email", $adm_email, "Email", 1, "", "", 255, "", "", "") ?>
                    </div>
                </div>
            </div>
            <div class="col-xs-6">
                <div class="box box-primary">
                    <div class="box-header with-border">
                        <h3 class="box-title">Phân quyền quản lý</h3>
                    </div><!-- /.box-header -->
                    <div class="box-body">
                        <table class="table table-bordered table-striped table-hover table-responsive">
                            <thead>
                            <tr>
                                <th class="text-center bg-primary">
                                    Hiển thị
                                </th>
                                <th class="text-center bg-primary">
                                    Tính năng
                                </th>
                                <th class="text-center bg-primary">
                                    Thêm mới
                                </th>
                                <th class="text-center bg-primary">
                                    Sửa
                                </th>
                                <th class="text-center bg-primary">
                                    Xóa
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            <?
                            foreach ($modules as $row){
                            //if(file_exists("../../modules/" . $row["mod_path"] . "/inc_security.php") === true){
                            ?>
                            <tr>
                                <td align="center">
                                    <input type="checkbox" name="mod_id[]" id="mod_id" value="<?=$row['mod_id'];?>">
                                </td>
                                <td class="textBold">
                                    <?=$row['mod_name'];?>
                                </td>
                                <td align="center">
                                    <input type="checkbox" name="adu_add<?=$row['mod_id'];?>"
                                           id="adu_add<?=$row['mod_id'];?>" value="1">
                                </td>
                                <td align="center">
                                    <input type="checkbox" name="adu_edit<?=$row['mod_id'];?>"
                                           id="adu_edit<?=$row['mod_id'];?>" value="1">
                                </td>
                                <td align="center">
                                    <input type="checkbox" name="adu_delete<?=$row['mod_id'];?>"
                                           id="adu_delete<?=$row['mod_id'];?>" value="1">
                                </td>
                            </tr>
                            <?
                            //}
                            }
                            //                            unset($db_getallmodule);
                            ?>
                            </tbody>

                        </table>
                    </div>
                </div>
            </div>

            <div class="col-xs-12">
                <div class="">
                    <div class="" style="text-align: center;">
                        <?= $form->button("submit" . $form->ec . "reset", "submit" . $form->ec . "reset", "submit" . $form->ec . "reset", "Cập nhật" . $form->ec . "Làm lại", "Cập nhật" . $form->ec . "Làm lại", ""); ?>
                        <?= $form->hidden("action", "action", "execute", ""); ?>
                        <?= $form->hidden("valradio", "valradio", 0) ?>
                    </div>
                </div>
            </div>
        </div>
        <?
        $form->close_form();
        unset($form);
        ?>
    </div>
@stop

@section('script')
    <script>

    </script>
@stop