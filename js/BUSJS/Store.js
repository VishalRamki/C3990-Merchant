
/*
 *  Store.js
 *  This file represents all the REST functions that can be carried out.
 *  It provides the logic code for reach REST State.
 *  GET: store() ; POST: createStore() ; DELETE: del_store() ; PUT: store_mod()
 *
 */


/*
 *  del_store() is called when the user requests a store to be deleted;
 */
function del_store(code) {
  helper.showLoader();

  // send the delete request to the server;
  $.ajax({
    method: "DELETE",
    url: SITE.location + "/store",
    data: {"store_id": USER.currentStore }
  }).done(function(response) {
    // log the response for dexterity
    console.log(response);
    // stop the loading to inform the user wheather or not the aaction
    // was true;

    // check the response to make sure it was deleted;
    if (response.deleted === USER.currentStore) {
      // the correct store was deleted;
      // the server confimred it;
      // do not delay; reload the page with the updated list;
      helper.showLoader();
      reload("store", function(e) {
        store();
        // inform the user;
        helper.showMessage({
          message: "Store " + response.deleted + " was deleted.",
          type: "success"
        });
      });
    } else {
      helper.hideLoader();
      // inform the user;
      helper.showMessage({
        message: "There was an error deleting the store, or the wrong store was deleted.",
        type: "danger"
      });
    }
  });
}


/*
 *  store_mod(OBJECT) contains the logic that is needed when a particular store
 *  needs to be updated;
 *
 */
function store_mod(code) {
  var itemKey = USER.currentStore;
  console.log(itemKey);

  // interject the current stores id; so the user knows what store is being
  // edited;
  $(".page-header span").text(itemKey);

  // ajax get the store with this id;
  $.ajax({
    method: "GET",
    url: SITE.location + "/store",
    data: { "store_id": itemKey }
  }).done(function(msg) {
    // load the first entry into its own object;
    var storeData = msg[0];
    console.log(storeData.name);

    // assign the gotten data into the form;
    $("#storeName").attr("placeholder", storeData.name);
    $("#storeName").val(storeData.name);

    // convert beacon data into html data;
    var ht = helper.buildBeaconList(storeData.beacons);
    // console.log(storeData.beacons);
    // console.log(ht);
    // interject beacon thml into page;
    $("#insert_beacons").append(ht);

    $.ajax({
      method: "GET",
      url: SITE.location + "/user/beacons",
      data: {"user_id": USER.currentUser}
    }).done(function(response) {

      var str = "";
      for (var i = 0; i < response.length; i++) {
        console.log(response[i]);
        if (helper.beaconInList(storeData.beacons, response[i])) {
          console.log("selcted");
          str += '<option value="'+response[i].beacon_id+'" selected>'+response[i].beacon_id+'</option>';
        } else {
          str += '<option value="'+response[i].beacon_id+'">'+response[i].beacon_id+'</option>';
        }

      }

      $("#selectmultipleBeacon").append(str);

      // tell the user we are finished;
      helper.hideLoader();
    });



  }); // end GET AJAX for stores

  $("#modify_data #submit").on("click", function(e) {
    // prevent form submission;
    e.preventDefault();

    // tell the user the system is processing;
    helper.showLoader();
    var beacons = [];
    $("#selectmultipleBeacon option:selected").each(function () {
      var $this = $(this);
      if ($this.length) {
        var selText = $this.text();
        console.log(selText);
        beacons.push(selText);
      }
    });
    console.log(beacons);
    console.log({ "store_id": itemKey, update: JSON.stringify({
      "name": $("#storeName").val(),
      "beacons": beacons
    }) });

    // update store ajax;
    $.ajax({
      method: "PUT",
      url: SITE.location + "/store",
      data: { "store_id": itemKey, update: JSON.stringify({
        "name": $("#storeName").val(),
        "beacons": beacons
      }) }
    }).done(function(msg) {
      helper.hideLoader();
      console.log(msg);
      reload("store", function(e) {
          helper.showLoader();
          store();
      }); // end reload;
    }); // end PUT AJAX;
  }); // END #modify_data #submit on CLICK function

  $("#cancelStoreMod").click(function(e) {
    e.preventDefault();
    helper.showLoader();
    reload("store", function() {
      store();
    })
  }); // end cancelPromoMod
};


/*
 *  store() contains the logic required to get and interject all the stores
 *  owned by an individual user;
 *
 */
function store() {
  console.log(USER.currentUser);
  // get all the store associated with a `store_manager_id`
  $.ajax({
    method: "GET",
    url: SITE.location + "/user/store/",
    data: { "store_manager_id": USER.currentUser }
  }).done(function(msg) {
    // the data is returned;
    console.log(msg);
    var data = msg;

    // load the store array from the server;
    // into the page with the required links;
    var str = "";
    for (var i = 0; i < data.length; i++) {
      str += "<tr>";
      str += "<td>"+i+"</td>";
      str += "<td>"+(data[i].name || "no name")+"</td>";
      str += "<td> <a href='#store_mod_["+data[i].store_id+"]'><span class='glyphicon glyphicon-pencil' aria-hidden='false'></span></a></td>";
      str += "<td> <a href='#store_promo_["+data[i].store_id+"]'><span class='glyphicon glyphicon-tasks' aria-hidden='false'></span> Add</a></td>";
      str += "<td> <a href='#store_["+data[i].store_id+"]'><span class='glyphicon glyphicon-remove' aria-hidden='false'></span></a></td>";
      str += "</tr>";
    }

    // insert into the page;
    $("#insert_stores").append(str);

    // setup create store links;
    createStore();

    // tell the user that the page is ready
    helper.hideLoader();

  });// end GET AJAX;

};

/*
 *  createStore() contains the logic required to create a new store;
 *
 */
function createStore() {
  $("#storeCreate").click(function(e) {
    // prevent form submission
    e.preventDefault();

    // tell the user that stuff is happening;
    helper.showLoader();

    // ajax to create;
    $.ajax({
      method: "POST",
      url: SITE.location + "/store",
      data: { "store_manager_id": USER.currentUser }
    }).done(function(response) {
      // log response for posterity
      console.log(response);

      // check if the server did create the store;
      if (response[0].store_id != null) {
        // notify the user that the store was create;

        // create a delay;

        // then reload the current page with the updated list;
        helper.showLoader();
        reload("store", function(e) {
          store();
          // inform the user;
          helper.showMessage({
            message: "Your new store " + response[0].store_id + " has been created.",
            type: "success"
          });
        });
      }
    }); // end POST ajax;
  }); // end #storeCreate click;
};
