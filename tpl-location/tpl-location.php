<?php
/*
Template Name: Location
*/
get_header();
get_template_part('template-parts/slide', 'show');
if (have_posts()) :
    if(has_post_thumbnail()) {
        $image_url = wp_get_attachment_url(get_post_thumbnail_id());
        $image_url = $image_url != false ? $image_url : '';
    }
    ?>
    <main class="main-page main-location">
        <div class="container">
            <?php the_title('<h2 class="main__title">', '</h2>'); ?>
            <div class="main__content-row">
                <div class="location__image col-md-5">
                    <a class="btn btn-zoom magnific-popup" href="<?php echo $image_url ?>">
                        <i class="fa fa-search" aria-hidden="true"></i>
                    </a>
                    <img width="100%" src="<?php echo $image_url ?>">
                </div>
                <div class="location__info col-md-7">
                    <?php the_content(); ?>
                </div>
                <div class="location__map--desktop">
                    <div class="location__map col-xs-12" id="hotel-map"></div>
                    <div class="location__calculate col-xs-12">
                        <div class="location__calculate__wrapper">
                            <div class="location__calculate__footer">
                                <img class="location__car" src="<?php echo get_template_directory_uri() . '/img/car.png' ?>" width="25px">
                                <img src="<?php echo get_template_directory_uri() . '/img/person.jpg' ?>" width="25px">
                                <span class="location__calculate__text"><?php _e('CALCULATE ROUTE', 'fjtss') ?></span>
                                <input class="location__calculate__input js-route-address" type="text"
                                       placeholder="<?php _e('Type your location', 'fjtss') ?>">
                                <input class="location__calculate__button js-btn-calroute" type="button"
                                       value="<?php _e('CALCULATE ROUTE', 'fjtss') ?>">
                          <span class="location__calculate__reset js-btn-reset">
                              <i class="fa fa-angle-double-right" aria-hidden="true"></i> <?php _e('Reset', 'fjtss') ?>
                          </span>
                                <div class="location__calculate__address"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="location__map--mobile">
                    <img src="<?php echo get_template_directory_uri() . '/img/map.jpg' ?>" />
                </div>
                <div class="maker__hotel"><?php echo get_template_directory_uri() . '/img/icon-map-marker-blue.png' ?></div>
                <div class="clear"></div>
            </div>
        </div>
    </main>
    <?php
endif;
get_footer();
