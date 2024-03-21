const User = require("../models/users");
const Post = require("../models/posts");
const Moment = require("../models/moments");
const Chats = require("../models/chats");

exports.myProfile = (req, res, next) => {
  const authenticatedUserId = req.authenticatedUserId;
  const mainTask = async () => {
    try {
      const fetchUser = await User.findById(authenticatedUserId);
      const fetchMemoriesAndThoughts = await Post.find({
        _id: {
          $in: fetchUser.posts,
        },
      }).sort({ createdAt: -1 });
      const fetchedRecents = fetchMemoriesAndThoughts.map((item) => {
        const isSaved = fetchUser.saved.includes(item._id);
        const isLiked = fetchUser.liked.includes(item._id);
        return { ...item._doc, isSaved, isLiked };
      });

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

      const momentsOnProfile = fetchUser.momentsOnProfile.reverse();
      const rawMoments = await Moment.find({
        _id: {
          $in: momentsOnProfile,
        },
      });

      const fetchedMoments = momentsOnProfile.map((momentID) =>
        rawMoments.find((moment) => moment._id === momentID)
      );

      const profileNumbersData = {
        thoughts: fetchedThoughts.length >= 0 ? fetchedThoughts.length : 0,
        memories: fetchedMemories.length >= 0 ? fetchedMemories.length : 0,
        followers:
          fetchUser.followers.length >= 0 ? fetchUser.followers.length : 0,
        following:
          fetchUser.following.length >= 0 ? fetchUser.following.length : 0,
      };
      res.status(200).json({
        status: "PROFILE_FETCHED",
        data: {
          fetchedRecents,
          fetchedThoughts,
          fetchedMemories,
          fetchedMoments,
          profileDetails: {
            bio: fetchUser.bio,
            accountPrivacy: fetchUser.accountPrivacy,
            profileNumbersData,
          },
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

exports.othersProfile = (req, res, next) => {
  const authenticatedUserId = req.authenticatedUserId;
  const usernameToFetch = req.params.usernameToFetch;

  const mainTask = async () => {
    try {
      const requestingUser = await User.findById(authenticatedUserId);
      const fetchUser = await User.findById(usernameToFetch);

      let isRequestingUserFollowing =
        fetchUser.followers.includes(authenticatedUserId);

      const fetchMemoriesAndThoughts = await Post.find({
        _id: {
          $in: fetchUser.posts,
        },
      }).sort({ createdAt: -1 });
      const fetchedRecents = fetchMemoriesAndThoughts.map((item) => {
        const isSaved = requestingUser.saved.includes(item._id);
        const isLiked = requestingUser.liked.includes(item._id);
        return { ...item._doc, isSaved, isLiked };
      });

      const rawThoughts = fetchMemoriesAndThoughts.filter(
        (post) => post.postType === "thought"
      );
      const fetchedThoughts = rawThoughts.map((thought) => {
        const isSaved = requestingUser.saved.includes(thought._id);
        const isLiked = requestingUser.liked.includes(thought._id);
        return { ...thought._doc, isSaved, isLiked };
      });

      const rawMemories = fetchMemoriesAndThoughts.filter(
        (post) => post.postType === "memory"
      );
      const fetchedMemories = rawMemories.map((memory) => {
        const isSaved = requestingUser.saved.includes(memory._id);
        const isLiked = requestingUser.liked.includes(memory._id);
        return { ...memory._doc, isSaved, isLiked };
      });

      const momentsOnProfile = fetchUser.momentsOnProfile.reverse();
      const rawMoments = await Moment.find({
        _id: {
          $in: momentsOnProfile,
        },
      });
      const fetchedMoments = momentsOnProfile.map((momentID) =>
        rawMoments.find((moment) => moment._id === momentID)
      );

      let areBothSame = false;
      if (requestingUser._id === fetchUser._id) {
        isRequestingUserFollowing = true;
        areBothSame = true;
      }
      const chatIDPrimary = authenticatedUserId + "₹₹₹₹" + usernameToFetch;
      const chatIDSecondary = usernameToFetch + "₹₹₹₹" + authenticatedUserId;
      let isChatExists;
      isChatExists = await Chats.findById(chatIDPrimary);
      if (!isChatExists) {
        isChatExists = await Chats.findById(chatIDSecondary);
      }
      if (!isChatExists) {
        isChatExists = null;
      }
      console.log(isChatExists);

      if (isChatExists) {
        isChatExists = isChatExists._id;
      }

      if (
        (isRequestingUserFollowing && fetchUser.accountPrivacy === true) ||
        (isRequestingUserFollowing && fetchUser.accountPrivacy === false) ||
        (!isRequestingUserFollowing && fetchUser.accountPrivacy === false) ||
        areBothSame
      ) {
        const profileNumbersData = {
          thoughts: fetchedThoughts.length >= 0 ? fetchedThoughts.length : 0,
          memories: fetchedMemories.length >= 0 ? fetchedMemories.length : 0,
          followers:
            fetchUser.followers.length >= 0 ? fetchUser.followers.length : 0,
          following:
            fetchUser.following.length >= 0 ? fetchUser.following.length : 0,
        };

        res.status(200).json({
          status: "OTHER_PROFILE_FETCHED",
          data: {
            areBothSame,
            fetchedRecents,
            fetchedThoughts,
            fetchedMemories,
            fetchedMoments,
            profileDetails: {
              isFollowRequestSent:
                requestingUser.followRequestsSent.includes(usernameToFetch),
              isRequestingUserFollowing,
              fullName: fetchUser.firstName + " " + fetchUser.lastName,
              otherUserName: fetchUser._id,
              bio: fetchUser.bio,
              accountPrivacy: fetchUser.accountPrivacy,
              profileNumbersData,
              isChatExists,
            },
          },
        });
      }

      if (!isRequestingUserFollowing && fetchUser.accountPrivacy === true) {
        const profileNumbersData = {
          thoughts: fetchedThoughts.length >= 0 ? fetchedThoughts.length : 0,
          memories: fetchedMemories.length >= 0 ? fetchedMemories.length : 0,
          followers:
            fetchUser.followers.length >= 0 ? fetchUser.followers.length : 0,
          following:
            fetchUser.following.length >= 0 ? fetchUser.following.length : 0,
        };

        res.status(200).json({
          status: "NOT_FOLLOWING_OTHER_USER",
          data: {
            areBothSame,
            profileDetails: {
              isFollowRequestSent:
                requestingUser.followRequestsSent.includes(usernameToFetch),
              isRequestingUserFollowing,
              fullName: fetchUser.firstName + " " + fetchUser.lastName,
              otherUserName: fetchUser._id,
              bio: fetchUser.bio,
              accountPrivacy: fetchUser.accountPrivacy,
              profileNumbersData,
              isChatExists: null,
            },
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

exports.getMemories = (req, res, next) => {
  const authenticatedUserId = req.authenticatedUserId;
  const usernameToFetch = req.params.usernameToFetch;

  const mainTask = async () => {
    try {
      const fetchUser = await User.findById(usernameToFetch);
      const fetchMemoriesAndThoughts = await Post.find({
        _id: {
          $in: fetchUser.posts,
        },
      }).sort({ createdAt: -1 });

      const rawMemories = fetchMemoriesAndThoughts.filter(
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
          whosMemories:
            authenticatedUserId === usernameToFetch
              ? "my-profile"
              : "others-profile",
          userProfilePicture: fetchUser.profilePicture,
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

exports.getThought = (req, res, next) => {
  const authenticatedUserId = req.authenticatedUserId;
  const thoughtID = req.params.thoughtID;
  const updateViews = Boolean(req.params.updateViews);

  const mainTask = async () => {
    try {
      const fetchUser = await User.findById(authenticatedUserId);
      const fetchedThought = await Post.findById(thoughtID);
      const fetchOwnerOfThought = await User.findById(fetchedThought.userName);

      const profilePicture = fetchOwnerOfThought.profilePicture;
      const fullName =
        fetchOwnerOfThought.firstName + " " + fetchOwnerOfThought.lastName;
      const whosThought =
        authenticatedUserId === fetchOwnerOfThought.userName
          ? "my-profile"
          : "others-profile";
      if (updateViews == true) {
        await Post.findByIdAndUpdate(thoughtID, {
          views: fetchedThought.views + 1,
        });
      }

      const isSaved = fetchUser.saved.includes(thoughtID);
      const isLiked = fetchUser.liked.includes(thoughtID);

      res.status(200).json({
        status: "THOUGHT_FETCHED",
        data: {
          fetchedThought,
          whosThought,
          profilePicture,
          fullName,
          isSaved,
          isLiked,
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

exports.othersProfileSendFollowRequest = (req, res, next) => {
  const authenticatedUserId = req.authenticatedUserId;
  const mainTask = async () => {
    try {
      const fetchUser = await User.findById(authenticatedUserId);
    } catch (error) {
      console.log(error);
      res.status(400).json({
        status: "FAILED",
      });
    }
  };
  mainTask();
};

exports.removeMomentFromProfile = (req, res, next) => {
  const authenticatedUserId = req.authenticatedUserId;
  const momentID = req.params.momentID;
  const mainTask = async () => {
    try {
      const removeFromProfile = await User.findOneAndUpdate(
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
      res.status(200).json({
        status: "MOMENT_REMOVED_FROM_PROFILE",
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
