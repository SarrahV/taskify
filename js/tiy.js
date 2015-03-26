window.tiy = {

    // namespace for views
    views: {},

    //namespace for models
    models: {},

    // raw authentication data
    authData: null,

    // user model
    currentUser: null,

    // base firebase url
    firebaseURL: "https://taskify.firebaseio.com/taskify",

    //firebase connection reference
    fireRef: null,

    // set everything up
    init: function() {

      // add backbone events
      _.extend(this, Backbone.Events);

      // create a model to store our current user
      this.currentUser = new Backbone.Model();

      // connect to firebase
      this.fireRef = new Firebase(this.firebaseURL);

      // give firebase a callback when a user signs in or out
      this.fireRef.onAuth(this.onAuthCallback);
    },

    // callback when user logs in or out
    onAuthCallback: function(authData){
      if (authData) {
        tiy.authData = authData;
        tiy.currentUser.set(authData.twitter.cachedUserProfile);
        console.log("A user is logged in:", tiy.currentUser.get("name"));
        tiy.trigger("sign:in");// triggers event for functions listening for sign in
      } else {
        tiy.authData = null;
        tiy.currentUser.clear();
        console.log("No one is signed in.");
        tiy.trigger("sign:out");// triggers event for functions listening for sign out
      }
      tiy.trigger("sign:in:out");// triggers event for functions listening for either
    },

    //log in to twitter
    twitterLogin: function() {
      this.fireRef.authWithOAuthRedirect("twitter", function(error, authData) {
        if (error) {
          console.log("Login Failed", error);
        } else {
          console.log("Authenticated successfully:", authData);
        }
      });
    },

    isLoggedIn: function() {
      return !!(this.authData && this.authData.uid);
    },

    //
    logout: function() {
      this.fireRef.unauth();
    }

};






