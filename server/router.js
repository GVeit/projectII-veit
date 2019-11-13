const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getDomos', mid.requiresLogin, controllers.Domo.getDomos);
  app.get('/login', controllers.Account.loginPage);
  app.post('/login', controllers.Account.login);
  app.get('/signup', controllers.Account.signupPage);
  app.post('/signup', controllers.Account.signup);
  app.get('/logout', controllers.Account.logout);
  app.get('/addFunds', controllers.Account.addFunds);
  app.post('/addFunds', controllers.Account.increaseMoney);
  app.get('/getFunds', controllers.Account.getFunds);
  app.get('/blackJack', controllers.Account.blackJack);
  app.get('/maker', controllers.Domo.makerPage);
  app.post('/maker', controllers.Domo.make);
  app.get('/', controllers.Account.loginPage);
};

module.exports = router;

