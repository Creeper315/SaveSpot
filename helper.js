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
        visible: true,
    },
    {
        id: 2,
        requester: 'elina@gmail.com',
        time: '2021-10-01 2:00AM',
        location: 'UBC Math 100 first row, any seat',
        helper: 'abc',
        reward: '$20',
        visible: true,
    },
    {
        id: 3,
        requester: 'elina@gmail.com',
        time: '2021-10-01 3:00AM',
        location: 'UBC Math 100 first row, any seat',
        helper: undefined,
        reward: '$20',
        visible: true,
    },
    {
        id: 4,
        requester: 'hello123',
        time: '2021-10-01 4:00AM',
        location: 'UBC Math 100 first row, any seat',
        helper: undefined,
        reward: '$20',
        visible: true,
    },
    {
        id: 5,
        requester: 'hello123',
        time: '2021-10-01 5:00AM',
        location: 'UBC Math 100 first row, any seat',
        helper: 'elina@gmail.com',
        reward: '$20',
        visible: true,
    },
    {
        id: 6,
        requester: 'abc',
        time: '2021-10-01 6:00AM',
        location: 'UBC Math 100 first row, any seat',
        helper: 'hello123',
        reward: '$20',
        visible: true,
    },
    {
        id: 7,
        requester: 'abc',
        time: '2021-10-01 7:00AM',
        location: 'UBC Math 100 first row, any seat',
        helper: undefined,
        reward: '$20',
        visible: true,
    },
    {
        id: 8,
        requester: 'abc',
        time: '2021-10-01 8:00AM',
        location: 'UBC Math 100 first row, any seat',
        helper: undefined,
        reward: '$20',
        visible: true,
    },
    {
        id: 9,
        requester: 'elina@gmail.com',
        time: '2021-10-01 9:00AM',
        location: 'UBC Math 100 first row, any seat',
        helper: undefined,
        reward: '$20',
        visible: true,
    },
    {
        id: 10,
        requester: 'abc',
        time: '2021-10-01 10:00AM',
        location: 'UBC Math 100 first row, any seat',
        helper: undefined,
        reward: '$20',
        visible: true,
    },
    {
        id: 11,
        requester: 'abc',
        time: '2021-10-01 11:00AM',
        location: 'UBC Math 100 first row, any seat',
        helper: undefined,
        reward: '$20',
        visible: true,
    },
    {
        id: 12,
        requester: 'hello123',
        time: '2021-10-01 12:00AM',
        location: 'UBC Math 100 first row, any seat',
        helper: undefined,
        reward: '$20',
        visible: true,
    },
    {
        id: 13,
        requester: 'abc',
        time: '2021-10-01 13:00AM',
        location: 'UBC Math 100 first row, any seat',
        helper: undefined,
        reward: '$20',
        visible: true,
    },
    {
        id: 14,
        requester: 'elina@gmail.com',
        time: '2021-10-01 14:00AM',
        location: 'UBC Math 100 first row, any seat',
        helper: undefined,
        reward: '$20',
        visible: true,
    },
    {
        id: 15,
        requester: 'abc',
        time: '2021-10-01 15:00AM',
        location: 'UBC Math 100 first row, any seat',
        helper: undefined,
        reward: '$20',
        visible: true,
    },
    {
        id: 16,
        requester: 'elina@gmail.com',
        time: '2021-10-01 16:00AM',
        location: 'UBC Math 100 first row, any seat',
        helper: undefined,
        reward: '$20',
        visible: true,
    },
    {
        id: 17,
        requester: 'elina@gmail.com',
        time: '2021-10-01 17:00AM',
        location: 'UBC Math 100 first row, any seat',
        helper: undefined,
        reward: '$20',
        visible: true,
    },
    {
        id: 18,
        requester: 'abc',
        time: '2021-10-01 18:00AM',
        location: 'UBC Math 100 first row, any seat',
        helper: undefined,
        reward: '$20',
        visible: true,
    },
    {
        id: 19,
        requester: 'elina@gmail.com',
        time: '2021-10-01 19:00AM',
        location: 'UBC Math 100 first row, any seat',
        helper: undefined,
        reward: '$20',
        visible: true,
    },
    {
        id: 20,
        requester: 'elina@gmail.com',
        time: '2021-10-01 20:00AM',
        location: 'UBC Math 100 first row, any seat',
        helper: undefined,
        reward: '$20',
        visible: true,
    },
    {
        id: 21,
        requester: 'abc',
        time: '2021-10-01 21:00AM',
        location: 'UBC Math 100 first row, any seat',
        helper: undefined,
        reward: '$20',
        visible: true,
    },
    {
        id: 22,
        requester: 'hello123',
        time: '2021-10-01 22:00AM',
        location: 'UBC Math 100 first row, any seat',
        helper: undefined,
        reward: '$20',
        visible: true,
    },
    {
        id: 23,
        requester: 'abc',
        time: '2021-10-01 23:00AM',
        location: 'UBC Math 100 first row, any seat',
        helper: undefined,
        reward: '$20',
        visible: true,
    },
    {
        id: 24,
        requester: 'abc',
        time: '2021-10-02 00:00AM',
        location: 'UBC Math 100 first row, any seat',
        helper: undefined,
        reward: '$20',
        visible: true,
    },
    {
        id: 25,
        requester: 'hello123',
        time: '2021-10-02 01:00AM',
        location: 'UBC Math 100 first row, any seat',
        helper: undefined,
        reward: '$20',
        visible: true,
    },
    {
        id: 26,
        requester: 'elina@gmail.com',
        time: '2021-10-02 02:00AM',
        location: 'UBC Math 100 first row, any seat',
        helper: undefined,
        reward: '$20',
        visible: true,
    },
    {
        id: 27,
        requester: 'abc',
        time: '2021-10-02 03:00AM',
        location: 'UBC Math 100 first row, any seat',
        helper: undefined,
        reward: '$20',
        visible: true,
    },
    {
        id: 28,
        requester: 'hello123',
        time: '2021-10-02 04:00AM',
        location: 'UBC Math 100 first row, any seat',
        helper: undefined,
        reward: '$20',
        visible: true,
    },
    {
        id: 29,
        requester: 'hello123',
        time: '2021-10-02 05:00AM',
        location: 'UBC Math 100 first row, any seat',
        helper: undefined,
        reward: '$20',
        visible: true,
    },
    {
        id: 30,
        requester: 'abc',
        time: '2021-10-02 06:00AM',
        location: 'UBC Math 100 first row, any seat',
        helper: undefined,
        reward: '$20',
        visible: true,
    },
    {
        id: 31,
        requester: 'elina@gmail.com',
        time: '2021-10-02 07:00AM',
        location: 'UBC Math 100 first row, any seat',
        helper: undefined,
        reward: '$20',
        visible: true,
    },
    {
        id: 32,
        requester: 'elina@gmail.com',
        time: '2021-10-02 08:00AM',
        location: 'UBC Math 100 first row, any seat',
        helper: undefined,
        reward: '$20',
        visible: true,
    },
    {
        id: 33,
        requester: 'abc',
        time: '2021-10-02 09:00AM',
        location: 'UBC Math 100 first row, any seat',
        helper: undefined,
        reward: '$20',
        visible: true,
    },
];
let deletedID = [];

// currentID = currentID.filter(onlyUnique);
// function onlyUnique(value, index, self) {
//     return self.indexOf(value) === index;
// }

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

function getUniqueID() {
    if (deletedID.length != 0) {
        return deletedID.pop();
    }
    let currentID = allSpots.map((e) => {
        return e.id;
    });
    return Math.max(...currentID) + 1;
}

function pagination(spotData, page_num = 1, np = 8) {
    // 这个 function 过滤到当前页面需要显示的 8 个 post，
    // 并且，return 这个页面是 几分之几 的总页数
    // 不知道是不是 shallow copy，spotData 需要 return 吗，只需要改变就行，只 return 几分之几 页面
    // 默认的当前页数是第一页。如果页数没给出的话
    // console.log('herererere', page_num, np);
    let n = spotData.length;
    let a = Math.floor(n / np);
    let b = n % np;
    if (b != 0) {
        var total = a + 1;
    } else {
        var total = a;
    }
    if (page_num > total) {
        page_num = total;
    }
    let endIdx = page_num * np;
    let startIdx = endIdx - np;
    spotData = spotData.slice(startIdx, endIdx);
    return [spotData, page_num, total];
}

module.exports = {
    currentUsers,
    allSpots,
    deletedID,
    session_conf,
    getUniqueID,
    pagination,
};
