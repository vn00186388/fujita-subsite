var $fjtss_theme_path = '' + "wp-content/themes/fujita-subsite/"
var $fjtss_js_path    = $fjtss_theme_path + "js/"
var $fjtss_img_path   = $fjtss_theme_path + "img/"

// -----------------------------------------
// THANKS IE9!
// -----------------------------------------
if( !window.console ){
	console={};
	console.log = function(){};
}


// -----------------------------------------
// EXISTS
// -----------------------------------------
jQuery.fn.exists = function(){
	return this.length>0;
}


// -----------------------------------------
// NO DRAG
// -----------------------------------------
$( '.js_no-drag' ).attr('draggable', false);


// -----------------------------------------
// URL FILENAME
// -----------------------------------------
if (typeof fjtss_get_filename_from_url === 'undefined') {
	function fjtss_get_filename_from_url( url ) {
		var index = url.lastIndexOf("/") + 1;
		return url.substr(index);
	}
}


// -----------------------------------------
// LOAD BG IMAGES
// -----------------------------------------
if (typeof fjtss_load_large_bg_img === 'undefined') {
	function fjtss_load_large_bg_img( el ) {

		$( el ).each(function( index ) {

			var _this = this;

			var img_url = $( _this ).data( "large" );
			if ( img_url ) {
				var img_large = $('<img class="js_lazy-bg_large hidden" />');
				img_large.attr('src', img_url ).on( 'load', function() {
					// console.log( '[bgimg] ' + fjtss_get_filename_from_url( img_url ) )
					$( _this ).attr( "src", img_url );
					$( _this ).css( "background-image", "url(" + img_url + ")" )
				});;
			}

		});

	}
}


// -----------------------------------------
// LOAD BG IMAGES
// -----------------------------------------
if (typeof fjtss_load_large_img === 'undefined') {
	function fjtss_load_large_img( el ) {

		$( el ).each(function( index ) {

			var _this = this;

			var img_url = $( _this ).data( "large" );
			if ( img_url ) {
				var img_large = $('<img class="js_lazy-bg_large hidden" />');
				img_large.attr('src', img_url ).on( 'load', function() {
					// console.log( '[img] ' + fjtss_get_filename_from_url( img_url ) )
					$( _this ).attr( "src", img_url );
				});;
			}

		});

	}
}


// -----------------------------------------
// GO TO TOP BUTTON
// -----------------------------------------
if (typeof fjtss_go_top === 'undefined') {
	function fjtss_go_top() {

		$(window).scroll(function() {
			if ($(this).scrollTop() > 200) {
				$('.go-top').fadeIn(200);
			} else {
				$('.go-top').fadeOut(200);
			}
		});

		// Animate the scroll to top
		$('.go-top').click(function(event) {
			event.preventDefault();

			$('html, body').animate({scrollTop: 0}, 300);
		})

	}
}


// -----------------------------------------
// On Available - http://jsfiddle.net/6hpm2/1/
// -----------------------------------------
$.fn.onAvailable = function(fn){
	var sel = this.selector;
	// console.log( sel );
	var timer;
	var self = this;
	if (this.length > 0) {
			fn.call(this);
	}
	else {
		timer = setInterval(function(){
			if ($(sel).length > 0) {
				fn.call($(sel));
				clearInterval(timer);
			}
		},50);
	}
};


// -----------------------------------------
// HEADER SCROLL
// -----------------------------------------
if ( typeof fjtss_on_header_scroll === 'undefined' ) {
	function fjtss_on_header_scroll() {
		$( window ).scroll(function() {
			if ( $( 'html' ).hasClass( 'desktop' ) || $( 'html' ).hasClass( 'tablet' ) ) {
				var state = $(this).scrollTop() > 200;
				$( 'body' ).toggleClass( 'is_scrolled', state );
			}
		} );
	}
}


// -----------------------------------------
// DATEPICKER LANG
// -----------------------------------------
if (typeof fjtss_get_datepicker_lang === 'undefined') {

	function fjtss_get_datepicker_lang() {
		var language_obj = {
			'zh-hant': 'zh-TW',
			'zh-hans': 'zh-HK',
			'en':      'en-GB'
		};

		return ( icl_lang ) && ( language_obj[ icl_lang ] || icl_lang );
	}
}


// -----------------------------------------
// SCROLLED INTO VIEW
// -----------------------------------------
function fjtss_scrolled_in_view( elem ) {
	var $elem = $(elem);
	var $window = $(window);

	var docViewTop = $window.scrollTop();
	var docViewBottom = docViewTop + $window.height();

	var elemTop = $elem.offset().top;
	var elemBottom = elemTop + $elem.height();

	return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}


// -----------------------------------------
// HTTP BUILD QUERY IN JS
// https://jsfiddle.net/gabrieleromanato/YHjKm/
// -----------------------------------------
var httpBuildQuery = function(params) {
	if (typeof params === 'undefined' || typeof params !== 'object') {
		params = {};
		return params;
	}

	var query = '?';
	var index = 0;

	for (var i in params) {
		index++;
		var param = i;
		var value = params[i];
		if (index == 1) {
			query += param + '=' + value;
		} else {
			query += '&' + param + '=' + value;
		}
	}

	return query;
};

// -----------------------------------------
// Get JSON
// -----------------------------------------
function fjtss_get_json( url, callback ) {
	$.getJSON( url )
		.done(function(data) {
			if ( callback != null ) {
				callback(data);
			}
		})
		.fail(function( xhr, event, error ) {
			console.log(xhr);
			console.log(event);
			console.log(error);
		});
}



function facilitiesRender(data) {
    var $facilitiesContent = $('.js_facility-content');

    $facilitiesContent.empty();
    for (var key in data) {
        var facilityBox = $('<div/>', {
            class: 'facility-box col-ms-12 col-md-6'
        });

        var facilityImgWrapper = $('<div/>', {
            class: 'facility-img__wrapper col-md-2 ' + data[key]['facility_icon']
        });

        var facilityInfo = $('<div/>', {
            class: 'facility-info col-md-10'
        }).html('<h3 class="info__title">'+data[key].post_title+'</h3><p class="info__text">'+data[key].post_content+'</p>');

        facilityBox.append(facilityImgWrapper).append(facilityInfo);
        $facilitiesContent.append(facilityBox);
    }
};

$(document).ready(function() {
    var facilities_rest_url = fjtss_data.group_rest_url + 'hotel-facilities' ;
    fjtss_get_json(facilities_rest_url, facilitiesRender);
});
