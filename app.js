var session = require('express-session');
const express = require('express');
const app = express();
const port = 3003;

const path = require('path');

// Cache-Control no store, 只在 '/' 里面设定了，不在 store 里面设定，但是也不会跳回到 spot 里面
// 页面跳转，res.redirect 在 post login 里面 call，就没法跳转到 get /spot. 但是在 client 里面 location.herf 才行
// 我自己的 project，多个大页面联合起来，怎么弄呢

// app.use(express.static('public'));
// console.log(path.join(__dirname, '/view/public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const currentUsers = [
    { email: 'abc', password: '123' },
    { email: 'elina@gmail.com', password: 'cool' },
    { email: 'hello123', password: '123' },
];
const allSpots = [
    {
        id: 1,
        requester: 'abc',
        time: '2021-10-01 9:00AM',
        location: 'UBC Math 100 first row, any seat',
        helper: 'elina@gmail.com',
        reward: '$20',
        complete: false,
    },
    {
        id: 2,
        requester: 'elina@gmail.com',
        time: '2021-10-01 9:00AM',
        location: 'UBC Math 100 first row, any seat',
        helper: 'abc',
        reward: '$20',
        complete: false,
    },
    {
        id: 3,
        requester: 'elina@gmail.com',
        time: '2021-10-01 9:00AM',
        location: 'UBC Math 100 first row, any seat',
        helper: undefined,
        reward: '$20',
        complete: false,
    },
    {
        id: 4,
        requester: 'hello123',
        time: '2021-10-01 9:00AM',
        location: 'UBC Math 100 first row, any seat',
        helper: undefined,
        reward: '$20',
        complete: false,
    },
    {
        id: 5,
        requester: 'hello123',
        time: '2021-10-01 9:00AM',
        location: 'UBC Math 100 first row, any seat',
        helper: 'elina@gmail.com',
        reward: '$20',
        complete: true,
    },
    {
        id: 6,
        requester: 'abc',
        time: '2021-10-01 9:00AM',
        location: 'UBC Math 100 first row, any seat',
        helper: 'hello123',
        reward: '$20',
        complete: false,
    },
    {
        id: 7,
        requester: 'abc',
        time: '2021-10-01 9:00AM',
        location: 'UBC Math 100 first row, any seat',
        helper: undefined,
        reward: '$20',
        complete: false,
    },
];

function minute_to_milisecond(min) {
    return Math.ceil(min * 60 * 1000);
}

let session_conf = {
    secret: 'no secret',
    cookie: {
        secure: false,
        maxAge: minute_to_milisecond(10),
    },
};
app.use(session(session_conf));

app.listen(port, () => {
    console.log('hheheh');
});

app.get('/', (req, res) => {
    res.set('Cache-Control', 'no-store');
    res.sendFile('login.html', {
        root: 'view',
    });
});

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/view/register.html');
});

app.get('/spot', (q, s) => {
    if (q.session.uId) {
        s.sendFile(__dirname + '/view/spot.html');
    } else {
        console.log('Session Expired! back login');
        s.redirect('/');
    }
});

app.post('/login', (q, s) => {
    // s.json({ result: q });
    // return;
    // console.log('?@@@');
    // console.log(q.body);
    // console.log(q.query);
    // console.log(q.session);
    let email = q.body.email;
    let password = q.body.password;
    if (!email || !password) {
        s.json({ result: 'Please provide both email & password' });
    }
    currentUsers.forEach((e) => {
        if (email == e.email && password == e.password) {
            q.session.uId = q.body.email;
            s.json({ result: 'success, logged in as user: ' + email });
        }
    });
    if (q.body.email == 'abc' && q.body.password == '123') {
        q.session.uId = q.body.email;
        // console.log('Session exist, redirect spot!');
        s.json({ result: 'success' });
    } else {
        // console.log('wrong email/pass');
        s.json({ result: 'wrong email or pass' });
    }
});

app.post('/register', (q, s) => {
    // console.log('is uId set ?', q.session.uId);
    // console.log('all session, ', q.session);
    s.json({ result: 'sucess' });
});

app.get('/login_test', (q, s) => {
    // console.log('from test: ', q.session);
    if (q.session.uId) {
        s.send('uId is : ' + q.session.uId);
    } else {
        s.send('uId NOT defined' + q.session.uId);
    }
});

app.get('/spot/data/:type', (q, s) => {
    if (q.session.uId) {
        var my_email = q.session.uId;
    } else {
        s.redirect('/'); // TODO , check if this work.
    }
    let type = q.params['type'];
    let result = [];
    let filterHelper = (obj) => {
        // Check if helper == undefined, if it is, make sure it is null.
        if (!obj.helper) {
            return {
                ...obj,
                helper: null,
            };
        } else {
            return obj;
        }
    };
    switch (type) {
        case 'all':
            result = allSpots.flatMap((e) => {
                if (!e.helper) {
                    return filterHelper(e);
                } else {
                    return [];
                }
            });
            break;
        case 'requested_by_me':
            result = allSpots.flatMap((e) => {
                if (e.requester == my_email) {
                    return filterHelper(e);
                } else {
                    return [];
                }
            });
            break;
        case 'worked_by_me':
            result = allSpots.flatMap((e) => {
                if (e.helper == my_email) {
                    return filterHelper(e);
                } else {
                    return [];
                }
            });
            break;

        default:
            console.log('invalid spot type !! you entered: ', type);
            break;
    }
    result = {
        spots: result,
        user: my_email,
    };
    s.json(result);
});
