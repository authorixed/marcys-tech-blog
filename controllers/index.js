const router = require('express').Router();
const userRoutes = require('./api/userRoutes');
const postRoutes = require('./api/postRoutes');
const commentRoutes = require('./api/commentRoutes');
const { Post, User } = require('../models');
const withAuth = require('../utils/auth');

// Route to render the homepage
router.get('/', async (req, res) => {
  try {
    const postData = await Post.findAll({
      include: [{ model: User, attributes: ['username'] }],
    });

    const posts = postData.map((post) => post.get({ plain: true }));

    res.render('homepage', {
      posts,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route to render the login page
router.get('/login', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }

  res.render('login');
});

// Route to render the signup page
router.get('/signup', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }

  res.render('signup');
});

// Route to render the dashboard page, only accessible if logged in
router.get('/dashboard', withAuth, async (req, res) => {
  try {
    const userData = await User.findByPk(req.session.user_id, {
      include: [{ model: Post }],
    });

    if (!userData) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const user = userData.get({ plain: true });

    res.render('dashboard', {
      ...user,
      logged_in: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Use API routes
router.use('/api/users', userRoutes);
router.use('/api/posts', postRoutes);
router.use('/api/comments', commentRoutes);

module.exports = router;
