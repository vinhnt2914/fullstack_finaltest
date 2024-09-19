const express = require("express");
const cors = require("cors");
const { users, links } = require("./data");
const { findUser } = require("./function");

const app = express();
const PORT = 8080;

app.use(cors());

// return all users
app.get("/users", (req, res) => {
  res.status(200).json(users);
});

// return a users with more detail
app.get("/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  // find the matching user
  console.log("userID: ", userId);
  const user = findUser(userId);
  console.log("user: ", user);
  // construct the followers array
  let followingList = [];
  let followersList = [];

  links.forEach((link) => {
    if (link.from === userId) {
      followingList.push(link.to);
    } else if (link.to === userId) {
      followersList.push(link.from);
    }
  });

  console.log(followersList);
  console.log(followingList);

  user["following_list"] = followingList;
  user["follower_list"] = followersList;

  res.status(200).json(user);
});

app.post("/users/:from_id/follow/:to_id", (req, res) => {
  const fromId = parseInt(req.params.from_id);
  const toId = parseInt(req.params.to_id);

  const index = links.find((link) => link.from === fromId && toId === toId);
  let msg;
  // Have not follow
  if (index === -1) {
    links.push({ from: fromId, to: toId });
    msg = "removed";
  } else {
    links.splice(index, 1);
    msg = "added";
  }

  res.status(200).json({ msg });
});

app.all("*", (req, res) => {
  res.status(404).json({ msg: "not found" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
