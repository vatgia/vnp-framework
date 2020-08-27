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
                        <?= $form->text("Mô tả", "swe_label", "swe_label", $swe_label, "Mô tả", 1, "", "", 255, "", "", ""); ?>
                        <?= $form->text("Key", "swe_key", "swe_key", $swe_key, "Tên key", 1, "", "", 255, "", "readonly", ""); ?>

                        <?= $form->select("Type", "swe_type", "swe_type", $arr_type, $swe_type, "Kiểu dữ liệu", 1, "", ""); ?>

                        <label for=""><font class="form_asterisk"></font>Giá trị :</label>

                        <div id="swe_value_plain_text_bound">
                            <?= $form->textarea("", 'swe_value_plain_text', 'swe_value_plain_text', $swe_value)?>
                        </div>
                        <div id="swe_value_text_bound">
                            <?= $form->wysiwyg("", "swe_value_text", html_entity_decode($swe_value), $editor_path, "", 1); ?>
                        </div>
                        <div id="swe_value_image_bound">
                            <?= $form->getFile("", "swe_value_image", "swe_value_image", "", "", "", ""); ?>
                        </div>
                        <?php $arrImg = array_filter(explode("|", $swe_value));
                        foreach ($arrImg as $value):
                        ?>
                        <div class="gallery">
                            <img src="<?= url() . '/upload/setting/' . $value;?>"/>
                        </div>
                        <?php endforeach;?>
                    </div>
                </div>
            </div>

            <div class="col-xs-12">
                <div class="">
                    <div class="" style="text-align: center;">
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

        .gallery img {
            width: 300px;
            height: 200px;
        }

        .gallery {
            display: none;
        }
    </style>
@stop

@section('script')
    <script>
        $(function () {

            // Multiple images preview in browser
            var imagesPreview = function (input, placeToInsertImagePreview) {

                if (input.files) {
                    var filesAmount = input.files.length;

                    for (i = 0; i < filesAmount; i++) {
                        var reader = new FileReader();

                        reader.onload = function (event) {
                            $($.parseHTML('<img>')).attr('src', event.target.result).appendTo(placeToInsertImagePreview);
                        }

                        reader.readAsDataURL(input.files[i]);
                    }

                    $('div.gallery img').remove();
                }

            };

            $('#swe_value_image').on('change', function () {
                imagesPreview(this, 'div.gallery');
            });


        });

        $('#swe_type').change(function () {

            var type = $(this).val();
            if (type == 'text') {
                $('#swe_value_text_bound').show();
                $('#swe_value_plain_text_bound').hide();
                $('#swe_value_image_bound').hide();
                $('.gallery').hide();
            } else if (type == 'image') {
                $('#swe_value_text_bound').hide();
                $('#swe_value_plain_text_bound').hide();
                $('#swe_value_image_bound').show();
                $('.gallery').show();
            } else if (type == 'plain_text') {
                $('#swe_value_text_bound').hide();
                $('#swe_value_plain_text_bound').show();
                $('#swe_value_image_bound').hide();
                $('.gallery').hide();
            }
        });
        $('#swe_type').change();
    </script>
@stop