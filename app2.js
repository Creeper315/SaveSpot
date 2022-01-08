var session = require('express-session');
const UserController = require('./controller/userController');
const SpotController = require('./controller/spotController');
const ViewController = require('./controller/viewController');
const express = require('express');
const app = express();
const port = 3003;
var { session_conf } = require('./helper');
const path = require('path');

// Cache-Control no store, 只在 '/' 里面设定了，不在 store 里面设定，但是也不会跳回到 spot 里面
// 页面跳转，res.redirect 在 post login 里面 call，就没法跳转到 get /spot. 但是在 client 里面 location.herf 才行
// 我自己的 project，多个大页面联合起来，怎么弄呢

// app.use(express.static('public'));
// console.log(path.join(__dirname, '/view/public'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.use(session(session_conf));

app.listen(port, () => {
    console.log('start my save spot ~');
});

app.get('/', (req, res) => {
    ViewController.getLoginPage(req, res);
});

app.get('/register', (req, res) => {
    ViewController.getRegisterPage(req, res);
});

app.get('/spot', (q, s) => {
    ViewController.getSpotPage(q, s);
});

// const UserController = require('./controller/userController');

// app.post('/login', (req, res)=>{UserController.login(req, res)});

// app.post('/login', new UserController(email, password).login());

// app.post('/login', UserController.login(email, password));

app.post('/login', (q, s) => {
    UserController.login(q, s);
});

app.post('/register', (q, s) => {
    UserController.register(q, s);
});

app.get('/login_test', (q, s) => {
    if (q.session.uId) {
        s.send('uId is : ' + q.session.uId);
    } else {
        s.send('uId NOT defined' + q.session.uId);
    }
});

app.post('/spot/data', (q, s) => {
    SpotController.getSpotData(q, s);
});
// id: 1,
// requester: 'abc',
// time: '2021-10-01 9:00AM',
// location: 'UBC Math 100 first row, any seat',
// helper: 'elina@gmail.com',
// reward: '$20',
// complete: false,
// visible: true,
app.post('/spot/action/:act', (q, s) => {
    SpotController.modifySpots(q, s);
});

app.post('/signout', (q, s) => {
    UserController.logout(q, s);
});
