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
            <div class="col-xs-12">
                <div class="box box-primary">
                    <div class="box-header with-border">
                        <h3 class="box-title">Thông tin cơ bản</h3>
                    </div><!-- /.box-header -->
                    <div class="box-body">
                    <?= $form->text("Tiêu đề", "ban_title", "ban_title", $ban_title, "Tiêu đề", 1, "", "", 255, "", "", ""); ?>
                    <?= $form->text("Đường dẫn", "ban_link", "ban_link", $ban_link, "Đường dẫn url", 1, "", "", "", "", "", ""); ?>
                    <!--                        --><?//= $form->select("Hình thức", "ban_type", "ban_type", $form_arr, $ban_type, "Hình thức", 1); ?>
                        <?= $form->getFile("", "ban_image", "ban_image", "", "", "", ""); ?>
                        <img style="display: none" id="blah" src="" width="300" height="200">
                        <br>
                        <br>
                        <!--                        --><?//= $form->wysiwyg("", "ban_html", $ban_html, $editor_path, "", 1); ?>
                        <?= $form->select("Trạng thái", "ban_active", "ban_active", $status_arr, $ban_active, "Trạng thái", 1); ?>
                    </div>
                </div>
            </div>

            <div class="col-xs-12">
                <div class="">
                    <div class="" style="text-align: center;">
                        <?= $form->radio("Sau khi lưu dữ liệu", "add_new" . $form->ec . "return_listing", "after_save_data", $add . $form->ec . $listing, $after_save_data, "Thêm mới" . $form->ec . "Quay về danh sách", 0, $form->ec, ""); ?>
                        <?= $form->button("submit" . $form->ec . "reset", "submit" . $form->ec . "reset", "submit" . $form->ec . "reset", "Cập nhật" . $form->ec . "Làm lại", "Cập nhật" . $form->ec . "Làm lại", ""); ?>
                        <?= $form->hidden("action", "action", "execute", ""); ?>
                        <?= $form->hidden("valradio", "valradio", 0); ?>
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

@section('header')
    <style type="text/css">
        /*#ban_image, #blah{
            display: none;
        }*/
        #cke_ban_html, #ban_type {
            display: none;
        }
    </style>
@stop

@section('script')
    <script>
        function readURL(input) {
            if (input.files && input.files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    $('#blah').attr('src', e.target.result).show();
                }

                reader.readAsDataURL(input.files[0]);
            }
        }

        $("#ban_image").change(function () {
            readURL(this);
        });

        // $('#form_choose').change(function(){
        //     var type = $(this).val();
        //     if(type == 1){
        //         $('#cke_ban_html').hide();
        //         $('#ban_image').show();
        //         $('#blah').show();
        //     }else{
        //         $('#cke_ban_html').show();
        //         $('#ban_image').hide();
        //         $('#blah').hide();
        //     }
        // });
    </script>
@stop