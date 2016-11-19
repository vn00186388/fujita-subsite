function selectCategories() {
    $('.dropdown-menu li a').click(function(e) {
        e.preventDefault();
        $('#' + $(this).attr('data-id')).focus();
    })
}

function insertData(data) {
    var mapObj = {
        hotel_address: true,
        hotel_phone: true,
        hotel_check_in: true,
        hotel_check_out: true,
        hotel_credit_cards_accepted: true,
        hotel_internet: true,
        hotel_parking: true,
        hotel_property_details: true,
        hotel_smoke_free_policy: true,
        hotel_accessibility: true
    };
    var nodeAppend = '';
    var temp = '';
    for (var i in data) {
        if (mapObj[i]) {
            switch (i) {
                case 'hotel_address': temp = 'Address'; break;
                case 'hotel_phone': temp = 'Tel'; break;
                case 'hotel_check_in': temp = 'Check in'; break;
                case 'hotel_check_out': temp = 'Check out'; break;
                case 'hotel_credit_cards_accepted': temp = 'Credit cards accepted'; break;
                case 'hotel_internet': temp = 'Internet'; break;
                case 'hotel_parking': temp = 'Parking'; break;
                case 'hotel_property_details': temp = 'Property details'; break;
                case 'hotel_smoke_free_policy': temp = 'Smoke free policy'; break;
                case 'hotel_accessibility': temp = 'Accessibility'; break;
            }
            nodeAppend += '<div class="content clearfix"><div class="content__title">' + temp + '</div><div class="content__info">'+ data[i] +'</div></div>';
        }
    }
    $('.information__featured').attr('src',data.hotel_faq_feature_image);
    $(nodeAppend).appendTo('.information__detail');
}

$(document).ready(function() {

    selectCategories();

    var dropdownImage = $('.dropdown-image').text();
    $('.contact-us-form iframe').on('load', function() {
        $(this).contents().find('.page-section li[data-type="control_dropdown"] .form-dropdown').css({
            background: 'url(' + dropdownImage + ') right no-repeat',
            'background-size': 'contain',
            '-webkit-appearance': 'none',
            '-moz-appearance': 'none',
            'appearance': 'none'
        });
    });

    $('.contact-us .panel-title a').on('click', function () {
        $(this).closest('.panel-heading').toggleClass('open');

        var directionIcon = $(this).parent().prev().children();

        if( !(directionIcon).hasClass('up') ){
            var totalIcon = $('.symbol i');
            for( var i = 0 ; i < totalIcon.length -1;i++){
                $(totalIcon[i]).removeClass('up');
            }
            directionIcon.addClass('up');
        }
        else {
            directionIcon.removeClass('up');
        }
    })
    var hotel_info = 'http://fujita-group.wsdasia-sg-1.wp-ha.fastbooking.com/wp-json/fujita-group/v1/hotels/akihabara';
    fjtss_get_json(hotel_info, insertData);

});