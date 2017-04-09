
/*
 *  Promotion.js
 *  This file represents all the REST functions that can be carried out.
 *  It provides the logic code for reach REST State.
 *  GET: store() ; POST: createStore() ; DELETE: del_store() ; PUT: store_mod()
 *
 */

 /*
  *  del_promo() is called when the user requests a promotion to be deleted;
  */
function del_promo(code) {
  // inform the user that processing has become;
  helper.showLoader();

  // send the delete request to the server;
  $.ajax({
    method: "DELETE",
    url: SITE.location + "/promotion",
    data: {"promotion_id": USER.currentPromotion }
  }).done(function(response) {
    // log the response for dexterity
    console.log(response);
    // stop the loading to inform the user wheather or not the aaction
    // was true;

    // check the response to make sure it was deleted;
    if (response.deleted === USER.currentPromotion) {
      // the correct store was deleted;
      // the server confimred it;
      // do not delay; reload the page with the updated list;
      helper.showLoader();
      reload("store_promo", function(e) {
        helper.showMessage({
          message: "The Promotion " + response.deleted + " was removed from database",
          type: "success"
        })
        promos();
      });
    } else {
      helper.hideLoader();
      // inform the user;
      helper.showMessage({
        message: "Something might have gone wrong.",
        type: "warning"
      })
    }
  });
};

/*
 *  promos() contains all the code data for the Promotions portion of the
 *  the website to work;
 */
function promos() {

  // gets all the promotions associated with a particular store
  $.ajax({
    method: "GET",
    url: SITE.location + "/user/store/promotion",
    data: { "store_id": USER.currentStore }
  }).done(function(msg) {
    console.log(msg);
    var data = msg;

    // loads the promotion arrays from the server
    // into the page;
    var str = "";
    for (var i = 0; i < data.length; i++) {
      str += "<tr>";
      str += "<td>"+i+"</td>";
      str += "<td>"+(data[i].title || "not yet named")+"</td>";
      str += "<td>"+(data[i].expires || "N/A")+"</td>";
      str += "<td> <a href='#store_promo_mod_["+USER.currentStore+"="+data[i].promotion_id+"]'><span class='glyphicon glyphicon-pencil' aria-hidden='false'></span></a></td>";
      str += "<td> <a href='#store_promo_delete_["+USER.currentStore+"="+data[i].promotion_id+"]'><span class='glyphicon glyphicon-remove' aria-hidden='false'></span></a></td>";
      if (data[i].active && data[i].active == "yes") {
        str += "<td> <span class='glyphicon glyphicon-ok-sign' aria-hidden='false'></span></td>";
        str += "<td></td>";
      } else {
        str += "<td></td>";
        str += "<td> <a href='#make_active_promo_["+USER.currentStore+"="+data[i].promotion_id+"]'><span class='glyphicon glyphicon-ok-circle' aria-hidden='false'></span></a></td>";
      }

      str += "</tr>";
    }

    // inserts it into page;
    $("#insert_promos").html("").append(str);
    helper.hideLoader();

    // listener for the add promotion button;
    // it takes the user to the add promotion page;
    $("#addPromo").click(function() {
      console.log("ADD");
      helper.showLoader();
      $("#main_content").load("html_src/add_promo.html", function() {

        helper.hideLoader();
        console.log($("#addtoPromoDB"));
        // Variable to store your files
        var files = false;

        // Add events
        // $('input[type=file]').on('change', function prepareUpload(event) {
        //   files = event.target.files;
        //   console.log(files);
        // });

        var uploader = new ss.SimpleUpload({
          button: 'upload-btn', // HTML element used as upload button
          url: SITE.location + "/promotion/materials", // URL of server-side upload handler
          name: 'picture', // Parameter name of the uploaded file
          onComplete: function(filename, response) {
            if (!response) {
              // alert(filename + 'upload failed');
              helper.showMessage({
                message: "Your File could not be uploaded.",
                type: "danger"
              });
              files = false;
              return false;
            }

            files = JSON.parse(response);
            console.log(files);
            helper.showMessage({
              message: "Your File was successfully uploaded.",
              type: "success"
            });
            console.log(files[0]);
            $("#fileName").text(stringify(files[0].path));

          }
        });

        // add a listener to the addbutton;
        $("#addtoPromoDB").click(function(e) {
          // get all the information associated with the promotion form;
          if (($("#imgCheck").is(":checked") && files == false)) {
            // tell user to wait for their image;
            helper.showMessage({
              message: "Your file is either still uploading, or you have uploaded a file but not checked the checkbox next to the browse button. Please check it back.",
              type: "warning"
            });
            return;
          }
          helper.showLoader();
          var store_id = USER.currentStore;
          var title = $("#title").val();
          var message = $("#message").val();
          var expires = null;
          if ($("#expireCheck").is(":checked")) {
            console.log ("checked");
            expires = $("#datetimepicker4").val();
          }
          var coupon = null;
          if ($("#couponCheck").is(":checked")) {
            console.log ("checked");
            coupon = $("#coupon").val();
          }
          var img = null;
          if (files != false) {
            img = files[0].path;
          }

          // POST this data to the server;
          $.ajax({
            method: "POST",
            url: SITE.location + "/promotion",
            data: { "title": title, "message": message, "coupon": coupon , "expires": expires, "store_id": store_id, "promotionImage": img, "active": "yes" }
          }).done(function(msg) {
            // call/reload the promo list
            helper.hideLoader();
            console.log(msg);
            reload("store_promo", function(e) {
              helper.showLoader();
              helper.showMessage({
                message: "Your Promotion was added.",
                type: "info"
              });
              promos();
            });

          }).fail(function(response) {
            helper.showMessage({
              message: "There was an error processing your request. Please try again later, or contact support.",
              type: "danger"
            })
            helper.hideLoader();
          }); // end ajax

        }); // end addtoPromoDB

        $("#cancelPromo").click(function(e) {
          e.preventDefault();
          reload("store_promo", function() {
            helper.showLoader();
            promos();
          });
        });

      }); // end add_promo

    });
  });

};


/*
 *  promo_mod() is called when the user attempts to modify a promotion;
 *  it contains all the logic required to modify, send to server and reload
 *  the promotion list;
 */
function promo_mod(code) {
  var itemKey = USER.currentPromotion;
  $("#promotion-title").text(itemKey);

  // setup back the image uploader
  var files = false;
  var active = "no";
  // Sends a GET Request to the Server
  $.ajax({
    method: "GET",
    url: SITE.location + "/promotion",
    data: { "promotion_id": itemKey }
  }).done(function(msg) {
    // load response into promoData;
    // the response is always a single object in an array;
    helper.hideLoader();
    var promoData = msg[0];
    console.log(promoData);
    var store_id = USER.currentStore;
    $("#title").attr("placeholder", promoData.title);
    $("#title").val(promoData.title);
    $("#message").val(promoData.message);

    // make sure that expires had data in it;
    // if not, just the leave the checkbox unchecked
    if (promoData.expires != "" || promoData.expires != null) {
      $("#expireCheck").attr("checked", true);
      // $("#expires").val(promoData.expires);
      // $("#expires").attr("placeholder", promoData.expires);
      $('#datetimepicker4').datetimepicker({
        format: "DD/MM/YYYY HH:mm A",
        defaultDate: moment(promoData.expires, 'DD/MM/YYYY HH:mm A')
      });
    }
    // do the same thing here;
    if (promoData.coupon != "") {
      $("#couponCheck").attr("checked", true);
      $("#coupon").val(promoData.coupon);
      $("#coupon").attr("placeholder", promoData.coupon);
    }

    // type to check if any images where
    if (promoData.promotionImage != "") {
      $("#promotionalMats").attr("checked", true);
      $("#fileName").text(helper.getFileName(promoData.promotionImage));

    }

    active = promoData.active || "no";

    // image uploader;

    var uploader = new ss.SimpleUpload({
      button: 'upload-btn', // HTML element used as upload button
      url: SITE.location + "/promotion/materials", // URL of server-side upload handler
      name: 'picture', // Parameter name of the uploaded file
      onComplete: function(filename, response) {
        if (!response) {
          // alert(filename + 'upload failed');
          helper.showMessage({
            message: "Your File could not be uploaded.",
            type: "danger"
          });
          files = false;
          return false;
        }

        files = JSON.parse(response);
        console.log(files);
        $("#fileName").text(helper.getFileName(files[0].path));
        helper.showMessage({
          message: "Your File was successfully uploaded.",
          type: "success"
        });
      }
    });
  }); // end AJAX GET REQUEST;

  // This is logic when the user clicks the modify promotion button;
  $("#modify_data #modPromoDB").on("click", function(e) {
    // prevent form submission
    e.preventDefault();
    if (($("#imgCheck").is(":checked") && files == false)) {
      // tell user to wait for their image;
      helper.showMessage({
        message: "Your file is either still uploading, or you have uploaded a file but not checked the checkbox next to the browse button. Please check it back.",
        type: "warning"
      });
      return;
    }
    // tell the user we are working;
    helper.showLoader();

    // get the data from the forms.
    var promotion_id = USER.currentPromotion;
    var title = $("#title").val();
    var message = $("#message").val();
    var expires = null;
    if ($("#expireCheck").is(":checked")) {
      console.log ("checked");
      expires = $("#expires").val();
    }
    var coupon = null;
    if ($("#couponCheck").is(":checked")) {
      console.log ("checked");
      coupon = $("#coupon").val();
    }

    var img = null;
    if (files != false) {
      img = files[0].path;
    }

    // Update Information on the Server;
    $.ajax({
      method: "PUT",
      url: SITE.location + "/promotion",
      data: { "promotion_id": promotion_id, update: JSON.stringify({
        "title": title,
        "message": message,
        "coupon": coupon ,
        "expires": expires,
        "promotionImage": img,
        "active": active || "no"
      }) }
    }).done(function(msg) {
      console.log(msg);
      // once the Update is sent to the server
      // reload the store's promotion
      // and go to its page;
      helper.showLoader();
      reload("store_promo", function () {
        promos();
      });
    });// end AJAX PUT Request;
  }); // end modPromoDB

  // contains the logic for returning to the page before;
  $("#cancelPromoMod").click(function(e) {
    e.preventDefault();
    helper.showLoader();
    reload("store_promo", function() {
      promos();
    })
  }); // end cancelPromoMod
};


/*
 *  Simple function to make a promotion active;
 */
function makePromoActive() {
  // inform the user that stuff is going on;
  helper.showLoader();

  // send data to Server;
  $.ajax({
    method: "PUT",
    url: SITE.location + "/promotion",
    data: {"promotion_id": USER.currentPromotion, "update": JSON.stringify({"active": "yes", "store_id": USER.currentStore})}
  }).done(function (response) {
    reload("store_promo", function() {
      promos();
    });
  }); // end promo active


};
