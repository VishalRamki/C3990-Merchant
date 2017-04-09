$(document).ready(function() {

  helper.hideLoader();
  $("#user").text(USER.currentName || "Not Logged In.");

  /*
   *  This Alters the Page From the Navbar.
   */
  $("a").click(function() {
    var item = $(this);
    var itemHash = item.attr("href");
    if (helper.checkATTR(itemHash) === false) return;
    var itemURI = helper.fromHREFgetURI(itemHash);
    console.log(itemURI);
    helper.showLoader();
    $("#main_content").load("html_src/"+itemURI+".html", function() {
      switchITX(itemURI);
    });
  });

  $(document).on("click", "#main_content a", function() {
    var item = $(this);
    var itemHash = item.attr("href");
    if (helper.checkATTR(itemHash) === false) return;
    var URI = {
      itemURI: helper.fromHREFgetURI(itemHash),
      itemKey: helper.getKeys(helper.getKey(helper.fromHREFgetURI(itemHash), "[", "]")),
      itemLocation: helper.getLocation(helper.fromHREFgetURI(itemHash))
    };
    helper.showLoader();
    $("#main_content").load("html_src/"+URI.itemLocation+".html", function(s) {
      console.log(s)
      switchIt(URI);
    });
  });
});
