var mongoose = require('mongoose'); var User = mongoose.model('User', {
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  tel: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique:true
  },
  loc: {
       type: [Number],
       index: '2d'
   },
   connected: {
       type: Boolean,
       default: false
   },
    img: {
       type: String
   }
  
});
module.exports = {User}
