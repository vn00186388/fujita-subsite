<?php
$tpl_news_id        = rojak_get_page_id_by_tpl('tpl-news');
$tpl_news_url       = $tpl_news_id ? esc_url(get_permalink($tpl_news_id)) : '#';
$tpl_contact_id     = rojak_get_page_id_by_tpl('tpl-faq-contact');
$tpl_contact_url    = $tpl_contact_id ? esc_url(get_permalink($tpl_contact_id)) : '#';
$tpl_sitemap_id     = rojak_get_page_id_by_tpl('tpl-site-map');
$tpl_sitemap_url    = $tpl_sitemap_id ? esc_url(get_permalink($tpl_sitemap_id)) : '#';
$tpl_policy_id      = rojak_get_page_id_by_tpl('tpl-privacy');
$tpl_policy_url     = $tpl_policy_id ? esc_url(get_permalink($tpl_policy_id)) : '#';
$tpl_credit_id      = rojak_get_page_id_by_tpl('tpl-credit');
$tpl_credit_url     = $tpl_credit_id ? esc_url(get_permalink($tpl_credit_id)) : '#';
?>
<div class="container">
    <div class="footer__content__wrapper">
        <div class="row">
            <div class="col-xs-6 col-md-4 footer__nav">
                <ul>
                    <?php   if($tpl_news_id): ?>
                        <li><a class="footer__nav_item" href="<?php echo $tpl_news_url ?>"><?php _e('News', 'fjtss') ?></a></li>
                    <?php   endif;
                            if($tpl_contact_id) : ?>
                        <li><a class="footer__nav_item" href="<?php echo $tpl_contact_url ?>"><?php _e('Contact Us', 'fjtss') ?></a></li>
                    <?php   endif;
                            if($tpl_sitemap_id) : ?>
                        <li><a class="footer__nav_item" href="<?php echo $tpl_sitemap_url ?>"><?php _e('Site map', 'fjtss') ?></a></li>
                    <?php   endif;
                            if($tpl_policy_id) :  ?>
                        <li><a class="footer__nav_item" href="<?php echo $tpl_policy_url ?>"><?php _e('Privacy Policy', 'fjtss') ?></a></li>
                    <?php   endif;
                            if($tpl_credit_id) :  ?>
                        <li><a class="footer__nav_item" href="<?php echo $tpl_credit_url ?>"><?php _e('Credit', 'fjtss') ?></a></li>
                    <?php   endif; ?>
                </ul>
            </div>
            <div class="col-xs-6 col-md-4 footer__address">
                <ul>
                    <li class="footer__address_detail js_footer__address_detail"></li>
                    <li class="footer__address__phone js_footer__address__phone"></li>
                </ul>
            </div>
            <div class="col-xs-12 col-md-4">
                <ul class="footer__social js_footer__social">
                    <li><a href="#"><i class="fa fa-facebook-square" aria-hidden="true"></i></a></li>
                    <li><a href="#"><i class="icon-twitter"></i></a></li>
                    <li><a class="btn join-member" href="#"><?php _e('Join membership', 'fjtss') ?></a></li>
                </ul>
            </div>
        </div>
    </div>
    <div class="hotels__list__wrapper js_hotels__list__wrapper">
        <button class="btn btn-close js_btn-close"></button>
        <div class="hotels__list__logo center"><img src="<?php echo get_template_directory_uri() . '/img/logo-whg-white.png' ?>" alt="Hotel logo"></div>
        <div class="hotels__list js_hotels__list clearfix">

        </div>
    </div>
</div>
