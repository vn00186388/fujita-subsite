<?php
/*
Template Name: Privacy
*/

get_header();
get_template_part('template-parts/slide', 'show');
if (have_posts()) :
    $excerpt = get_the_excerpt();
?>
    <main class="main-page privacy-policy">
        <div class="container">
            <?php the_title('<h3 class="main__title">', '</h3>'); ?>
            <?php if ( $excerpt ) : ?>
                <div class="excerpt">
                    <?php echo $excerpt ?>
                </div>
            <?php endif; ?>
            <div class="main__content-row">
                <?php the_content(); ?>
            </div>
        </div>
    </main>
<?php
endif;
get_footer();
