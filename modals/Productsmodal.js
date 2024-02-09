const mongoose = require("mongoose");

const Productschema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "please enter the product name"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "please give the description"],
  },
  price: {
    type: String,
    required: [true, "please enter the price"],
    maxLength: [8, "price cannot exceed 8 characters"],
  },
  ratings: {
    type: Number,
    default: 0,
  },
  category: {
    type:String,
    required:[true, "please enter the product category"]
  },
  Images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],


  stocks:{
    type:String,
    required:[true, "please enter the stocks"],
    maxLength:[4, "stock cannot exceed 4 characters"],
    default:0
  },
  reviews:
[
    {
        name:{
            type:String,
            required:true,
        },
        rating:{
            type:Number,
            required:true,
        },
        comment:{
            type:String,
            required:true
        }
      }
],

user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'user', // or whatever the reference model is
  required: true, // make sure this is set if the field is required
},

  createdAt:{
    type:Date,
     default:Date.now,
  }

});


module.exports =mongoose.model("Product", Productschema)
