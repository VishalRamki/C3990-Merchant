function onSignIn(googleUser) {
  helper.showLoader();
  var profile = googleUser.getBasicProfile();
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
  var id_token = googleUser.getAuthResponse().id_token;
  console.log(helper.createToken(id_token));

  /*
   *  Get the current user from their Google Authorization;
   *  We are not validating the token. we are simply using an id;
   *  it is VERY Insecure.
   *  @TODO actually secure that;
   */
  $.ajax({
    method: "GET",
    url: SITE.location + "/user/oauth",
    data: { "google_oauth_token": profile.getId() }
  })
    .done(function( msg ) {
      console.log(msg);
      if (msg.error != undefined) {
        // If the user was not found in the server;
        // create the user;
        console.log("make new user");
        $.ajax({
          method: "POST",
          url: SITE.location + "/user",
          crossDomain: true,
          dataType: "application/json",
          data: { "google_oauth_token": profile.getId() }
        }).done(function(row) {
          console.log(row);
          // Now redo the Authorization
          onSignIn(googleUser);
        });
      } else {
        // clear .container and load the new page;
        USER.currentUser = msg.user_id;
        USER.currentName = profile.getName();
        $("#user").text(USER.currentName || "Not Logged In.");
        console.log(USER);
        $("#main_content").load("html_src/store.html", function(data) {
          store();
        });
      }
    });
}
