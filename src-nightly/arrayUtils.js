"use strict";
function arraySum(a, b, out) {
    var l = a.length;
    for (var i = 0; i < l; i++)
        out[i] = a[i] + b[i];
}
exports.arraySum = arraySum;
function arrayTimes(n, b, out) {
    var l = b.length;
    for (var i = 0; i < l; i++)
        out[i] = n * b[i];
}
exports.arrayTimes = arrayTimes;
function repeatArray(arr, len, times) {
    var buff = arr.subarray(0, len), newlen = times * len;
    for (var i = len; i < newlen; i += len)
        arr.set(buff, i);
    return arr;
}
exports.repeatArray = repeatArray;
function repeatPoints(arr, len, times) {
    for (var i = len - 1, t = len * times - 1; i >= 0; i--) {
        var val = arr[i];
        for (var j = 0; j < times; j++, t--)
            arr[t] = val;
    }
    return arr;
}
exports.repeatPoints = repeatPoints;
function blockRepeat(source, blockSize, blockCount, repCount, target) {
    if (blockCount > 50) {
        for (var i = blockCount - 1; i >= 0; i--) {
            var baseS = i * blockSize;
            var baseTT = i * repCount;
            for (var k = 0; k < repCount; k++) {
                var baseT = (baseTT + k) * blockSize;
                for (var j = 0; j < blockSize; j++) {
                    target[baseT + j] = source[baseS + j];
                }
            }
        }
        return;
    }
    if (blockCount > 10) {
        var buffer = new Float32Array(blockSize);
        for (var i = blockCount - 1; i >= 0; i--) {
            for (var j = 0; j < blockSize; j++) {
                buffer[j] = source[i * blockSize + j];
            }
            var baseT = i * repCount * blockSize;
            for (var k = 0; k < repCount; k++) {
                target.set(buffer, baseT);
                baseT += blockSize;
            }
        }
        return;
    }
    for (var i = blockCount - 1; i >= 0; i--) {
        var buffer = source.subarray(i * blockSize, (i + 1) * blockSize);
        for (var k = 0; k < repCount; k++) {
            target.set(buffer, (i * repCount + k) * blockSize);
        }
    }
}
exports.blockRepeat = blockRepeat;
;
function incArray(arr, by) {
    for (var i = 0; i < arr.length; i++)
        arr[i] += by;
    return arr;
}
exports.incArray = incArray;
function timesArray(n, arr) {
    for (var i = 0; i < arr.length; i++)
        arr[i] *= n;
    return arr;
}
exports.timesArray = timesArray;
function Buffer() {
    this.array = new Float32Array(0);
    this.length = 0;
}
exports.Buffer = Buffer;
