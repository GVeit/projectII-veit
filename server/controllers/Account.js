const models = require('../models');

const Account = models.Account;

const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

const signupPage = (req, res) => {
  res.render('signup', { csrfToken: req.csrfToken() });
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const addFunds = (req, res) => {
  res.render('addFunds');
};

const increaseMoney = (req, res) =>{
    //grab the current account from mongo

    Account.AccountModel.findByUsername(req.session.account.username, (err, doc) => {
        let account = doc;
        account.funds += req.body.fundField;
        
        let saveMoney = account.save();
        
        saveMoney.then(() => {
           res.json({message: 'success'}); 
        });
        
        saveMoney.catch((err) => {
            res.json({err});
        });
        
        
    });

    
};

const getFunds = (req, res) => {
    Account.AccountModel.findByUsername(req.session.account.username, (err, doc) =>{
        res.json({funds: doc.fund});
    });
};

const blackJack = (req, res) => {
  res.render('blackJack');
};

const login = (request, response) => {
  const req = request;
  const res = response;

    // force cast to strings to cover some security flaws
  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/maker' });
  });
};

const signup = (request, response) => {
  const req = request;
  const res = response;

    // cast to strings to cover up some security flaws
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };
      
      

    const newAccount = new Account.AccountModel(accountData);
    const savePromise = newAccount.save();

        // savePromise.then(() => res.json({ redirect: '/maker' }));

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      return res.json({ redirect: '/maker' });
    });

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already in use.' });
      }
      return res.status(400).json({ error: 'An error occurred' });
    });
  });
};

const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};


module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.getFunds = getFunds;
module.exports.addFunds = addFunds;
module.exports.blackJack = blackJack;
module.exports.signupPage = signupPage;
module.exports.signup = signup;
module.exports.getToken = getToken;
module.exports.increaseMoney = increaseMoney;