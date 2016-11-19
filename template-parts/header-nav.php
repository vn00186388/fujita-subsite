<?php
$languages = icl_get_languages('skip_missing=0&orderby=code');
$l_url = [];
foreach ($languages as $l) {
    if (!$l['active']) {
        $l_url[$l['language_code']] = $l['url'];
    }
}
?>
<div class="header__nav js_header__nav">
    <div class="header__nav-close version-mobile">
        <button class="btn-close js_btn-close"></button>
    </div>
    <div class="header__nav-logo-wh version-mobile">
        <a class="logo__link js_logo__link" href="#"></a>
    </div>
        <?php wp_nav_menu(array(
            'theme_location'    => 'primary',
            'container'         => 'nav',
            'container_class'   => 'header__nav-menu menu menu--primary',
            'menu_class'        => 'ul' . ICL_LANGUAGE_CODE . ' menu__ul menu--primary__ul',
            'fallback_cb' => false
        )); ?>
    <div class="header__nav-lang nav-lang center--table version-mobile">
        <span class="inner"><?php _e('Language:', 'fjtss') ?></span>
        <ul class="nav-lang__ul">
            <?php foreach($l_url as $code => $url) : ?>
            <li class="nav-lang-item <?php echo $code == 'ja' ? 'ja js_ja' : '' ?>">
                <a class="nav-lang-link" href="<?php echo $url ? :'#' ?>">
                    <img src="<?php echo get_template_directory_uri() . '/img/flags/'. $code . '.png' ?>">
                </a>
            </li>
            <?php endforeach; ?>
        </ul>
    </div>
    <div class="header__nav-logo-wh version-mobile">
        <a class="logo__link js_logo__link" href="#"></a>
    </div>
</div>
<div class="header--top b-layout">
    <div class="header__ch-wrapper ch-wrapper ch-wrapper--right layout-right version-mobile">
        <button class="btn btn-hotel-list js_btn-hotel-list"><?php _e('our hotels', 'fjtss') ?></button>
    </div>
    <div class="header__logo logo layout-middle">
        <a class="logo__link js_logo__link" href="/">
        </a>
    </div>
</div>
<div class="header--bottom b-layout version-mobile">
    <div class="header__ch-wrapper ch-wrapper ch-wrapper--right layout-right">
        <button class="btn btn-menu js_btn-menu"><i class="fa fa-bars" aria-hidden="true"></i></button>
    </div>
    <div class="header__ch-wrapper layout-middle">
        <button class="btn btn-book js_btn-book"><?php _e('Book now', 'fjtss') ?></button>
    </div>
</div>
<script type="text/javascript">window.allHotelsJsonUrl = 'http://fujita-group.wsdasia-sg-1.wp-ha.fastbooking.com/wp-json/fujita-group/v1/hotels';</script>
