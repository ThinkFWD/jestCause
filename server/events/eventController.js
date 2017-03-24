var Event = require('./eventModel.js');
var email = require('emailjs');
var gmail = require('../../credentials/gmail.js');

var server = email.server.connect({
	user: gmail.user,
	password: gmail.password,
	host: 'smtp.gmail.com',
	ssl: true
});

module.exports = {
	getAttendees: function(req, res, next){
		Event.getAttendees(req.headers.id, function(userID){
			if(userID) {
				res.send(userID)
			} else {
				next(new Error("Could not get attendees in controller"));
			}
		});
	},

	getEvents: function(req, res, next) {
		Event.getEvents(req.headers.email, function(events) {
			if (events) {
				res.send(events);
			} else {
				next(new Error('no event found'));
			}
		});
	},

	getAllEvents : function(req,res,next){
		Event.getAllEvents(function(events){
			if(events){
				res.send(events);
			} else{
				next(new Error('this wasnt successful'));
			}
		})

	},

	getHostedEvents: function(req, res, next) {
		Event.getHostedEvents(req.headers.email, function(events) {
			if (events) {
				res.send(events);
			} else {
				next(new Error('no events found'));
			}
		});
	},

	createEvent: function(req, res, next) {
		let {venue, address, when, description, guests, email} = req.body;


		Event.createEvent(req.body, function(response) {
			if (response) {
				server.send({
					text: (`Venue: ${venue}, Address: ${address}, When: ${when}, Description: ${description}, Who: ${guests}`),
					from: gmail.user,
					to: guests.toString(),
					subject: 'Hang Invitation'
				}, function(err, message) {
					console.log(err || message);
				});
				res.send(response);
			}
			else {
				next(new Error('problem saving event'));
			}
		})
	}
}
