<nav aria-label="Page navigation example">
    <ul class="pagination">
        <?php if ($pagination->current_page > 1): ?>
            <li class="page-first page-item">
                <a class="page-link"
                   href="?page=1">
                    Trang đầu
                </a>
            </li>
        <?php endif; ?>
        <?php if ($pagination->links->previous ?? false): ?>
            <li class="page-previous page-item">
                <a class="page-link"
                   href="<?= $pagination->links->previous ?>">
                    Quay lại
                </a>
            </li>
        <?php endif; ?>
        <?php
        foreach ($page_list['data'] ?? [] as $key => $item) {
            ?>
            <li class="page-number page-item <?= ($item['current'] ? 'active' : '') ?>">
                <a class="page-link" href="<?= $item['url'] ?>">
                    <?= $key ?>
                </a>
            </li>
            <?php
        }
        ?>
        <?php if ($pagination->links->next ?? false): ?>
            <li class="page-next page-item">
                <a class="page-link"
                   href="<?= $pagination->links->next ?>">
                    Tiếp
                </a>
            </li>
        <?php endif; ?>

        <?php if ($pagination->current_page < $pagination->total_pages): ?>
            <li class="page-last page-item">
                <a class="page-link"
                   href="?page=<?= $pagination->total_pages ?>">
                    Trang cuối
                </a>
            </li>
        <?php endif; ?>

    </ul>
</nav>