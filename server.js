const express = require('express');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const { engine } = require('express-handlebars');

const routes = require('./controllers');
const sequelize = require('./config/connection');
const { User, Post, Comment } = require('./models');

const app = express();
const PORT = process.env.PORT || 3001;

const sess = {
  secret: process.env.SESSION_SECRET || 'supersecret',
  cookie: { maxAge: 600000 },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({ db: sequelize }),
};

app.use(session(sess));

app.engine('handlebars', engine({ extname: '.handlebars' }));
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(routes);

sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
});
