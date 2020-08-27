@extends('module-master')

@section('content')
    <section class="content">
        <div class="box box-primary">
            <div class="box-header with-border">
                <h3 class="box-title">Danh sách cấu hình</h3>
            </div>
            <!-- /.box-header -->
            <div class="box-body">
                <div class="row">
                    <div class="col-md-12">
                        {!! $data_table !!}
                    </div>
                </div>
                <!-- /.row -->
            </div>
            <!-- /.box-body -->
            <div class="box-footer">

            </div>
        </div>
    </section>
@stop

@section('header')
    <style type="text/css">
        img{
            object-fit: scale-down;
        }
    </style>
@stop

@section('script')
    <script>


    </script>
@stop