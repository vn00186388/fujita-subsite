<?php
$languages = icl_get_languages('skip_missing=0&orderby=code');
if (!empty($languages)) : ?>
<ul class="header__utility version-desktop">
    <?php get_template_part( 'template-parts/header', 'logo' ) ?>
    <li class="header__utility-item header__utility-lang lang">
        <a class="lang__current" href="#"><?php echo ICL_LANGUAGE_NAME ?><i class="fa fa-angle-down" aria-hidden="true"></i></a>
        <ul class="lang__list lang__ul">
            <?php
            foreach ($languages as $l) {
                if (!$l['active']) {
                    $temp_class = $l['code'] == 'ja' ? 'ja js_ja' : '';
                    echo '<li class="lang__item '.$temp_class.'">';
                    $l_url = $l['url'];
                    if (strpos($l['url'], $wp_query->query['pagename'])) {
                    }
                    echo '<a href="' . $l_url . '">';
                    echo icl_disp_language($l['native_name']);
                    echo '</a></li>';
                }
            } ?>
        </ul>
    </li>
</ul>
<?php endif; ?>