function selectCategories() {
  $('.dropdown-menu li a').click(function(e) {
    e.preventDefault();
    $('#' + $(this).attr('data-id')).focus();
  })
}

$(document).ready(function() {
  selectCategories();
});
