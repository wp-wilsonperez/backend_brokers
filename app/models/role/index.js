
import mongoose from 'mongoose';

let RoleSchema = new mongoose.Schema({
	name: {type: String, require: true},
	description: {type: String},
	dateCreate: {type: Date, require: true},
	userCreate: {type: Number, require: true},
	dateUpdate: {type: String, require: true},
	userUpdate: {type: Number, require: true}
});

export default mongoose.model('Role', RoleSchema)
