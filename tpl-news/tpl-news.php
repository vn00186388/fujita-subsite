<?php
/*
Template Name: News
*/

get_header();
get_template_part('template-parts/slide', 'show');
if (have_posts()) :
    $excerpt = get_the_excerpt();
    if(has_post_thumbnail()) {
                $image_url = wp_get_attachment_url(get_post_thumbnail_id());
                $image_url = $image_url != false ? $image_url : '';
    }
?>
<main class="main-page news">
    <div class="container">
        <?php the_title('<h3 class="main__title">', '</h3>'); ?>
        <?php if ( $excerpt ) : ?>
            <div class="excerpt">
                <?php echo $excerpt ?>
            </div>
        <?php endif; ?>
        <div class="main__content-row">
            <div class="col-sm-6 col-sm-push-6 news__image">
                <a class="btn btn-zoom magnific-popup" href="<?php echo $image_url ?>">
                    <i class="fa fa-search" aria-hidden="true"></i>
                </a>
                <img src="<?php echo $image_url ?>">
            </div>
            <div class="col-sm-6 col-sm-pull-6">
                <?php the_content(); ?>
            </div>
        </div>
    </div>
</main>
<?php
    endif;
    get_footer();
