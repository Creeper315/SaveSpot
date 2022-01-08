// global var, current user email.
var Spot = require('../model/spot').model;
var thisUserEmail;
const postsPerPage = 8;

async function getSpot(type, email) {
    // type 可以是一个 array of filter requirement 吗？
    thisUserEmail = email;
    let keepFiltering = filterVisible(allSpots);
    if (typeof type == 'string') {
        type = [type];
    }

    type.forEach((t) => {
        switch (t) {
            case 'needing_help':
                keepFiltering = filterNeedHelp(keepFiltering);
                break;
            case 'helped_by_me':
                keepFiltering = filterHelpByMe(keepFiltering);
                break;
            case 'posted_by_me':
                keepFiltering = filterSelfPost(keepFiltering);
                break;
            default:
                // do nothing
                break;
        }
    });
    keepFiltering = filterHelperNull(keepFiltering);
    return keepFiltering;
}

function filterVisible(inputSpots) {
    let filtered = inputSpots.filter((e) => {
        return e.requester == thisUserEmail || e.visible == true;
    });
    return filtered;
}

function filterNeedHelp(inputSpots) {
    let filtered = inputSpots.filter((e) => {
        return e.helper == undefined || e.helper == null;
    });
    return filtered;
}

function filterHelpByMe(inputSpots) {
    let filtered = inputSpots.filter((e) => {
        return e.helper == thisUserEmail;
    });
    return filtered;
}

function filterSelfPost(inputSpots) {
    let filtered = inputSpots.filter((e) => {
        return e.requester == thisUserEmail;
    });
    return filtered;
}

function filterHelperNull(arrSpot) {
    // 这个 function，确保每个 spot 的 helper 的值，如果是 undefined，把他改成 null，不然传送到前端，undefined 的值，就消失了。
    let filtered = arrSpot.map((obj) => {
        if (!obj.helper) {
            return {
                ...obj,
                helper: null,
            };
        } else {
            return obj;
        }
    });
    return filtered;
    // Check if helper == undefined, if it is, make sure it is null.
}

function getUniqueID() {
    if (deletedID.length != 0) {
        return deletedID.pop();
    }
    let currentID = allSpots.map((e) => {
        return e.id;
    });
    return Math.max(...currentID) + 1;
}

async function checkExist(postID) {
    for (let i = 0; i < allSpots.length; i++) {
        const e = allSpots[i];
        if (e.id == postID) {
            return i;
        }
    }
    return false;
}

async function createSpot(data) {
    // 检查 spot id 是否冲突。
    let obj = new Spot(
        getUniqueID(),
        thisUserEmail,
        data.time,
        data.location,
        null,
        data.reward,
        true
    );
    // let obj = {
    //     id: getUniqueID(),
    //     requester: thisUserEmail,
    //     time: data.time,
    //     location: data.location,
    //     helper: null,
    //     reward: data.reward,
    //     visible: true,
    // };
    allSpots.unshift(obj);
    return obj;
}
async function editSpot(data, id) {
    let idx = await checkExist(id);
    console.log('edit id idx ', id, idx);
    if (idx == undefined) {
        // !!!! idx 也可能是 0 ，所以要用 == undefined ?
        return false;
    }
    let e = allSpots[idx];
    allSpots[idx] = {
        ...e,
        location: data.location,
        time: data.time,
        reward: data.reward,
    };
    return true;
}

async function deleteSpot(id) {
    let idx = await checkExist(id);
    console.log('delete id, idx ', idx);
    if (idx != undefined) {
        allSpots = allSpots.filter((e) => {
            return e.id != id;
        });
        deletedID.push(id);
    }
    return true;
}

async function cancelHelp(id) {
    let idx = await checkExist(id);
    if (idx == undefined) {
        return false;
    }
    allSpots[idx].helper = null;
    return true;
}

async function public(id) {
    let idx = await checkExist(id);
    if (idx == undefined) {
        return false;
    }
    allSpots[idx].visible = true;
}

async function invisible(id) {
    let idx = await checkExist(id);
    if (idx == undefined) {
        return false;
    }
    allSpots[idx].visible = false;
}

async function helpSpot(id, user) {
    let idx = await checkExist(id);
    // console.log('which idx, spot', idx, allSpots[idx]);
    if (idx == undefined) {
        return false;
    }
    allSpots[idx].helper = user;
    return true;
}
module.exports = {
    getSpot,
    createSpot,
    helpSpot,
    editSpot,
    public,
    invisible,
    cancelHelp,
    deleteSpot,
};
let deletedID = [];
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
