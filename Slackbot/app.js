require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const WebClient = require('@slack/client').WebClient;
const createSlackEventAdapter = require('@slack/events-api').createSlackEventAdapter;
const slackEvents = createSlackEventAdapter('saU2NFmghtKOY0NnvqvlUrMT');
const web = new WebClient('xoxp-259953777764-259824498723-259901113986-f84ded97e0726cd85038154c0ce81ef2');
const bot = new WebClient('xoxb-260785911174-IPG6sDxhKiQ8nm1T6yxZqm1J');

let channel;
let botID;
const PORT = 4390;
const app = express();
var request = require('request');


app.use('/slackbot', slackEvents.expressMiddleware());

slackEvents.on('error', console.error);

slackEvents.on('message', (event) => {
  console.log(`Received a message event: user ${event.user} in channel ${event.channel} says ${event.text}`);
});

app.listen(PORT, function() {
	console.log('TalkBot is listening on port ' + PORT);

	// Get userID for bot
	bot.auth.test()
		.then((info) => {
			if (info.user_id) {
				botID = info.user_id;
				console.log('bot id: ' + botID)
				getSummary();
			}
		})
		.catch(console.error)
});

//make a call to the summarizer API:



function getSummary() {
	request.post(
	    'http://simplif-ai-backend.us-east-2.elasticbeanstalk.com/sumarizertext',
	    { json: { text: 'This is a test. A test of the summary. Is it working?' } },
	    function (error, response, body) {
	        if (!error && response.statusCode == 200) {
	            console.log(body)
	        }
	    }
	);

}

web.chat.postMessage('#general', 'Hello, world!', function(err, info) {
	if (err) console.log(err);
});

/*
slackEvents.on('reaction_added', (event) => {
	// Check for white check mark emoji
	console.log('reaction added')
});

slackEvents.on('message', (event) => {
	console.log('message sent');
	let trigger = '<@' + botID + '>';
	let channel = event.channel;
	if (event.thread_ts && event.text.startsWith(trigger)) {
		// Send message
		web.chat.postMessage(channel, 'Splash down!', function(err, info) {
		
		});

	}
});

*/

