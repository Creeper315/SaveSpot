var session = require('express-session');
const express = require('express');
const app = express();
const port = 3003;

const path = require('path');

// app.use(express.static('public'));
// console.log(path.join(__dirname, '/view/public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

let session_conf = {
    secret: 'no secret',
    cookie: {
        secure: false,
        maxAge: 8000,
    },
};
app.use(session(session_conf));

app.listen(port, () => {
    console.log('hheheh');
});

app.get('/', (req, res) => {
    res.sendFile('login.html', {
        root: 'view',
    });
});

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/view/register.html');
});

app.post('/login', (q, s) => {
    // s.json({ result: q });
    // return;
    console.log('?@@@');
    console.log(q.body);
    console.log(q.query);

    console.log(q.session);
    if (q.body.email == 'abc' && q.body.password == '123') {
        q.session.uId = q.body.email;
        console.log(q.session);
        s.json({ result: 'success' });
    } else {
        s.json({ result: 'wrong email or pass' });
    }
});

app.post('/register', (q, s) => {
    console.log('is uId set ?', q.session.uId);
    console.log('all session, ', q.session);
    s.json({ result: 'sucess' });
});

app.get('/login_test', (q, s) => {
    console.log('from test: ', q.session);
    if (q.session.uId) {
        s.send('uId is : ' + q.session.uId);
    } else {
        s.send('uId NOT defined' + q.session.uId);
    }
});
