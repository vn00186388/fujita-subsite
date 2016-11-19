<?php
/*
Template Name: Meetings
*/

get_header();
get_template_part('template-parts/slide', 'show');

if (have_posts()) :
$excerpt = get_the_excerpt();
$page_name = get_the_title();
$args = array(
    'post_type'      => 'meeting',
    'posts_per_page' => -1,
    'suppress_filters' => 0,
);
$meeting_query = new WP_Query( $args );
if ( $meeting_query->have_posts() ){
    $meetings = array();
    $categories = array();
    //Number of meeting post
    $type_num = 0;
    while ( $meeting_query->have_posts() ) {
        $meeting_query->the_post();
        //To make sure title is clean.
        $title = get_the_title();
        $title = preg_replace("/[^a-zA-Z0-9_\s-]/", "", $title); // Make alphanumeric (removes all other characters)
        $title = preg_replace("/[\s-]+/", " ", $title); // Clean up multiple dashes or whitespaces
        $title = str_replace( '_', " ", $title ); // Remove underscore duh

        $content = get_the_content();
        $content = apply_filters( 'the_content', $content );
        $content = str_replace( ']]>', ']]&gt;', $content );

        $meeting_fields = pods('meeting', get_the_ID());
        $meeting_table = $meeting_fields->field('meeting_table') ? : false;

        //Need categories variable for dropdown menu.
        $categories[$type_num] = $title;
        $meeting_data[] = array();
        //Get infor from attachment
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
        }
        $meeting_data[$type_num] = array(
            'category'      => $title,
            'title'         => $image_title,
            'caption'       => $image_info['caption'],
            'image_thumb'   => $img_thumb != false ? $img_thumb : '#',
            'image_full'    => $img_full != false ? $img_full : '#',
            'image_alt'     => $image_alt,
            'content'       => $content,
            'meeting_table' => $meeting_table
        );
        $type_num++;
    }
}
?>
<main class="main-page meeting">
    <div class="container">
        <div class="main__title clearfix">
            <div class="col-xs-12 col-md-3 pull-right categories dropdown active">
                <div class="dropdown-toggle" id="menu1" data-toggle="dropdown"><?php _e('Categories', 'fjtss') ?>
                    <i class="fa fa-sort-desc" aria-hidden="true"></i>
                </div>
                <ul class="dropdown-menu" role="menu" aria-labelledby="menu1">
                <?php
                    if ( $categories ) :
                        foreach( $categories as $cnum => $category ) : ?>
                        <li role="presentation">
                            <a role="menuitem" data-id="<?php echo $cnum ?>" href="#<?php echo $category ?>">
                                <?php echo $category ?>
                            </a>
                        </li>
                    <?php endforeach;
                    endif;
                ?>
                </ul>
            </div>
            <div class="col-xs-12 col-md-9 meeting__title"><?php echo $page_name ?></div>
        </div>
        <?php if ( $excerpt ) : ?>
            <div class="excerpt">
                <?php echo $excerpt ?>
            </div>
        <?php endif; ?>
        <div class="main__content-row">
            <?php
        if ($meeting_data) :
            foreach( $meeting_data as $num => $item ) : ?>
            <div class="meetings__description row clearfix">
                <div class="meetings__description__image col-sm-6 col-sm-push-6">
                    <a class="btn btn-zoom magnific-popup" href="<?php echo $item['image_thumb'] ?>">
                        <i class="fa fa-search" aria-hidden="true"></i>
                    </a>
                    <img src="<?php echo $item['image_thumb'] ?>">
                </div>
                <div id="<?php echo $num ?>" class="meetings__description__text col-sm-6 col-sm-pull-6" tabindex="<?php echo $num + 1 ?>">
                    <?php echo $item['content'] ?>
                </div>
            </div>
            <div class="meetings_tables row clearfix">
                <?php
                    $content = apply_filters( 'the_content', $item['meeting_table'] );
                    $content = str_replace( ']]>', ']]&gt;', $content );
                    echo $content;
                ?>
            </div>
        <?php endforeach;
        endif; ?>
            <div class="meetings_form">
                <script type="text/javascript" src="https://form.jotform.me/jsform/63083046451451"></script>
            </div>
            <div class="meetting_tables__reset">
              <a>reset</a>
              <div class="btn btn-submit"><?php _e('Submit', 'fjtss') ?></div>
            </div>
            <div class="dropdown-image"><?php echo get_template_directory_uri() . '/img/dropdown.png' ?></div>
            <div class="datetime-image"><?php echo get_template_directory_uri() . '/img/datetime.png' ?></div>
        </div>
    </div>
</main>
<?php
    endif;
    get_footer();