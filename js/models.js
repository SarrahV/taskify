(function(models){

  models.Task = Backbone.Model.extend({ // one task
    initialize: function() {
      this.milestones = new models.Milestones(null, {task: this});

      // listen for change to milestones, recalc percent complete
      this.listenTo(this.milestones, "remove add change:completed_at", function(){
        var percent = this.calcPercentComplete();
        this.set("percent_complete", percent);
      });
    },

    calcPercentComplete: function() {
      //count how many milestones
      var totalMilestoneCount = this.milestones.length;
      //grab all the completed milestones
      var completedMilestones = this.milestones.filter(function(ms){
        return !!ms.get("completed_at");
      });
      //count how many completed milestones we have
      var comepletedMilestonecount = completedMilestones.length;
      //divide completed by total
      var percent = comepletedMilestonecount / totalMilestoneCount;

      return percent;
    }

  });

  models.Tasks = Backbone.Firebase.Collection.extend({
    model:models.Task,
    //scope under twitter namespace
    url: function() {
      if(!tiy.authData || !tiy.authData.uid) {
        throw new Error("I need a user!");
      }
      var uid = encodeURIComponent(tiy.authData.uid); //will add to base firebase url we call in tiy
      return tiy.firebaseURL + "/" + uid + "/tasks";
    }
  });

  models.Milestone = Backbone.Model.extend({

    toggleComplete: function(){
      if(!!this.get("completed_at")){
        this.set("completed_at", null);
      }
      else {
        this.set("completed_at", new Date().toString());
      }
    }

  });

  models.Milestones = Backbone.Firebase.Collection.extend({
    model:models.Milestone,

    url: function() {
      if(!tiy.authData || !tiy.authData.uid) {
        throw new Error("A user must be logged in.");
      }
      if(!this.task) {
        throw new Error("I need a task");
      }
      var uid = encodeURIComponent(tiy.authData.uid); //will add to base firebase url we call in tiy
      var tid = this.task.id;//task id
      return tiy.firebaseURL + "/" + uid + "/milestones/" + tid //scopes under user and task
    },

    initialize: function(data, options){ 
      options || (options = {}); //if options, get that option, if not, create empty options object
      this.task = options.task; // assume there is a task and get it   
    }
  });

})(tiy.models);

// There is not a twitter user model. The tasks created get scoped under the logged in twitter namespace
// this scopes the taks under that twitter id in the url it creates.