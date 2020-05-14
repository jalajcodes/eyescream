const mongoose = require('mongoose');
const Store = mongoose.model('Store');

exports.homePage = (req, res) => {
	res.render('index', {
		title: 'Eyescream',
	});
};

exports.addStore = (req, res) => {
	res.render('editStore', {
		title: 'Add Store',
	});
};

exports.createStore = async (req, res) => {
	const store = new Store(req.body);
	const { slug } = await store.save();
	console.log(slug);
	req.flash('success', `Successfully created ${store.name}. Care to leave a review?`);
	res.redirect(`/store/${slug}`);
};
