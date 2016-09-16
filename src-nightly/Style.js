"use strict";
var THREE = require('../libs/three.min');
var Color = window.Color;
var utils_1 = require('./utils');
var config_1 = require('./config');
var styles = {};
var Style = (function () {
    function Style(init) {
        this.alpha = null;
        this.start = null;
        this.end = null;
        this.points = null;
        this.radius = null;
        this.lines = null;
        this.palette = [];
        this.colors = {};
        this.materials = {};
        init = init || {};
        this.id = init.id || utils_1.makeID(styles);
        styles[this.id] = this;
        this.update(init);
        this.samplePalette(init.paletteSize);
        return this;
    }
    Style.randColor = function () {
        var rgb = Color.convert({
            l: 60,
            a: -100 + Math.floor(200 * Math.random()),
            b: -100 + Math.floor(200 * Math.random())
        }, 'rgb');
        return new THREE.Color('rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')');
    };
    Style.constantColor = function (r, g, b) {
        return function (color, data, l) {
            for (var i = 0; i < l; i++) {
                color[i * 3] = r;
                color[i * 3 + 1] = g;
                color[i * 3 + 2] = b;
            }
        };
    };
    Style.matHelper = function (type, col) {
        console.log('style.matHelper');
        if (!utils_1.isExisty(col))
            col = Style.randColor();
        if (type === 'point')
            return new THREE.PointCloudMaterial({
                size: config_1.config.particleRadius,
                transparent: true,
                opacity: 0.5,
                sizeAttenuation: false,
                vertexColors: THREE.VertexColors
            });
        else if (type === 'line')
            return new THREE.LineBasicMaterial({
                vertexColors: THREE.VertexColors
            });
        else if (type === 'mesh')
            return new THREE.MeshLambertMaterial({
                side: THREE.DoubleSide,
                transparent: true,
                opacity: .5,
                depthWrite: false,
                vertexColors: THREE.VertexColors
            });
    };
    Style.prototype.update = function (styleChanges) {
        var _this = this;
        Object.getOwnPropertyNames(styleChanges || {})
            .filter(function (name) { return _this.hasOwnProperty(name); })
            .forEach(function (name) { _this[name] = styleChanges[name]; });
        return this;
    };
    return Style;
}());
exports.Style = Style;
