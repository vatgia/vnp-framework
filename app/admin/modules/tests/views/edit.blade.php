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
                        <h3 class="box-title">Thông tin cơ bản</h3>
                    </div><!-- /.box-header -->
                    <div class="box-body">
                        <?= $form->select("Loại danh mục", "cat_type", "cat_type", $type_arr, $cat_type, "") ?>
                        <?= $form->text("Tên danh mục", "cat_name", "cat_name", $cat_name, "Tên danh mục", 1, "", "", 255, "", "", "") ?>
                        <?= $form->text("Rewrite", "cat_rewrite", "cat_rewrite", $cat_rewrite, "Rewrite đường dẫn url", 0, "", "", "", "", "", "") ?>
                        <?= $form->select("Trạng thái", "cat_show", "cat_show", $status_arr, $cat_show, "Trạng thái", 1) ?>
                        <?= $form->checkbox("Active", 'cat_active', 'cat_active', 1, $cat_active, '') ?>
                    </div>
                </div>
            </div>

            <div class="col-xs-6">
                <div class="box box-primary">
                    <div class="box-header with-border">
                        <h3 class="box-title">Thông tin thêm</h3>
                    </div><!-- /.box-header -->
                    <div class="box-body">
                        <?= $form->getFile('Icon', 'cat_icon', 'cat_icon', 'Icon') ?>

                        <?= $form->textarea("Mô tả", "cat_description", "cat_description", $cat_description, "Mô tả", 0, "", 100) ?>
                        <?= $form->text("Order", "cat_order", "cat_order", $cat_order, "", 1, "", "", 255, "", "", "") ?>

                    </div>
                    {{--<div class="box-footer">--}}

                    {{--</div>--}}
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

        $(function () {
            // set_max_order();
            change_write();
        });
        function locdau(str) {
            str = str.toLowerCase();
            str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
            str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
            str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
            str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
            str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
            str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
            str = str.replace(/đ/g, "d");
            str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'| |\"|\&|\#|\[|\]|~|$|_/g, "-");
            /* tìm và thay thế các kí tự đặc biệt trong chuỗi sang kí tự - */
            str = str.replace(/-+-/g, "-"); //thay thế 2- thành 1-
            str = str.replace(/^\-+|\-+$/g, "");
            //cắt bỏ ký tự - ở đầu và cuối chuỗi
            return str;
        }
        function change_write() {
            var rewrite = locdau($('#cat_name').val());
            var parent_select = $('#cat_parent_id option:selected');
            parent_id = $(parent_select).val();
            if (parent_id > 0) {
                var parent_rewrite = arr_parent_rewite[parent_id];
                rewrite = parent_rewrite + '/' + rewrite;
            }
            $('#cat_rewrite').val(rewrite);
        }
        function set_max_order() {
            var parent_select = $('#cat_parent_id option:selected');
            parent_id = $(parent_select).val();
            console.log(arr_parent_order);
            if (parent_id == 0) {
                $('#cat_order').val(parseInt(parent_max_order) + 1);
            } else {
                $('#cat_order').val(parseInt(arr_parent_order[parent_id]) + 1);
            }
        }
        $(function () {
            $('#cat_name').focus();
            $('#cat_name').keyup(function () {
                change_write();
            });
        });
    </script>
@stop