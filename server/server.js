import { handler } from '../build/handler.js';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
	console.log('a user connected');

	socket.on('disconnect', () => {
		console.log('user disconnected');
	});

	socket.on('ping', () => {
		socket.emit('pong');
	});

	socket.on('leave', (data) => {
		socket.leave(data.room);
		socket.emit('left', data.room);
		io.to(data.room).emit('message', {
			user: 'system',
			message: `User '${data.user}' left the room`,
			timestamp: new Date()
		});
	});

	socket.on('join', (data) => {
		socket.join(data.room);
		socket.emit('joined', data.room);
		io.to(data.room).emit('message', {
			user: 'system',
			message: `User '${data.user}' joined the room`,
			timestamp: new Date()
		});
	});

	socket.on('to', (data) => {
		console.log('to: ' + data.room + ' ' + JSON.stringify(data.msg));
		io.to(data.room).emit('message', data.msg);
	});
});

// add a route that lives separately from the SvelteKit app
app.get('/healthcheck', (_req, res) => {
	res.end('ok');
});

// let SvelteKit handle everything else, including serving prerendered pages and static assets
app.use(handler);

server.listen(3000, () => {
	console.log('listening on port 3000');
	console.log('http://localhost:3000');
});
