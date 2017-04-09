
/// Helper Class;

var HelperClass = function() {
  this.delayTimeout = 2000;
};

HelperClass.prototype.showLoader = function() {
  $("#loader").fadeIn();
};

HelperClass.prototype.hideLoader = function() {
  $("#loader").fadeOut();
};

HelperClass.prototype.defaultDelay = function(cb) {
  window.setTimeout(cb, this.delayTimeout);
};

HelperClass.prototype.delay = function(cb, time) {
  window.setTimeout(cb, time);
};

HelperClass.prototype.fromHREFgetURI = function(string) {
  if (string.indexOf("#") < 0) return "home";
  return string.substr(string.indexOf("#")+1, string.length);
};

HelperClass.prototype.createToken = function(token) {
  return token.substr(0, token.lastIndexOf(".")-1);
};

HelperClass.prototype.buildBeaconList = function(list) {
  str = "";
  for (var i = 0; i < list.length; i++) {
    str += "<tr>";
    str += "<td>"+i+"</td>";
    str += "<td>"+list[i]+"</td>";
    str += "</tr>"
  }
  return str;
};

// Adpated from
// @https://stackoverflow.com/questions/7365575/how-to-get-text-between-two-characters
HelperClass.prototype.getKey = function(str, delim1, delim2) {
    var a = str.indexOf(delim1);

    if (a == -1)
       return str;

    var b = str.indexOf(delim2, a+1);

    if (b == -1)
       return str;

    return str.substr(a+1, b-a-1);
    //                 ^    ^- length = gap between delimiters
    //                 |- start = just after the first delimiter
};

HelperClass.prototype.getLocation = function(str) {
  var p = str.indexOf("_[");
  if (p < 0) return str;
  return str.substr(0, p);
};

HelperClass.prototype.checkATTR = function(attr) {
  if (typeof attr !== typeof undefined && attr !== false) {
    // real;
    return true;
  }
  return false;
};

HelperClass.prototype.beaconInList = function(list, beacon) {
  for (var j = 0; j < list.length; j++) {
    if (list[j] === beacon.beacon_id) return true;
  }
  return false;
};

HelperClass.prototype.sendToSend = function() {
  console.log("Sending To Sending.");
}

HelperClass.prototype.getKeys = function(str) {
  if (str.indexOf("=") <= 0) return str;
  var x = str.split("=");
  return {
    store: x[0],
    promotion: x[1]
  }
};

HelperClass.prototype.convertTime = function(timeStr) {
  // 2017-04-08T03:24:43.163+00:00
  var spilt1 = timeStr.split("T");
  var rawYMD = spilt1[0].split("-");
  var rawTIME = spilt1[1].split(".")[0].split(":");
  return {
    year: rawYMD[0],
    month: rawYMD[1],
    day: rawYMD[2],
    hour: rawTIME[0],
    minute: rawTIME[1],
    second: rawTIME[2]
  };
};

HelperClass.prototype.generateAggregateStoreData = function(raws) {
  var storeNames = this.getDistinctNames(raws);
  var storeData = this.getDistinctData(storeNames, raws);
  return {
    labels: storeNames,
    data: storeData
  };
};

HelperClass.prototype.generateAggregateBeaconData = function(raws) {
  var distictBeacons = this.getDistinctBeacons(raws);
  var distinctBeaconData = this.getDistinctBeaconData(distictBeacons, raws);
  return {
    labels: distictBeacons,
    data: distinctBeaconData
  }
};

HelperClass.prototype.generateAggregatePromotionData = function(raws) {
  var distinctPromotions = this.getDistinctPromotions(raws);
  var distinctPromoData = this.getDistinctPromoData(distinctPromotions, raws);
  return {
    labels: distinctPromotions,
    data: distinctPromoData
  }
};

HelperClass.prototype.getDistinctBeaconData = function(beaconNames, raws) {
  var data = [];
  for (var i = 0; i < beaconNames.length; i++) {
    var tmpData = 0;
    for (var j = 0; j < raws.length; j++) {
      if (beaconNames[i] == raws[j].beacon_id) {
        tmpData++;
      }
    }
    data.push(tmpData);
  }
  return data;
};

HelperClass.prototype.getDistinctBeacons = function(raws) {
  var names = [];
  var inside = 1;
  for (var i = 0; i < raws.length; i++) {
    inside = 1;
    for (var j = 0; j < names.length; j++) {
      if (raws[i].beacon_id == names[j]) {
        inside = 0;
      }
    }
    if (inside == 1) names.push(raws[i].beacon_id);
  }

  return names;
};

HelperClass.prototype.getDistinctPromoData = function(promoNames, raws) {
  var data = [];
  for (var i = 0; i < promoNames.length; i++) {
    var tmpData = 0;
    for (var j = 0; j < raws.length; j++) {
      if (promoNames[i] == raws[j].promotion.title) {
        tmpData++;
      }
    }
    data.push(tmpData);
  }
  return data;
};

HelperClass.prototype.getDistinctPromotions = function(raws) {
  var names = [];
  var inside = 1;
  for (var i = 0; i < raws.length; i++) {
    inside = 1;
    for (var j = 0; j < names.length; j++) {
      console.log(raws[i]);

      if (raws[i].promotion.title == names[j]) {
        inside = 0;
      }
    }
    if (inside == 1) names.push(raws[i].promotion.title);
  }

  return names;
};


HelperClass.prototype.getDistinctData = function(storeNames, raws) {
  var data = [];
  for (var i = 0; i < storeNames.length; i++) {
    var tmpData = 0;
    for (var j = 0; j < raws.length; j++) {
      if (storeNames[i] == raws[j].storeName) {
        tmpData++;
      }
    }
    data.push(tmpData);
  }
  return data;
};

HelperClass.prototype.getDistinctNames = function(raws) {
  var names = [];
  var inside = 1;
  for (var i = 0; i < raws.length; i++) {
    inside = 1;
    for (var j = 0; j < names.length; j++) {
      if (raws[i].storeName == names[j]) {
        inside = 0;
      }
    }
    if (inside == 1) names.push(raws[i].storeName);
  }

  return names;
};

HelperClass.prototype.getFileName = function(str) {
  if (str == null) return "";
  if (str.lastIndexOf("/") <= 0) return str;
  return str.substr(str.lastIndexOf("/"), str.length);
};

/*
 *  showMessage() creates an alert on the page for the user to interact with;
 *  it will be used to give the user information about what has happened;
 *  and if anything requires attention;
 *
 *  options => {
 *    message // the general message you want to display;
 *    type // the type of alert it is => ["info", "success", "warning", "danger"]
 *  }
 *
 */
HelperClass.prototype.showMessage = function(options) {

  var item = $('<div class="alert alert-'+(options.type || 'info')+' alert-dismissible" role="alert"> \
      <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button> \
      '+(options.message || 'nothing')+'</div>').hide().slideDown("slow");

  $("#alertSpace").append(item);
};

var helper = new HelperClass();
//
// var data = [
//   {
//       "beacon_id": "baee89bb-8147-44fa-919d-178574bbc105",
//       "date": "2017-04-08T03:24:43.163+00:00",
//       "storeName": "Payless (Totally Not Bankrupt)",
//       "store_id": "96aa15b7-436a-4ed9-afe4-32a629985da1"
//   },
//   {
//       "beacon_id": "baee89bb-8147-44fa-919d-178574bbc105",
//       "date": "2017-04-08T03:24:43.163+00:00",
//       "storeName": "Payless (Totally Not Bankrupt)",
//       "store_id": "96aa15b7-436a-4ed9-afe4-32a629985da1"
//   },
//   {
//       "beacon_id": "baee89bb-8147-44fa-919d-178574bbc105",
//       "date": "2017-04-08T03:24:43.163+00:00",
//       "storeName": "Payless (Totally Not Bankrupt)",
//       "store_id": "96aa15b7-436a-4ed9-afe4-32a629985da1"
//   },
//   {
//       "beacon_id": "baee89bb-8147-44fa-919d-178574bbc105",
//       "date": "2017-04-08T03:24:43.163+00:00",
//       "storeName": "Payless ggg(Totally Not Bankrupt)",
//       "store_id": "96aa15b7-436a-4ed9-afe4-32a629985da1"
//   }
//
// ]
// ;
// helper.generateAggregateStoreData(data);
