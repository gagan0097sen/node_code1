const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },

  name: {
    type: String,
  },

  quantity: {
    type: String,
  },

  price: {
    type: String,
  },

  image: {
    type: [String],
  },
});

const countrySchema = new mongoose.Schema({
    id:{
     type:Number,
    },
    name:{
     type:String,
    },
    iso3:{
     type:String,
    },
    iso2:{
     type:String,
    },
    numeric_code:{
     type:String,
    },
    phone_code:{
     type:String,
    },
    capital:{
     type:String,
    },
    currency:{
     type:String,
    },
    currency_name:{
     type:String,
    },
    currency_symbol:{
     type:String,
    },
    tld:{
     type:String,
    },
    native:{
     type:String,
    },
    region:{
     type:String,
    },
    region_id:{
     type:String,
    },
    subregion:{
     type:String,
    },
    subregion_id:{
     type:String,
    },
    nationality:{
     type:String,
    },
    timezones:{
     type:Array,
    },
    translations:{
     type:Object,
    },
    latitude:{
     type:String,
    },
    longitude:{
     type:String,
    },
    emoji:{
     type:String,
    },
    emojiU:{
     type:String
    },
    states:{
     type:Array
    }
  });

  const uploadIcons = async (iconArray, upload, folderName, icon_file) => {
    for (let i = 0; i < iconArray.length; i++) {
      if (icon_file[`${folderName}[${i}][icon]`]) {
        const folderPath = folderName;
        // const uploadPath = `public/uploads/plans_page/${folderPath}/`;
        const uploadPath = `public/${upload}/${folderPath}/`;
        const response = await getfileUpload(
          icon_file[`${folderName}[${i}][icon]`],
          folderPath,
          uploadPath
        );
        iconArray[i]["icon"] = response.image_url;
      }
    }
  };

const productModel = mongoose.model("Product", productSchema);
module.exports = productModel;
