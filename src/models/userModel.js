const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: { 
    type: String, 
    index: true, 
    unique: true, 
    required: true 
  },
  email: { 
    type: String, 
    index: true, 
    required: true, 
    unique: true 
  },
  displayName: { 
    type: String, 
    required: true 
  },
  photo: { 
    type: String 
  },

  
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
