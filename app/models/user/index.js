
import mongoose from 'mongoose';

let UserSchema = new mongoose.Schema({
	name: {type: String, require: true},
	lastname: {type: String, require: true},
	cedula: {type: String, require: true},
	password: {type: String, require: true},
	phone: {type: String, require: true},
	dateBirthday: {type: String, require: true},
	idRol: {type: Number, require: true},
	dateCreate: {type: Date, require: true},
	userCreate: {type: Number, require: true},
	dateUpdate: {type: String, require: true},
	userUpdate: {type: Number, require: true},
	enabled: {type: Number, require: true}
});

export default mongoose.model('User', UserSchema)
