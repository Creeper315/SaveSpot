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
var allSpots = [
    {
        id: 1,
        requester: 'abc',
        time: '2021-10-01 1:00AM',
        location: 'UBC Math 100 first row, any seat',
        helper: 'elina@gmail.com',
        reward: '$20',
        complete: false,
        visible: true,
    },
    {
        id: 2,
        requester: 'elina@gmail.com',
        time: '2021-10-01 2:00AM',
        location: 'UBC Math 100 first row, any seat',
        helper: 'abc',
        reward: '$20',
        complete: false,
        visible: true,
    },
    {
        id: 3,
        requester: 'elina@gmail.com',
        time: '2021-10-01 3:00AM',
        location: 'UBC Math 100 first row, any seat',
        helper: undefined,
        reward: '$20',
        complete: false,
        visible: true,
    },
    {
        id: 4,
        requester: 'hello123',
        time: '2021-10-01 4:00AM',
        location: 'UBC Math 100 first row, any seat',
        helper: undefined,
        reward: '$20',
        complete: false,
        visible: true,
    },
    {
        id: 5,
        requester: 'hello123',
        time: '2021-10-01 5:00AM',
        location: 'UBC Math 100 first row, any seat',
        helper: 'elina@gmail.com',
        reward: '$20',
        complete: true,
        visible: true,
    },
    {
        id: 6,
        requester: 'abc',
        time: '2021-10-01 6:00AM',
        location: 'UBC Math 100 first row, any seat',
        helper: 'hello123',
        reward: '$20',
        complete: false,
        visible: true,
    },
    {
        id: 7,
        requester: 'abc',
        time: '2021-10-01 7:00AM',
        location: 'UBC Math 100 first row, any seat',
        helper: undefined,
        reward: '$20',
        complete: false,
        visible: true,
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
        s.status(400).send('Please provide both email & password');
        return;
    }
    let match_any_user = false;
    currentUsers.forEach((e) => {
        if (email == e.email && password == e.password) {
            match_any_user = true;
            q.session.uId = q.body.email;
            s.status(200).send('success, logged in as user: ' + email);
            return;
        }
    });
    if (!match_any_user) {
        s.status(403).send('wrong email or password');
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
                    return e;
                }
            });
            break;

        case 'needing_help':
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
    s.status(200).json(result);
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
    if (q.session.uId) {
        var my_email = q.session.uId;
    } else {
        s.redirect('/'); // TODO , check if this work.
    }
    let type = q.params['act'];
    let data = q.body;
    console.log('act here, ', type, data);
    switch (type) {
        case 'help': {
            allSpots = allSpots.map((e) => {
                if (e.id == data.postID) {
                    return {
                        ...e,
                        helper: data.user,
                    };
                } else {
                    return e;
                }
            });
            // console.log('what ? ', allSpots[1]);
            s.status(200).send('helper added!');
            s.end();
            break;
        }
        case 'cancelhelp': {
            allSpots = allSpots.map((e) => {
                if (e.id == data.postID) {
                    return {
                        ...e,
                        helper: null,
                    };
                } else {
                    return e;
                }
            });
            s.status(200).send('helper removed!');
            s.end();
            break;
        }
        case 'public':
            break;
        case 'invisible':
            break;
        case 'edit':
            break;
        case 'delete':
            break;
        default:
            console.log('shouldnt get here, unknown type: ', type);
            break;
    }
});
