'use strict';
	
(function(global) {
	var _G = global.grafar;
    var Reactive = _G.Reactive;
	
	
	function Graph() {
        Reactive.call(this);
	};
    
    Graph.prototype = Reactive;
    
    
	_G.GraphR = Graph;
}(this));