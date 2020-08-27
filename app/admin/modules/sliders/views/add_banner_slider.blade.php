@extends('module-master')

@section('content')
    <div class="container-fluid">
        <?php
        $form = new form();
        $form->create_form("add", $fs_action, "post", "multipart/form-data", 'id="add_banner"');
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
                        <?= $form->select("Tên slider", "sli_id", "sli_id", $arr_slider, $sli_id, "Id slider", 1, "", "", "", "onchange=\"chooseSlider(this);\"", ""); ?>

                        <? foreach($banner as $ban):
                            $query = new db_query('SELECT * 
                                                    FROM banner_slider 
                                                    WHERE bsl_sli_id = ' . $sli_id, 
                                                    'USE_SLAVE');
                            $rowQuery = $query->fetch();

                            $chooser_banner = false;
                            $full_time      = false;
                            $start_time     = 0;
                            $end_time       = 0;
                            $order          = 0;
                            if(!empty($rowQuery)){
                                foreach ($rowQuery as $row) {
                                    if($row['bsl_ban_id'] == $ban['ban_id']){
                                        $chooser_banner = true;
                                        $full_time = ($row['bsl_full_time'] == 1) ? true : false;
                                        $start_time = $row['bsl_start_time'];
                                        $end_time = $row['bsl_end_time'];
                                        $order = $row['bsl_order'];
                                    }

                                }
                            }

                            $url_image = url() . '/upload/banners/'.$ban['ban_image'];
                        ?>
                            <div class="banner_zone">
                                <span class="title_banner"><?=$ban['ban_title'];?></span>
                                <img src="<?=$url_image?>" onerror="errorImagePost(this);">
                                
                                <label for="choose_banner_<?=$ban['ban_id'];?>">
                                    <input type="checkbox" 
                                    name="choose_banner[<?=$ban['ban_id'];?>]" 
                                    id="choose_banner_<?=$ban['ban_id'];?>" 
                                    <?=($chooser_banner) ? 'checked' : ''?>
                                    /> Chọn
                                </label>  
                                <?php /*                              
                                <label for="choose_full_time_<?=$ban['ban_id'];?>">
                                    <input type="checkbox" 
                                    name="choose_full_time[<?=$ban['ban_id'];?>]" 
                                    id="choose_full_time_<?=$ban['ban_id'];?>"
                                    <?=($full_time) ? 'checked' : ''?>
                                    /> Không giới hạn thời gian
                                </label>
                                */ ?>
                                <div class="pick_time_zone">
                                    <?php /*
                                    <div class="time_zone">
                                        <span>Bắt đầu</span>
                                        <input id="choose_start_time_<?=$ban['ban_id'];?>"
                                        name="choose_start_time[<?=$ban['ban_id'];?>]" 
                                        onkeypress="displayDatePicker('choose_start_time[<?=$ban['ban_id'];?>]', this);"
                                        onclick="displayDatePicker('choose_start_time[<?=$ban['ban_id'];?>]', this);" 
                                        class="date_picker" value="<?=($start_time != 0) ? date('d/m/Y', $start_time) : date('d/m/Y');?>" 
                                        type="text"
                                        placeholder="dd/mm/YYYY"
                                        />
                                    </div>
                                    <div class="time_zone">
                                        <span>Kết thúc</span>
                                        <input id="choose_end_time_<?=$ban['ban_id'];?>"
                                        name="choose_end_time[<?=$ban['ban_id'];?>]" 
                                        onkeypress="displayDatePicker('choose_end_time[<?=$ban['ban_id'];?>]', this);"
                                        onclick="displayDatePicker('choose_end_time[<?=$ban['ban_id'];?>]', this);" 
                                        class="date_picker" value="<?=($end_time != 0) ? date('d/m/Y', $end_time) : date('d/m/Y');?>" 
                                        type="text"
                                        placeholder="dd/mm/YYYY"
                                        />
                                    </div>
                                    */?>
                                    {{-- <div class="order_zone"> --}}
                                        <span>Thứ tự</span>
                                        <input type="text" id="choose_order_<?=$ban['ban_id'];?>" 
                                            name="choose_order[<?=$ban['ban_id'];?>]" 
                                            class="order_banner" value="<?=($order != 0) ? $order : ''?>" />
                                    {{-- </div> --}}
                                </div>
                            </div>
                        <? endforeach;?>
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
    <link rel="stylesheet" href="../../resource/js/calendar/calendar.css">
    <style type="text/css">
        img{
            width: 228px;
            height: 152px;
            object-fit: scale-down;
        }

        .order_banner{
            width: 30px;
            float: left;
            text-align: center;
        }

        .time_zone{
            margin-top: 3px;
            width: 140px;
            float: left;
        }

        .title_banner{
            font-weight: bold;
            font-family: sans-serif;
            font-size: 13px;
            height: 35px;
            display: block;
        }

        label{
            font-family: sans-serif;
            font-size: 13px;
        }

        .banner_zone{
            height: 215px;
            width: 230px;
            border: 1px solid blue;
            float: left;
            margin: 5px 0 0 5px;
            position: relative;
        }

        .date_picker{
            text-align: center;
            width: 80px;
        }

        .pick_time_zone{
            position: absolute;
            top: 187px;
            width: 50%;
            background: white;
            opacity: 0.8;
            height: 26px;
            right: 0;
        }

        .pick_time_zone span{
            width: 55px;
            float: left;
            height: 26px;
            line-height: 26px;
            padding-left: 2px;
        }
    </style>
    <script>
        function errorImagePost(element){
            $(element).attr("src", "http://localhost:9004/assets/img/noimage.png");
            $(element).css("border", "1px solid #ccc");
        }
    </script>
@stop

@section('script')
    <script src="../../resource/js/calendar/calendar.js"></script>
    <script type="text/javascript">
        function chooseSlider(element){
            $sli_id = $(element).val();
            location.href='add_banner_slider.php?sli_id=' + $sli_id;
        }
    </script>
@stop