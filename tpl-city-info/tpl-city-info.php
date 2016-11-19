<?php
/*
Template Name: City Info
*/

get_header();
get_template_part('template-parts/slide', 'show');

if (have_posts()) :
    $excerpt = get_the_excerpt();
    $page_name = get_the_title();
    ?>
    <main class="main-page main-city-info">
        <div class="container">
            <div class="city-info">
                <h3 class="main__title"><?php echo $page_name ?></h3>
                <?php if ($excerpt): ?>
                    <div class="excerpt">
                        <?php echo $excerpt; ?>
                    </div>
                <?php endif; ?>
                <div class="city-info__sliderbar">
                    <div class="city-info__places-of-interest">
                        <div
                            class="city-info__places-of-interest__title"><?php _e('PLACES OF INTEREST', 'fjtss') ?></div>
                        <div class="city-info__places-of-interest__content">
                        <span class="city-info__places-of-interest__text">
                            <?php _e('SEARCH BY INTEREST', 'fjtss') ?>
                        </span>
                            <ul class="city-info__places-of-interest__list"></ul>
                        </div>
                    </div>
                    <div class="city-info__detail-places">
                        <div class="city-info__detail-places__back">
                            <a class="js-city-info__detail-places__back--closed" href="#">
                                <i class="fa fa-angle-left" aria-hidden="true"></i>
                                <span><?php _e('PLACES OF INTEREST', 'fjtss') ?></span>
                            </a>
                        </div>
                        <div class="city-info__detail-places__title"><?php _e('ENTERTAINMENT', 'fjtss') ?></div>
                        <ul class="city-info__detail-places__list"></ul>
                    </div>
                    <div class="city-info__description">
                        <img class="city-info__description__image" src="" alt="">
                        <div class="city-info__description__title"></div>
                        <div class="city-info__description__content"></div>
                    </div>
                </div>
                <div class="city-info__map col-xs-12" id="city-hotel-map"></div>
                <div class="city-info__map--desktop">
                    <div class="city-info__calculate col-xs-12">
                        <div class="city-info__calculate__wrapper">
                            <div class="city-info__calculate__footer">
                                <img class="city-info__car"
                                     src="<?php echo get_template_directory_uri() . '/img/car.png' ?>" width="25px">
                                <img src="<?php echo get_template_directory_uri() . '/img/person.jpg' ?>" width="25px">
                                <span class="city-info__calculate__text"><?php _e('CALCULATE ROUTE', 'fjtss') ?></span>
                                <input class="city-info__calculate__input js-route-address" type="text"
                                       placeholder="<?php _e('Type your location', 'fjtss') ?>">
                                <input class="city-info__calculate__button js-btn-calroute" type="button"
                                       value="<?php _e('CALCULATE ROUTE', 'fjtss') ?>">
                    <span class="city-info__calculate__reset js-btn-reset">
                        <i class="fa fa-angle-double-right" aria-hidden="true"></i> <?php _e('Reset', 'fjtss') ?>
                    </span>
                                <div class="city-info__calculate__address"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="city-info__map--mobile">
                    <img src="<?php echo get_template_directory_uri() . '/img/map.jpg' ?>" />
                </div>
                <div
                    class="maker__hotel"><?php echo get_template_directory_uri() . '/img/icon-map-marker-blue.png' ?></div>
                <div class="clear"></div>
            </div>
        </div>
    </main>
    <?php
endif;
get_footer();
