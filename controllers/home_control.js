exports.index = function(req, res) {
  if (req.user) {
    if (req.user) {
      return res.redirect('/user/:username');
    }
  }
  res.render('pages/index', {
    title: 'You Be the Judge'
  });
};