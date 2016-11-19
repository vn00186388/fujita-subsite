<?php
/*
Template Name: Dining
*/

get_header();
get_template_part('template-parts/slide', 'show');
if (have_posts()) :
$excerpt = get_the_excerpt();
$page_name = get_the_title();
$post_type = 'dining';
$args=array(
    'post_type'      => $post_type,
    'posts_per_page' => -1,
    'suppress_filters' => 0,
);
$dining_query = new WP_Query($args);
if ( $dining_query->have_posts() ):

?>
<main class="main-page main-breakfast">
    <?php while ( $dining_query->have_posts() ) : $dining_query->the_post();
        $image_url = has_post_thumbnail() ?  wp_get_attachment_url(get_post_thumbnail_id()) : '';
    ?>
    <div class="container">
        <h3 class="main__title"><?php echo $page_name ?></h3>
        <?php if ( $excerpt ) : ?>
        <div class="excerpt">
            <?php echo $excerpt ?>
        </div>      
        <?php endif; ?>
        <div class="main__content-row">
            <div class="breakfast-more row">
                <div class="col-md-6 col-right--desktop">
                    <div class="breakfast-more__image">
                        <a class="btn btn-zoom magnific-popup"
                           href="<?php echo $image_url ?>">
                          <i class="fa fa-search" aria-hidden="true"></i>
                        </a>
                        <img src="<?php echo $image_url ?>">
                    </div>
                </div>
                <div class="col-md-6">
                    <?php the_content(); ?>
                </div>
            </div>
        </div>
    </div>
    <?php endwhile; ?>
</main>
<?php   endif;
    endif;
        get_footer();
