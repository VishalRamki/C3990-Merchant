
var LOCATION = "http://localhost:5000/api";

var CURRENTCLIENT = {
  userId: null,
  currentStore: null,
  currentPromtion: null
};

$( document ).ready(function() {
  // $("#navbar a").click(function() {
  //   var clickedID = $(this).attr('href');
  //   $( ".active" ).each(function() {
  //     $( this ).removeClass( "active" );
  //   });
  //   $(this).closest('li').addClass('active');
  //   console.log(clickedID);
  //   // var lz = clickedID.replace("#", "");
  //   // console.log(lz);
  //   // $(".container").load("html_src/"+lz+".html");
  //   // lo(lz);
  // });


});
$("a").click(function() {
  var item = $(this);
  var itemHash = item.attr("href");
  if (checkATTR(itemHash) === false) return;
  var itemURI = fromHREFgetURI(itemHash);
  var URI = {
    itemURI: fromHREFgetURI(itemHash),
    itemKey: "",
    itemLocation: getLocation(fromHREFgetURI(itemHash))
  };
  console.log(itemURI);
  $("#main_content").load("html_src/"+itemURI+".html", function() {
    switchITX(itemURI);
  });
});

$(document).on("click", "#main_content a", function() {
  var item = $(this);
  var itemHash = item.attr("href");
  if (checkATTR(itemHash) === false) return;
  var URI = {
    itemURI: fromHREFgetURI(itemHash),
    itemKey: getKey(fromHREFgetURI(itemHash), "[", "]"),
    itemLocation: getLocation(fromHREFgetURI(itemHash))
  };
  $("#main_content").load("html_src/"+URI.itemLocation+".html", function() {
    switchIt(URI);
  });
});



function switchIt(code) {
  switch (code.itemLocation) {
    case "store_mod":
      store_mod(code);
      break;
    case "store_promo":
      promos(code);
      break;
    default:
  }
}

function switchITX(s) {
  switch (s) {
    case s:
        store();
      break;
    default:

  }
}

function store() {
  $.ajax({
    method: "GET",
    url: LOCATION + "/user/store/",
    data: { "store_manager_id": "4fdfec63-1629-4c7d-96d5-16b41490fb9e" }
  }).done(function(msg) {
    console.log(msg);
    var data = msg;

    var str = "";

    for (var i = 0; i < data.length; i++) {
      str += "<tr>";
      str += "<td>"+i+"</td>";
      str += "<td>"+(data[i].name || "no name")+"</td>";
      str += "<td> <a href='#store_mod_["+data[i].store_id+"]'>[X]</a></td>";
      str += "<td> <a href='#store_promo_["+data[i].store_id+"]'>[X]</a></td>";
      str += "</tr>";
    }

    $("#insert_stores").append(str);
  });

}

function promos() {
  $.ajax({
    method: "GET",
    url: LOCATION + "/user/store/promotion",
    data: { "store_id": "4fdfec63-1629-4c7d-96d5-16b41490fb9e" }
  }).done(function(msg) {
    console.log(msg);
    var data = msg;

    var str = "";

    for (var i = 0; i < data.length; i++) {
      str += "<tr>";
      str += "<td>"+i+"</td>";
      str += "<td>"+(data[i].title || "not yet named")+"</td>";
      str += "<td>"+(data[i].expires || "N/A")+"</td>";
      str += "<td> <a href='#store_promo_mod_["+data[i].promotion_id+"]'>[X]</a></td>";
      str += "</tr>";
    }

    $("#insert_promos").append(str);
    $("#addPromo").click(function() {
      console.log("ADD");
      $("#main_content").load("html_src/add_promo.html", function() {



        // promotion stuff;
        $.ajax({
          method: "POST",
          url: LOCATION + "/promotion",
          data: { "title": itemKey, "message": message, "coupon": coupon ,"present": present, "expires": expires, "store_id": store_id }
        }).done(function(msg) {
          var storeData = msg[0];
          console.log(storeData.name);
          // if (storeData.name != undefined)
            $("#storeName").attr("placeholder", storeData.name);
            var ht = buildBeaconList(storeData.beacons);
            console.log(storeData.beacons);
            console.log(ht);
            $("#insert_beacons").append(ht);
        });
      });
    });
  });

}

function store_mod(code) {
  var itemKey = code.itemKey;
  console.log(itemKey);
  CURRENTCLIENT.currentStore = itemKey;
  console.log(CURRENTCLIENT);
  // console.log($("#modify_data").html(""));
  $(".page-header span").text(itemKey);

  $.ajax({
    method: "GET",
    url: LOCATION + "/store",
    data: { "store_id": itemKey }
  }).done(function(msg) {
    var storeData = msg[0];
    console.log(storeData.name);
    // if (storeData.name != undefined)
      $("#storeName").attr("placeholder", storeData.name);
      var ht = buildBeaconList(storeData.beacons);
      console.log(storeData.beacons);
      console.log(ht);
      $("#insert_beacons").append(ht);
  });

  $("#modify_data #submit").on("click", function(e) {
    e.preventDefault();
    console.log("F");
    $.ajax({
      method: "PUT",
      url: LOCATION + "/store",
      data: { "store_id": itemKey, update: JSON.stringify({
        "name": $("#storeName").val()
      }) }
    }).done(function(msg) {
      console.log(msg);
    });
  });

}

console.log(window.jQuery);

function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
  var id_token = googleUser.getAuthResponse().id_token;
  console.log(createToken(id_token));
  $.ajax({
    method: "GET",
    url: LOCATION + "/user/oauth",
    data: { "google_oauth_token": profile.getId() }
  })
    .done(function( msg ) {
      console.log(msg);
      if (msg.error != undefined) {
        console.log("make new user");
        $.ajax({
          method: "POST",
          url: LOCATION + "/user",
          crossDomain: true,
          dataType: "application/json",
          data: { "google_oauth_token": profile.getId() }
        }).done(function(row) {
          console.log(row);
          // now auth;
          onSignIn(googleUser);
        });
      } else {
        // clear .container and load the new page;
        CURRENTCLIENT.userId = msg.user_id;
        console.log(CURRENTCLIENT);
        $("#main_content").load("html_src/store.html", function(data) {
          store();
        });
      }
    });
}


function fromHREFgetURI(string) {
  if (string.indexOf("#") < 0) return "home";
  return string.substr(string.indexOf("#")+1, string.length);
}

function createToken(token) {
  return token.substr(0, token.lastIndexOf(".")-1);
}

function buildBeaconList(list) {
  str = "";
  for (var i = 0; i < list.length; i++) {
    str += "<tr>";
    str += "<td>"+i+"</td>";
    str += "<td>"+list[i].beacon_id+"</td>";
    str += "</tr>"
  }
  return str;
}

// Adpated from
// @https://stackoverflow.com/questions/7365575/how-to-get-text-between-two-characters
function getKey(str, delim1, delim2) {
    var a = str.indexOf(delim1);

    if (a == -1)
       return str;

    var b = str.indexOf(delim2, a+1);

    if (b == -1)
       return str;

    return str.substr(a+1, b-a-1);
    //                 ^    ^- length = gap between delimiters
    //                 |- start = just after the first delimiter
}

function getLocation(str) {
  var p = str.indexOf("_[");
  if (p < 0) return str;
  return str.substr(0, p);
}

function checkATTR(attr) {
  if (typeof attr !== typeof undefined && attr !== false) {
    // real;
    return true;
  }
  return false;
}

function sendToSend() {
  console.log("Sending To Sending.");
}
