<?php
/*
Template Name: FAQ & Contact
*/

get_header();
get_template_part('template-parts/slide', 'show');
if (have_posts()) :
    $excerpt = get_the_excerpt();
    $page_name = get_the_title();
    
    $args=array(
        'post_type'      => 'faq',
        'posts_per_page' => -1,
        'suppress_filters' => 0,
    );
    $faq_query = new WP_Query($args);
    if ( $faq_query->have_posts() ):
        $type_num = 0;
        while ( $faq_query->have_posts() ) {
            $faq_query->the_post();
            //To make sure title is clean.
            $title = get_the_title();
            $title = preg_replace("/[^a-zA-Z0-9_\s-]/", "", $title); // Make alphanumeric (removes all other characters)
            $title = preg_replace("/[\s-]+/", " ", $title); // Clean up multiple dashes or whitespaces
            $title = str_replace( '_', " ", $title ); // Remove underscore duh
            //Need categories variable for dropdown menu.
            $categories[$type_num] = $title;

            //CFS.
            if(function_exists('CFS')){
                $faq_qa = CFS()->get('faq_qa');
            }
            $type_num++;
        }
?>
<main class="main-page contact gallery">
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
                                <a role="menuitem" data-id="<?php echo $cnum ?>" href="#<?php echo $cnum ?>">
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
        <?php   if ( $excerpt ) : ?>
            <div class="excerpt">
                <?php echo $excerpt ?>
            </div>
        <?php   endif; ?>
        <div class="main__content-row">         
            <div class="contact-us">
        <?php   if ( $categories ) :
                $collapse = 0;
                foreach ( $categories as $num => $category ) :?>
                    <h1 class="title" id="<?php echo $num ?>"><?php echo $categories[$num] ?></h1>
                    <div class="panel-group" id="accordian<?php echo $num ?>">
                        <?php foreach ($faq_qa as $cnum => $item) : ?>
                            <div class="panel panel-default">
                                <div class="panel-heading clearfix">
                                    <div class="symbol">
                                        <i class="fa fa-angle-down collapse_q<?php echo $collapse ?>" aria-hidden="true" up="false"></i>
                                        </div>
                                    <h4 class="panel-title">
                                        <a data-toggle="collapse" data-parent="#accordian<?php echo $num ?>" href="#collapse_q<?php echo $collapse ?>">
                                            <?php echo $item['faq_qa_question'] ?>
                                        </a>
                                    </h4>
                                </div>
                                <div class="panel-collapse collapse" id="collapse_q<?php echo $collapse ?>">
                                    <div class="panel-body">
                                        <?php echo $item['faq_qa_answer'] ?>
                                    </div>
                                </div>
                            </div>
                        <?php
                        $collapse++;
                        endforeach; ?>
                    </div>
                <?php endforeach;
                endif;?>
                <div class="contact-us-form">
                    <script type="text/javascript" src="https://form.jotform.me/jsform/63141603048447"></script>
                    <div class="dropdown-image">
                        <?php echo get_template_directory_uri() . '/img/dropdown.png' ?>
                    </div>
                </div>
                <div class="information container-fluid">
                    <div class="row">
                        <div class="col-md-4">
                            <img src="" class="information__featured">
                        </div>
                        <div class="col-md-8">
                            <h3 class="title"><?php _e('HOTEL INFORMATION', 'fjtss') ?> </h3>
                            <div class="information__detail">

                            </div>
                        </div>
                    </div>
                </div>
                <div class="clearfix"></div>
            </div>
        </div>
    </div>
</main>
<?php   endif;
    endif;
    get_footer();