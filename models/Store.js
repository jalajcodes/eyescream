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
