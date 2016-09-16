"use strict";
function firstMatch(set, callback) {
    for (var i = 0; i <= set.length; i++) {
        if (callback(set[i])) {
            return set[i];
        }
    }
    ;
}
exports.firstMatch = firstMatch;
function haveCommon(arr1, arr2) {
    return arr1.some(function (e1) { return arr2.indexOf(e1) !== -1; });
}
exports.haveCommon = haveCommon;
function intersection(pv, cv, out) {
    return pv.filter(function (e) { return cv.indexOf(e) !== -1; });
}
exports.intersection = intersection;
function interPower(arr1, arr2) {
    var pow = 0;
    for (var i = 0; i < arr1.length; i++) {
        if (arr2.indexOf(arr1[i]) !== -1) {
            pow++;
        }
    }
    return pow;
}
exports.interPower = interPower;
function union(a, b, out) {
    out = out || [];
    if (out !== a && out !== b)
        out.length = 0;
    a.reduce(setpush, out);
    b.reduce(setpush, out);
    return out;
}
exports.union = union;
function nunion(sets, out) {
    out = out || [];
    if (sets.indexOf(out) === -1)
        out.length = 0;
    sets.forEach(function (set) {
        union(out, set, out);
    });
    return out;
}
exports.nunion = nunion;
;
function unique(pv, cv) {
    if (pv.indexOf(cv) === -1)
        pv.push(cv);
    return pv;
}
exports.unique = unique;
function setMinus(l, r, out) {
    return l.filter(function (el) { return r.indexOf(el) === -1; });
}
exports.setMinus = setMinus;
function setpush(arr, el) {
    if (arr.indexOf(el) === -1)
        arr.push(el);
    return arr;
}
exports.setpush = setpush;
function setpop(arr, el) {
    var i = arr.indexOf(el);
    if (el !== -1) {
        arr.splice(i, 1);
    }
    return arr;
}
exports.setpop = setpop;
