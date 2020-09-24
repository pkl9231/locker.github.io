const jwt = require('jsonwebtoken');
const form = require('express-form');
const field = form.field;
const helper = require('../helper/global');
const inquiryrModel = require('../model/inquiry');
const moment = require('moment');
const constants = require('../config/constants');
var cloudinary = require('cloudinary').v2;
cloudinary.config(constants.cloudinaryConfig);

module.exports = {
  addRedFlags: async (req, res, next) => {
    // Checking Form Validation
    if (!req.form.isValid) {
      helper.getValidationString(req.form.getErrors(), function (errString) {
        var rError = helper.generalResponse(401, "validation errors!", '', errString, req.form.getErrors());
        res.status(401).send(rError);
      });
    } else {
      jwt.verify(req.token, "secretkey", async (err, authData) => {
        if (err) {
          var rError = helper.generalResponse(401, "Error Token", [], "", "");
          res.status(401).send(rError);
        } else {
          // Insert Data
          let data = {
            title: req.body.title,
            comment: req.body.description,
            department_id: req.body.department,
            status: req.body.status != undefined ?
              req.body.status : constants.INQUIRY_STATUS.STATUS1,
            geolocation_lat: req.body.geolocation_lat != undefined ?
              req.body.geolocation_lat : "",
            geolocation_long: req.body.geolocation_long != undefined ?
              req.body.geolocation_long : "",
            type: "red-flag",
            user_id: authData.id,
            added_on: moment().format("YYYY-MM-DD")
          };
          try {
            await inquiryrModel.insertInquiry(data);
          } catch (error) {
            var rError = helper.generalResponse(
              401,
              "Error while creating red-flag record",
              [],
              error.message,
              error.message
            );
            res.status(401).send(rError);
          }

          try {
            let listData = await inquiryrModel.listOfInquiry(
              "red-flag",
              authData.id
            );
            var rError = helper.generalResponse(
              200,
              "Created red-flag record",
              listData.rows.length ? listData.rows[0] : {},
              "",
              ""
            );
            res.status(200).send(rError);
          } catch (error) {
            var rError = helper.generalResponse(
              401,
              "Error while fetching red-flag record",
              [],
              error.message,
              error.message
            );
            res.status(401).send(rError);
          }
        }
      });
    }
  },
  listOfRedFlags: async (req, res, next) => {
    jwt.verify(req.token, "secretkey", async (err, authData) => {
      if (err) {
        var rError = helper.generalResponse(401, "Error Token", [], "", "");
        res.status(401).send(rError);
      } else {
        try {
          let listData = await inquiryrModel.UserlistOfInquiry("red-flag", authData.id, authData.type);
          let rError = helper.generalResponse(200, "List of red-flag", listData.rows, "", "");
          res.status(200).send(rError);
        } catch (error) {
          let rError = helper.generalResponse(401, "Error while fetching list of red-flag", [], error.message, error.message);
          res.status(401).send(rError);
        }

      }
    })
  },
  addIntervention: async (req, res, next) => {
    // Checking Form Validation
    if (!req.form.isValid) {
      helper.getValidationString(req.form.getErrors(), function (errString) {
        var rError = helper.generalResponse(401, "validation errors!", '', errString, req.form.getErrors());
        res.status(401).send(rError);
      });
    } else {
      jwt.verify(req.token, "secretkey", async (err, authData) => {
        if (err) {
          var rError = helper.generalResponse(401, "Error Token", [], "", "");
          res.status(401).send(rError);
        } else {
          // Insert Data
          let data = {
            comment: req.body.description,
            status: req.body.status != undefined ? req.body.status : constants.INQUIRY_STATUS.STATUS1,
            inquiry_id: req.body.inquiry_id != undefined ? req.body.inquiry_id : 0,
            added_on: moment().format("YYYY-MM-DD")
          };
          try {
            await inquiryrModel.insertIntervention(data);
          } catch (error) {
            var rError = helper.generalResponse(
              401,
              "Error while creating intervention record",
              [],
              error.message,
              error.message
            );
            res.status(401).send(rError);
          }

          try {
            let listData = await inquiryrModel.listOfInquiry(
              "intervention",
              authData.id
            );
            var rError = helper.generalResponse(
              200,
              "Created intervention record",
              listData.rows.length ? listData.rows[0] : {},
              "",
              ""
            );
            res.status(200).send(rError);
          } catch (error) {
            var rError = helper.generalResponse(
              401,
              "Error while fetching intervention record",
              [],
              error.message,
              error.message
            );
            res.status(401).send(rError);
          }
        }
      });
    }
  },
  listOfIntervention: async (req, res, next) => {
    jwt.verify(req.token, "secretkey", async (err, authData) => {
      if (err) {
        var rError = helper.generalResponse(401, "Error Token", [], "", "");
        res.status(401).send(rError);
      } else {
        try {
          let listData = await inquiryrModel.interventionList(authData.id, authData.type);
          let rError = helper.generalResponse(200, "List of intervention", listData.rows, "", "");
          res.status(200).send(rError);
        } catch (error) {
          let rError = helper.generalResponse(401, "Error while fetching list of intervention", [], error.message, error.message);
          res.status(401).send(rError);
        }

      }
    })
  },
  listOfDepartment: async (req, res, next) => {
    jwt.verify(req.token, "secretkey", async (err, authData) => {
      if (err) {
        var rError = helper.generalResponse(401, "Error Token", [], "", "");
        res.status(401).send(rError);
      } else {
        var department = await inquiryrModel.departmentList();
        if (department && department.rows && department.rows.length) {
          var rError = helper.generalResponse(
            200,
            "Department Listing!",
            department.rows,
            "",
            ""
          );
          res.status(200).send(rError);
        } else {
          var rError = helper.generalResponse(401, "No Department!", [], "", "");
          res.status(401).send(rError);
        }
      }
    });
  },
  deleteInquiry: async (req, res, next) => {
    jwt.verify(req.token, "secretkey", async (err, authData) => {
      if (err) {
        var rError = helper.generalResponse(401, "Error Token", [], "", "");
        res.status(401).send(rError);
      } else {
        var inq = await inquiryrModel.deleteInquiry(req.body.id);
        if (inq.rowCount > 0) {
          var rError = helper.generalResponse(
            200,
            "data deleted!",
            [],
            "",
            ""
          );
          res.status(200).send(rError);
        } else {
          var rError = helper.generalResponse(401, "No data found!", [], "", "");
          res.status(401).send(rError);
        }
      }
    });
  },
  updateRedFlags: async (req, res, next) => {
    // Checking Form Validation
    if (!req.form.isValid) {
      helper.getValidationString(req.form.getErrors(), function (errString) {
        var rError = helper.generalResponse(401, "validation errors!", '', errString, req.form.getErrors());
        res.status(401).send(rError);
      });
    } else {
      jwt.verify(req.token, "secretkey", async (err, authData) => {
        if (err) {
          var rError = helper.generalResponse(401, "Error Token", [], "", "");
          res.status(401).send(rError);
        } else {
          // Insert Data
          let data = {
            id: req.body.id,
            title: req.body.title,
            comment: req.body.description,
            department_id: req.body.department,
            status: req.body.status != undefined ? req.body.status : constants.INQUIRY_STATUS.STATUS1,
            geolocation_lat: req.body.geolocation_lat != undefined ? req.body.geolocation_lat : "",
            geolocation_long: req.body.geolocation_long != undefined ? req.body.geolocation_long : "",
            type: "red-flag",
            user_id: authData.id,
            updated_on: moment().format("YYYY-MM-DD")
          };
          try {
            let upd = await inquiryrModel.updateInquiry(data);
            if (upd.rowCount > 0) {
              var rError = helper.generalResponse(
                200,
                "red-flag record updated!",
                [],
                "",
                ""
              );
              res.status(200).send(rError);
            } else {
              var rError = helper.generalResponse(
                200,
                "Already updated",
                [],
                '',
                ''
              );
              res.status(401).send(rError);
            }

          } catch (error) {
            var rError = helper.generalResponse(
              401,
              "Error while updating red-flag record",
              [],
              error.message,
              error.message
            );
            res.status(401).send(rError);
          }
        }
      });
    }
  },
  getInterventionById: async (req, res, next) => {
    jwt.verify(req.token, "secretkey", async (err, authData) => {
      if (err) {
        var rError = helper.generalResponse(401, "Error Token", [], "", "");
        res.status(401).send(rError);
      } else {
        var id = (req.query && (req.query.id != undefined && req.query.id != "")) ? req.query.id : '';
        if (id == '') {
          // validation error
          let rError = helper.generalResponse(401, "Validation error", [], '', '');
          res.status(401).send(rError);
        } else {

          try {
            let listData = await inquiryrModel.UserlistOfInquiry("intervention", authData.id, authData.type, id);
            let rError = helper.generalResponse(200, "Intervention details", (listData.rows && listData.rows.length > 0) ? listData.rows[0] : {}, "", "");
            res.status(200).send(rError);
          } catch (error) {
            let rError = helper.generalResponse(401, "Error while fetching intervention by id", [], error.message, error.message);
            res.status(401).send(rError);
          }

        }


      }
    })
  },
  getRedflagById: async (req, res, next) => {
    jwt.verify(req.token, "secretkey", async (err, authData) => {
      if (err) {
        var rError = helper.generalResponse(401, "Error Token", [], "", "");
        res.status(401).send(rError);
      } else {
        var id = (req.query && (req.query.id != undefined && req.query.id != "")) ? req.query.id : '';
        if (id == '') {
          // validation error
          let rError = helper.generalResponse(401, "Validation error", [], '', '');
          res.status(401).send(rError);
        } else {

          try {
            let listData = await inquiryrModel.UserlistOfInquiry("red-flag", authData.id, authData.type, id);
            let rError = helper.generalResponse(200, "red flag details", (listData.rows && listData.rows.length > 0) ? listData.rows[0] : {}, "", "");
            res.status(200).send(rError);
          } catch (error) {
            let rError = helper.generalResponse(401, "Error while fetching red flag by id", [], error.message, error.message);
            res.status(401).send(rError);
          }

        }

      }
    })
  },
  getInterventionByIdInquiryId: async (req, res, next) => {
    var id = (req.query && (req.query.id != undefined && req.query.id != "")) ? req.query.id : '';
    if (id == '') {
      // validation error
      let rError = helper.generalResponse(401, "Validation error", [], '', '');
      res.status(401).send(rError);
    }
    try {
      var listData = await inquiryrModel.getInquiryById(id);
      var inquiryListData = listData.rows;
    } catch (error) {
      let rError = helper.generalResponse(401, "Error while fetching list of intervention", [], error.message, error.message);
      res.status(401).send(rError);
    }

    try {
      if (inquiryListData && inquiryListData.length) {
        for (var i = 0; i < inquiryListData.length; i++) {
          // console.log(listData.rows[i]['title']);
          var interventionReply = await inquiryrModel.getInterventionDetails(listData.rows[i]['inquiry_id']);
          inquiryListData[i]['details'] = JSON.stringify(interventionReply.rows);
        }
      }
      let rError = helper.generalResponse(200, "details of intervention", inquiryListData, "", "");
      res.status(200).send(rError);

    } catch (error) {
      let rError = helper.generalResponse(401, "Error while showing details of intervention", [], error.message, error.message);
      res.status(401).send(rError);
    }
  },
  testUpload: (req, res, next) => {
    // var file = req.files.photo;
    console.log(req);
    /* cloudinary.uploader.upload(file.tempFilePath, function(error, result){
      res.send({
        success : true,
        result
      })
    }) */
  }
}