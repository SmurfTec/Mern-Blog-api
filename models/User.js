const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A User must has a name'],
  },
  email: {
    type: String,
    required: [true, 'A User must has a email'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'A User must has a password'],
  },
  passwordConfirm: {
    type: String,
    validate: {
      validator: function (value) {
        return value === this.password;
      },
      message: 'Confirm Password Does NOT match with Password',
    },
  },
  image: {
    type: String,
  },
  bio: {
    type: String,
    required: [true, 'A User must has a Bio'],
    minlength: [10, 'A Bio must NOT be less than 10 characters long'],
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  activationLink: String,
  activated: {
    type: Boolean,
    default: true,
  },
});

// Encrpt the password ad Presave it
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    //  only run if password is modified
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12); // hashing password
  this.passwordConfirm = undefined; // delete passwordConfirm field
  next();
});

// Add User Photo
userSchema.pre('save', async function (next) {
  if (this.image) {
    return next();
  }
  this.image = `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${this.name
    .toString()
    .split(' ')
    .join('%20')}`;
  next();
});

// create accountActivationLink
userSchema.methods.createAccountActivationLink = function () {
  const activationToken = crypto.randomBytes(32).toString('hex');
  // console.log(activationToken);
  this.activationLink = crypto
    .createHash('sha256')
    .update(activationToken)
    .digest('hex');
  // console.log({ activationToken }, this.activationLink);
  return activationToken;
};

// comparing password
userSchema.methods.correctPassword = async function (
  candidate_Password,
  user_Password
) {
  console.log(candidate_Password);
  return await bcrypt.compare(candidate_Password, user_Password);
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  console.log(resetToken);

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // console.log({ resetToken }, this.passwordResetToken);
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
