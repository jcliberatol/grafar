"use strict";
var _T = require('../libs/three.min');
var arrayPool_1 = require('./arrayPool');
var config_1 = require('./config');
var Object3D = _T.Object3D;
var PointCloud = _T.PointCloud;
var Line = _T.Line;
var LinePieces = _T.LinePieces;
var BufferGeometry = _T.BufferGeometry;
var BufferAttribute = _T.BufferAttribute;
var PointCloudMaterial = _T.PointCloudMaterial;
var LineBasicMaterial = _T.LineBasicMaterial;
var MeshLambertMaterial = _T.MeshLambertMaterial;
var MeshPhongMaterial = _T.MeshPhongMaterial;
var DoubleSide = _T.DoubleSide;
function interleave(tab, buffer, itemsize) {
    itemsize = itemsize || tab.length;
    resizeBuffer(buffer, itemsize * tab[0].length);
    var target = buffer.array;
    var j;
    for (j = 0; j < tab.length; j++) {
        var colData = tab[j].array;
        var len = tab[j].length;
        for (var i = 0, k = j; i < len; i++, k += itemsize) {
            target[k] = colData[i];
        }
    }
    for (j = tab.length; j < itemsize; j++) {
        for (var i = 0, k = j; i < len; i++, k += itemsize) {
            target[k] = 0;
        }
    }
    buffer.needsUpdate = true;
}
exports.interleave = interleave;
function resizeBuffer(buffer, size) {
    var type = buffer.array.constructor;
    if (size !== buffer.array.length) {
        arrayPool_1.pool.push(buffer.array);
        buffer.array = arrayPool_1.pool.get(type, size);
        if (buffer.hasOwnProperty('length')) {
            buffer.length = size;
        }
    }
}
exports.resizeBuffer = resizeBuffer;
;
function InstanceGL(panel, col) {
    var pointGeometry = new BufferGeometry();
    var lineGeometry = new BufferGeometry();
    var meshGeometry = new BufferGeometry();
    var position = new BufferAttribute(arrayPool_1.pool.get(Float32Array, 0), 3);
    var lineIndex = new BufferAttribute(arrayPool_1.pool.get(Uint32Array, 0), 2);
    var meshIndex = new BufferAttribute(arrayPool_1.pool.get(Uint32Array, 0), 3);
    var normal = new BufferAttribute(arrayPool_1.pool.get(Float32Array, 0), 3);
    var color = new BufferAttribute(arrayPool_1.pool.get(Float32Array, 0), 3);
    pointGeometry.addAttribute('position', position);
    lineGeometry.addAttribute('position', position);
    meshGeometry.addAttribute('position', position);
    lineGeometry.addAttribute('index', lineIndex);
    meshGeometry.addAttribute('index', meshIndex);
    meshGeometry.addAttribute('normal', normal);
    pointGeometry.addAttribute('color', color);
    lineGeometry.addAttribute('color', color);
    meshGeometry.addAttribute('color', color);
    var object = new Object3D();
    object.add(new PointCloud(pointGeometry, matHelper('point', col)))
        .add(new Line(lineGeometry, matHelper('line', col), LinePieces))
        .add(new _T.Mesh(meshGeometry, matHelper('mesh', col)));
    panel.scene.add(object);
    this.panel = panel;
    this.position = position;
    this.color = color;
    this.segments = lineIndex;
    this.faces = meshIndex;
    this.normals = normal;
    this.object = object;
}
exports.InstanceGL = InstanceGL;
;
function matHelper(type, col) {
    if (type === 'point') {
        return new PointCloudMaterial({
            size: config_1.config.particleRadius,
            transparent: true,
            opacity: 0.5,
            sizeAttenuation: false
        });
    }
    if (type === 'line') {
        return new LineBasicMaterial({
            vertexColors: _T.VertexColors
        });
    }
    if (type === 'mesh') {
        return new MeshPhongMaterial({
            side: DoubleSide,
            transparent: true,
            opacity: .7,
            vertexColors: _T.VertexColors,
            normalScale: new _T.Vector2(1, 1)
        });
    }
}
;
