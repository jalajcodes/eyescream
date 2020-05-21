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
	req.flash('success', `Successfully created ${store.name}. Care to leave a review?`);
	res.redirect(`/store/${slug}`);
};

exports.getStores = async (req, res) => {
	// Query the database for the list of all stores.
	const stores = await Store.find();
	//
	res.render('stores', { title: 'Stores', stores });
};

exports.editStore = async (req, res) => {
	// 1. Find the store with help of the id
	const id = req.params.id;
	const store = await Store.findOne({ _id: id });

	// 2. Check if user is the owner of the store
	// TODO

	// 3. Render out the edit form so the user can edit the store
	res.render('editStore', { store, title: `Edit ${store.name}` });
};

exports.updateStore = async (req, res) => {
	// set the location data to Point
	req.body.location.type = 'Point';

	// find and update the store
	const store = await Store.findOneAndUpdate({ _id: req.params.id }, req.body, {
		new: true, // return the new store instead of old one
		runValidators: true,
	}).exec();

	// tell them it worked and redirect them to the store
	req.flash(
		'success',
		`Successfully updated <strong>${store.name}.</strong> <a href="/stores/${store.slug}">View Store &rarr; </a>`
	);
	res.redirect(`/stores/${store._id}/edit`);
};
