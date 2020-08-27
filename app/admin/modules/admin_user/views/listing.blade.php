@extends('module-master')

@section('content')
    <section class="content">
        <div class="box box-primary">
            <div class="box-header with-border">
                <h3 class="box-title">
                    Danh sách
                </h3>
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

@stop

@section('script')
    <script>
        $('input.table-active').change(function () {
            var _input = $(this);
            $.ajax({
                type: 'POST',
                url: 'active.php',
                data: {
                    field: _input.attr('row-field'),
                    id: _input.attr('row-id'),
                    value: _input.is(':checked') ? 1 : 0
                },
                success: function (response) {
                }
            });
            $(this).is(':checked');
        });
    </script>
@stop