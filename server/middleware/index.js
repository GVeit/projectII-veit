const requiresLogin = (req, res, next) => {
  if (!req.session.account) {
    return res.redirect('/');
  }
  return next();
};

const requiresLogout = (req, res, next) => {
  if (req.session.account) {
    return res.redirect('/maker');
  }

  return next();
};

const requiresaddFunds = (req, res, next) => {
  if (req.session.account) {
    return res.redirect('/addFunds');
  }

  return next();
};


const requiresblackJack = (req, res, next) => {
  if (req.session.account) {
    return res.redirect('/blackJack');
  }

  return next();
};


const requiresSecure = (req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(`https://${req.hostname}${req.url}`);
  }
  return next();
};

const bypassSecure = (req, res, next) => {
  next();
};

module.exports.requiresLogin = requiresLogin;
module.exports.requiresLogout = requiresLogout;
module.exports.requiresaddFunds = requiresaddFunds;
module.exports.requiresblackJack = requiresblackJack;

if (process.env.NODE_ENV === 'production') {
  module.exports.requiresSecure = requiresSecure;
} else {
  module.exports.requiresSecure = bypassSecure;
}
