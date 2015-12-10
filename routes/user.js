app.param('user_id', function(req, res, next, user_id) {

  UserDatabase.find(user_id, function(err, user) {
    if (err) return next(err);
    if (!user) return next(
      
    );
    req.user = user;
    next()
  });
});