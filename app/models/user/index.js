
import mongoose from 'mongoose';
import validate from 'mongoose-validator';

let UserSchema = new mongoose.Schema({
	name: {type: String, require: true},
	lastName: {type: String, require: true},
	cedula: {type: String, require: true, unique : true},
	password: {type: String, require: true},
	mail: {type: String, require: true, unique : true},
	phone: {type: String, require: true},
	dateBirthday: {type: String, require: true},
	idRol: {type: String, require: true},
	userImg: {type: String, default: ""},
	Enabled: {type: Number, require: true},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true}
});

var nameValidator = [
  validate({
    validator: 'isLength',
    arguments: [3, 50],
    message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters'
  }),
  validate({
    validator: 'isAlphanumeric',
    passIfEmpty: true,
    message: 'Name should contain alpha-numeric characters only'
  })
];

export default mongoose.model('User', UserSchema)
