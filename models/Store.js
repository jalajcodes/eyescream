const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');

const storeSchema = new mongoose.Schema({
	name: {
		type: String,
		required: 'Please enter a name',
		trim: true,
	},
	slug: String,
	description: {
		type: String,
		trim: true,
	},
	tags: [String],
});

storeSchema.pre('save', function (next) {
	// this.isModified('name') ? (this.slug = slug(this.name)) : next();
	if (!this.isModified('name')) {
		next(); // skip it
		return; // stop this function from running
	}
	this.slug = slug(this.name);
	next();
});

module.exports = mongoose.model('Store', storeSchema);
