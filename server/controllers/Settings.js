const User = require("../models/users");
const Post = require("../models/posts");
const Moment = require("../models/moments");
const Verification = require("../models/verifications");
const nodemailer = require("nodemailer");

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

exports.loadSettings = (req, res, next) => {
  const authenticatedUserId = req.authenticatedUserId;
  const mainTask = async () => {
    try {
      const getUser = await User.findById(authenticatedUserId);
      res.status(200).json({
        status: "SETTINGS_LOADED",
        data: {
          accountPrivacy: getUser.accountPrivacy,
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

exports.clearSearchHistory = (req, res, next) => {
  const authenticatedUserId = req.authenticatedUserId;
  const mainTask = async () => {
    try {
      const temp = await User.findOneAndUpdate(
        {
          _id: authenticatedUserId,
        },
        {
          searchHistory: [],
        },
        {}
      );
      res.status(200).json({
        status: "SEARCH_HISTORY_CLEARED",
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

exports.changeEmailRequestVerificationCode = (req, res, next) => {
  const authenticatedUserId = req.authenticatedUserId;
  const enteredEmail = req.body.enteredEmail;

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
      const isEmailAlreadyInUse = await User.findOne({ email: enteredEmail });
      const fetchUser = await User.findById(authenticatedUserId);
      if (!isEmailAlreadyInUse) {
        if (isEmail(enteredEmail)) {
          const verificationDocument = await Verification.findOneAndUpdate(
            {
              _id: enteredEmail,
            },
            { _id: enteredEmail, otp: otp },
            {
              upsert: true,
              new: true,
              setDefaultsOnInsert: true,
            }
          );

          const otpTemplate =
            '<html lang="en"> <head> <meta charset="UTF-8" /> <meta http-equiv="X-UA-Compatible" content="IE=edge" /> <meta name="viewport" content="width=device-width, initial-scale=1.0" /> <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans:400,600,300" /> <title>Verification Code</title> </head> <body style="font-family:sans-serif"> <div style=" background-color: rgba(255, 233, 160, 0.04); padding: 30px 20px 20px 20px; margin: 15px 10px; border-top: 3px solid rgba(255, 189, 89, 0.9); border-left: 3px solid rgba(255, 189, 89, 0.9); border-right: 3px solid rgba(255, 189, 89, 0.9); border-bottom: 3px solid rgba(255, 189, 89, 0.9); border-top-left-radius: 25px; border-top-right-radius: 25px; border-bottom-right-radius: 25px;"> <div> <div style="text-align: start; margin-bottom: 30px"> <img src="https://server.swoopkart.varunbukka.in/images/displaypicture/full_logo.png" alt=""  style="height: 22px; width: 135.3px; margin-left: 0;" /> </div> <div style=" font-family:sans-serif; text-align: start; margin-bottom: 16px; font-size: 20px; color: rgb(0, 0, 0); " > <strong>Verification Code</strong> </div> <div style=" font-family:sans-serif; font-size: 15px; color: rgb(31, 31, 31); "> Hey ' +
            fetchUser.firstName +
            " " +
            fetchUser.lastName +
            ", here is your verification code that you requested for. Use this code to verify your new email and link with your <strong>" +
            fetchUser._id +
            '</strong> swoopchat account.</div> <div style=" padding-top: 9px; font-family:sans-serif; font-size: 23px; color: rgb(0, 0, 0); margin: 15px 0px 18px 0px; text-align: center;"> <strong><strong style="border-radius: 13px; padding: 6px 25px 6px 25px; background-color: rgb(255, 230, 169);">' +
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

          let detailsForTemplate = {
            from: '"Swoopchat" <no-reply@varunbukka.in>',
            to: enteredEmail.trim(),
            subject: "Verification Code",
            html: otpTemplate,
          };
          mailTransporter.sendMail(detailsForTemplate, (err) => {
            if (err) {
              console.log(err);
            }
          });

          const extractedNameFromEmail = emailToName(enteredEmail);
          const extractedDomainFromEmail = emailToDomain(enteredEmail);
          var firstChar = extractedNameFromEmail[0];
          var lastChar = extractedNameFromEmail.substr(
            extractedNameFromEmail.length - 1
          );
          let maskedEmail =
            firstChar + "***" + lastChar + "@" + extractedDomainFromEmail;

          res.status(200).json({
            status: "OTP_SENT",
            data: {
              maskedEmail: maskedEmail,
            },
          });
        } else {
          res.status(200).json({
            status: "INVALID_EMAIL",
          });
        }
      } else {
        res.status(200).json({
          status: "EMAIL_ALREADY_TAKEN",
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

exports.changeEmailResendVerificationCode = (req, res, next) => {
  const authenticatedUserId = req.authenticatedUserId;
  const enteredEmail = req.body.enteredEmail;

  const mainTask = async () => {
    try {
      const fetchUser = await User.findById(authenticatedUserId);

      const fetchOTP = await Verification.findById(enteredEmail);
      let otp = fetchOTP.otp;

      const resendOTPTemplate =
        '<html lang="en"> <head> <meta charset="UTF-8" /> <meta http-equiv="X-UA-Compatible" content="IE=edge" /> <meta name="viewport" content="width=device-width, initial-scale=1.0" /> <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans:400,600,300" /> <title>Verification Code</title> </head> <body style="font-family:sans-serif"> <div style=" background-color: rgba(255, 233, 160, 0.04); padding: 30px 20px 20px 20px; margin: 15px 10px; border-top: 3px solid rgba(255, 189, 89, 0.9); border-left: 3px solid rgba(255, 189, 89, 0.9); border-right: 3px solid rgba(255, 189, 89, 0.9); border-bottom: 3px solid rgba(255, 189, 89, 0.9); border-top-left-radius: 25px; border-top-right-radius: 25px; border-bottom-right-radius: 25px;"> <div> <div style="text-align: start; margin-bottom: 30px"> <img src="https://server.swoopkart.varunbukka.in/images/displaypicture/full_logo.png" alt=""  style="height: 22px; width: 135.3px; margin-left: 0;" /> </div> <div style=" font-family:sans-serif; text-align: start; margin-bottom: 16px; font-size: 20px; color: rgb(0, 0, 0); " > <strong>Verification Code</strong> </div> <div style=" font-family:sans-serif; font-size: 15px; color: rgb(31, 31, 31); "> Hey ' +
        fetchUser.firstName +
        " " +
        fetchUser.lastName +
        ", here is your verification code that you requested for. Use this code to verify your new email and link with your <strong>" +
        fetchUser._id +
        '</strong> swoopchat account.</div> <div style=" padding-top: 9px; font-family:sans-serif; font-size: 23px; color: rgb(0, 0, 0); margin: 15px 0px 18px 0px; text-align: center;"> <strong><strong style="border-radius: 13px; padding: 6px 25px 6px 25px; background-color: rgb(255, 230, 169);">' +
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
        to: enteredEmail.trim(),
        subject: "Verification Code",
        html: resendOTPTemplate,
      };
      mailTransporter.sendMail(detailsForResendOTPTemplate, (err) => {
        if (err) {
          console.log(err);
        }
      });

      const extractedNameFromEmail = emailToName(enteredEmail);
      const extractedDomainFromEmail = emailToDomain(enteredEmail);
      var firstChar = extractedNameFromEmail[0];
      var lastChar = extractedNameFromEmail.substr(
        extractedNameFromEmail.length - 1
      );
      let maskedEmail =
        firstChar + "*****" + lastChar + "@" + extractedDomainFromEmail;

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

exports.changeEmailValidateVerificationCode = (req, res, next) => {
  const authenticatedUserId = req.authenticatedUserId;
  const enteredEmail = req.body.enteredEmail;
  const enteredOTP = req.body.enteredOTP;
  const deviceName = req.body.deviceName;

  const mainTask = async () => {
    try {
      const fetchUser = await User.findById(authenticatedUserId);

      let otp = "";
      const fetchOTP = await Verification.findById(enteredEmail);

      otp = fetchOTP.otp;
      let fullName = fetchUser.firstName + " " + fetchUser.lastName;

      if (otp === enteredOTP) {
        const updateEmail = await User.findByIdAndUpdate(authenticatedUserId, {
          email: enteredEmail,
        });
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
          to: enteredEmail.trim(),
          subject: "New Login to Swoopchat from an " + deviceName + " Device",
          html: notificationTemplate,
        };

        mailTransporter.sendMail(detailsForNotificationTemplate, (err) => {
          if (err) {
            console.log(err);
          }
        });

        res.status(200).json({
          status: "EMAIL_UPDATED",
        });
      } else {
        res.status(200).json({
          status: "INCORRECT_VERIFICATION_CODE",
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

exports.toggleAccountPrivacy = (req, res, next) => {
  const authenticatedUserId = req.authenticatedUserId;
  const mainTask = async () => {
    try {
      const getUser = await User.findById(authenticatedUserId);
      const temp = await User.findOneAndUpdate(
        {
          _id: authenticatedUserId,
        },
        {
          accountPrivacy: !getUser.accountPrivacy,
        },
        {}
      );
      const check = await User.findById(authenticatedUserId);
      console.log(check.accountPrivacy);
      res.status(200).json({
        status: "ACCOUNT_PRIVACY_TOGGLED",
        data: {
          accountPrivacy: check.accountPrivacy,
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

exports.changeChatLockPasscode = (req, res, next) => {
  const authenticatedUserId = req.authenticatedUserId;
  const oldChatlockPasscode = rwq.body.oldChatlockPasscode;
  const newChatlockPasscode = rwq.body.newChatlockPasscode;

  const mainTask = async () => {
    try {
      const getUser = await User.findById(authenticatedUserId);
      if (getUser.chatLockPasscode !== oldChatlockPasscode) {
        res.status(200).json({
          status: "INVALID_OLD_CHAT_LOCK_PASSCODE",
        });
      } else {
        const temp = await User.findOneAndUpdate(
          {
            _id: authenticatedUserId,
          },
          {
            chatLockPasscode: newChatlockPasscode,
          },
          {}
        );
        res.status(200).json({
          status: "CHAT_LOCK_PASSCODE_CHANGED",
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

exports.liked = (req, res, next) => {
  const authenticatedUserId = req.authenticatedUserId;
  const mainTask = async () => {
    try {
      const fetchUser = await User.findById(authenticatedUserId);

      const likedArray = fetchUser.liked.reverse();

      const fetchMemoriesAndThoughtsRaw = await Post.find({
        _id: {
          $in: likedArray,
        },
      });

      const fetchMemoriesAndThoughtsToProcess = likedArray.map((id) =>
        fetchMemoriesAndThoughtsRaw.find((item) => item._id === id)
      );

      const fetchMemoriesAndThoughts = fetchMemoriesAndThoughtsToProcess.filter(
        (element) => {
          return element !== undefined;
        }
      );

      const rawThoughts = fetchMemoriesAndThoughts.filter(
        (post) => post.postType === "thought"
      );
      const fetchedThoughts = rawThoughts.map((thought) => {
        const isSaved = fetchUser.saved.includes(thought._id);
        const isLiked = fetchUser.liked.includes(thought._id);
        return { ...thought._doc, isSaved, isLiked };
      });

      const rawMemories = fetchMemoriesAndThoughts.filter(
        (post) => post.postType === "memory"
      );

      const fetchedMemories = rawMemories.map((memory) => {
        const isSaved = fetchUser.saved.includes(memory._id);
        const isLiked = fetchUser.liked.includes(memory._id);
        return { ...memory._doc, isSaved, isLiked };
      });

      res.status(200).json({
        status: "LIKED_FETCHED",
        data: {
          fetchedThoughts,
          fetchedMemories,
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

exports.saved = (req, res, next) => {
  const authenticatedUserId = req.authenticatedUserId;
  const mainTask = async () => {
    try {
      const fetchUser = await User.findById(authenticatedUserId);

      const savedArray = fetchUser.saved.reverse();

      const fetchMemoriesAndThoughtsRaw = await Post.find({
        _id: {
          $in: savedArray,
        },
      });

      const fetchMemoriesAndThoughtsToProcess = savedArray.map((id) =>
        fetchMemoriesAndThoughtsRaw.find((item) => item._id === id)
      );

      const fetchMemoriesAndThoughts = fetchMemoriesAndThoughtsToProcess.filter(
        (element) => {
          return element !== undefined;
        }
      );

      const rawThoughts = fetchMemoriesAndThoughts.filter(
        (post) => post.postType === "thought"
      );
      const fetchedThoughts = rawThoughts.map((thought) => {
        const isSaved = fetchUser.saved.includes(thought._id);
        const isLiked = fetchUser.liked.includes(thought._id);
        return { ...thought._doc, isSaved, isLiked };
      });

      const rawMemories = fetchMemoriesAndThoughts.filter(
        (post) => post.postType === "memory"
      );

      const fetchedMemories = rawMemories.map((memory) => {
        const isSaved = fetchUser.saved.includes(memory._id);
        const isLiked = fetchUser.liked.includes(memory._id);
        return { ...memory._doc, isSaved, isLiked };
      });

      res.status(200).json({
        status: "SAVED_FETCHED",
        data: {
          fetchedThoughts,
          fetchedMemories,
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

exports.savedOrLikedMemories = (req, res, next) => {
  const authenticatedUserId = req.authenticatedUserId;
  const what = req.params.what;
  const mainTask = async () => {
    try {
      const fetchUser = await User.findById(authenticatedUserId);
      let fetchedData;

      if (what === "saved") {
        const savedArray = fetchUser.saved.reverse();
        const fetchMemoriesAndThoughtsRaw = await Post.find({
          _id: {
            $in: savedArray,
          },
        });

        const fetchMemoriesAndThoughtsToProcess = savedArray.map((id) =>
          fetchMemoriesAndThoughtsRaw.find((item) => item._id === id)
        );

        fetchedData = fetchMemoriesAndThoughtsToProcess.filter((element) => {
          return element !== undefined;
        });
      }
      if (what === "liked") {
        const likedArray = fetchUser.liked.reverse();
        const fetchMemoriesAndThoughtsRaw = await Post.find({
          _id: {
            $in: likedArray,
          },
        });
        const fetchMemoriesAndThoughtsToProcess = likedArray.map((id) =>
          fetchMemoriesAndThoughtsRaw.find((item) => item._id === id)
        );

        fetchedData = fetchMemoriesAndThoughtsToProcess.filter((element) => {
          return element !== undefined;
        });
      }

      const rawMemories = fetchedData.filter(
        (post) => post.postType === "memory"
      );

      const fetchedMemories = rawMemories.map((memory) => {
        const isSaved = fetchUser.saved.includes(memory._id);
        const isLiked = fetchUser.liked.includes(memory._id);
        return { ...memory._doc, isSaved, isLiked };
      });

      res.status(200).json({
        status: "MEMORIES_FETCHED",
        data: {
          fetchedMemories,
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

exports.getMoments = (req, res, next) => {
  const authenticatedUserId = req.authenticatedUserId;
  const mainTask = async () => {
    try {
      const fetchUser = await User.findById(authenticatedUserId);
      const momentsArray = fetchUser.moments.reverse();
      const fetchMomentsRaw = await Moment.find({
        _id: {
          $in: momentsArray,
        },
      });
      const fetchedMoments = momentsArray.map((id) =>
        fetchMomentsRaw.find((item) => item._id === id)
      );

      res.status(200).json({
        status: "MOMENTS_FETCHED",
        data: {
          fetchedMoments,
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

exports.addMomentToProfile = (req, res, next) => {
  const authenticatedUserId = req.authenticatedUserId;
  const momentID = req.params.momentID;
  const mainTask = async () => {
    try {
      await User.findOneAndUpdate(
        {
          _id: authenticatedUserId,
        },
        {
          $pull: {
            momentsOnProfile: momentID,
          },
        },
        {}
      );
      await User.findOneAndUpdate(
        {
          _id: authenticatedUserId,
        },
        {
          $push: {
            momentsOnProfile: momentID,
          },
        },
        {}
      );
      res.status(200).json({
        status: "MOMENT_ADDED_TO_PROFILE",
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

exports.deleteMoment = (req, res, next) => {
  const authenticatedUserId = req.authenticatedUserId;
  const momentID = req.params.momentID;
  const mainTask = async () => {
    try {
      const request = await Moment.findOneAndDelete({
        _id: momentID,
      });
      const updateUser = await User.findOneAndUpdate(
        {
          _id: authenticatedUserId,
        },
        {
          $pull: {
            moments: momentID,
            momentsOnProfile: momentID,
          },
        },
        {}
      );
      const fetchUser = await User.findById(authenticatedUserId);
      const momentsArray = fetchUser.moments.reverse();
      const fetchMomentsRaw = await Moment.find({
        _id: {
          $in: momentsArray,
        },
      });
      const fetchedMoments = momentsArray.map((id) =>
        fetchMomentsRaw.find((item) => item._id === id)
      );

      res.status(200).json({
        status: "MOMENT_DELETED",
        data: {
          fetchedMoments,
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
