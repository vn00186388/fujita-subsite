<?php
/*
Template Name: Facilities
*/

get_header();
get_template_part('template-parts/slide', 'show');

if (have_posts()) :
    $excerpt = get_the_excerpt();
    $page_name = get_the_title();
?>
    <main class="main-page main-facilities">
        <div class="container">
            <h3 class="main__title"><?php echo $page_name ?></h3>
            <?php if ( $excerpt ) : ?>
                <div class="excerpt">
                    <?php echo $excerpt ?>
                </div>
            <?php endif; ?>
            <div class="main__content row facility-content js_facility-content">
            </div>
        </div>
    </main>
<?php
    endif;
    get_footer();
