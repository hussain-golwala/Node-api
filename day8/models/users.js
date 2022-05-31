const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const user = new Schema(
{
first_name: {
type: String,
required: [true, "First name is required"],
},
last_name: {
type: String,
required: [true, "Last name is required"],
},
email: {
  type: String,
  required: [true, "email is required"],
  },
username: {
type: String,
required: [true, "Username is required"],
},
password: {
  type: String,
  required: [true, "Password is required"],
  },
company: {
  type: String,
  required: [false],
  },
profile_pic:{
  type:String,

},
is_deleted: {
type: Boolean,
default: false,
},
},
{
timestamps: true,
}
);

module.exports = mongoose.model("user", user);