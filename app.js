require("dotenv").config();

const PythonShell = require("python-shell");
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();

// Switch states held in memory
const switches = [];

// Actions held in memory
const actions = [];

// Read state from saveState.json, populate switches array
var readableStream = fs.createReadStream("saveState.json");
var data = "";

readableStream.on("data", function(chunk) {
  data += chunk;
});

readableStream.on("end", function() {
  var parsed = JSON.parse(data);

  for (i = 0; i < parsed.switches.length; i++) {
    switches.push(new Switch(parsed.switches[i]));
  }
});

// Read actions from actions.json, populate actions array
var readableStreamA = fs.createReadStream("actions.json");
var dataA = "";

readableStreamA.on("dataA", function(chunk) {
  dataA += chunk;
});

readableStreamA.on("end", function() {
  var parsed = JSON.parse(dataA);

  for (i = 0; i < parsed.actions.length; i++) {
    actions.push(new Action(parsed.actions[i]));
  }
});

// Switch Model
// Expects an object:{
// id:"sw" + number,
// state: "on" or "off",
// name: any name you want to display. Defaults to "switch"
// }

function Switch(switchValues) {
  this.id = switchValues.id || "sw";
  this.state = switchValues.state || "off";
  this.name = switchValues.name || "switch";
  this.toggle = function() {
    if (this.state === "on") {
      this.setState("off");
    } else {
      this.setState("on");
    }
  };
  this.setState = function(state) {
    var str = state === "on" ? onString(this.id[2]) : offString(this.id[2]);
    PythonShell.run(str, function(err) {
      if (!process.env.DEV) {
        if (err) throw err;
      }
    });
    this.state = state;
  };
  // Invokes setState on init to set the switch to its last recalled state.
  this.setState(this.state);
}

// Action Model
// Expects an object:{
// id:"act" + number,
// name: any name you want to display. Defaults to "action"
// }

function Action(actionValues) {
  this.id = actionValues.id || "act";
  // this.state = actionValues.state || "off";
  this.name = actionValues.name || "action";
  
  this.trigger = function() {
	var str = triggerString(this.id.slice(2,this.id.length+1));
    PythonShell.run(str, function(err) {
      if (!process.env.DEV) {
        if (err) throw err;
      }
    });
    this.state = state;
  };
}

// needed due to a quirk with PythonShell
function onString(number) {
  return "./public/python/sw" + number + "_on.py";
}
function offString(number) {
  return "./public/python/sw" + number + "_off.py";
}

// For actions
function triggerString(numberStr) {
	return "./public/python/act" + numberStr + ".py";
}

// Switch Lookup
function getSwitch(string) {
  return switches.filter(function(element) {
    return element.id === string;
  })[0];
}

// Action Lookup
function getAction(string) {
  return actions.filter(function(element) {
    return element.id === string;
  })[0];
}

// Updates saveState.json
function saveState() {
  var formattedState = {
    switches: switches
  };
  fs.writeFile("./saveState.json", JSON.stringify(formattedState), function(
    err
  ) {
    if (err) {
      console.error(err);
    } else {
      let date = new Date();
      console.log(`
${date.toLocaleDateString()} ${date.toLocaleTimeString()} State has been updated
New state: ${JSON.stringify(formattedState)}
`);
    }
  });
}

//Server Configuration
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

// If you have a frontend, drop it in the Public folder with an entry point of index.html
app.get("/", function(req, res) {
  res.sendFile("index");
});

// Switch Routes for API
app.get("/api/switches", function(req, res) {
  res.send(switches);
});

app.get("/api/switches/:id", function(req, res) {
  var found = getSwitch(req.params.id);
  res.json(found);
});

// Action Routes for API?
app.get("/api/actions", function(req, res) {
  res.send(actions);
});

app.get("/api/actions/:id", function(req, res) {
  var found = getAction(req.params.id);
  res.json(found);
});

app.post("/api/switches/:id", function(req, res) {
  // For now, uses a simple password query in the url string.
  // Example: POST to localhost:8000/API/switches/sw1?password=test
  if (req.query.password === process.env.PASS) {
    var foundSwitch = getSwitch(req.params.id);

	if (typeof foundSwitch === 'undefined'){
		console.log("Unrecognized switch: " + req.params.id);
		res.send("Unrecognized switch");
		return;
	} 
    // Optional On / Off command. If not included, defaults to a toggle.

    if (!(req.query.command === "on" || req.query.command === "off")) {
      foundSwitch.toggle();
    } else {
      foundSwitch.setState(req.query.command);
    }

    saveState();
    console.log("postSwitch " + JSON.stringify(foundSwitch));
    res.json(foundSwitch);
  } else {
    console.log("invalid password");
    res.send("try again");
  }
});

app.post("/api/actions/:id", function(req, res) {
  // For now, uses a simple password query in the url string.
  // Example: POST to localhost:8000/API/actions/act1?password=test
  if (req.query.password === process.env.PASS) {
    var foundAction = getAction(req.params.id);
	if (typeof foundAction === 'undefined'){
		console.log("Unrecognized action: " + req.params.id);
		res.send("Unrecognized action");
		return;
	} 
	foundAction.trigger();

    console.log("postAction " + JSON.stringify(foundAction));
    res.json(foundAction);
  } else {
    console.log("invalid password");
    res.send("try again");
  }
});

app.listen(process.env.PORT, function() {
  console.log("Listening on port " + process.env.PORT);
});
