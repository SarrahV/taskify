(function(views){

  views.TwitterLoggedIn = React.createClass({

    render: function(){
      return (
        <div className="logged-in" onClick={tiy.logout.bind(tiy)}>
          <img className="profile-image" src={this.props.img} alt=""/>
          {" "}
          <span>{this.props.name}</span>
          {" "}
          <views.Icon fa="sign-out"/>
        </div>
      )
    }

  });

  views.TwitterNotLoggedIn = React.createClass({

    render: function() {
      return (
        <div className="not-logged-in" onClick={tiy.twitterLogin.bind(tiy)}>
          <span>Sign In With</span>
          {" "}
          <views.Icon fa="twitter"/>
        </div>
      );
    }

  });

  views.TwitterLogin = React.createBackboneClass({
    getChild: function(){
      if (this.props.model.id) {
        var name = this.props.model.get("name");
        var img = this.props.model.get("profile_image_url");
        return <views.TwitterLoggedIn name={name} img={img}/>
      }
      else{
        return <views.TwitterNotLoggedIn/>
      }
    },

    render: function(){
      return (
          <div className="twitter-login">
            { this.getChild() }
          </div>
      );
    }

  });

  views.Header = React.createBackboneClass({
    render: function() {
      return (
         <div>
            <div className="logo">Taskify</div>
            <views.TwitterLogin model={this.props.model}/>
          </div>
      );
    }

  });

})(tiy.views);

/*test in console
var c = tiy.views.TwitterLoggedIn;

var elem = React.createElement(c, {name: "jd", img:"imgurlhere"});*/





