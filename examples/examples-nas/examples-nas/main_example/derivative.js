(function() {
	function get_track(centr, coord) {
		var track;
		if (coord < 0) {
			if(centr < 0) {
    			return Math.abs(coord)- Math.abs(centr);
            }
            return Math.abs(coord)+ Math.abs(centr);
		} else {
			if(centr < 0) {
    			return Math.abs(coord)+ Math.abs(centr);
			} else {
    			return Math.abs(coord)- Math.abs(centr);
            }
		}
	}

    function setColor(threeObj, r, g, b) {
        threeObj.material.color.r = r / 255;
        threeObj.material.color.g = g / 255;
        threeObj.material.color.b = b / 255;
    }


    // UI binding

    var panelMainDiv = document.getElementById('plot3d_main');
	panelMainDiv.addEventListener('mouseover', eulerface.lockScroll);
	panelMainDiv.addEventListener('mouseout', eulerface.unlockScroll);

	document.getElementById('m_blue').addEventListener('change', updateProblem);
	document.getElementById('m_green').addEventListener('change', updateProblem);
	document.getElementById('sl_b').addEventListener('change', updateProblem);
	document.getElementById('sl_g').addEventListener('change', updateProblem);

	grafar.ui([
    	{type: 'checkbox', id: 'animation', bind: animate},
    	{type: 'label', init: 'Анимация'},
    	{type: 'br'}
	], {container: 'options'});


    // Grafar object declaration

	var pan3d_main = new grafar.Panel(document.getElementById('plot3d_main'));
	var obj_1 = new grafar.Object().pin(pan3d_main),
    	c_1 = new grafar.Object().pin(pan3d_main),
    	obj_2 = new grafar.Object().pin(pan3d_main),
    	c_2 = new grafar.Object().pin(pan3d_main),
    	line = new grafar.Object().pin(pan3d_main),
    	centr = new grafar.Object().pin(pan3d_main);

	var cond_graf = [],
    	obj_1_mass_x = [],
    	obj_1_mass_y = [],
	maxLambda = 20;
	for (var i = 0; i < maxLambda; i++) {
		cond_graf.push(new grafar.Object().pin(pan3d_main));
		cond_graf[i].hide(true);
	}

	pan3d_main.camera.position.set(-8, 15, 10);
	pan3d_main.setAxes(['x', 'y', 'z']);


	var r_1,
        r_2,
        obj_1_x,
        obj_2_x,
        m_1,
        m_2,
        С;

	// массив для анимации
	var obj = [];
	for (var i = 0; i < 10; i++) {
    	obj.push(new grafar.Object().pin(pan3d_main));
    }

	updateProblem();

	function updateProblem() {
		var m_1 = parseFloat(document.getElementById('m_blue').value),
    		m_2 = parseFloat(document.getElementById('m_green').value);

		var obj_1_x = parseFloat(document.getElementById('sl_b').value),
    		obj_2_x = parseFloat(document.getElementById('sl_g').value);

		r_1 = Math.pow(m_1 / 12, 1 / 3);
		r_2 = Math.pow(m_2 / 12, 1 / 3);
        C = (m_1 * obj_1_x + m_2 * obj_2_x) / (m_1 + m_2);

		document.getElementById('res').disabled = true;
		document.getElementById('res').value =  (1 / Math.abs(m_1) + 1 / Math.abs(m_2)).toFixed(2);
		document.getElementById('cent').disabled = true;
		document.getElementById('cent').value =  C;

		// Resetting animated panel
		for (var i = 0; i < cond_graf.length; i++) {
			cond_graf[i].reset().hide(true);
		}

		// Первый шарик
		obj_1.reset()
            .constrain({ what: 'phi', maxlen: 25, as: grafar.seq( 0, 2*Math.PI, 'phi') })
    		.constrain({ what: 'theta', maxlen: 25, as: grafar.seq( 0, Math.PI , 'theta') })
    		.constrain({ what: 'x, y, z', using: 'phi ,theta', as: function(data, l) {
				var  phi = data.phi, theta = data.theta;
				for (var i = 0; i < l; i++) {
					data.x[i] =  obj_1_x + r_1* Math.sin(theta[i])*Math.cos(phi[i]);
					data.y[i] = r_1 * Math.sin(theta[i])*Math.sin(phi[i]);
					data.z[i] = r_1 * Math.cos(theta[i]);
				}
			} })
    		.colorize({ using: '', as: grafar.Style.constantColor(0 / 255, 140 / 255, 240 / 255) })
    		.refresh();

		c_1.constrain({what: 'x, y, z', maxlen: 1, as: function(data, l) {
				var x = data.x,
                    y = data.y,
                    z = data.z;
				for (var i = 0; i < l; i++) {
					x[i] = obj_1_x;
					y[i] = 0;
					z[i] = 0;
				}
			}})
            .refresh();

		c_1.glinstances[0].object.children[0].visible = true;
		c_1.glinstances[0].object.children[1].visible = false;
		c_1.glinstances[0].object.children[0].material.transparent = false;
		c_1.glinstances[0].object.children[0].material.size = 20;
		setColor(c_1.glinstances[0].object.children[0], 0, 128, 0);

		// Второй шарик
		obj_2.reset()
    		.constrain({ what: 'phi', maxlen: 25, as: grafar.seq( 0, 2 * Math.PI, 'phi') })
    		.constrain({ what: 'theta', maxlen: 25, as: grafar.seq( 0, Math.PI , 'theta') })
    		.constrain({ what: 'x, y, z', using: 'phi ,theta', as: function(data, l) {
				var  phi = data.phi, theta = data.theta;
				for (var i = 0; i < l; i++) {
					data.x[i] = obj_2_x + r_2 * Math.sin(theta[i])*Math.cos(phi[i]);
					data.y[i] =  r_2 * Math.sin(theta[i])*Math.sin(phi[i]);
					data.z[i] = r_2 * Math.cos(theta[i]);
				}
			} })
    		.colorize({ using: '', as: grafar.Style.constantColor(168/255, 228/255, 160/255) })
    		.refresh();

		c_2.constrain({ what: 'x, y, z', maxlen: 1, as: function(data, l) {
				var x = data.x, y = data.y , z = data.z;
				for (var i = 0; i < l; i++) {
					x[i] = obj_2_x;
					y[i] = 0;
					z[i] = 0;
				}
			} })
            .refresh();

		c_2.glinstances[0].object.children[0].visible = true;
		c_2.glinstances[0].object.children[1].visible = false;
		c_2.glinstances[0].object.children[0].material.transparent = false;
		c_2.glinstances[0].object.children[0].material.size = 20;
		setColor(c_2.glinstances[0].object.children[0], 0, 128, 0);

		// Ось
		line.reset()
    		.constrain({what: 'x', maxlen: 100, as: grafar.seq(-10, 10, 'x')})
    		.constrain({what: 'y,z', using: 'x', as: function(data, l) {
				var x = data.x;
				for (var i = 0; i < l; i++) {
					data.y[i]= 0 ;
					data.z[i] = 0;
				}
			}})
    		.refresh();

		line.glinstances[0].object.children[0].visible = true;
		line.glinstances[0].object.children[0].material.size = 2;
		setColor(line.glinstances[0].object.children[0], 225, 115, 5);
		line.glinstances[0].object.children[0].material.transparent = false;

		// Центр масс
		centr.reset()
            .constrain({what: 'x, y, z', maxlen: 1, as: function(data, l) {
				var x = data.x, y = data.y, z = data.z;
				x[0] = C;
				y[0] = 0;
				z[0] = 0;
			}})
    		.refresh();

		centr.glinstances[0].object.children[0].visible = true;
		centr.glinstances[0].object.children[1].visible = false;
		centr.glinstances[0].object.children[0].material.transparent = false;
		centr.glinstances[0].object.children[0].material.size = 10;
		setColor(centr.glinstances[0].object.children[0], 225, 115, 5);
	}

    function prepareAnimation() {
    	obj_1_x = parseFloat(document.getElementById('sl_b').value);
    	obj_2_x = parseFloat(document.getElementById('sl_g').value);

    	m_1 = parseFloat(document.getElementById('m_blue').value);
    	m_2 = parseFloat(document.getElementById('m_green').value);

    	C = (m_1 * obj_1_x + m_2 * obj_2_x) / (m_1 + m_2);

    	maxLam = 10;

    	for (var i = 0; i < maxLam; i++) {
            var deg = i * 360 / maxLam * 0.0174533;
            var track = get_track(C, obj_1_x);
    		obj_1_mass_x.push(C + track * Math.cos(deg));
    		obj_1_mass_y.push(track * Math.sin(deg));
    	}

    	var animationState = {
    		isActive: false,
    		j: 1,
    		frame: function() {
    			obj_1.reset()
    				.constrain({what: 'phi', maxlen: 25, as: grafar.seq( 0, 2*Math.PI, 'phi')})
    				.constrain({what: 'theta', maxlen: 25, as: grafar.seq( 0, Math.PI , 'theta')})
    				.constrain({what: 'x, y, z', using: 'phi ,theta', as: function(data, l) {
    					var r = data.r, phi = data.phi, theta = data.theta;
    					for (var i = 0; i < l; i++) {
    						data.x[i] = obj_1_mass_x[animationState.j] + r_1 * Math.sin(theta[i])*Math.cos(phi[i]);
    						data.y[i] = obj_1_mass_y[animationState.j] + r_1 * Math.sin(theta[i])*Math.sin(phi[i]);
    						data.z[i] = r_1 * Math.cos(theta[i]);
    					}
    				}})
    				.colorize({using: '', as: grafar.Style.constantColor(0/255,140/255, 240/255)})
    				.refresh();
    			if (animationState.isActive) {
    				setTimeout(animationState.frame, 200);    // скорость здесь
    			}
    			animationState.j = (animationState.j + 1) % maxLam;
    		}
    	};

    	return animationState;
    }

    var animationControl = prepareAnimation();

    function animate() {
    	if (animationControl.isActive) {
    		animationControl.isActive = false;
    	} else {
    		animationControl.j = 1;
    		animationControl.isActive = true;
    		animationControl.frame();
    	}
    }

	MathJax.Hub.Queue(['Typeset', MathJax.Hub]);
}());
