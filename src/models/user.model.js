const mongoose = require('mongoose')
const bcrypt = require("bcryptjs")

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: [true, "This Username is already registered"],
    required: [true, "Username is required to create an account"]
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: [true, "This email is already registered"],
    required: [true, "Email is required"],
    match: [emailRegex, "Pls fill a vlaid email address"]
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"],
    select: false
  },
  systemUser: {
    type: Boolean,
    default: false,
    immutable: true,
    select: false
  }
}, {
  timestamps: true
})


userSchema.pre("save", async function () {

    if(!this.isModified("password")) {
      return
    }

    const hash = await bcrypt.hash(this.password, 10)
    this.password = hash

    return
})

userSchema.methods.comparePassword = async function (password){
  return await bcrypt.compare(password, this.password)
}

const userModel = mongoose.model("user", userSchema)

module.exports = userModel