<?php
if(! function_exists('showPaginate'))
{
    /**
     * Tao ra môt doan phan trang
     *
     * @param array $data : mảng truyền vào để kiểm tra phân trang
     * @return string
     */
    function showPaginate($perPage, $currentPage, $total, $append = array())
    {
        $lastPage       = ceil($total / $perPage);
        $lpm1           = $lastPage - 1;
        $adjacents      = 2;
        $next           = $currentPage + 1;
        $dot            = "<li class='dot'><a>...</a></li>";

        $html_first_two = "<li><a href='".appendUrl($append,['page' => 1])."'>1</a></li>
                           <li><a href='".appendUrl($append, ['page' => 2])."'>2</a></li>";
        $html_near_last = "<li><a href='".appendUrl($append, ['page' => $lpm1])."'>$lpm1</a></li>
                           <li><a href='".appendUrl($append, ['page' => $lastPage])."'>$lastPage</a></li>";

        $pagination = '';
        if($lastPage > 1)
        {
            $pagination .= "<ul class='pagination'>";

            if ($lastPage < 7 + ($adjacents * 2))
            {
                for ($counter = 1; $counter <= $lastPage; $counter++)
                {
                    $pagination .= ($counter == $currentPage)
                        ? "<li class='active'><a>$counter</a></li>"
                        : "<li><a href='".appendUrl($append, ['page'=> $counter])."'>$counter</a></li>";
                }
            }
            elseif($lastPage > 5 + ($adjacents * 2))
            {
                // trường hợp dành cho việc phân trang lúc đầu nhỏ hơn 5
                if($currentPage < 1 + ($adjacents * 2))
                {
                    for ($counter = 1; $counter < 4 + ($adjacents * 2); $counter++)
                    {
                        $pagination .= ($counter == $currentPage)
                            ? "<li class='active'><a>$counter</a></li>"
                            : "<li><a href='".appendUrl($append, ['page'=> $counter])."'>$counter</a></li>";
                    }
                    $pagination.= $dot.$html_near_last;
                }
                //trường hợp dành cho page cuối cùng -4 lớn hơn page đang click
                elseif($lastPage - ($adjacents * 2) > $currentPage && $currentPage > ($adjacents * 2))
                {
                    $pagination.= $html_first_two;
                    $pagination.= $dot;

                    for ($counter = $currentPage - $adjacents; $counter <= $currentPage + $adjacents; $counter++)
                    {
                        $pagination .= ($counter == $currentPage)
                            ? "<li class='active'><a>$counter</a></li>"
                            : "<li><a href='".appendUrl($append, ['page'=> $counter])."'>$counter</a></li>";
                    }
                    $pagination.= $dot.$html_near_last;
                }
                // trường hợp click vào các page cuối cùng
                else
                {
                    $pagination.= $html_first_two;
                    $pagination.= $dot;

                    for ($counter = $lastPage - (2 + ($adjacents * 2)); $counter <= $lastPage; $counter++)
                    {
                        $pagination .= ($counter == $currentPage)
                            ? "<li class='active'><a>$counter</a></li>"
                            : "<li><a href='".appendUrl($append, ['page'=> $counter])."'>$counter</a></li>";
                    }
                }
            }

            if ($currentPage < $counter - 1)
            {
                $pagination.= "<li><a href='".appendUrl($append, ['page' => $next])."'>Next</a></li>";
                $pagination.= "<li><a href='".appendUrl($append, ['page' => $lastPage])."'>Last</a></li>";
            }else
            {
                $pagination.= "<li><a class='current'>Next</a></li>";
                $pagination.= "<li><a class='current'>Last</a></li>";
            }

            $pagination.= "</ul>\n";
        }

        return $pagination;
    }
}