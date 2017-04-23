var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var giphy = require('giphy-api')()
var app = express()

app.use(bodyParser())

app.get('/', function(req, res) {
	res.send('hello world')
})

app.get('/messages', function(req, res) {
	res.send(req.query['hub.challenge'])
})

app.post('/messages', function(req, res) {
	res.sendStatus(200)
	var body = req.body
	if (body.object === 'page') {
		body.entry.forEach(function(entry) {
			entry.messaging.forEach(function(message) {
				var senderId = message.sender.id
				var text = message.message.text

				giphy.random(text, function(err, res) {
					var gif = res.data.fixed_height_small_url
					sendMessage(senderId, gif)
				})
			})
		})
	}
})

function sendMessage(recipient, text) {
	var body = {
		recipient: {
			id: recipient
		},
		message: {
			attachment: {
				type: 'image',
				payload: {
					url: text
				}
			}
		}
	}

	request({
		uri: 'https://graph.facebook.com/v2.6/me/messages',
		qs: { access_token: 'FACEBOOK_ACCESS_TOKEN' },
		method: 'POST',
		json: body
	}, function (err, res, body) {
	})
}

app.listen((process.env.PORT || 5000), function() {
	console.log('server started')
})