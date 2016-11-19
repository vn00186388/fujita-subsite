<?php
/*
Template Name: Offers
*/

get_header();
get_template_part('template-parts/slide', 'show');

if (have_posts()) :
    $excerpt = get_the_excerpt();
    $page_name = get_the_title();
?>
    <main class="main-page page-offers">
        <div class="container">
            <h3 class="main__title"><?php echo $page_name ?></h3>
            <?php if ( $excerpt ) : ?>
                <div class="excerpt">
                    <?php echo $excerpt ?>
                </div>
            <?php endif; ?>
            <div class="main__content-row">
                <div class="offers">
                </div>
            </div>
        </div>
    </main>
<?php
    endif;
    echo fjtss_websdk_home_offer_config();
    get_footer();
