//jshint esversion:8
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const mongoose = require('mongoose');

const app = express();
// let items = [];
// let workItems = [];

mongoose.connect('mongodb+srv://admin-jamiu:hyperjay@cluster0.hzvuy.mongodb.net/todolistDB', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false
});

const itemsSchema = {
	name: String
};

const Item = mongoose.model('Item', itemsSchema);

const item1 = new Item({
	name: 'Welcome to your todolist!'
});
const item2 = new Item({
	name: 'Hit the + button to add a new list'
});
const item3 = new Item({
	name: '<--Hit this to delete an item'
});

const defaultItems = [ item1, item2, item3 ];

const listSchema = {
	name: String,
	items: [ itemsSchema ]
};

const List = mongoose.model('List', listSchema);

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
	Item.find({}, (err, foundItems) => {
		if (foundItems.length === 0) {
			Item.insertMany(defaultItems, (err) => {
				if (err) {
					console.log(err);
				} else {
					console.log('Successfully saved default items to DB!');
				}
			});
			res.redirect('/');
		} else {
			res.render('list', { listTitle: 'Today', newListItems: foundItems });
		}
	});
});

app.post('/', (req, res) => {
	const itemName = req.body.newItem;
	const listName = req.body.list;
	const item = new Item({
		name: itemName
	});

	if (listName === 'Today') {
		item.save();
		res.redirect('/');
	} else {
		List.findOne({ name: listName }, (err, foundList) => {
			foundList.items.push(item);
			foundList.save();
			res.redirect(`/${listName}`);
		});
	}
});

app.post('/delete', (req, res) => {
	const checkedItemId = req.body.checkbox;
	const listName = req.body.listName;

	if (listName === 'Today') {
		Item.findByIdAndRemove(checkedItemId, (err) => {
			if (err) {
				console.log(err);
			} else {
				res.redirect('/');
			}
		});
	} else {
		List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedItemId } } }, (err, foundList) => {
			if (err) {
				console.log(err);
			} else {
				res.redirect(`/${listName}`);
			}
		});
	}
});

app.get('/:customListName', (req, res) => {
	const customListName = _.capitalize(req.params.customListName);

	List.findOne({ name: customListName }, (err, foundList) => {
		if (!err) {
			if (!foundList) {
				// Create a new list
				const list = new List({
					name: customListName,
					items: defaultItems
				});
				list.save();
				res.redirect(`/${customListName}`);
			} else {
				// Show existing list
				res.render('list', { listTitle: foundList.name, newListItems: foundList.items });
			}
		}
	});
});

app.get('/about', (req, res) => {
	res.render('about');
});

const port = process.env.PORT || 3000;
const ip = process.env.IP || '0.0.0.0';
app.listen(port, ip, () => {
	console.log('Server listening on port 3000');
});
