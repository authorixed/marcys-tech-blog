const router = require("express").Router();
const { User } = require("../../models");

router.post("/signup", async (req, res) => {
  try {
    const newUser = await User.create(req.body);

    req.session.save(() => {
      req.session.user_id = newUser.id;
      req.session.logged_in = true;
      res.status(200).json({ message: "You are now signed up!" });
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ where: { username: req.body.username } });

    if (!user || !user.checkPassword(req.body.password)) {
      res.status(400).json({ message: "Incorrect username or password" });
      return;
    }

    req.session.save(() => {
      req.session.user_id = user.id;
      req.session.logged_in = true;
      res.status(200).json({ message: "You are now logged in!" });
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Logout route
router.post("/logout", (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
