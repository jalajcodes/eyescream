const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

const multerOptions = {
	storage: multer.memoryStorage(),
	fileFilter(req, file, next) {
		const isPhoto = file.mimetype.startsWith('image/');
		if (isPhoto) {
			next(null, true);
		} else {
			next({ message: "That file type isn't allowed" }, false);
		}
	},
};

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

exports.upload = multer(multerOptions).single('photo');
exports.resize = async (req, res, next) => {
	//check if there is no new file
	if (!req.file) {
		next(); //skip to next middleware
	} else {
		//get extension
		const extension = req.file.mimetype.split('/')[1];
		//create photo on req.body so that createStore can add it in store
		req.body.photo = `${uuid.v4()}.${extension}`;
		//now we resize (jimp is based on promises, so we can use await)
		const photo = await jimp.read(req.file.buffer);
		await photo.resize(800, jimp.AUTO);
		await photo.write(`./public/uploads/${req.body.photo}`);

		// after writing the photo to filesystem. Keep going!
		next();
	}
};

exports.createStore = async (req, res) => {
	req.body.author = req.user._id;

	const store = await new Store(req.body).save();
	req.flash('success', `Successfully created ${store.name}. Care to leave a review?`);
	res.redirect(`/store/${store.slug}`);
};

exports.getStores = async (req, res) => {
	// Query the database for the list of all stores.
	const stores = await Store.find();
	//
	res.render('stores', { title: 'Stores', stores });
};

const confirmOwner = (store, user) => {
	if (!store.author.equals(user._id)) {
		throw Error('You must own a store in order to edit it!');
	}
};

exports.editStore = async (req, res) => {
	// 1. Find the store with help of the id
	const id = req.params.id;
	const store = await Store.findOne({ _id: id });

	// 2. Check if user is the owner of the store
	confirmOwner(store, req.user);

	// 3. Render out the edit form so the user can edit the store
	res.render('editStore', { store, title: `Edit ${store.name}` });
};

exports.updateStore = async (req, res) => {
	// set the location data to Point becaue our model has a type of point as location. If we don't add this here
	// then when we update the store it will not be added to our location schema type because mongodb didn't add
	// default values when updating. This type of point is necessaary because we want to get store close to each other.

	req.body.location.type = 'Point';

	// find and update the store
	const store = await Store.findOneAndUpdate({ _id: req.params.id }, req.body, {
		new: true, // return the new store instead of old one
		runValidators: true,
	}).exec();

	// tell them it worked and redirect them to the store
	req.flash(
		'success',
		`Successfully updated <strong>${store.name}.</strong> <a href="/store/${store.slug}">View Store &rarr; </a>`
	);
	res.redirect(`/stores/${store._id}/edit`);
};

exports.getStoreBySlug = async (req, res, next) => {
	const store = await Store.findOne({ slug: req.params.slug }).populate('author');
	if (!store) return next();
	res.render('store', { store, title: store.name });
};

exports.getStoresByTag = async (req, res, next) => {
	const tag = req.params.tag;

	// if there is a tag in the params then use it otherwise get all the stores which contains the tags array.
	const tagsQuery = tag || { $exists: true };
	const tagsPromise = Store.getTagsList();
	const storesPromise = Store.find({ tags: tagsQuery });

	const [tags, stores] = await Promise.all([tagsPromise, storesPromise]);
	res.render('tags', { title: 'Tags', tags, tag, stores });
};
