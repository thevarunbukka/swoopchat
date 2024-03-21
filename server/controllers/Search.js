const User = require("../models/users");

exports.loadHistory = (req, res, next) => {
  const authenticatedUserId = req.authenticatedUserId;
  const mainTask = async () => {
    try {
      const fetchUser = await User.findById(authenticatedUserId);
      const rawSearchHistory = await User.find({
        _id: {
          $in: fetchUser.searchHistory,
        },
      });
      const searchHistoryFinal = rawSearchHistory.map((item) => {
        return {
          fullName: item.firstName + " " + item.lastName,
          userName: item._id,
        };
      });

      const searchHistory = fetchUser.searchHistory.map((id) =>
        searchHistoryFinal.find((item) => item.userName === id)
      );
      const suggestions = [...searchHistory];
      res.status(200).json({
        status: "SEARCH_HISTORY_LOADED",
        data: {
          suggestions,
          searchHistory: searchHistory.reverse(),
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

exports.push = (req, res, next) => {
  const authenticatedUserId = req.authenticatedUserId;
  const otherUserName = req.body.otherUserName;
  const mainTask = async () => {
    try {
      const check = await User.findByIdAndUpdate(
        authenticatedUserId,
        {
          $pull: {
            searchHistory: otherUserName,
          },
        },
        {}
      );

      const request = await User.findByIdAndUpdate(
        authenticatedUserId,
        {
          $push: {
            searchHistory: otherUserName,
          },
        },
        {}
      );
      res.status(200).json({
        status: "PUSHED_TO_SEARCH_HISTORY",
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

exports.pull = (req, res, next) => {
  const authenticatedUserId = req.authenticatedUserId;
  const otherUserName = req.body.otherUserName;
  const mainTask = async () => {
    try {
      const request = await User.findByIdAndUpdate(
        authenticatedUserId,
        {
          $pull: {
            searchHistory: otherUserName,
          },
        },
        {}
      );
      res.status(200).json({
        status: "PULLED_FROM_SEARCH_HISTORY",
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

exports.search = (req, res, next) => {
  const authenticatedUserId = req.authenticatedUserId;
  const searchText = req.body.searchText;
  const mainTask = async () => {
    try {
      if (searchText) {
        const searchHistory = await User.find({
          $and: [
            {
              $or: [
                {
                  _id: {
                    $regex: searchText.toLowerCase(),
                  },
                },
                {
                  firstName: {
                    $regex: searchText.toLowerCase(),
                  },
                },
                {
                  lastName: {
                    $regex: searchText.toLowerCase(),
                  },
                },
                {
                  _id: {
                    $regex: searchText.toUpperCase(),
                  },
                },
                {
                  firstName: {
                    $regex: searchText.toUpperCase(),
                  },
                },
                {
                  lastName: {
                    $regex: searchText.toUpperCase(),
                  },
                },
                {
                  firstName: {
                    $regex:
                      searchText.charAt(0).toUpperCase() + searchText.slice(1),
                  },
                },
                {
                  lastName: {
                    $regex:
                      searchText.charAt(0).toUpperCase() + searchText.slice(1),
                  },
                },
              ],
            },
            {},
          ],
        });

        const fetchedSearchHistory = searchHistory.map((item) => {
          return {
            _id: item._id,
            fullName: item.firstName + " " + item.lastName,
          };
        });
        res.status(201).json({
          status: "SEARCH_HISTORY_LOADED",
          data: {
            searchResults: fetchedSearchHistory,
          },
        });
      }
      if (!searchText) {
        res.status(201).json({
          status: "SEARCH_HISTORY_LOADED",
          data: {
            searchResults: [],
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
