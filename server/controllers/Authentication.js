const User = require("../models/users");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const Verification = require("../models/verifications");

let mailTransporter = nodemailer.createTransport({
  host: "ph01.mafiaserver.com",
  port: "465",
  secure: true,
  auth: {
    user: "no-reply@varunbukka.in",
    pass: "qytjec-vyMni8-rypcef",
  },
});

const isEmail = (email) => {
  return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
};

function emailToName(emailAddress) {
  return emailAddress.split("@")[0];
}
function emailToDomain(emailAddress) {
  return emailAddress.split("@")[1];
}

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

exports.requestVerificationCode = (req, res, next) => {
  const emailOrUsername = req.body.emailOrUsername;
  console.log(emailOrUsername);
  let randomNumber1 = Math.floor(Math.random() * 9 + 1);
  let randomNumber2 = Math.floor(Math.random() * 9 + 1);
  let randomNumber3 = Math.floor(Math.random() * 9 + 1);
  let randomNumber4 = Math.floor(Math.random() * 9 + 1);
  let randomNumber5 = Math.floor(Math.random() * 9 + 1);
  let randomNumber6 = Math.floor(Math.random() * 9 + 1);
  const otp =
    randomNumber1 +
    "" +
    randomNumber2 +
    "" +
    randomNumber3 +
    "" +
    randomNumber4 +
    "" +
    randomNumber5 +
    "" +
    randomNumber6;

  const mainTask = async () => {
    try {
      const fetchUser = await User.findOne({
        $or: [{ _id: emailOrUsername }, { email: emailOrUsername }],
      });
      if (!fetchUser) {
        if (isEmail(emailOrUsername)) {
          const verificationDocument = await Verification.findOneAndUpdate(
            {
              _id: emailOrUsername,
            },
            { _id: emailOrUsername, otp: otp },
            {
              upsert: true,
              new: true,
              setDefaultsOnInsert: true,
            }
          );

          const otpNewUserTemplate =
            '<html lang="en"> <head> <meta charset="UTF-8" /> <meta http-equiv="X-UA-Compatible" content="IE=edge" /> <meta name="viewport" content="width=device-width, initial-scale=1.0" /> <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans:400,600,300" /> <title>Verification Code</title> </head> <body style="font-family:sans-serif"> <div style=" background-color: rgba(255, 233, 160, 0.04); padding: 30px 20px 20px 20px; margin: 15px 10px; border-top: 3px solid rgba(255, 189, 89, 0.9); border-left: 3px solid rgba(255, 189, 89, 0.9); border-right: 3px solid rgba(255, 189, 89, 0.9); border-bottom: 3px solid rgba(255, 189, 89, 0.9); border-top-left-radius: 25px; border-top-right-radius: 25px; border-bottom-right-radius: 25px;"> <div> <div style="text-align: start; margin-bottom: 30px"> <img src="https://server.swoopkart.varunbukka.in/images/displaypicture/full_logo.png" alt=""  style="height: 22px; width: 135.3px; margin-left: 0;" /> </div> <div style=" font-family:sans-serif; text-align: start; margin-bottom: 16px; font-size: 20px; color: rgb(0, 0, 0); " > <strong>Verification Code</strong> </div> <div style=" font-family:sans-serif; font-size: 15px; color: rgb(31, 31, 31); "> Hey ' +
            emailOrUsername +
            ', here is your verification code that you requested for. </div> <div style=" padding-top: 9px; font-family:sans-serif; font-size: 23px; color: rgb(0, 0, 0); margin: 15px 0px 18px 0px; text-align: center;"> <strong><strong style="border-radius: 13px; padding: 6px 25px 6px 25px; background-color: rgb(255, 230, 169);">' +
            randomNumber1 +
            " " +
            randomNumber2 +
            " " +
            randomNumber3 +
            " " +
            randomNumber4 +
            " " +
            randomNumber5 +
            " " +
            randomNumber6 +
            '</strong></strong> </div> <div style="margin-bottom: 6px; padding-top: 6px; font-family:sans-serif; font-size: 15px; color: rgb(31, 31, 31);">If you have initiated this action then you can ignore it, if not inform us at <strong style="color: rgb(72, 72, 72)">reply@varunbukka.in</strong>. </div> <div style="margin-bottom: 8px; font-family:sans-serif; font-size: 15px; color: rgb(31, 31, 31);" > <strong> <a href="https://swoopchat.varunbukka.in" style="text-decoration: none">Visit our website now.</a> </strong> </div> <div style=" padding-top: 5px; margin-bottom: 60px; font-family:sans-serif; font-size: 15px; color: rgb(31, 31, 31);" >Team Swoopchat.</div> </div> <div style="margin-bottom: 15px; text-align: center; font-family:sans-serif; font-size: 13px; color: rgb(79, 79, 79);">with love by <strong>swoopchat</strong></div></div></body></html>';

          let detailsForOtpNewUserTemplate = {
            from: '"Swoopchat" <no-reply@varunbukka.in>',
            to: emailOrUsername.trim(),
            subject: "Verification Code",
            html: otpNewUserTemplate,
          };
          mailTransporter.sendMail(detailsForOtpNewUserTemplate, (err) => {
            if (err) {
              console.log(err);
            }
          });

          const extractedNameFromEmail = emailToName(emailOrUsername);
          const extractedDomainFromEmail = emailToDomain(emailOrUsername);
          var firstChar = extractedNameFromEmail[0];
          var lastChar = extractedNameFromEmail.substr(
            extractedNameFromEmail.length - 1
          );
          let maskedEmail =
            firstChar + "***" + lastChar + "@" + extractedDomainFromEmail;

          res.status(200).json({
            status: "NEW_USER_OTP_SENT",
            data: {
              maskedEmail: maskedEmail,
            },
          });
        }
        if (!isEmail(emailOrUsername)) {
          res.status(200).json({
            status: "NEW_USER_SHOULD_USE_EMAIL",
          });
        }
      } else {
        const temp = await Verification.findOneAndUpdate(
          {
            _id: fetchUser.email,
          },
          { _id: fetchUser.email, otp: otp },
          {}
        );

        const otpOldUserTemplate =
          '<html lang="en"> <head> <meta charset="UTF-8" /> <meta http-equiv="X-UA-Compatible" content="IE=edge" /> <meta name="viewport" content="width=device-width, initial-scale=1.0" /> <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans:400,600,300" /> <title>Verification Code</title> </head> <body> <div style=" background-color: rgba(255, 233, 160, 0.04); padding: 30px 20px 20px 20px; margin: 15px 10px; border-top: 3px solid rgba(255, 189, 89, 0.9); border-left: 3px solid rgba(255, 189, 89, 0.9); border-right: 3px solid rgba(255, 189, 89, 0.9); border-bottom: 3px solid rgba(255, 189, 89, 0.9); border-top-left-radius: 25px; border-top-right-radius: 25px; border-bottom-right-radius: 25px;"> <div> <div style="text-align: start; margin-bottom: 30px"> <img src="https://server.swoopkart.varunbukka.in/images/displaypicture/full_logo.png" alt=""  style="height: 22px; width: 135.3px; margin-left: 0;" /> </div> <div style=" font-family:sans-serif; text-align: start; margin-bottom: 16px; font-size: 20px; color: rgb(0, 0, 0); " > <strong>Verification Code</strong> </div> <div style=" font-family:sans-serif; font-size: 15px; color: rgb(31, 31, 31); "> Hey ' +
          fetchUser.firstName +
          " " +
          fetchUser.lastName +
          ', here is your verification code that you requested for. </div> <div style=" padding-top: 9px; font-family:sans-serif; font-size: 23px; color: rgb(0, 0, 0); margin: 15px 0px 18px 0px; text-align: center;"> <strong><strong style="border-radius: 13px; padding: 6px 25px 6px 25px; background-color: rgb(255, 230, 169);">' +
          randomNumber1 +
          " " +
          randomNumber2 +
          " " +
          randomNumber3 +
          " " +
          randomNumber4 +
          " " +
          randomNumber5 +
          " " +
          randomNumber6 +
          '</strong></strong> </div> <div style="margin-bottom: 6px; padding-top: 6px; font-family:sans-serif; font-size: 15px; color: rgb(31, 31, 31);">If you have initiated this action then you can ignore it, if not inform us at <strong style="color: rgb(72, 72, 72)">reply@varunbukka.in</strong>. </div> <div style="margin-bottom: 8px; font-family:sans-serif; font-size: 15px; color: rgb(31, 31, 31);" > <strong> <a href="https://swoopchat.varunbukka.in" style="text-decoration: none">Visit our website now.</a> </strong> </div> <div style=" padding-top: 5px; margin-bottom: 60px; font-family:sans-serif; font-size: 15px; color: rgb(31, 31, 31);" >Team Swoopchat.</div> </div> <div style="margin-bottom: 15px; text-align: center; font-family:sans-serif; font-size: 13px; color: rgb(79, 79, 79);">with love by <strong>swoopchat</strong></div></div></body></html>';

        let detailsForOtpOldUserTemplate = {
          from: '"Swoopchat" <no-reply@varunbukka.in>',
          to: fetchUser.email.trim(),
          subject: "Verification Code",
          html: otpOldUserTemplate,
        };
        mailTransporter.sendMail(detailsForOtpOldUserTemplate, (err) => {
          if (err) {
            console.log(err);
          }
        });

        const extractedNameFromEmail = emailToName(fetchUser.email);
        const extractedDomainFromEmail = emailToDomain(fetchUser.email);
        var firstChar = extractedNameFromEmail[0];
        var lastChar = extractedNameFromEmail.substr(
          extractedNameFromEmail.length - 1
        );
        let maskedEmail =
          firstChar + "***" + lastChar + "@" + extractedDomainFromEmail;

        res.status(200).json({
          status: "EXISTING_USER_OTP_SENT",
          data: {
            maskedEmail: maskedEmail,
          },
        });
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({
        status: "FAILED",
      });
    }
  };
  mainTask();
};

exports.resendVerificationCode = (req, res, next) => {
  const emailOrUsername = req.body.emailOrUsername;

  const mainTask = async () => {
    try {
      const fetchUser = await User.findOne({
        $or: [{ _id: emailOrUsername }, { email: emailOrUsername }],
      });

      let email = "";
      let otp = "";
      let name = "";

      if (!fetchUser) {
        const fetchOTP = await Verification.findById(emailOrUsername);
        email = fetchOTP._id;
        otp = fetchOTP.otp;
        name = fetchOTP._id;
      } else {
        const fetchOTP = await Verification.findById(fetchUser.email);
        email = fetchOTP._id;
        otp = fetchOTP.otp;
        name = fetchUser.firstName + " " + fetchUser.lastName;
      }

      const resendOTPTemplate =
        '<html lang="en"> <head> <meta charset="UTF-8" /> <meta http-equiv="X-UA-Compatible" content="IE=edge" /> <meta name="viewport" content="width=device-width, initial-scale=1.0" /> <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans:400,600,300" /> <title>Verification Code</title> </head> <body style="font-family:sans-serif"> <div style=" background-color: rgba(255, 233, 160, 0.04); padding: 30px 20px 20px 20px; margin: 15px 10px; border-top: 3px solid rgba(255, 189, 89, 0.9); border-left: 3px solid rgba(255, 189, 89, 0.9); border-right: 3px solid rgba(255, 189, 89, 0.9); border-bottom: 3px solid rgba(255, 189, 89, 0.9); border-top-left-radius: 25px; border-top-right-radius: 25px; border-bottom-right-radius: 25px;"> <div> <div style="text-align: start; margin-bottom: 30px"> <img src="https://server.swoopkart.varunbukka.in/images/displaypicture/full_logo.png" alt=""  style="height: 22px; width: 135.3px; margin-left: 0;" /> </div> <div style=" font-family:sans-serif; text-align: start; margin-bottom: 16px; font-size: 20px; color: rgb(0, 0, 0); " > <strong>Verification Code</strong> </div> <div style=" font-family:sans-serif; font-size: 15px; color: rgb(31, 31, 31); "> Hey ' +
        name +
        ', here is your verification code that you requested for. </div> <div style=" padding-top: 9px; font-family:sans-serif; font-size: 23px; color: rgb(0, 0, 0); margin: 15px 0px 18px 0px; text-align: center;"> <strong><strong style="border-radius: 13px; padding: 6px 25px 6px 25px; background-color: rgb(255, 230, 169);">' +
        otp[0] +
        " " +
        otp[1] +
        " " +
        otp[2] +
        " " +
        otp[3] +
        " " +
        otp[4] +
        " " +
        otp[5] +
        '</strong></strong> </div> <div style="margin-bottom: 6px; padding-top: 6px; font-family:sans-serif; font-size: 15px; color: rgb(31, 31, 31);">If you have initiated this action then you can ignore it, if not inform us at <strong style="color: rgb(72, 72, 72)">reply@varunbukka.in</strong>. </div> <div style="margin-bottom: 8px; font-family:sans-serif; font-size: 15px; color: rgb(31, 31, 31);" > <strong> <a href="https://swoopchat.varunbukka.in" style="text-decoration: none">Visit our website now.</a> </strong> </div> <div style=" padding-top: 5px; margin-bottom: 60px; font-family:sans-serif; font-size: 15px; color: rgb(31, 31, 31);" >Team Swoopchat.</div> </div> <div style="margin-bottom: 15px; text-align: center; font-family:sans-serif; font-size: 13px; color: rgb(79, 79, 79);">with love by <strong>swoopchat</strong></div></div></body></html>';

      let detailsForResendOTPTemplate = {
        from: '"Swoopchat" <no-reply@varunbukka.in>',
        to: email.trim(),
        subject: "Verification Code",
        html: resendOTPTemplate,
      };
      mailTransporter.sendMail(detailsForResendOTPTemplate, (err) => {
        if (err) {
          console.log(err);
        }
      });

      const extractedNameFromEmail = emailToName(email);
      const extractedDomainFromEmail = emailToDomain(email);
      var firstChar = extractedNameFromEmail[0];
      var lastChar = extractedNameFromEmail.substr(
        extractedNameFromEmail.length - 1
      );
      let maskedEmail =
        firstChar + "***" + lastChar + "@" + extractedDomainFromEmail;

      res.status(200).json({
        status: "OTP_RESENT",
        data: {
          maskedEmail: maskedEmail,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        status: "FAILED",
      });
    }
  };
  mainTask();
};

exports.verifyVerificationCode = (req, res, next) => {
  const emailOrUsername = req.body.emailOrUsername;
  const enteredOTP = req.body.enteredOTP;
  const deviceName = req.body.deviceName;

  const mainTask = async () => {
    try {
      const fetchUser = await User.findOne({
        $or: [{ _id: emailOrUsername }, { email: emailOrUsername }],
      });

      let otp = "";
      if (!fetchUser) {
        const fetchOTP = await Verification.findById(emailOrUsername);

        otp = fetchOTP.otp;
        if (otp === enteredOTP) {
          console.log(otp, enteredOTP);
          res.status(200).json({
            status: "NEW_USER_VERIFICATION_SUCCESSFUL",
            data: {
              verifiedEmail: emailOrUsername,
            },
          });
        } else {
          console.log(otp, enteredOTP);
          res.status(200).json({
            status: "NEW_USER_VERIFICATION_FAILED",
          });
        }
      } else {
        const fetchOTP = await Verification.findById(fetchUser.email);

        otp = fetchOTP.otp;
        let fullName = fetchUser.firstName + " " + fetchUser.lastName;

        if (otp === enteredOTP) {
          const token = jwt.sign(
            {
              user: fetchUser._id,
            },
            "swoopchatsecrettokenforuser",
            {
              expiresIn: "10000d",
            }
          );

          const date = new Date();
          let fullDateAndTime =
            date.getHours() +
            "h:" +
            date.getMinutes() +
            "m:" +
            date.getSeconds() +
            "s, " +
            date.getDate() +
            " " +
            months[date.getMonth()] +
            " " +
            date.getFullYear();

          const notificationTemplate =
            '<html lang="en"> <head> <meta charset="UTF-8" /> <meta http-equiv="X-UA-Compatible" content="IE=edge" /> <meta name="viewport" content="width=device-width, initial-scale=1.0" /> <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans:400,600,300" /> <title>Notification</title> </head> <body style="font-family: Arial, Helvetica, sans-serif"> <div style="background-color: rgba(255, 233, 160, 0.04); padding: 30px 20px 20px 20px; margin: 15px 10px; border-top: 3px solid rgba(255, 189, 89, 0.9); border-left: 3px solid rgba(255, 189, 89, 0.9); border-right: 3px solid rgba(255, 189, 89, 0.9); border-bottom: 3px solid rgba(255, 189, 89, 0.9); border-top-left-radius: 25px; border-top-right-radius: 25px; border-bottom-right-radius: 25px;"> <div> <div style="text-align: start; margin-bottom: 30px"> <img src="https://server.swoopkart.varunbukka.in/images/displaypicture/full_logo.png" alt="" style="height: 22px; width: 135.3px; margin-left: 0" /> </div> <div style="font-family: sans-serif; text-align: start; margin-bottom: 18px; font-size: 20px; color: rgb(0, 0, 0);"> <strong>New Login from an ' +
            deviceName +
            ' Device</strong> </div> <div style=" margin-top:30px; margin-bottom:3px; display:flex; justify-content:center; align-items:center; text-align:center"> <img src="https://server.swoopkart.varunbukka.in/images/displaypicture/logo.png" alt="" style="height: 52px; width: 52px; border-radius: 50px" /> </div> <div style="text-align: center; margin-bottom: 22px; font-family: sans-serif; font-size: 17px; color: rgb(31, 31, 31);"> <strong> ' +
            fetchUser._id +
            '</strong> </div> <div style=" font-family: sans-serif; font-size: 14px; color: rgb(31, 31, 31);"> Hey ' +
            fullName +
            ", We noticed a login from a device on " +
            fullDateAndTime +
            '. </div> <div style="margin-bottom: 6px; padding-top: 6px; font-family: sans-serif; font-size: 14px; color: rgb(31, 31, 31);">If this was you, you can safely disregard this email. If this was not you, you can logout from your settings or inform us at <strong style="color: rgb(72, 72, 72)">reply@varunbukka.in</strong>. </div> <div style="margin-bottom: 8px; font-family: sans-serif; font-size: 14px; color: rgb(31, 31, 31); "> <strong> <a href="https://chat.swoopkart.com" style="text-decoration: none">Visit our website now.</a> </strong> </div> <div style=" padding-top: 5px; margin-bottom: 60px; font-family: sans-serif; font-size: 14px; color: rgb(31, 31, 31);"> Team Swoopchat. </div> </div> <div style="margin-bottom: 15px; text-align: center; font-family: sans-serif; font-size: 13px; color: rgb(79, 79, 79);"> with love by <strong>swoopchat</strong> </div> </div> </body> </html>';

          let detailsForNotificationTemplate = {
            from: '"Swoopchat" <no-reply@varunbukka.in>',
            to: fetchUser.email.trim(),
            subject: "New Login to Swoopchat from an " + deviceName + " Device",
            html: notificationTemplate,
          };

          mailTransporter.sendMail(detailsForNotificationTemplate, (err) => {
            if (err) {
              console.log(err);
            }
          });

          res.status(200).json({
            status: "OLD_USER_VERIFICATION_SUCCESSFUL",
            data: {
              token: token,
              fullName: fetchUser.firstName + " " + fetchUser.lastName,
              _id: fetchUser._id,
              profilePicture: fetchUser.profilePicture,
            },
          });
        } else {
          res.status(200).json({
            status: "OLD_USER_VERIFICATION_FAILED",
          });
        }
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({
        status: "FAILED",
      });
    }
  };
  mainTask();
};

exports.verifyUserName = (req, res, next) => {
  const enteredUserName = req.body.enteredUserName.toLowerCase().trim();
  const mainTask = async () => {
    try {
      const isUserNameTaken = await User.findById(enteredUserName);
      if (isUserNameTaken) {
        res.status(200).json({
          status: "USERNAME_ALREADY_TAKEN",
        });
      }
      if (!isUserNameTaken) {
        res.status(200).json({
          status: "USERNAME_AVAILABLE",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({
        status: "FAILED",
      });
    }
  };
  mainTask();
};

exports.finishAccountSetup = (req, res, next) => {
  const enteredEmail = req.body.enteredEmail;
  const enteredFirstName = req.body.enteredFirstName;
  const enteredLastName = req.body.enteredLastName;
  const enteredPhoneNumber = req.body.enteredPhoneNumber;
  const enteredBio = req.body.enteredBio.trim();
  const enteredGender = req.body.enteredGender;
  const enteredUserName = req.body.enteredUserName.toLowerCase().trim();
  const profileImage = req.file.originalname;
  const deviceName = req.body.deviceName;

  const mainTask = async () => {
    try {
      const isUserNameTaken = await User.findById(enteredUserName);
      if (isUserNameTaken) {
        res.status(200).json({
          status: "USERNAME_ALREADY_TAKEN",
        });
      }
      if (!isUserNameTaken) {
        const registerUser = new User({
          _id: enteredUserName,
          email: enteredEmail,
          firstName: enteredFirstName,
          lastName: enteredLastName,
          phoneNumber: enteredPhoneNumber,
          gender: enteredGender,
          bio: enteredBio,
          profilePicture: profileImage,
          accountPrivacy: false,
          chatLockPasscode: null,
          posts: [],
          chats: [],
          stories: [],
          followers: [],
          following: [],
          searchHistory: [],
          liked: [],
          saved: [],
          followRequestsSent: [],
          notifications: [],
          moments: [],
          momentsOnProfile: [],
        });
        const result = await registerUser.save();

        const token = jwt.sign(
          {
            user: enteredUserName,
          },
          "swoopchatsecrettokenforuser",
          {
            expiresIn: "10000d",
          }
        );

        const date = new Date();
        let fullDateAndTime =
          date.getHours() +
          "h:" +
          date.getMinutes() +
          "m:" +
          date.getSeconds() +
          "s, " +
          date.getDate() +
          " " +
          months[date.getMonth()] +
          " " +
          date.getFullYear();

        const notificationTemplate =
          '<html lang="en"> <head> <meta charset="UTF-8" /> <meta http-equiv="X-UA-Compatible" content="IE=edge" /> <meta name="viewport" content="width=device-width, initial-scale=1.0" /> <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans:400,600,300" /> <title>Notification</title> </head> <body style="font-family: Arial, Helvetica, sans-serif"> <div style="background-color: rgba(255, 233, 160, 0.04); padding: 30px 20px 20px 20px; margin: 15px 10px; border-top: 3px solid rgba(255, 189, 89, 0.9); border-left: 3px solid rgba(255, 189, 89, 0.9); border-right: 3px solid rgba(255, 189, 89, 0.9); border-bottom: 3px solid rgba(255, 189, 89, 0.9); border-top-left-radius: 25px; border-top-right-radius: 25px; border-bottom-right-radius: 25px;"> <div> <div style="text-align: start; margin-bottom: 30px"> <img src="https://server.swoopkart.varunbukka.in/images/displaypicture/full_logo.png" alt="" style="height: 22px; width: 135.3px; margin-left: 0" /> </div> <div style="font-family: sans-serif; text-align: start; margin-bottom: 18px; font-size: 20px; color: rgb(0, 0, 0);"> <strong>New Login from an ' +
          deviceName +
          ' Device</strong> </div> <center style=" margin-top: 25px; margin-bottom: 4px;"> <img src="http://172.20.10.2:4000/images/profiles/' +
          profileImage +
          '" alt="" style="height: 55px; width: 55px; border-radius: 55px" /> </center> <div style="text-align: center; margin-bottom: 22px; font-family: sans-serif; font-size: 17px; color: rgb(31, 31, 31);"> <strong> ' +
          enteredUserName +
          '</strong> </div> <div style=" font-family: sans-serif; font-size: 14px; color: rgb(31, 31, 31);"> Hey ' +
          enteredFirstName +
          " " +
          enteredLastName +
          ", We noticed a login from a device on " +
          fullDateAndTime +
          '. </div> <div style="margin-bottom: 6px; padding-top: 6px; font-family: sans-serif; font-size: 14px; color: rgb(31, 31, 31);">If this was you, you can safely disregard this email. If this was not you, you can logout from your settings or inform us at <strong style="color: rgb(72, 72, 72)">reply@varunbukka.in</strong>. </div> <div style="margin-bottom: 8px; font-family: sans-serif; font-size: 14px; color: rgb(31, 31, 31); "> <strong> <a href="https://chat.swoopkart.com" style="text-decoration: none">Visit our website now.</a> </strong> </div> <div style=" padding-top: 5px; margin-bottom: 60px; font-family: sans-serif; font-size: 14px; color: rgb(31, 31, 31);"> Team Swoopchat. </div> </div> <div style="margin-bottom: 15px; text-align: center; font-family: sans-serif; font-size: 13px; color: rgb(79, 79, 79);"> with love by <strong>swoopchat</strong> </div> </div> </body> </html>';

        let detailsForNotificationTemplate = {
          from: '"Swoopchat" <no-reply@varunbukka.in>',
          to: enteredEmail.trim(),
          subject: "New Login to Swoopchat from an " + deviceName + " Device",
          html: notificationTemplate,
        };

        mailTransporter.sendMail(detailsForNotificationTemplate, (err) => {
          if (err) {
            console.log(err);
          }
        });
        const fetchUser = await User.findById(enteredUserName);
        res.status(200).json({
          status: "NEW_USER_REGISTERED",
          data: {
            token: token,
            fullName: fetchUser.firstName + " " + fetchUser.lastName,
            _id: fetchUser._id,
            profilePicture: fetchUser.profilePicture,
          },
        });
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({
        status: "FAILED",
      });
    }
  };
  mainTask();
};
