testing task and milestones in console

var ms = new tiy.models.Milestones();

models.js:31 Uncaught Error: I need a task

var ts = new tiy.models.Tasks();

undefined

ts;

child {length: 1, models: Array[1], _byId: Object, autoSync: true, firebase: O…}

var t = ts.first();

undefined

var ms = new tiy.models.Milestones(null, {task: t});

undefined

ms;

child {length: 0, models: Array[0], _byId: Object, task: child, autoSync: true…}

ms.url();

"https://taskify.firebaseio.com/taskify/twitter%3A881288227/milestones/-JlB30ecyKwgkK9-BNRo"
ms.add({name: "create tasks collection"});

[Object]