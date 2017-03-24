var userController = require('../users/userController.js');
var eventController = require('../events/eventController.js');
let profileController = require('../profile/profileController.js');

module.exports = function(app, express) {
	app.post('/api/users/signin', userController.signin);
	app.post('/api/users/signup', userController.signup);
	app.get('/api/users', userController.getUsers);
	app.put('/api/users', userController.updateUser);
	app.get('/api/allevents', eventController.getAllEvents);
	app.get('/api/events', eventController.getEvents);
	app.get('/api/profile');
	app.get('/api/hostedEvents', eventController.getHostedEvents);
	app.post('/api/events', eventController.createEvent);
	app.get('/api/currentUser', userController.currentUser);
	app.get('/api/attendees', eventController.getAttendees);
};
