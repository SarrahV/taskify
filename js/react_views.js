(function(views){

  views.TwitterLoggedIn = React.createClass({displayName: "TwitterLoggedIn",

    render: function(){
      return (
        React.createElement("div", {className: "logged-in", onClick: tiy.logout.bind(tiy)}, 
          React.createElement("img", {className: "profile-image", src: this.props.img, alt: ""}), 
          " ", 
          React.createElement("span", null, this.props.name), 
          " ", 
          React.createElement(views.Icon, {fa: "sign-out"})
        )
      )
    }

  });

  views.TwitterNotLoggedIn = React.createClass({displayName: "TwitterNotLoggedIn",

    render: function() {
      return (
        React.createElement("div", {className: "not-logged-in", onClick: tiy.twitterLogin.bind(tiy)}, 
          React.createElement("span", null, "Sign In With"), 
          " ", 
          React.createElement(views.Icon, {fa: "twitter"})
        )
      );
    }

  });

  views.TwitterLogin = React.createBackboneClass({
    getChild: function(){
      if (this.props.model.id) {
        var name = this.props.model.get("name");
        var img = this.props.model.get("profile_image_url");
        return React.createElement(views.TwitterLoggedIn, {name: name, img: img})
      }
      else{
        return React.createElement(views.TwitterNotLoggedIn, null)
      }
    },

    render: function(){
      return (
          React.createElement("div", {className: "twitter-login"}, 
             this.getChild() 
          )
      );
    }

  });

  views.Header = React.createBackboneClass({
    render: function() {
      return (
         React.createElement("div", null, 
            React.createElement("div", {className: "logo"}, "Taskify"), 
            React.createElement(views.TwitterLogin, {model: this.props.model})
          )
      );
    }

  });

})(tiy.views);

/*test in console
var c = tiy.views.TwitterLoggedIn;

var elem = React.createElement(c, {name: "jd", img:"imgurlhere"});*/






(function(views) {

  views.Icon = React.createClass({displayName: "Icon",

    render: function() {
      // create the font awesome class
      var cssClass = "fa fa-" + this.props.fa;
      // add spin effect 
      if (this.props.spin) {
        cssClass += " fa-spin";
      }

      return React.createElement("i", {className: cssClass})
    }

  });

  views.Toggle = React.createClass({displayName: "Toggle",
    render: function(){
      var icon = this.props.on ? "toggle-on" : "toggle-off"; // terinary - check for on prop, if true return on, false return off
      return (
        React.createElement("div", {className: "toggle", onClick: this.props.onToggle}, 
          React.createElement(views.Icon, {fa: icon})
        )
      );
    }
  });

  views.DeleteButton = React.createClass ({displayName: "DeleteButton",
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
        React.createElement("div", {className: "delete-btn", onClick: this.onClick}, 
          React.createElement(views.Icon, {fa: "remove"})
        )
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
          React.createElement("a", {href: "#", 
          key: index, 
          onClick: this.onLinkClick.bind(this, crumb.route)}, 
          crumb.title
          )
        )
      }, this);
    },

    render: function() {
      if ( !tiy.isLoggedIn() ) {
        return React.createElement("div", null);
      }
    return (
        React.createElement("div", {className: "breadcrumbs"}, 
          this.build()
        )
      )
    }
  });

  views.Progress = React.createClass({displayName: "Progress",
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
        React.createElement("div", {className: "progress"}, 
          React.createElement("div", {className: "complete", style: {width: percent}})
        )
      );
    }
  });

})(tiy.views);
(function(views){
//need state because we need to keep the state of whats inside input till submitted
  views.AddForm = React.createClass({displayName: "AddForm",
    getInitialState: function() {
      return {name: ""};
    },

    updateName: function(e) {
      this.setState({name: e.target.value});
    },
    
    onSubmit: function(e) {
      e.preventDefault();
      var form = this.getDOMNode();
      var data = $(form).serializeJSON();
      this.props.onAdd(data);
      this.setState({name: ""});
    },

    render: function() {
      var adding = this.props.adding;
      var placeholder = "Add a " + adding;
      return (
        React.createElement("form", {onSubmit: this.onSubmit}, 
          React.createElement("input", {
            type: "text", 
            name: "name", 
            value: this.state.name, 
            onChange: this.updateName, 
            placeholder: placeholder})
        )
      );
    }

  });

  views.Milestone = React.createBackboneClass({

    toggleComplete: function() {
      this.props.model.toggleComplete();//expect model to have method called toggle complete
    },

    render: function() {
      var name = this.props.model.get("name");
      var done = this.props.model.get("completed_at");
      return (
        React.createElement("div", {className: "milestone item"}, 
          React.createElement("div", {className: "item-title"}, name), 
          React.createElement(views.Toggle, {on: done, onToggle: this.toggleComplete})
        )
      );
    }

  });

  views.Milestones = React.createBackboneClass({

    getItem: function(model, index) {
      return React.createElement(views.Milestone, {model: model, key: index})
    },

    add: function(data) {
      this.props.collection.add(data)
    },

    render: function() {
      return (
        React.createElement("div", {className: "milestones list"}, 
          React.createElement("div", {className: "heading"}, 
            React.createElement("h2", null, this.props.title)
          ), 
          React.createElement("div", {className: "items"}, 
             this.props.collection.map(this.getItem) 
          ), 
          React.createElement("div", {className: "add-item"}, 
            React.createElement(views.AddForm, {adding: "milestone", onAdd: this.add})
          )
        )
      )
    }

  });

  views.Task = React.createBackboneClass({

    destroy: function(){
      this.props.model.destroy();
    },

    render: function() {
      var d = this.props.model.toJSON();// d is the task from model
      return (
        React.createElement("div", {className: "task item", onClick: this.props.onClick}, 
          React.createElement("span", {className: "item-title"}, d.name), 
          React.createElement(views.DeleteButton, {
           confirm: "Do oyou really want to delete this task?", 
           onDelete: this.destroy}), 
          React.createElement(views.Progress, {percent: d.percent_complete})
        )
      );
    }

  });

  views.Tasks = React.createBackboneClass({

    selectTask: function(model) {
      this.props.onSelect(model);
    },

    getItem: function(model, index) {
        return (
          React.createElement(views.Task, {
            model: model, 
            onClick: this.selectTask.bind(this, model), 
            key: index})
        )
    },

    add: function(data) {
      this.props.collection.add(data);
    },

    render: function() {
      return (
        React.createElement("div", {className: "tasks list"}, 
          React.createElement("div", {className: "heading"}, 
            React.createElement("h2", null, "Tasks")
          ), 
          React.createElement("div", {className: "items"}, 
             this.props.collection.map(this.getItem) 
          ), 
          React.createElement("div", {className: "add-item"}, 
            React.createElement(views.AddForm, {adding: "task", onAdd: this.add})
          )
        )
      );
    }
  });

  views.Main = React.createBackboneClass({

    render: function() {
      if(this.props.loading) {
        return (
          React.createElement("div", {className: "main-loading"}, 
            React.createElement(views.Icon, {fa: "spinner", spin: "true"})
          )
        );
      }
      else if (this.props.collection && this.props.taskId) {
        var taskId = this.props.taskId;// id, not list of tasks
        var tasks = this.props.collection;
        var task = tasks.get(taskId);
        return React.createElement(views.Milestones, {
          collection: task.milestones, 
          title: task.get("name")});
      }
      else if(this.props.collection) {
        return React.createElement(views.Tasks, {
          onSelect: this.props.onTaskSelect, 
          collection: this.props.collection});
        }
      else {
        return React.createElement("div", {className: "please-signin"}, "Please sign in to view or create tasks")
      }
    }

  });

})(tiy.views)










