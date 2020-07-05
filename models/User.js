const mongoose = require('mongoose');
// mongoose.promise = global.promise;
const md5 = require('md5');
const validator = require('validator');
const monogdberrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: 'Please supply an email address',
		trim: true,
		unique: true,
		lowercase: true,
		validate: [validator.isEmail, 'Invalid Email Address.'],
	},
	name: {
		type: String,
		required: 'Hey, what the hell is your name?',
		trim: true,
	},
});

userSchema.plugin(passportLocalMongoose, { userNameField: 'email' });
userSchema.plugin(monogdberrorHandler);

module.exports = mongoose.model('User', userSchema);
