function f(str) {
    str = str.split('/');
    let newStr = [str[2], str[1], str[0]];

    return new Date(newStr);
}

let start = f('01/03/2022');

function diff(endStr) {
    let obj = f(endStr);
    let diff = obj.getTime() - start.getTime();
    let days = Math.ceil(diff / (1000 * 3600 * 24));
    return days;
}
