const User = require("../models/users");
const Post = require("../models/posts");

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

exports.getPeople = (req, res, next) => {
  const authenticatedUserId = req.authenticatedUserId;
  const mainTask = async () => {
    try {
      const fetchUser = await User.findById(authenticatedUserId);
      let followers = fetchUser.followers;
      let following = fetchUser.following;
      let people = followers.concat(following);
      const requestToFetchUsers = await User.find({
        _id: {
          $in: people,
        },
      });

      const loadedPeople = requestToFetchUsers.map(
        ({ _id, firstName, lastName, profilePicture }) => {
          return { _id, firstName, lastName, profilePicture };
        }
      );
      res.status(200).json({
        status: "PEOPLE_FETCHED",
        data: { loadedPeople: loadedPeople },
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

exports.postMemory = (req, res, next) => {
  const authenticatedUserId = req.authenticatedUserId;
  const memoryImage = req.file.originalname;
  const postType = req.body.postType;
  const caption = req.body.caption.trim();
  const postID = req.body.postID;
  const taggedPeople = JSON.parse(req.body.taggedPeople);

  const date = new Date();
  let fullDate =
    date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();

  const mainTask = async () => {
    try {
      const createPost = new Post({
        _id: postID,
        userName: authenticatedUserId,
        caption: caption,
        memoryImage: memoryImage,
        postType: postType,
        postedOn: fullDate,
        comments: [],
        likes: [],
        saves: [],
        tags: taggedPeople,
        views: 0,
      });
      const result = await createPost.save();
      const updateUser = await User.findOneAndUpdate(
        {
          _id: authenticatedUserId,
        },
        {
          $push: {
            posts: postID,
          },
        },
        {}
      );
      res.status(200).json({
        status: "MEMORY_CREATED",
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

exports.postThought = (req, res, next) => {
  const authenticatedUserId = req.authenticatedUserId;
  const postType = req.body.postType;
  const caption = req.body.caption.trim();
  const postID = req.body.postID;
  const taggedPeople = req.body.taggedPeople;

  const date = new Date();
  let fullDate =
    date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();

  const mainTask = async () => {
    try {
      const createPost = new Post({
        _id: postID,
        userName: authenticatedUserId,
        caption: caption,
        memoryImage: "",
        postType: postType,
        postedOn: fullDate,
        comments: [],
        likes: [],
        saves: [],
        tags: taggedPeople,
        views: 0,
      });
      const result = await createPost.save();
      const updateUser = await User.findOneAndUpdate(
        {
          _id: authenticatedUserId,
        },
        {
          $push: {
            posts: postID,
          },
        },
        {}
      );
      res.status(200).json({
        status: "THOUGHT_CREATED",
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

exports.likePost = (req, res, next) => {
  const authenticatedUserId = req.authenticatedUserId;
  const postID = req.body.postID;
  const mainTask = async () => {
    try {
      const fetchUser = await User.findById(authenticatedUserId);
      let isPostLiked = fetchUser.liked.find((post) => post === postID);
      if (!isPostLiked) {
        const likePost = await Post.findOneAndUpdate(
          {
            _id: postID,
          },
          {
            $push: {
              likes: authenticatedUserId,
            },
          },
          {}
        );
        const addToLikedPost = await User.findOneAndUpdate(
          {
            _id: authenticatedUserId,
          },
          {
            $push: {
              liked: postID,
            },
          },
          {}
        );
        res.status(200).json({
          status: "LIKED",
        });
      } else {
        const unlikePost = await Post.findOneAndUpdate(
          {
            _id: postID,
          },
          {
            $pull: {
              likes: authenticatedUserId,
            },
          },
          {}
        );
        const removeFromLikedPost = await User.findOneAndUpdate(
          {
            _id: authenticatedUserId,
          },
          {
            $pull: {
              liked: postID,
            },
          },
          {}
        );
        res.status(200).json({
          status: "UNLIKED",
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

exports.savePost = (req, res, next) => {
  const authenticatedUserId = req.authenticatedUserId;
  const postID = req.body.postID;
  const mainTask = async () => {
    try {
      const fetchUser = await User.findById(authenticatedUserId);
      let isPostSaved = fetchUser.saved.find((post) => post === postID);
      if (!isPostSaved) {
        const savePost = await Post.findOneAndUpdate(
          {
            _id: postID,
          },
          {
            $push: {
              saves: authenticatedUserId,
            },
          },
          {}
        );
        const adToLikedPost = await User.findOneAndUpdate(
          {
            _id: authenticatedUserId,
          },
          {
            $push: {
              saved: postID,
            },
          },
          {}
        );
        res.status(200).json({
          status: "SAVED",
        });
      } else {
        const unsavePost = await Post.findOneAndUpdate(
          {
            _id: postID,
          },
          {
            $pull: {
              saves: authenticatedUserId,
            },
          },
          {}
        );
        const removeFromLikedPost = await User.findOneAndUpdate(
          {
            _id: authenticatedUserId,
          },
          {
            $pull: {
              saved: postID,
            },
          },
          {}
        );
        res.status(200).json({
          status: "UNSAVED",
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

exports.deletePost = (req, res, next) => {
  const authenticatedUserId = req.authenticatedUserId;
  const postID = req.body.postID;
  const mainTask = async () => {
    try {
      const fetchUser = await User.findById(authenticatedUserId);

      const request = await Post.findOneAndDelete({
        _id: postID,
      });

      const deletePostFromUser = await User.findOneAndUpdate(
        {
          _id: authenticatedUserId,
        },
        {
          $pull: {
            posts: postID,
          },
        },
        {}
      );

      res.status(200).json({
        status: "POST_DELETED",
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

exports.sharePost = (req, res, next) => {
  const authenticatedUserId = req.authenticatedUserId;
  const postID = req.body.postID;
  const mainTask = async () => {
    try {
    } catch (error) {
      console.log(error);
      res.status(400).json({
        status: "FAILED",
      });
    }
  };
  mainTask();
};

exports.commentOnPost = (req, res, next) => {
  const authenticatedUserId = req.authenticatedUserId;
  const postID = req.body.postID;
  const caption = req.body.caption;
  const randomId = Math.floor(Math.random() * 1000000 + 1).toString();
  const mainTask = async () => {
    try {
      const request = await Post.findOneAndUpdate(
        {
          _id: postID,
        },
        {
          $push: {
            comments: {
              _id: randomId,
              byUserName: authenticatedUserId,
              caption: caption,
              replies: [],
            },
          },
        },
        {}
      );
      const fetchComments = await Post.findById(postID);
      res.status(200).json({
        status: "COMMENT_POSTED",
        data: {
          comments: fetchComments.comments,
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

exports.replyToCommentOnPost = (req, res, next) => {
  const authenticatedUserId = req.authenticatedUserId;
  const postID = req.body.postID;
  const commentID = req.body.commentID;
  const caption = req.body.caption;
  const randomId = Math.floor(Math.random() * 10000 + 1).toString();
  const mainTask = async () => {
    try {
      const request = await Post.findByIdAndUpdate(
        postID,
        {
          $push: {
            "comments.$[comment].replies": {
              _id: randomId,
              byUserName: authenticatedUserId,
              caption,
            },
          },
        },
        {
          arrayFilters: [{ "comment._id": commentID }],
        }
      );
      const fetchComments = await Post.findById(postID);
      res.status(200).json({
        status: "REPLIED_TO_COMMENT",
        data: {
          comments: fetchComments.comments,
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

exports.getComments = (req, res, next) => {
  const authenticatedUserId = req.authenticatedUserId;
  const postID = req.params.postID;
  const mainTask = async () => {
    try {
      const request = await Post.findById(postID);

      res.status(200).json({
        status: "COMMENTS_FETCHED",
        data: {
          comments: request.comments,
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
