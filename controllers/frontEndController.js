const jwt = require('jsonwebtoken');
const wrap = require('../helper/wrapper');
const constants = require('../config/constants');
const checkAuth = require('../middleware/auth');

// checkAuth.userAuth();
module.exports = {
  signin: {
    get: (req, res, next) => {
      let options = {
        flash_error: req.flash('flash_error')[0],
        flash_success: req.flash('flash_success')[0]
      }
      res.render('user/login', options);
    },

    post: async (req, res, next) => {
      let apiName = constants.API_ACCESS_URL + 'users/signin';
      try {
        var apis = await wrap.wrapper(req, res, apiName);
      } catch (error) {
        res.render('error', { message: error.message });
      }
      // Case of Success
      if (apis[0]['statusCode'] == 200) {
        let pass = req.body.password;
        req.session.password = pass;
        let apiResponse = JSON.parse(apis[0]['body']);
        let errorMsg = apiResponse.msg;
        let fullName = apiResponse.data.first_name + " " + apiResponse.data.last_name;
        let token = apiResponse.data.token;
        req.session.token = token;
        req.session.userName = fullName;
        req.session.userDetails = apiResponse.data;
        res.redirect('/dashboard');
      } else {
        req.flash('flash_error', 'Invalid credential');
        res.redirect('/');
      }
    }
  },

  signup: {
    get: async (req, res) => {
      let options = {
        flash_error: req.flash('flash_error')[0],
        flash_success: req.flash('flash_success')[0]
      }
      res.render('user/signup', options);
    },
    post: async (req, res, next) => {
      let apiName = constants.API_ACCESS_URL + 'users/signup';
      try {
        var apis = await wrap.wrapper(req, res, apiName);
        var errorMsg = '';
        if (apis.length) {
          var apiResponse = JSON.parse(apis[0]['body']);
          errorMsg = apiResponse.msg;
        }
        if (apis[0]['statusCode'] == 200) {
          res.redirect('/signin-success');
        } else {
          req.flash('flash_error', errorMsg);
          res.redirect('/signup');
        }
      } catch (error) {
        res.render('error', { message: error.message });
      }
    },

    signSuccess: async (req, res) => {
      res.render('user/success')
    }
  },

  dashboard: (req, res, next) => {
    let fullName = req.session.userName;
    res.render('user/dashboard', { headerEnable: true, dashboardMenu: true, title: "Dashboard", fName: fullName });
  },
  redFlags: async (req, res, next) => {
    // API CALLING
    let headers = {
      authorization: constants.TOKEN_EXTRA_KEY + req.session.token
    }
    req.session.headers = headers;
    let redFlagList = constants.API_ACCESS_URL + 'inquiry/red-flag-list';
    let departmentName = constants.API_ACCESS_URL + 'inquiry/department';
    try {
      var apis = await wrap.wrapper(req, res, redFlagList, headers);
      var departmentApis = await wrap.wrapper(req, res, departmentName, headers);

    } catch (error) {
      res.render('inquiry/error-msg', { headerEnable: true, redFlag: true, title: "Add Red Flags", message: error.message });
    }
    // API response
    var finalResponse = [];
    var depResponse = [];
    if (apis.length) {
      let apiResponse = JSON.parse(apis[0]['body']);
      let departmentResponse = JSON.parse(departmentApis[0]['body']);
      let errorMsg = apiResponse['msg'];
      if (apis[0]['statusCode'] == 200) {
        finalResponse = apiResponse['data'];
        depResponse = departmentResponse['data'];
        req.session.depResponse = depResponse;
        req.session.data = finalResponse;
      } else {
        //  Page / Api Error
        res.render('inquiry/error-msg', { headerEnable: true, redFlag: true, title: "Add Red Flags", message: errorMsg });
      }

    } else {
      res.render('inquiry/error-msg', { headerEnable: true, redFlag: true, title: "Add Red Flags", message: 'something went wrong!' });
    }

    res.render('inquiry/red-flags', { headerEnable: true, redFlag: true, title: "Add Red Flags", data: finalResponse });
  },

  addRedFlags: {
    get: (req, res, next) => {
      res.render('inquiry/add-red-flags', {
        headerEnable: true,
        redFlag: true, title: "Add Red Flags",
        data: req.session.data,
        departmentName: req.session.depResponse
      });
    },
    post: async (req, res, next) => {
      let apiName = constants.API_ACCESS_URL + 'inquiry/add-red-flag';
      try {
        var apis = await wrap.wrapper(req, res, apiName, req.session.headers);
        var errorMsg = '';
        if (apis.length) {
          var apiResponse = JSON.parse(apis[0]['body']);
          errorMsg = apiResponse.msg;
        }
        if (apis[0]['statusCode'] == 200) {
          res.redirect('/red-flags');
        } else {
          req.flash('flash_error', errorMsg);
          res.send(errorMsg);
        }
      } catch (error) {
        res.render('error', { message: error.message });
      }
    },
  },

  intervention: async (req, res, next) => {
    // API CALLING
    let headers = {
      authorization: constants.TOKEN_EXTRA_KEY + req.session.token
    }
    req.session.headData = headers;
    let redFlagList = constants.API_ACCESS_URL + 'inquiry/intervention-list';
    try {
      var apis = await wrap.wrapper(req, res, redFlagList, headers);
    } catch (error) {
      res.render('inquiry/error-msg', { headerEnable: true, intervention: true, title: "Add Red Flags", message: error.message });
    }
    // API response
    var finalResponse = [];
    if (apis.length) {
      let apiResponse = JSON.parse(apis[0]['body']);
      let errorMsg = apiResponse['msg'];
      if (apis[0]['statusCode'] == 200) {
        finalResponse = apiResponse['data'];
        req.session.intervention = finalResponse;
      } else {
        //  Page / Api Error
        res.render('inquiry/error-msg', { headerEnable: true, intervention: true, title: "Add Red Flags", message: errorMsg });
      }

    } else {
      res.render('inquiry/error-msg', { headerEnable: true, intervention: true, title: "Add Red Flags", message: 'something went wrong!' });
    }

    res.render('inquiry/interverntion', { headerEnable: true, intervention: true, title: "Add Red Flags", data: finalResponse });
  },

  addIntervention: {
    get: (req, res, next) => {
      res.render('inquiry/add-interverntion', {
        headerEnable: true,
        intervention: true,
        title: "Add Red Flags",
        data: req.session.intervention,
        departmentName: req.session.depResponse
      });
    },
    post: async (req, res, next) => {
      let apiName = constants.API_ACCESS_URL + 'inquiry/add-intervention';
      try {
        var apis = await wrap.wrapper(req, res, apiName, req.session.headData);
        var errorMsg = '';
        if (apis.length) {
          var apiResponse = JSON.parse(apis[0]['body']);
          errorMsg = apiResponse.msg;
        }
        if (apis[0]['statusCode'] == 200) {
          res.redirect('/intervention');
        } else {
          req.flash('flash_error', errorMsg);
          res.send(errorMsg);
        }
      } catch (error) {
        res.render('error', { message: error.message });
      }
    },
  },

  userProfile: (req, res, next) => {
    // API CALLING
    let userDetails = req.session.userDetails;
    res.render('user/edit-profile', { headerEnable: true, editProfile: true, title: "Edit Profile", data: userDetails });
  },


  logout: (req, res, next) => {
    // Seession / Cookes expired for logout
    req.session.destroy();
    res.redirect('/');
  },

  deleteData: async (req, res, next) => { // red-flag
    let apiName = constants.API_ACCESS_URL + 'inquiry/delete';
    try {
      req.method = 'delete';
      req.body = { id: req.params.id }
      var type = req.params.type
      var apis = await wrap.wrapper(req, res, apiName, req.session.headers);
      var errorMsg = '';
      if (apis[0]['statusCode'] == 200) {
        var apiResponse = JSON.parse(apis[0]['body']);
        errorMsg = apiResponse.msg;
      }

      if (apis[0]['statusCode'] == 200) {

        if (type == "redFlag") {
          res.redirect('/red-flags');
        }
        if (type == "interverntion") {
          res.redirect('/intervention');
        }

      } else {
        req.flash('flash_error', errorMsg);
        res.send(errorMsg);
      }
    } catch (error) {
      res.render('error', { message: error.message });
    }
  },

  edit: async (req, res, next) => {

    try {
      req.method = 'get';
      let userDetails = constants.API_ACCESS_URL + 'inquiry/get-intervention?id="' + req.params.id + '"';
      // console.log("body data", req.body)
      var apis = await wrap.wrapper(req, res, userDetails, req.session.headers);
      var apiResponse = JSON.parse(apis[0]['body']);
      var errorMsg = '';
      console.log("apiResponse.data", apiResponse.data)

      if (apis[0]['statusCode'] == 200) {
        console.log("department s", req.session.depResponse)
        res.render('inquiry/edit-interverntion', { data: apiResponse.data, department: req.session.depResponse });
      } else {
        errorMsg = apiResponse.msg;
        req.flash('flash_error', errorMsg);
        //res.render('error', { message: errorMsg });
        res.render('inquiry/error-msg', { headerEnable: true, redFlag: true, title: "Add Red Flags", message: errorMsg });
      }
    } catch (error) {
      res.render('error', { message: error.message });
    }
  },
  updateInvention: async (req, res, next) => {
    let updateApi = constants.API_ACCESS_URL + 'inquiry/update-intervention';
    console.log(req.body);
    try {
      var apis = await wrap.wrapper(req, res, updateApi);
      console.log("apis...............", apis)
      var errorMsg = '';
      if (apis.length) {
        var apiResponse = JSON.parse(apis[0]['body']);
        // console.log("apiResponse .........", apiResponse)
        errorMsg = apiResponse.msg;
      }
      if (apis[0]['statusCode'] == 200) {
        res.redirect('/intervention');
      } else {
        req.flash('flash_error', errorMsg);
        res.send(errorMsg);
      }
    } catch (error) {
      res.render('error', { message: error.message });
    }
  }
}
