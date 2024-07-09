const User = require('../models/user');

exports.getAdmin = (req, res, next) => {
  User.findOne({ email: req.user.email})
    .then(user => {
      if(user.isAdmin) {
        User.find()
          .then(users => {
            res.render('admin/admin', {
              users: users,
              pageTitle: 'Admin Dashboard',
              path: '/admin'
            })
          })
          .catch(err => {
            console.log(err);
          })
      }
      else {
        res.redirect('/dashboard');
      }
    })
    .catch(err => {
      console.log(err);
    })
};

exports.getEditUser = (req, res, next) => {
  const userId = req.params.userId;

  User.findById(userId)
    .then(user => {
      if(!user) {
        return res.redirect('/admin')
      }
      res.render('admin/edit-users', {
        user: user,
        pageTitle: 'Edit User',
        path: '/admin/edit-users'
      })
    })
    .catch(err => {
      console.log(err);
    })
}

exports.postEditUser = (req, res, next) => {
  const userId = req.body.userId;
  const updatedfullname = req.body.fullname;
  const updatedusername = req.body.username;
  const updatedemail = req.body.email;
  const updatedtotalDeposit = req.body.totalDeposit;
  const updatedtotalProfit = req.body.totalProfit;
  const updatedaccountWithdrawable = req.body.accountWithdrawable;

  User.findById(userId)
    .then(user => {
      if (!user) {
        return res.redirect('/admin');
      }
      user.fullname = updatedfullname;
      user.username = updatedusername;
      user.email = updatedemail;
      user.totalDeposit = updatedtotalDeposit;
      user.totalProfit = updatedtotalProfit;
      user.accountWithdrawable = updatedaccountWithdrawable;

      return user.save();
    })
    .then(result => {
      console.log('User Updated')
      res.redirect('/admin');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    })
}

exports.getDeleteUser = (req, res, next) => {
  const userId = req.params.userId;

  User.findByIdAndDelete(userId)
    .then(result => {
      if (req.session.user && req.session.user._id === userId) {
        req.session.destroy(err => {
          if (err) {
            console.log(err);
            return res.redirect('/admin');
          }
          res.redirect('/login'); // Redirect to login page after session is destroyed
        });
      } else {
        res.redirect('/admin');
      }
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    })
}