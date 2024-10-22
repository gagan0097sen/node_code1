const jwt = require("jsonwebtoken");

const encode = async (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "1h",});
};

const decode = async (token) => {
  return jwt.decode(token, process.env.JWT_SECRET);
};

/********************************************** */

const bcrypt = require("bcrypt");
const hashedPassword=async(password)=> {
    return await bcrypt.hashSync(password, 10);
  }
  
const validatePassword=async(plainpassword, hashedPassword)=> {
    return await bcrypt.compare(plainpassword, hashedPassword);
  }

/********************************************* */

  const multer = require("multer");
  const path = require("path");
  
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/images");
    },
    filename: function (req, file, cb) {
      let ext = path.extname(file.originalname);
      cb(null, Date.now() + ext);
    },
  });
  
  var upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
      if (
        file.mimetype == "image/jpeg" ||
        file.mimetype == "image/png" ||
        file.mimetype == "image/jpg" ||
        file.mimetype == "application/pdf" ||
        file.mimetype === "application/msword" ||
        file.mimetype ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        cb(null, true);
      } else {
        console.log("only jpg,jpeg and png file supported");
        cb(null, false);
      }
    },
  });

/******************************************** */
function removeDuplicasy(arr) {
    let uniqueItems = new Set();
    let uniqueArr = [];
  
    arr.forEach((element) => {
      let key = JSON.stringify(element);
      if (!uniqueItems.has(key)) {
        uniqueItems.add(key);
        uniqueArr.push(element);
      }
    });
  
    return uniqueArr;
  }
  
  const array = [
    { id: 1, value: "xyz" },
    { id: 2, value: "abc" },
    { id: 1, value: "xyz" },
    { id: 3, value: "pqr" },
    { id: 3, value: "pqr" },
  ];
  
  const data = removeDuplicasy(array);
  console.log(data);

/****************************************** */
// for handle multiple file
  if (req.files) {
      let file = "";
      req.files.forEach(function (files) {
        file = file + files.filename + "," + process.env.BASE_URL;
      });
      file = file.substring(0, file.lastIndexOf(","));
      addNewProduct.image = process.env.BASE_URL + file;
    } else {
      file = null;
    }

/************************************ */
const paginate = ({ currentPage, pageSize }) => {
    const offset = parseInt(currentPage * pageSize, 10);
    const limit = parseInt(pageSize, 10);
    return {
      offset,
      limit,
    };
  };

function convertHoursToSeconds(hours) {
    return hours * 60 * 60;
  }

  const checkAdminAuth = async (req, res, next) => {   // token
    let token;
    const { authorization } = req.headers;
    if (authorization) {
      try {
        // Get Token from header
        token = authorization;
        // Verify Token
        jwt.verify(
          token,
          process.env.JWT_SECRET_KEY,
          async (err, jwtResponse) => {
            if (err) {
              // Token is invalid or expired
              if (err.name == "JsonWebTokenError") {
                return res.status(403).json({
                  status: false,
                  statusCode: 403,
                  message: "Invalid token.",
                });
              }
              if (err.name == "TokenExpiredError") {
                return res.status(403).json({
                  status: false,
                  statusCode: 403,
                  message: "Token has expired.",
                });
              }
            }
            const { userID, email } = jwtResponse;
            
            if (!userID) {
              return res.status(403).send({
                status: false,
                message: "Unauthorized User",
                // err: "user",
              });
            }
            if (!email) {
              return res.status(403).send({
                status: false,
                message: "Unauthorized User",
                // err: "password",
              });
            }
  
            // Get User from Token
            // const userData = await AdminModel.findOne(
            //   { where: { id: userID, password: password } },
            //   {
            //     attributes: {
            //       exclude: ["password"],
            //     },
            //   }
            // );
            const userData = await AdminModel.findOne(
              { _id: userID, email: email },
              { password: 0 } 
            ).lean();
  
            if (userData) {
              req.user = userData;
              next();
            } else {
              return res.status(403).send({
                status: false,
                message: "Unauthorized User",
                err: "user",
                // userID: password,
              });
            }
          }
        );
      } catch (error) {
        return res
          .status(403)
          .send({ status: false, message: "Unauthorized User", error: error });
      }
    }
  
    if (!token) {
      res
        .status(403)
        .send({ status: false, message: "Unauthorized User, No Token" });
    }
  };

  /************************************* */
//   list pagination
  const listPagination = async (req, res) => {
    try {
        const { offset } = req.body;
        let page = 0;
        const limit = 10;
        if (offset) {
            page = offset;
        }

        const totalCount = await PaginationModel.countDocuments();
        const results = await PaginationModel.find()
            .sort({ id: -1 })
            .skip(page * limit)
            .limit(limit);

        const get_plans_list = results.map((element) => {
            return {
                id: element.id,
                title: element.title || "",
                status: element.status || "",
                is_parent: element.is_parent || "",
                image: element.image ? asset("app.secure.propertyType", element.image) : "",
            };
        });

        if (get_plans_list.length) {
            return res.status(200).json({
                status: true,
                message: "Pagination Type List",
                page_count: totalCount,
                data: get_plans_list,
            });
        } else {
            return res.status(404).send({
                status: true,
                statusCode: 404,
                message: "Data not Found",
            });
        }
    } catch (error) {
        if (process.env.Node_APP_ENV == "development") {
            console.log("error", error);
        }
        return res.status(500).send({
            error: error.message,
            status: false,
            statusCode: 500,
            message: "Something went wrong",
        });
    }
}

/**************************************** */

const get_token = async (req, res) => {
    const validationSchema = joi
      .object({
        client_id: joi.string().required(),
        client_secret: joi.string().required(),
        grant_type: joi.string().required(),
      })
      .options({ abortEarly: false });      
  
    const validationResult = await validateFormData.validateFormData(req.body, validationSchema);
    if (validationResult.status == false) {
      return res.status(400).json({
        status: false,
        statusCode: 400,
        errors: validationResult.errors,
      });
    }
    const { client_id, client_secret, grant_type } = req.body;
    if (client_id != process.env.CLIENT_ID) {   
      return res.status(401).json({
        status: false,
        statusCode: 401,
        message: "Unauthorized access token (status-401)",
      });
    }
  
    if (client_secret != process.env.CLIENT_SECRET) {
      return res.status(401).json({
        status: false,
        statusCode: 401,
        message: "Unauthorized access token (status-401)",
      });
    }
  
    if (grant_type != process.env.GRANT_TYPE) {
      return res.status(401).json({
        status: false,
        statusCode: 401,
        message: "Unauthorized access token (status-401)",
      });
    }
  
    const obj = {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: process.env.GRANT_TYPE,
    };
    const accessToken = jwt.sign({ ...obj }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.EXPIRE_TOKEN,
    });
  
    return res.status(200).json({
      access_token: accessToken,
      expires_in: convertHoursToSeconds.convertHoursToSeconds(process.env.EXPIRE_TOKEN),
      token_type: "Bearer",
      scope: "",
    });
  };

  /*************************************** */

  const checkApiToken = async (req, res, next) => {
    let token;
    // const { access_token } = req.body;
    const { access_token } = req.headers;
    if (access_token) {
      try {
        // Get Token from header
        token = access_token;
        // Verify Token
  
        // console.log("access_token",access_token);
  
        jwt.verify(
          token,
          process.env.JWT_SECRET_KEY,
          async (err, jwtResponse) => {
            if (err) {
              // Token is invalid or expired
              if (err.name == "JsonWebTokenError") {
                return res.status(401).json({
                  status: false,
                  statusCode: 401,
                  message: "Invalid token.",
                });
              }
              if (err.name == "TokenExpiredError") {
                return res.status(401).json({
                  status: false,
                  statusCode: 401,
                  message: "Token has expired.",
                });
              }
            }
  
            const { client_id, client_secret, grant_type } = jwtResponse;
  
            if (client_id != process.env.CLIENT_ID) {
              return res.status(401).json({
                status: false,
                statusCode: 401,
                message: "Unauthorized access token (status-401)",
              });
            }
  
            if (client_secret != process.env.CLIENT_SECRET) {
              return res.status(401).json({
                status: false,
                statusCode: 401,
                message: "Unauthorized access token (status-401)",
              });
            }
  
            if (grant_type != process.env.GRANT_TYPE) {
              return res.status(401).json({
                status: false,
                statusCode: 401,
                message: "Unauthorized access token (status-401)",
              });
            }
            next();
          }
        );
      } catch (error) {
        return res.status(401).send({
          status: false,
          message: "Unauthorized access token (status-401)",
        });
      }
    }
  
    if (!token) {
      res
        .status(401)
        .send({ status: false, message: "Unauthorized User, No Token" });
    }
  };

  
const getCountries = async (req, res, next) => {
    try {
      var get_country_list = [];
      const getCountryCode = await CountryModel.find({},{"id":1,"name":1,"phone_code":1,"_id":0}).sort({ name: 1 });
      return res.status(200).json({
        status: true,
        message: "Country Code List",
        data: getCountryCode,
      });
  
    } catch (error) {
      if (process.env.Node_APP_ENV == "development") {
        console.log("error", error);
      }
      return res.status(500).send({
        status: false,
        statusCode: 500,
        message: "Something went wrong",
      });
    }
  };
  
  const getStates = async (req, res, next) => {
    try {
      const validationSchema = joi
        .object({
          country_id: joi.number().required(),
        })
        .options({ abortEarly: false }); // { abortEarly: false }---To send all error messages at once
  
      let validatingData = {
        ...req.body,
      };
      const { country_id } = req.body;
  
      const validationResult = await validateFormData(
        validatingData,
        validationSchema
      );
      if (validationResult.status == false) {
        return res.status(402).json({
          status: false,
          statusCode: 402,
          errors: validationResult.errors,
        });
      }
      var get_state_list = [];
      const getState = await CountryModel.findOne(
        { id: country_id },
        "states"
      );
      if (getState.states.length) {
        getState.states.forEach((element) => {
          var newArray = {};
          newArray["id"] = element["id"];
          newArray["name"] = element["name"] != "" ? element["name"] : "";
          get_state_list.push(newArray);
        });
        return res.status(200).json({
          status: true,
          message: "State List",
          data: get_state_list,
        });
      }
    } catch (error) {
      if (process.env.Node_APP_ENV == "development") {
        console.log("error", error);
      }
      return res.status(500).send({
        status: false,
        statusCode: 500,
        message: "Something went wrong",
      });
    }
  };
  
  const getCities = async (req, res, next) => {
    try {
      const validationSchema = joi
        .object({
          country_id: joi.number().required(),
          state_id: joi.number().required(),
        })
        .options({ abortEarly: false }); // { abortEarly: false }---To send all error messages at once
  
      let validatingData = {
        ...req.body,
      };
      const validationResult = await validateFormData(
        validatingData,
        validationSchema
      );
  
      if (validationResult.status == false) {
        return res.status(402).json({
          status: false,
          statusCode: 402,
          errors: validationResult.errors,
        });
      }
  
      const country_id = parseInt(req.body.country_id);
      const state_id = parseInt(req.body.state_id);
  
      const CitesArray = await CountryModel.aggregate([
        { $match: { id: country_id } },
        { $unwind: "$states" },
        { $match: { "states.id": state_id } },
        { $project: { _id: 0, cities: "$states.cities" } },
      ]);
  
      if (CitesArray.length > 0) {
        const cities = CitesArray[0].cities || [];
  
        return res.status(200).json({
          status: true,
          message: "City List",
          data: cities,
        });
      } else {
        return res.status(404).json({
          status: false,
          statusCode: 404,
          message: "Country or State not found",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).send({
        status: false,
        statusCode: 500,
        message: "Something went wrong",
      });
    }
  };

module.exports = {encode,decode,hashedPassword,validatePassword,upload};
