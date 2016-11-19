<div class="header__qs js_header__qs">
    <div class="header__qs-close version-mobile">
        <button class="btn-close js_btn-close"></button>
    </div>
    <div class="header__qs-logo-wh  version-mobile">
        <a class="logo__link js_logo__link" href="#"></a>
    </div>
    <form class="header__qs-form qs-form js_qs-form" target="dispoprice" name="js__fbqs__form">
        <input class="js_promo" type="hidden" name="showPromotions" value="">
        <input class="js__fbqs__locale" type="hidden" name="locale" value="en">
        <input class="js_cluster" type="hidden" name="Clusternames" value="">
        <div class="booking__formstyle" style="text-align:center"><span style="display: none;text-align:center">
              <select class="fbqs__checkin-month js__fbqs__checkin-month" name="frommonth">
                <option value="10">Oct</option>
                <option value="11">Nov</option>
                <option value="12">Dec</option>
                <option value="01">Jan</option>
                <option value="02">Feb</option>
                <option value="03">Mar</option>
                <option value="04">Apr</option>
                <option value="05">May</option>
                <option value="06">Jun</option>
                <option value="07">Jul</option>
                <option value="08">Aug</option>
                <option value="09">Sept</option>
              </select>
              <select class="fbqs__checkin-day js__fbqs__checkin-day" name="fromday">
                <option value="01">01</option>
                <option value="02">02</option>
                <option value="03">03</option>
                <option value="04">04</option>
                <option value="05">05</option>
                <option value="06">06</option>
                <option value="07">07</option>
                <option value="08">08</option>
                <option value="09">09</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
                <option value="13">13</option>
                <option value="14">14</option>
                <option value="15">15</option>
                <option value="16">16</option>
                <option value="17">17</option>
                <option value="18">18</option>
                <option value="19">19</option>
                <option value="20">20</option>
                <option value="21">21</option>
                <option value="22">22</option>
                <option value="23">23</option>
                <option value="24">24</option>
                <option value="25">25</option>
                <option value="26">26</option>
                <option value="27">27</option>
                <option value="28">28</option>
                <option value="29">29</option>
                <option value="30">30</option>
                <option value="31">31</option>
              </select>
              <select class="fbqs__checkin-year js__fbqs__checkin-year" name="fromyear" onchange="update_departure();">
                <option value="2016" selected="">2016</option>
                <option value="2017">2017</option>
              </select></span>
            <input class="fbqs__checkin js__fbqs__checkin" id="fbqs__checkin" type="hidden" readonly="">
            <span style="display:none;text-align:center">
              <select class="fbqs__checkout-month js__fbqs__checkout-month" name="tomonth">
                <option value="10">Oct</option>
                <option value="11">Nov</option>
                <option value="12">Dec</option>
                <option value="01">Jan</option>
                <option value="02">Feb</option>
                <option value="03">Mar</option>
                <option value="04">Apr</option>
                <option value="05">May</option>
                <option value="06">Jun</option>
                <option value="07">Jul</option>
                <option value="08">Aug</option>
                <option value="09">Sept</option>
              </select>
              <select class="fbqs__checkout-day js__fbqs__checkout-day" name="today">
                <option value="01">01</option>
                <option value="02">02</option>
                <option value="03">03</option>
                <option value="04">04</option>
                <option value="05">05</option>
                <option value="06">06</option>
                <option value="07">07</option>
                <option value="08">08</option>
                <option value="09">09</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
                <option value="13">13</option>
                <option value="14">14</option>
                <option value="15">15</option>
                <option value="16">16</option>
                <option value="17">17</option>
                <option value="18">18</option>
                <option value="19">19</option>
                <option value="20">20</option>
                <option value="21">21</option>
                <option value="22">22</option>
                <option value="23">23</option>
                <option value="24">24</option>
                <option value="25">25</option>
                <option value="26">26</option>
                <option value="27">27</option>
                <option value="28">28</option>
                <option value="29">29</option>
                <option value="30">30</option>
                <option value="31">31</option>
              </select>
              <select class="fbqs__checkout-year js__fbqs__checkout-year" name="toyear" onchange="update_departure();">
                <option value="2016" selected="">2016</option>
                <option value="2017">2017</option>
              </select></span>
            <input class="fbqs__checkout js__fbqs__checkout" id="fbqs__checkout" type="hidden" readonly="">
        </div>
        <div class="qs__field qs__select qs__field-sites">
            <label class="qs__label" for="qs__sites"><?php _e('Select a hotel', 'fjtss') ?></label>
            <div class="qs__viewport"></div>
            <select class="qs__sites js_qs__sites" id="qs__sites" name="Hotelnames">
                <option value="all"><?php _e('All hotels', 'fjtss') ?></option>
                <option value="ASIAFUJHTLAkihabara" data-cluster="crsprincetokyo" data-hid="jptok27499">Washington hotel Akihabara</option>
                <option value="ASIAPRIHTLTheKioicho" data-cluster="crsprincetokyo" data-hid="jptok27499">Washington hotel Akihabara main</option>
                <option value="ASIAPRIHTLTheKioicho" data-cluster="crsprincetokyo" data-hid="jptok27499">The Prince Gallery Tokyo Kioicho</option>
            </select>
        </div>
        <div class="qs__field qs__datepicker qs__field-checkin">
            <label class="qs__label" for="qs__checkin"><?php _e('Arrival', 'fjtss') ?></label>
            <input class="qs__checkin js_qs__checkin">
        </div>
        <div class="qs__field qs__datepicker qs__field-checkout">
            <label class="qs__label" for="qs__checkout"><?php _e('Departure', 'fjtss') ?></label>
            <input class="qs__checkout js_qs__checkout">
        </div>
        <div class="qs__field qs__select qs__field-adults-child">
            <label class="qs__label" for="qs__adults-child"><?php _e("Adult(s) / Child  (0-5 yrs old)", 'fjtss') ?></label>
            <select class="qs__adults-child js_qs__adults-child" name="adulteresa">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
            </select>
        </div>
        <div class="qs__field qs__input qs__field-promo-code">
            <label class="qs__label version-desktop" for="qs__promo-code"><?php _e('Access code', 'fjtss') ?></label>
            <input class="qs__promo-code" placeholder="<?php _e('Access code', 'fjtss') ?>" name="AccessCode" type="password">
        </div>
        <div class="qs__field qs__submit qs__field-btn-submit">
            <div class="qs__booking-btns b-layout">
                <a class="qs__btn-view layout-left js_qs__btn-view"
                   href="http://thames.book-secure.com/00000001/032/023112/historyv3.phtml?Hotelnames=&amp;amp;langue=uk"
                   target="_blank">View your booking</a><a class="qs__btn-cancel layout-right" href="javascript:;"
                   onclick="hhotelFormCancel(document.js__fbqs__form);"><?php _e('Cancel', 'fjtss') ?></a>
            </div>
            <button class="btn qs__btn-submit" type="submit" onclick="hhotelDispoprice(this.form);">
                <?php _e('check availability', 'fjtss') ?>
            </button>
        </div>
    </form>
    <div class="header__qs-logo-wh--bottom version-mobile">
        <a class="logo-whg__link" href="#">
          <img src="<?php echo get_template_directory_uri() . '/img/logo-whg-white.png' ?>">
        </a>
    </div>
</div>
