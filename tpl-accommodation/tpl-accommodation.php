<?php
/*
Template Name: Accomodation
*/

get_header();
get_template_part('template-parts/slide', 'show');

if (have_posts()) :
$excerpt = get_the_excerpt();
$page_name = get_the_title();
    
$args = array(
    'numberposts' => -1,
    'post_type'      => 'room',
    'posts_per_page' => -1,
    'suppress_filters' => 0,
);
$room_query = new WP_Query( $args );

if ( $room_query->have_posts() ){

    $categories = array();
    //Number of room post
    $type_num = 0;

    while ( $room_query->have_posts() ) {
        $room_query->the_post();
        //To make sure title is clean.
        $title = get_the_title();
        $title = preg_replace("/[^a-zA-Z0-9_\s-]/", "", $title); // Make alphanumeric (removes all other characters)
        $title = preg_replace("/[\s-]+/", " ", $title); // Clean up multiple dashes or whitespaces
        $title = str_replace( '_', " ", $title ); // Remove underscore duh

        //Need categories variable for dropdown menu.
        $categories[$type_num] = $title;
        $room_data[] = array();
        $room_fields = pods('room', get_the_ID());

        $room_size = $room_fields->field('room_size') ? : false;
        $bed_size = $room_fields->field('bed_size') ? : false;
        $room_equipment = $room_fields->field('room_equipment') ? : '';
        $room_amenities = $room_fields->field('room_amenities') ? : '';
        $image_info  = wp_prepare_attachment_for_js(get_post_thumbnail_id());
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
            $room_data[$type_num] = array(
                'category'          => $title,
                'title'             => $image_title,
                'caption'           => $image_info['caption'],
                'image_thumb'       => $img_thumb != false ? $img_thumb : '#',
                'image_full'        => $img_full != false ? $img_full : '#',
                'image_alt'         => $image_alt,
                'room_size'         => $room_size,
                'bed_size'          => $bed_size,
                'room_equipment'    => $room_equipment,
                'room_amenities'    => $room_amenities,
            );
        }
        $type_num++;
    }
}
?>
<main class="main-page guest__rooms">
    <div class="container">
        <div class="main__title clearfix">
            <div class="col-xs-12 col-md-3 pull-right categories dropdown active">
                <div class="dropdown-toggle" id="menu1" data-toggle="dropdown">
                    <i class="fa fa-sort-desc" aria-hidden="true"></i>
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
                endif; ?>
                </ul>
            </div>
            <div class="col-xs-12 col-md-9 guest__rooms__title"><?php echo $page_name ?></div>
        </div>
        <?php if($excerpt): ?>
            <div class="excerpt">
                <?php echo $excerpt;  ?>
            </div>
        <?php endif; ?>
        <div class="main__content-row">
        <?php
        if ($room_data) :
            foreach( $room_data as $num => $item ) : ?>
            <div class="guest__rooms__type">
                <div class="col-sm-6 col-sm-push-6 guest__rooms__image">
                    <a class="btn btn-zoom magnific-popup" href="<?php echo $item['image_full'] ?>">
                        <i class="fa fa-search" aria-hidden="true"></i>
                    </a>
                    <img src="<?php echo $item['image_thumb'] ?>">
                </div>
                <div id="<?php echo $num ?>" class="col-sm-6 col-sm-pull-6" tabindex="<?php echo $num + 1 ?>">
                    <div class="room__information">
                        <div class="room__style"><?php echo $categories[$num] ?></div>
                        <div class="room__size">
                            <?php
                              if($item['room_size']) : ?>
                                  <i><?php _e('Room size: ', 'fjtss') ?></i>
                                  <span><?php echo $item['room_size']; ?></span>
                            <?php endif ?>
                            <br>
                            <?php
                              if($item['bed_size']) : ?>
                                  <i><?php _e('Bed size: ', 'fjtss') ?></i>
                                  <span><?php echo $item['bed_size']; ?></span>
                              <?php endif ?>
                        </div>
                        <div class="room__equiments">
                            <p class="title"><?php _e('Room Equipments', 'fjtss') ?></p>
                            <p class="detail">
                                <?php echo $item['room_equipment']; ?>
                            </p>
                        </div>
                        <div class="room__equiments">
                            <p class="title"><?php _e('Room Amenities', 'fjtss') ?></p>
                            <p class="detail">
                                <?php echo $item['room_amenities']; ?>
                            </p>
                        </div><a class="btn__book"><?php _e('book now', 'fjtss') ?></a>
                    </div>
                </div>
            </div>
    <?php   endforeach;
        endif;?>
        </div>
    </div>
</main>
<?php
    endif;
    get_footer();
