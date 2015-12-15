exports.index = function(req, res) {
  if (req.user) {
    return res.redirect('/user/:username');
  }
  res.render('index', {
    title: 'You Be the Judge'
  });
};