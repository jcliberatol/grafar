"use strict";
var glUtils_1 = require('./glUtils');
var arrayUtils_1 = require('./arrayUtils');
function pathGraph(srcDummy, target) {
    var edgeCount = target.pointCount - 1;
    glUtils_1.resizeBuffer(target, edgeCount * 2);
    var data = target.array;
    for (var i = 0, j = 0; i < edgeCount; i++, j += 2) {
        data[j] = i;
        data[j + 1] = i + 1;
    }
}
exports.pathGraph = pathGraph;
function emptyGraph(srcDummy, target) {
    glUtils_1.resizeBuffer(target, 0);
}
exports.emptyGraph = emptyGraph;
function cartesianGraphProd2(src, target) {
    var arr1 = src[0].array, edgeCount1 = src[0].length / 2, nodeCount1 = src[0].pointCount, arr2 = src[1].array, edgeCount2 = src[1].length / 2, nodeCount2 = src[1].pointCount;
    glUtils_1.resizeBuffer(target, (edgeCount1 * nodeCount2 + edgeCount2 * nodeCount1) * 2);
    target.pointCount = nodeCount1 * nodeCount2;
    var pos = 0;
    var buffer1 = new Uint32Array(arr1);
    for (var i = 0; i < nodeCount2; i++, pos += 2 * edgeCount1) {
        target.array.set(buffer1, pos);
        arrayUtils_1.incArray(buffer1, nodeCount1);
    }
    var buffer2 = new Uint32Array(arr2);
    arrayUtils_1.timesArray(nodeCount1, buffer2);
    for (var i = 0; i < nodeCount1; i++, pos += 2 * edgeCount2) {
        target.array.set(buffer2, pos);
        arrayUtils_1.incArray(buffer2, 1);
    }
}
;
function cartesianGraphProd(src, target) {
    var accum = {
        array: new Uint32Array(0),
        pointCount: 1,
        length: 0
    };
    for (var i = 0; i < src.length; i++)
        cartesianGraphProd2([accum, src[i]], accum);
    glUtils_1.resizeBuffer(target, accum.length);
    target.array.set(accum.array);
    target.pointCount = accum.pointCount;
}
exports.cartesianGraphProd = cartesianGraphProd;
;
function makeFaces2(src, target) {
    var arr1 = src[0].array, edgeCount1 = src[0].length / 2, nodeCount1 = src[0].pointCount, arr2 = src[1].array, edgeCount2 = src[1].length / 2, nodeCount2 = src[1].pointCount;
    glUtils_1.resizeBuffer(target, edgeCount1 * edgeCount2 * 2 * 3);
    var targArray = target.array;
    target.pointCount = nodeCount1 * nodeCount2;
    var pos = 0;
    var buffer1 = new Uint32Array(arr1);
    for (var i = 0; i < edgeCount1; i++) {
        for (var j = 0; j < edgeCount2; j++) {
            var e1from = arr1[2 * i];
            var e1to = arr1[2 * i + 1];
            var e2from = arr2[2 * j];
            var e2to = arr2[2 * j + 1];
            targArray[pos] = e1from + e2from * nodeCount1;
            targArray[pos + 1] = e1from + e2to * nodeCount1;
            targArray[pos + 2] = e1to + e2to * nodeCount1;
            pos += 3;
            targArray[pos] = e1from + e2from * nodeCount1;
            targArray[pos + 1] = e1to + e2to * nodeCount1;
            targArray[pos + 2] = e1to + e2from * nodeCount1;
            pos += 3;
        }
    }
}
function makeFaces(src, target) {
    var nonEmpty = src.filter(function (src) { return src.length !== 0; });
    if (nonEmpty.length !== 2) {
        glUtils_1.resizeBuffer(target, 0);
        return;
    }
    var leftStretch = src.slice(0, src.indexOf(nonEmpty[0]))
        .reduce(function (pv, cv) { return pv * cv.pointCount; }, 1);
    var midStretch = src.slice(src.indexOf(nonEmpty[0]) + 1, src.indexOf(nonEmpty[1]))
        .reduce(function (pv, cv) { return pv * cv.pointCount; }, 1);
    var rightStretch = src.slice(src.indexOf(nonEmpty[1]) + 1)
        .reduce(function (pv, cv) { return pv * cv.pointCount; }, 1);
    var accum = {
        array: new Uint32Array(0),
        pointCount: leftStretch,
        length: 0
    };
    var edgeCount1 = nonEmpty[0].length / 2;
    var nodeCount1 = nonEmpty[0].pointCount;
    var buffer = new Uint32Array(nonEmpty[0].array);
    glUtils_1.resizeBuffer(accum, edgeCount1 * leftStretch * 2);
    accum.pointCount = leftStretch * nodeCount1;
    arrayUtils_1.timesArray(leftStretch, buffer);
    for (var i = 0, pos = 0; i < leftStretch; i++, pos += 2 * edgeCount1) {
        accum.array.set(buffer, pos);
        arrayUtils_1.incArray(buffer, 1);
    }
    edgeCount1 = accum.length / 2;
    nodeCount1 = accum.pointCount;
    buffer = new Uint32Array(accum.array);
    glUtils_1.resizeBuffer(accum, edgeCount1 * midStretch * 2);
    accum.pointCount = midStretch * nodeCount1;
    for (var i = 0, pos = 0; i < midStretch; i++, pos += 2 * edgeCount1) {
        accum.array.set(buffer, pos);
        arrayUtils_1.incArray(buffer, nodeCount1);
    }
    makeFaces2([accum, nonEmpty[1]], accum);
    if (rightStretch !== 1) {
        var rightPad = {
            array: new Uint32Array(0),
            pointCount: rightStretch,
            length: 0
        };
        cartesianGraphProd([accum, rightPad], accum);
    }
    glUtils_1.resizeBuffer(target, accum.length);
    target.array.set(accum.array);
    target.pointCount = accum.pointCount;
}
exports.makeFaces = makeFaces;
;
