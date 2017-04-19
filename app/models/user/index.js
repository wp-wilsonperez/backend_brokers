
import mongoose from 'mongoose';

let UserSchema = new mongoose.Schema({
	firstname: {type: String, require: true},
	lastname: {type: String, require: true},
	username: {type: String, require: true},
	password: {type: String, require: true},
	role_id: {type: Number, require: true},
	img: {type: String, require: true, default: "user.jpg"}
});

export default mongoose.model('User', UserSchema)

