//jshint esversion:8
const express = require('express');
const bodyParser = require('body-parser');
const date = require(`${__dirname}/date.js`);

const app = express();
let items = [];
let workItems = [];

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
	let day = date();
	res.render('list', { listTitle: day, newListItems: items });
});

app.post('/', (req, res) => {
	let item = req.body.newItem;
	if (req.body.list === 'Work List') {
		workItems.push(item);
		res.redirect('/work');
	} else if (item !== '') {
		items.push(item);
		res.redirect('/');
	}
});

app.get('/work', (req, res) => {
	res.render('list', { listTitle: 'Work List', newListItems: workItems });
});

app.post('/work', (req, res) => {
	let item = req.body.newItem;
	workItems.push(item);
	res.redirect('/work');
});

app.get('/about', (req, res) => {
	res.render('about');
});

const port = process.env.PORT || 3000;
const ip = process.env.IP || '0.0.0.0';
app.listen(port, ip, () => {
	console.log('Server listening on port 3000');
});
