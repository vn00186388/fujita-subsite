function selectCategories() {
  $('.dropdown-menu li a').click(function(e) {
    e.preventDefault();
    $('#' + $(this).attr('data-id')).focus();
  })
}


$(document).ready(function() {

  selectCategories();

  var dropdownImage = $('.dropdown-image').text();
  var datetimeImage = $('.datetime-image').text();
  $('.meetings_form iframe').on('load', function() {
      $(this).contents().find('.page-section li[data-type="control_dropdown"] .form-dropdown').css({
        background: 'url(' + dropdownImage + ') right no-repeat',
        'background-size': 'contain',
        '-webkit-appearance': 'none',
        '-moz-appearance': 'none',
        'appearance': 'none'
      });

      $(this).contents().find('.page-section li[data-type="control_datetime"] label').remove();

      $(this).contents().find('.page-section li[data-type="control_datetime"] span').removeClass('form-sub-label-container');

      $(this).contents().find('.page-section li[id="id_45"] input').attr({
        'placeholder': 'START DATE'
      });

      $(this).contents().find('.page-section li[id="id_46"] input').attr({
        'placeholder': 'END DATE'
      });

      $(this).contents().find('.page-section li[data-type="control_datetime"] div span:last-child').css({
        position: 'absolute',
        height: '93%',
        width: '10% !important',
        right: '14px',
        top: '2px'
      });

      $(this).contents().find('.page-section li[data-type="control_datetime"] span:last-child img').css({
        height: '100%'
      });

      $(this).contents().find('.page-section li[data-type="control_datetime"] span:last-child img').attr('src', datetimeImage);

      $(this).contents().find('.page-section li:nth-last-child(2)').css({
        'margin-bottom': '30px'
      });
  });
});
