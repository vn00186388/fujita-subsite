<?php
/*
Template Name: Gallery
*/
get_header();
get_template_part('template-parts/slide', 'show');

if (have_posts()) :
$excerpt = get_the_excerpt();
$page_name = get_the_title();
$args = array(
    'post_type'      => 'gallery',
    'posts_per_page' => -1,
    'suppress_filters' => 0,
);
$gallery_query = new WP_Query( $args );
if ( $gallery_query->have_posts() ){
    $galleries = array();
    $categories = array();
    //Number of gallery post
    $type_num = 0;
    while ( $gallery_query->have_posts() ) {
        $gallery_query->the_post();
        //To make sure title is clean.
        $title = get_the_title();
        $title = preg_replace("/[^a-zA-Z0-9_\s-]/", "", $title); // Make alphanumeric (removes all other characters)
        $title = preg_replace("/[\s-]+/", " ", $title); // Clean up multiple dashes or whitespaces
        $title = str_replace( '_', " ", $title ); // Remove underscore duh
        //Need categories variable for dropdown menu.
        $categories[$type_num] = $title;
        $attachments = rojak_fg_get_attachments( get_the_ID() );
        $gallery_data[] = array();
        if ($attachments) {
            foreach ($attachments as $attachment) {
                $image_info  = wp_prepare_attachment_for_js($attachment->ID);
                $image_title = $image_info['title'];
                $image_title = preg_replace("/[^a-zA-Z0-9_\s-]/", "", $image_title); // Make alphanumeric (removes all other characters)
                $image_title = preg_replace("/[\s-]+/", " ", $image_title); // Clean up multiple dashes or whitespaces
                $image_title = str_replace( '_', " ", $image_title ); // Remove underscore duh
                $image_description = $image_info['description'];
                $image_alt         = $image_info['alt'] ? : $image_title;
                $thumb        = wp_get_attachment_image_src( $image_info['id'], 'slider-thumb' );
                $thumb_width  = $thumb[1];
                $thumb_height = $thumb[2];
                // Make sure the large image size is 400 x 240
                if ( $thumb_width == 400 && $thumb_height == 240 ) {
                    $img_thumb = fjtss_get_img_url('slider-thumb', $image_info['id']);
                    $img_full = fjtss_get_img_url('slider', $image_info['id']);
                    array_push($gallery_data[$type_num], array(
                        'category'      => $title,
                        'title'         => $image_title,
                        'caption'       => $image_info['caption'],
                        'image_thumb'   => $img_thumb != false ? $img_thumb : '#',
                        'image_full'    => $img_full != false ? $img_full : '#',
                        'image_alt'     => $image_alt,
                    ));
                }
            }
        }
        $type_num++;
    }
}
?>
    <main class="main-page gallery">
        <div class="container">
            <div class="main__title clearfix">
                <div class="col-xs-12 col-md-3 pull-right categories dropdown active">
                    <div class="dropdown-toggle" id="menu1" data-toggle="dropdown">
                        <?php _e('Categories', 'fjtss') ?><i class="fa fa-sort-desc" aria-hidden="true"></i>
                    </div>
                    <ul class="dropdown-menu" role="menu" aria-labelledby="menu1">
                        <?php
                        if ( $categories ) :
                            foreach( $categories as $cnum => $category ) :?>
                                <li role="presentation">
                                    <a role="menuitem" data-id="<?php echo $cnum ?>" href="#<?php echo $category ?>">
                                        <?php echo $category ?>
                                    </a>
                                </li>
                                <?php
                            endforeach;
                        endif;
                        ?>
                    </ul>
                </div>
                <div class="col-xs-12 col-md-9 gallery__title"><?php echo $page_name ?></div>
            </div>
            <?php if ( $excerpt ) : ?>
                <div class="excerpt">
                    <?php echo $excerpt ?>
                </div>
            <?php endif; ?>
            <div class="main__content-row">
                <?php
                if ($gallery_data) :
                    foreach( $gallery_data as $num => $items ) : ?>
                        <div class="gallery__type">
                            <div id="<?php echo $num ?>" class="gallery__item__title" tabindex="<?php echo $num + 1 ?>">
                                <?php echo $categories[$num] ?>
                            </div>
                            <div class="row gallery__list">
                                <?php foreach ($items as $item) : ?>
                                    <div class="gallery__item col-xs-6 col-md-3 text-center">
                                        <a class="btn btn-zoom magnific-popup" href="<?php echo $item['image_full'] ?>">
                                            <i class="fa fa-search" aria-hidden="true"></i>
                                        </a>
                                        <img src="<?php echo $item['image_thumb'] ?>" alt="<?php echo $item['image_alt'] ?>">
                                        <div class="gallery__caption"><?php echo $item['caption'] ?></div>
                                    </div>
                                <?php endforeach; ?>
                            </div>
                        </div>
                        <?php
                    endforeach;
                endif;?>
            </div>
        </div>
    </main>
<?php
    endif;
    get_footer();
