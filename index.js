var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {}
handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/getAllNotes"] = requestHandlers.getAllNotes;
handle["/getAnneeNotes"] = requestHandlers.getAnneeNotes;

server.start(router.route, handle);