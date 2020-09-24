const jwt = require('jsonwebtoken');
const form = require('express-form');
const field = form.field;
const helper = require('../helper/global');
const userModel = require('../model/user');
const moment = require('moment');
const math = require('mathjs');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');
const md5 = require('md5');
module.exports = {
  signin: async (req, res, next) => {
    // Checking Form Validation
    if (!req.form.isValid) {
      helper.getValidationString(req.form.getErrors(), function (errString) {
        var rError = helper.generalResponse(401, "validation errors!", '', errString, req.form.getErrors());
        res.status(401).send(rError);
      });
    } else {
      try {
        var userExist = await userModel.isUserValid(req.body.username, md5(req.body.password));
      } catch (error) {
        var rError = helper.generalResponse(401, "Error while fetching user!", [], error.message, error.message);
        res.status(401).send(rError);
      }
      if (userExist && userExist.rows && userExist.rows.length) {
        let userResp = userExist.rows[0];
        jwt.sign(userResp, 'secretkey', {
          expiresIn: '1h'
        }, (err, token) => {
          userResp['token'] = token;
          delete userResp.password;
          var rError = helper.generalResponse(200, "User is successfully logged in!", userResp, '', '');
          res.status(200).send(rError);
        });
      } else {
        var rError = helper.generalResponse(401, "User not found!", [], '', '');
        res.status(401).send(rError);
      }
    }
  },
  signUp: async (req, res, next) => {
    // Checking Form Validation
    if (!req.form.isValid) {
      helper.getValidationString(req.form.getErrors(), function (errString) {
        var rError = helper.generalResponse(401, "validation errors!", '', errString, req.form.getErrors());
        res.status(401).send(rError);
      });
    } else {
      // Insert Data
      try {
        var isUserExist = await userModel.checkDuplicateEntryOfUser(req.body);
      } catch (error) {
        var rError = helper.generalResponse(401, "Error while check user information", [], error.message, error.message);
        res.status(401).send(rError);
      }
      if (isUserExist && isUserExist.rows && isUserExist.rows.length) {
        var rError = helper.generalResponse(401, "This email id is already registered", [], '', '');
        res.status(401).send(rError);
      } else {

        let usrFirstName = req.body.first_name;
        let userString = usrFirstName.split(' ');
        let uniqueNo = Math.random().toString(5).substr(2, 7);
        let userName = userString[0].toLowerCase() + uniqueNo;
        let usrs = {
          'first_name': req.body.first_name,
          'last_name': req.body.last_name,
          'email': req.body.email,
          'phone': (req.body.phoneNumber != undefined) ? req.body.phoneNumber : 0,
          'username': userName,
          'password': md5(req.body.password),
          'type': 'user',
          'added_on': moment().format("YYYY-MM-DD")
        }
        try {
          var insertUser = await userModel.insertUser(usrs);
          delete usrs.type;
          delete usrs.password;
          var rError = helper.generalResponse(200, "User created successfully", usrs, '', '');
          res.status(200).send(rError);
        } catch (error) {
          var rError = helper.generalResponse(401, "Error while adding user information", [], error.message, error.message);
          res.status(401).send(rError);
        }
      }
    }
  },
  userList: async (req, res, next) => {
    jwt.verify(req.token, 'secretkey', async (err, authData) => {
      if (err) {
        var rError = helper.generalResponse(401, "Error Token", [], '', '');
        res.status(401).send(rError);
      } else {
        var user = await userModel.userList();
        if (user && user.rows && user.rows.length) {
          let userResp = user.rows;
          // userResp['auth'] = authData;
          delete userResp.password;
          var rError = helper.generalResponse(200, "User Listing!", userResp, '', '');
          res.status(200).send(rError);
        } else {
          var rError = helper.generalResponse(401, "No user list!", [], '', '');
          res.status(401).send(rError);
        }

      }
    })
  }
}