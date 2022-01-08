var {
    getSpot,
    createSpot,
    helpSpot,
    editSpot,
    public,
    invisible,
    cancelHelp,
    deleteSpot,
} = require('../repository/spotRepo');

var thisUserEmail;
exports.modifySpots = async (q, s) => {
    thisUserEmail = q.session.uId;
    const type = q.params['act']; // 这里就不是 Array Type 了 ！
    let data = q.body;
    let respond = (success) => {
        if (success) {
            s.status(200).send('helper added!');
        } else {
            s.status(500).send('sth is wrong');
        }
        s.end();
    };
    // console.log('act here, ', type, data);
    switch (type) {
        case 'create': {
            let obj = await createSpot(data);
            if (obj) {
                s.status(200).json(obj);
            } else {
                s.status(500).send('sth is wrong');
            }
            s.end();
            break;
        }
        case 'help': {
            let success = await helpSpot(data.postID, thisUserEmail);
            respond(success);
            break;
        }
        case 'cancelhelp': {
            let success = await cancelHelp(data.postID);
            respond(success);
            break;
        }
        case 'public': {
            let success = await public(data.postID);
            respond(success);
            break;
        }

        case 'invisible': {
            let success = await invisible(data.postID);
            respond(success);
            break;
        }

        case 'edit': {
            let success = await editSpot(data, data.postID);
            respond(success);
            break;
        }

        case 'delete': {
            let success = await deleteSpot(data.postID);
            respond(success);
            break;
        }

        default:
            console.log('modify spot, unknown type: ', type);
            break;
    }
};

exports.getSpotData = async (q, s) => {
    // check logges in? already done in app.js by wrapper function
    // 拿到过滤的 spot data 后，pagination ！
    thisUserEmail = q.session.uId;
    var allData, page_num, total;

    // const type = q.params['type']; // TODO !!!!!!!!! 需要把 String 类型的 type 的 array ，json parse 成 array。
    const type = q.body.type;
    var page_num = q.body.page_num;
    // console.log('whats get spot ', getSpot);
    allData = await getSpot(type, thisUserEmail);

    // if (q.query) {
    //     page_num = q.query.page_num;
    // } else {
    //     page_num = undefined;
    // }
    if (page_num <= 0) {
        page_num = 1;
    }
    [allData, page_num, total] = pagination(allData, page_num); //给出此页面的 data，同时给出 页数的 x / total。比如 3/5 页
    let result = {
        spots: allData,
        user: thisUserEmail,
        current_p: page_num,
        total_p: total,
    };
    s.status(200).json(result);
    s.end();
};

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
