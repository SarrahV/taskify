(function(views) {

  views.Icon = React.createClass({

    render: function() {
      // create the font awesome class
      var cssClass = "fa fa-" + this.props.fa;
      // add spin effect 
      if (this.props.spin) {
        cssClass += " fa-spin";
      }

      return <i className={cssClass}/>
    }

  });

  views.Toggle = React.createClass({
    render: function(){
      var icon = this.props.on ? "toggle-on" : "toggle-off"; // terinary - check for on prop, if true return on, false return off
      return (
        <div className="toggle" onClick={this.props.onToggle}>
          <views.Icon fa={icon}/>
        </div>
      );
    }
  });

  views.DeleteButton = React.createClass ({
    onClick: function(e) {
      e.preventDefault();
      e.stopPropagation();//keeps it from bubbling up to task event which shows milestones
      if (this.props.confirm) {
        var confirmed = confirm(this.props.confirm);
        if(!confirmed) {
          return;
        }
      }
      this.props.onDelete();
    },

    render: function() {
      return (
        <div className="delete-btn" onClick={this.onClick}>
          <views.Icon fa="remove"/>
        </div>
      );
    }
  });

  views.BreadCrumbs = React.createBackboneClass({

    onLinkClick: function(route, e) {
      e.preventDefault();
      this.props.onRoute(route);
    },

    build: function() {// take array of objects [route: "tasks etc"]
      return (this.props.data || []).map(function(crumb, index){ //makes sure we are not mapping something empty
        // set key to index, set data route to crumbs route - // set text to that title
        return (
          <a href="#" 
          key={index} 
          onClick={this.onLinkClick.bind(this, crumb.route)}>
          {crumb.title}
          </a>
        )
      }, this);
    },

    render: function() {
      if ( !tiy.isLoggedIn() ) {
        return <div/>;
      }
    return (
        <div className="breadcrumbs">
          {this.build()}
        </div>
      )
    }
  });

  views.Progress = React.createClass({
    render: function(){
      // get percent or 0 if no percent
      var percent = this.props.percent || 0;
      // make sure it is a float (has decimal - Int is a whole number)
      percent = parseFloat(percent);
      // normalize value
      percent = percent * 100; 
      // no less than 10 either
      percent = _.max([percent, 10]);// takes larger of two values, less than 10, get 10, more than 10, get more
      // make it a string
      percent = percent.toString() + "%";

      return (
        <div className="progress">
          <div className="complete" style={{width: percent}}></div>
        </div>
      );
    }
  });

})(tiy.views);