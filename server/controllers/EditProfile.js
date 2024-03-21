const User = require("../models/users");

exports.loadEditProfile = (req, res, next) => {
  const authenticatedUserId = req.authenticatedUserId;
  const mainTask = async () => {
    try {
      const getUser = await User.findById(authenticatedUserId);
      res.status(200).json({
        status: "EDIT_PROFILE_LOADED",
        data: {
          profilePicture: getUser.profilePicture,
          firstName: getUser.firstName,
          lastName: getUser.lastName,
          _id: getUser._id,
          phoneNumber: getUser.phoneNumber,
          gender: getUser.gender,
          bio: getUser.bio,
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

exports.editProfile = (req, res, next) => {
  const authenticatedUserId = req.authenticatedUserId;
  const enteredFirstName = req.body.firstName;
  const enteredLastName = req.body.lastName;
  const enteredPhoneNumber = req.body.phoneNumber;
  const enteredGender = req.body.gender;
  const enteredBio = req.body.bio;

  const mainTask = async () => {
    try {
      const temp = await User.findOneAndUpdate(
        {
          _id: authenticatedUserId,
        },
        {
          firstName: enteredFirstName,
          lastName: enteredLastName,
          phoneNumber: enteredPhoneNumber,
          bio: enteredBio,
          gender: enteredGender,
        },
        {}
      );
      const getUser = await User.findById(authenticatedUserId);
      res.status(200).json({
        status: "PROFILE_UPDATED",
        data: {
          fullName: getUser.firstName + " " + getUser.lastName,
          _id: getUser._id,
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

exports.editProfilePicture = (req, res, next) => {
  const profileImage = req.file.originalname;
  const authenticatedUserId = req.authenticatedUserId;

  const mainTask = async () => {
    try {
      const temp = await User.findOneAndUpdate(
        {
          _id: authenticatedUserId,
        },
        {
          profilePicture: profileImage,
        },
        {}
      );
      const getUser = await User.findById(authenticatedUserId);
      res.status(200).json({
        status: "PROFILE_PICTURE_UPDATED",
        data: {
          profilePicture: getUser.profilePicture,
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
