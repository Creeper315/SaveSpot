exports.getLoginPage = (req, res) => {
    res.set('Cache-Control', 'no-store');
    res.sendFile('login.html', {
        root: 'view',
    });
};
exports.getRegisterPage = (req, res) => {
    res.sendFile('register.html', {
        root: 'view',
    });
};

exports.getSpotPage = (q, s) => {
    if (q.session.uId) {
        s.sendFile('spot.html', { root: 'view' });
    } else {
        console.log('Session Expired! back to Login page');
        s.redirect('/');
    }
};
