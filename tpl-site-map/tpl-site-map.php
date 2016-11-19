<?php
/*
Template Name: Site map
*/

get_header();
get_template_part('template-parts/slide', 'show');

if (have_posts()) :
    $excerpt = get_the_excerpt();
    $page_name = get_the_title();
?>
<main class="main-page sitemap">
    <div class="container">
        <h3 class="main__title"><?php echo $page_name ?></h3>
        <?php if ( $excerpt ) : ?>
            <div class="excerpt">
                <?php echo $excerpt ?>
            </div>
        <?php endif; ?>
        <div class="main__content-row">
            <?php
                $walker = new Page_Walker();
                wp_list_pages( array(
                    'title_li' => '',
                    'walker' => $walker,
                    'exclude' => get_the_ID(),
                    'sort_column' => 'menu_order'
                ) );
            ?>
        </div>
    </div>
</main>
<?php
    endif;
    get_footer();
