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
	createdAt: {
		type: Date,
		default: Date.now(),
	},
	location: {
		type: {
			type: String,
			default: 'Point',
		},
		coordinates: [
			{
				type: Number,
				required: 'You must supply coordinates.',
			},
		],
		address: {
			type: String,
			required: "Address field can't be blank.",
		},
	},
	photo: String,
	author: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: 'You must supply an author',
	},
});

storeSchema.pre('save', async function (next) {
	// this.isModified('name') ? (this.slug = slug(this.name)) : next();
	if (!this.isModified('name')) {
		next(); // skip it
		return; // stop this function from running
	}

	this.slug = slug(this.name);
	// find other stores that have a slug of 'store', 'store-1', etc.. //
	const slugRegex = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
	const storesWithSlug = await this.constructor.find({ slug: slugRegex });
	if (storesWithSlug.length) {
		this.slug = `${this.slug}-${storesWithSlug.length + 1}`;
	}
	next();
});

storeSchema.statics.getTagsList = function () {
	return this.aggregate([
		{ $unwind: '$tags' },
		{ $group: { _id: '$tags', count: { $sum: 1 } } },
		{ $sort: { count: -1 } },
	]);
};

module.exports = mongoose.model('Store', storeSchema);
