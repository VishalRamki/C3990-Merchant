
/*
 *  Switchs.js
 *  This file contains the logic for switching between the logic of the different
 *  pages on the webstie;
 *
 */

/*
 *  switchIt alters the data insisde the dynamically created .container;
 *  it is responsible for calling all the code required for the merchant store
 *  to work;
 */
function switchIt(code) {
  switch (code.itemLocation) {
    case "store":
      // this is actually a delete function;
      // but i needed it to reload the store front;
      // and i rather not duplicate the entire store.html
      // for a delete request;
      USER.currentStore = code.itemKey.store || code.itemKey;
      del_store(code);
      break;
    case "store_mod":
      console.log(code);
      USER.currentStore = code.itemKey.store || code.itemKey;
      console.log(USER.currentStore);
      store_mod(code);
      break;
    case "store_promo":
      USER.currentStore = code.itemKey.store || code.itemKey;
      console.log(USER.currentStore);
      promos(code);
      break;
    case "store_promo_mod":
      console.log(code);
      USER.currentStore = code.itemKey.store;
      USER.currentPromotion = code.itemKey.promotion;
      promo_mod(code);
      break;
    case "store_promo_delete":
      console.log(code);
      USER.currentStore = code.itemKey.store;
      USER.currentPromotion = code.itemKey.promotion;
      del_promo(code);
      break;
    case "make_active_promo":
      USER.currentStore = code.itemKey.store;
      USER.currentPromotion = code.itemKey.promotion;
      makePromoActive(code);
      break;
    default:
  }
}

/*
 *  switchITX alters the data insisde the dynamically created .container;
 *  it is responsible for loading up default pages.
 */
function switchITX(s) {
  switch (s) {
    case "store":
        store();
      break;
    case "stats":
        stats();
      break;
    case "purchase_beacons":
      purchase();
      break;
    default:

  }
};

/*
 *  reload(STRING, FUNCTION) is called when a page needs to be reloaded without
 *  additional calls;
 */
function reload(location, cb) {
  $("#main_content").load("html_src/"+location+".html", cb);
};


function remove(removeKey) {
  console.log(removeKey);
}

function purchase() {

  helper.hideLoader();

  $("#placeOrder").on("click", function(e) {
    e.preventDefault();
    helper.showLoader();

    var email = $("#email").val();
    var message = $("#optional").val();
    var beaconnum = $("#beaconNum").val();

      $.ajax({
        method: "POST",
        url: SITE.location + "/order",
        data: {"email": email, "message": message, "beacons": beaconnum}
      }).done(function(response) {
        console.log(response);
        helper.hideLoader();
        helper.showMessage({
          message: "Your Beacon Order has been placed. Your Order ID: " + response.order_id,
          type: "success"
        });
      });
  });
};
