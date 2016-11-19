<?php
$tplHome = fjtss_json_get_posts( 'tpl-home' );
if ( ! rojak_empty_array( $tplHome['slideshow'] ) ) { ?>
    <div class="slide-show js_slide-show">
        <?php foreach ( $tplHome['slideshow'] as $attachment ) :
                $image_url = fjtss_get_img_url('slider', $attachment['ID']);
                $image_url = $image_url != false ? $image_url : '';

        ?>
            <div class="slide__entry js_slide__entry" style="background: url(<?php echo $image_url ?>)
                center center no-repeat; background-size: cover">
                <div class="slide__show__caption"><?php echo $attachment['caption'] ?></div>
            </div>
        <?php endforeach; ?>
    </div>
<?php }
