
import mongoose from 'mongoose';

let LicenseSchema = new mongoose.Schema({
	key: {type: String, require: true},
	dateStart: {type: Date, require: true},
	months: {type: Number, require: true},
	years: {type: Number, require: true},
	dateCreate: {type: Date, require: true},
	userCreate: {type: Number, require: true},
	dateUpdate: {type: String, require: true},
	userUpdate: {type: Number, require: true}
});

export default mongoose.model('License', LicenseSchema)
