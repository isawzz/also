//#region sudoku tests
function suTest00(){
	let [rows, cols] = [4, 4];
	let pattern = getSudokuPattern(rows, cols);
	printMatrix(pattern, 'pattern');
	let colarrs = bGetCols(pattern); printMatrix(colarrs, 'transposed');
	let rowarrs = bGetCols(colarrs); printMatrix(rowarrs, 'normal');
	let cFlat = arrFlatten(rowarrs);
	//console.log(cFlat);
	let aRows = bGetRows(pattern);
	let rFlat = arrFlatten(aRows);
	console.assert(sameList(cFlat, rFlat), 'TRANSPOSE DOES NOT WORK!!!!!!!!!!!!!!!')

	let correct = checkSudokuRule(pattern);

}


//#region iconViewer tests
async function iPrepper(){
	//wie macht man eine pic?
	symbolDict = Syms = await localOrRoute('syms', '../assets/allSyms.yaml');
	SymKeys = Object.keys(Syms);
	initTable();
}
async function iTest00(){
	await iPrepper();
	let keys = SymKeys;
	let k=chooseRandom(keys);
	let item = miPic(k,dTable,{w:100,h:100,fz:80,bg:'blue'});
}

//#region graph tests

//simple graph
function gTest13() {
	let g = createSampleHex1(3, 2, 100, 100); let ids = g.getNodeIds(); let id = ids[0]; g.showExtent();

	//get the center of first node
	let center=g.getProp(id,'center');//jetzt geht es weil ich bei hex1Board die center prop in jedem node abspeichere!!!
	console.log('center prop',center);
	center = g.posDict['preset'][id];//ja das geht
	console.log('center',center);

	//get size of first node
	let size = g.getSize(id); // das returned eigentlich die bounding box! hab auch x1,y1,x2,y2
	console.log('size',size);



	//get pt in north:
	let pN={x:center.x,y:size.y1}; //falsch!
	let node = g.getNode(id);
	let b=node.renderedBoundingBox();
	pN={x:b.x1+b.w/2,y:b.y1};


	//create a node there!
	let nNew = g.addNode({width:25,height:25},pN);
	console.log('new node',nNew);
	let n1=g.getNode(nNew);
	n1.css('background-color','blue');
	let st={bg:'red',shape:'ellipse',w:25,h:25};
	let st1=mStyleToCy(st);
	n1.css(st1);



}

function gTest12() {
	let g = createSampleHex1(21, 11); let ids = g.getNodeIds(); let id = ids[0];

	g.showExtent();
}
function createSampleHex1(rows = 5, topcols = 3, w = 50, h = 50) {
	initTable();
	let styles = {
		outer: { bg: 'pink', padding: 25 },
		inner: { w: 500, h: 400 },
		node: { bg: 'pink', shape: 'hex', w: w, h: h },
		edge: { bg: 'white' }
	};
	let g = hex1Board(dTable, rows, topcols, styles);
	g.addLayoutControls();
	return g;
}
function gTest11() {
	let g = createSampleHex1();
	let ids = g.getNodeIds();
	let id = ids[0];
	console.log('size', g.getSize(id), g.cy.getElementById(id).bb());
	let n = g.cy.getElementById(id);
	n.css({ width: '40px', height: '40px' });
	g.zoom(false);
	let bb = g.cy.elements().bb();
	console.log('gesamt graph braucht:', bb)
}
function gTest10() {
	initTable();
	let [rows, topcols, w, h] = [7, 10, 50, 50];
	let styles = {
		outer: { bg: 'pink', padding: 25 },
		inner: { w: 500, h: 400 },
		node: { bg: 'pink', shape: 'hex', w: w, h: h },
		edge: { bg: 'green' }
	};
	let g = hex1Board(dTable, rows, topcols, styles);
}
function gTest09() {
	initTable();
	let [w, h] = [50, 50];
	let styles = {
		outer: { bg: 'pink', padding: 25 },
		inner: { w: 500, h: 400 },
		node: { bg: 'pink', shape: 'hex', w: w, h: h },
		edge: { bg: 'green' }
	};
	let g = new UIGraph(dTable, styles);
	let [rows, topcols] = [5, 3];
	let total = hex1Count(rows, topcols);
	console.log('for rows', rows, 'and cols', topcols, 'need', total, 'nodes')
	let nids = g.addNodes(total);
	g.hex1(rows, topcols, w + 4, h + 4);
	let indices = hex1Indices(rows, topcols);
	console.log('indices', indices);
	//correct, jetzt soll jeder node die bekommen!
	let ids = g.getNodeIds();
	console.log('node ids:', ids);
	//return;
	let di = {};
	for (let i = 0; i < ids.length; i++) {
		let [row, col] = [indices[i].row, indices[i].col];
		let id = ids[i];
		lookupSet(di, [row, col], id);
		g.setProp(id, 'row', row);
		g.setProp(id, 'col', col);
		g.setProp(id, 'label', `${row},${col}`);
		//g.setStyle(id, 'label', 'data(label)');
	}
	let labels = g.getNodes().map(x => x.data().label);
	console.log('labels', labels);
	let label = g.cy.getElementById(ids[1]).data('label');

	for (let i = 0; i < ids.length; i++) {
		let [row, col] = [indices[i].row, indices[i].col];
		let id = ids[i];
		let nid2 = lookup(di, [row, col + 2]); if (nid2) g.addEdge(id, nid2);
		nid2 = lookup(di, [row + 1, col - 1]); if (nid2) g.addEdge(id, nid2);
		nid2 = lookup(di, [row + 1, col + 1]); if (nid2) g.addEdge(id, nid2);
	}

	let deg = g.getDegree(ids[1]); //cy.getElementById(ids[1]).data('label');
	let deg1 = g.getDegree(ids[10]); //cy.getElementById(ids[1]).data('label');
	let deg2 = g.getDegree(ids[18]); //cy.getElementById(ids[1]).data('label');
	console.log('das geht: label', label, deg, deg1, deg2);

}
function gTest08() {
	initTable();
	let styles = {
		outer: { bg: 'pink', padding: 25 },
		inner: { w: 500, h: 400 },
		node: { bg: 'pink', shape: 'hex' },
		edge: { bg: 'green' }
	};
	let g = new UIGraph(dTable, styles);
	let nids = g.addNodes(10);
	let eids = g.addEdges(10);
	g.cose();
	g.addLayoutControls();
	let nodes = g.getNodes();
	console.log('nodes', nodes[0]);
	g.mStyle(nodes[0], { shape: 'ellipse', bg: 'black' });
}
function gTest07() {
	initTable();

	//let hexPoints = [{ x: 0, y: -1 }, { x: 1, y: -0.5 }, { x: 1, y: 0.5 }, { x: 0, y: 1 }, { x: -1, y: 0.5 }, { x: -1, y: -0.5 }]
	let hexPoints = [0, -1, 1, -0.5, 1, 0.5, 0, 1, -1, 0.5, -1, -0.5];

	let styles = {
		outer: { bg: 'pink', padding: 25 },
		inner: { w: 500, h: 400 },
		node: { bg: 'pink', shape: 'hex' },
		edge: { bg: 'blue' }
		// node: { shape: 'polygon', 'shape-polygon-points': hexPoints, w: 90, h: 100, bg: 'black', fg: 'red', fz: 40 },
		//'node.field':  { shape: 'polygon', 'shape-polygon-points': hexPoints, w: 90, h: 100, bg: 'black', fg: 'red', fz: 40 },
		// 'node.city':  { shape: 'circle', w: 25, h: 25, bg: 'violet', fg: 'white', fz: 40 },

	};

	let g = new UIGraph(dTable, styles);
	let cy = g.cy;
	//cy.style({ selector: 'h1', style: { 'background-color': 'grey' } });

	//let nids = g.addNodes(7);nids.map(x=>x.class('field'))
	let nids = g.addNodes(10);
	let eids = g.addEdges(10);

	let node = g.getNodes()[0];
	node.addClass('high');

	g.cose();
	//g.nodeEvent('click', x => { x.addClass('high'); }); //let id = x.id(); console.log('clicked ' + id); g.mStyle(id, { bg: 'yellow', fg: 'blue' }); });

	cy.style().selector('node.field').style('color', 'black');
	cy.style().selector('node.city').style('shape', 'hexagon');



	let node1 = g.getNodes()[1];
	node.addClass('city');
	node1.addClass('field');
}
function gTest06() {
	initTable();

	//let hexPoints = [{ x: 0, y: -1 }, { x: 1, y: -0.5 }, { x: 1, y: 0.5 }, { x: 0, y: 1 }, { x: -1, y: 0.5 }, { x: -1, y: -0.5 }]
	let hexPoints = [0, -1, 1, -0.5, 1, 0.5, 0, 1, -1, 0.5, -1, -0.5];

	let styles = {
		outer: { bg: 'pink', padding: 25 },
		inner: { w: 500, h: 400 },
		node: { bg: 'pink' },
		edge: { bg: 'blue' }
		// node: { shape: 'polygon', 'shape-polygon-points': hexPoints, w: 90, h: 100, bg: 'black', fg: 'red', fz: 40 },
		//'node.field':  { shape: 'polygon', 'shape-polygon-points': hexPoints, w: 90, h: 100, bg: 'black', fg: 'red', fz: 40 },
		// 'node.city':  { shape: 'circle', w: 25, h: 25, bg: 'violet', fg: 'white', fz: 40 },

	};

	let g = new UIGraph(dTable, styles);
	let cy = g.cy;
	//cy.style({ selector: 'h1', style: { 'background-color': 'grey' } });

	//let nids = g.addNodes(7);nids.map(x=>x.class('field'))
	let nids = g.addNodes(10);
	let eids = g.addEdges(10);

	let node = g.getNodes()[0];
	node.addClass('high');

	g.cose();
	//g.nodeEvent('click', x => { x.addClass('high'); }); //let id = x.id(); console.log('clicked ' + id); g.mStyle(id, { bg: 'yellow', fg: 'blue' }); });

	cy.style().selector('node.field').style('color', 'black');
	cy.style().selector('node.city').style('shape', 'hexagon');

	let node1 = g.getNodes()[1];
	node.addClass('city');
	node1.addClass('field');
}
function gTest05() {
	initTable();

	//let hexPoints = [{ x: 0, y: -1 }, { x: 1, y: -0.5 }, { x: 1, y: 0.5 }, { x: 0, y: 1 }, { x: -1, y: 0.5 }, { x: -1, y: -0.5 }]
	let hexPoints = [0, -1, 1, -0.5, 1, 0.5, 0, 1, -1, 0.5, -1, -0.5];

	let styles = {
		outer: { bg: 'pink', padding: 25 },
		inner: { w: 500, h: 400 },
		node: { shape: 'polygon', 'shape-polygon-points': hexPoints, w: 90, h: 100, bg: 'black', fg: 'red', fz: 40 }
	};

	let g = new UIGraph(dTable, styles);
	let nids = g.addNodes(7);
	//let eids = g.addEdges(15);
	console.log('g', g.getNodeIds(), g.getEdgeIds());
	//g should be of item form! dh hat id und iDiv!
	g.hex1(3, 2, styles.node.w + 2, styles.node.h + 2);
	g.addLayoutControls();
	g.disableDD(); //cool!!!!
	g.nodeEvent('click', x => { let id = x.id(); console.log('clicked ' + id); g.mStyle(id, { bg: 'yellow', fg: 'blue' }); });
}
//#endregion

//#region old code!
function gTest04() {
	initTable();
	let d = mDiv(dTable, { w: 500, h: 360, bg: 'blue', align: 'left' });
	let g = new AbsGraph1(d);
	g.addVisual(d);
	let nids = g.addNodes(10);
	let eids = g.addEdges(15);
	console.log('g', g.getNodeIds(), g.getEdgeIds());
	g.cose();
	g.addLayoutControls(d);
}
function gTest03() {
	initTable();
	let d = mDiv(dTable, { w: 500, h: 360, bg: 'blue', align: 'left' });
	let g = new AbsGraph1(d);
	upgradeToSimpleGraph(g, d); //g.addVisual(d);
	let nids = g.addNodes(10);
	let eids = g.addEdges(15);
	console.log('g', g.getNodeIds(), g.getEdgeIds());
	g.cose();
	g.addLayoutControls();
}
//#region nur fuer gTest02 gebraucht!
function upgradeToSimpleGraph(g, dParent, styles = {}) {
	g.id = nundef(dParent.id) ? getUID() : dParent.id;
	// mIfNotRelative(dParent);

	let styleDict = {
		node: { 'width': 25, 'height': 25, 'background-color': 'red', "color": "#fff", 'label': 'data(id)', "text-valign": "center", "text-halign": "center", },
		edge: { 'width': 2, 'line-color': 'silver', 'curve-style': 'haystack', },
		'node.highlight': { 'background-color': 'yellow' },
		'node.trans': { 'opacity': '0.5' },
	}
	for (const ks of ['node', 'edge', 'node.highlight', 'node.trans']) {
		if (isdef(styles[ks])) {
			for (const k in styles[ks]) {
				let [prop, val] = translateToCssStyle(k, styles[ks][k], false);
				styleDict[ks][prop] = val;
			}
		}
	}
	let cyStyle = [];
	for (const k in styleDict) { cyStyle.push({ selector: k, style: styleDict[k] }); }

	//let d1=
	let size = getSize(dParent);
	let d1 = mDiv(dParent, { position: 'relative', bg: 'green', w: size.w - 80, left: 40, top: 0, h: size.h, align: 'left' });
	// console.log('size',size)
	// let dCy = mDiv(dParent, { position: 'absolute', left: 40, top: 0, w: 'calc( 100% - 80px )', h: '100%' });
	// let dCy = mDiv(dParent, {display:'inline-block', position: 'absolute', left: 40, top: 0, w: size.w-80, h: size.h });
	g.cy.mount(d1);
	g.cy.style(cyStyle);
	// console.log('extent',g.cy.extent());
	g.enablePanZoom();
	iAdd(g, { div: dParent, dCy: d1 });
}
class AbsGraph1 {
	constructor() {
		let defOptions = {
			maxZoom: 1,
			minZoom: .001,
			motionBlur: false,
			wheelSensitivity: 0.05,
			zoomingEnabled: false,
			userZoomingEnabled: false,
			panningEnabled: false,
			userPanningEnabled: false,
			boxSelectionEnabled: false,
			layout: { name: 'preset' },
			elements: [],
		};

		this.cy = cytoscape(defOptions);
	}
	clear() { this.cy.destroy(); }
	//#region access and algos
	getComponents() { return this.cy.elements().components(); }
	getComponentIds() { return this.cy.elements().components().map(x => x.id()); }
	getCommonEdgeId(nid1, nid2) { return nid1 + '_' + nid2; }
	getNumComponents() { return this.cy.elements().components().length; }
	getNode(id) { return this.cy.getElementById(id); }
	getNodes() { return this.cy.nodes(); }
	getNodeIds() { return this.cy.nodes().map(x => x.id()); }
	getNodeData() { return this.cy.nodes().map(x => x.data()); }
	getNodePositions() { return this.cy.nodes.map(x => x.position()); }
	getEdges() { return this.cy.edges(); }
	getEdgeIds() { return this.cy.edges().map(x => x.id()); }
	getPosition(id) {
		let node = this.getNode(id);
		let pos = node.renderedPosition();
		//console.log('node', node, pos);
		return pos; //this.cy.getElementById(id).renderedPosition();
	}
	setPosition(id, x, y) { this.cy.getElementById(id).position({ x: x, y: y }); }

	setProp(id, prop, val) { this.cy.getElementById(id).data()[prop] = val; }

	getProp(id, prop) { return this.cy.getElementById(id).data()[prop]; }
	getDegree(id) { return this.cy.nodes('#' + id).degree(); }
	getNodeWithMaxDegree(idlist) {
		if (nundef(idlist)) idlist = this.cy.elements().filter('node').map(x => x.data().id);
		let imax = arrMinMax(idlist, x => this.getDegree(x)).imax;
		let id = idlist[imax];
		return id;
	}
	getShortestPathsFrom(id) { let res = this.cy.elements().dijkstra('#' + id); return res; }
	getShortestPathFromTo(nid1, nid2) {
		//console.log(nid1, nid2)
		let funcs = this.dijkstra = this.getShortestPathsFrom(nid1);
		// let len = funcs.distanceTo('#' + nid2);
		let path = funcs.pathTo('#' + nid2);
		return path;

	}
	getLengthOfShortestPath(nid1, nid2) {
		let funcs = this.dijkstra = this.getShortestPathsFrom(nid1);
		let len = funcs.distanceTo('#' + nid2);
		//let path = funcs.pathTo('#' + nid2);
		return len;
	}
	storeCurrentPositions(prop = 'center') {
		for (const n of this.getNodes()) {
			let id = n.id();
			//console.log('id', id);
			let pos = this.getPosition(id);
			//console.log('current pos', id, pos);
			this.setProp(id, prop, pos);
			//console.log('new val', this.getProp(id, prop));
		}
	}
	setPositionData(prop = 'center') {
		let ids = this.getNodeIds();
		for (const id of ids) {
			let pos = this.getProp(id, prop);
			if (isdef(pos)) this.setPosition(id, pos.x, pos.y);
			else return false;
		}
		return true;
	}
	sortNodesByDegree(idlist, descending = true) {
		//console.log('idlist',idlist)
		if (nundef(idlist)) idlist = this.cy.nodes.map(x => x.data().id);
		// if (nundef(idlist)) idlist = this.cy.elements().filter('node').map(x => x.data().id);
		let nodes = idlist.map(x => this.getNode(x));
		for (const n of nodes) {
			n.degree = this.getDegree(n.id());
			//console.log('id',n.id(),'has degree',n.degree);
		}
		if (descending) sortByDescending(nodes, 'degree'); else sortBy(nodes, 'degree');
		return nodes;
	}
	//#endregion

	//#region modify nodes, edges
	addNode(data, coords) {
		if (nundef(data)) data = {};
		if (nundef(data.id)) data.id = getFruid();
		if (isdef(coords)) {
			coords.x -= this.cy.pan().x;
			coords.y -= this.cy.pan().y;
		} else { coords = { x: 0, y: 0 }; }
		var ele = this.cy.add({
			group: 'nodes',
			data: data,
			position: coords
		});
		return ele.id();
	}
	addNodes(n, datalist, coordlist) {
		let ids = [];
		if (nundef(datalist)) datalist = new Array(n).map(x => ({ id: getFruid() }));
		if (nundef(coordlist)) coordlist = new Array(n).map(x => ({ coords: { x: 0, y: 0 } }));
		for (let i = 0; i < n; i++) {
			let id = this.addNode(datalist[i], coordlist[i]);
			ids.push(id);
		}
		return ids;
	}
	addEdge(nid1, nid2, data) {
		//console.log('addEdge',nid1,nid2,data)
		if (nundef(data)) data = {};
		data.id = this.getCommonEdgeId(nid1, nid2);

		data.source = nid1;
		data.target = nid2;
		var ele = this.cy.add({
			group: 'edges',
			data: data,
		});
		return ele.id();
	}
	addEdges(nOrNodePairList) {
		//nodePairList should be of the form: [[nid1,nid2], ...]
		if (isNumber(nOrNodePairList)) {
			//make n random nodes!
			let nids = this.getNodeIds();
			let prod = arrPairs(nids);
			nOrNodePairList = choose(prod, nOrNodePairList);
		}
		let res = [];
		for (const pair of nOrNodePairList) {
			res.push(this.addEdge(pair[0], pair[1]));
		}
		return res;
	}
	removeNode(node) { this.removeElement(node); return this.getNodeIds(); }
	removeEdge(edge) { this.removeElement(edge); return this.getEdgeIds(); }
	removeElement(ne) { if (!isString(ne)) ne = ne.id(); this.cy.getElementById(ne).remove(); }
	//#endregion

	//#region layouts
	breadthfirst() { this.cy.layout({ name: 'breadthfirst', animate: true }).run(); }
	circle() { this.cy.layout({ name: 'circle', animate: 'end' }).run(); }
	concentric() { this.cy.layout({ name: 'concentric', animate: true }).run(); }
	//cola() { this.cy.layout({ name: 'cola', animate: 'end' }).run(); }
	comcola() {
		let defaults = {
			name: 'cola',
			animate: true, // whether to show the layout as it's running
			refresh: 1, // number of ticks per frame; higher is faster but more jerky
			maxSimulationTime: 4000, // max length in ms to run the layout
			ungrabifyWhileSimulating: false, // so you can't drag nodes during layout
			fit: true, // on every layout reposition of nodes, fit the viewport
			padding: 30, // padding around the simulation
			boundingBox: undefined, //{x1:0,y1:0,x2:200,y2:200,w:200,h:200}, //undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
			nodeDimensionsIncludeLabels: false, // whether labels should be included in determining the space used by a node

			// layout event callbacks
			ready: function () { }, // on layoutready
			stop: function () { }, // on layoutstop

			// positioning options
			randomize: false, // use random node positions at beginning of layout
			avoidOverlap: true, // if true, prevents overlap of node bounding boxes
			handleDisconnected: true, // if true, avoids disconnected components from overlapping
			convergenceThreshold: 0.01, // when the alpha value (system energy) falls below this value, the layout stops
			nodeSpacing: function (node) { return 10; }, // extra spacing around nodes
			flow: undefined, // use DAG/tree flow layout if specified, e.g. { axis: 'y', minSeparation: 30 }
			alignment: undefined, // relative alignment constraints on nodes, e.g. function( node ){ return { x: 0, y: 1 } }
			gapInequalities: undefined, // list of inequality constraints for the gap between the nodes, e.g. [{"axis":"y", "left":node1, "right":node2, "gap":25}]

			// different methods of specifying edge length
			// each can be a constant numerical value or a function like `function( edge ){ return 2; }`
			edgeLength: undefined, // sets edge length directly in simulation
			edgeSymDiffLength: undefined, // symmetric diff edge length in simulation
			edgeJaccardLength: undefined, // jaccard edge length in simulation

			// iterations of cola algorithm; uses default values on undefined
			unconstrIter: undefined, // unconstrained initial layout iterations
			userConstIter: undefined, // initial layout iterations with user-specified constraints
			allConstIter: undefined, // initial layout iterations with all constraints including non-overlap

			// infinite layout options
			infinite: false // overrides all other options for a forces-all-the-time mode
		};
		let options = {
			name: 'cola',
			convergenceThreshold: 100, 
			// padding: 25,
			// nodeSpacing: 5,
			// edgeLengthVal: 2,
			// animate: true,
			// randomize: false,
			// maxSimulationTime: 1500,
			// ready: this.reset.bind(this),
			// flow: null,
			boundingBox: { x1: 20, y1: 20, w: 200, h: 200 },
		};
		copyKeys(options, defaults);
		console.log(defaults.boundingBox)
		this.cy.layout(defaults).run();
	}
	cose() { this.cy.layout({ name: 'cose', animate: 'end' }).run(); }
	// dagre() { this.cy.layout({ name: 'dagre', fit: true, padding: 25, animate: 'end' }).run(); }
	euler() { this.cy.layout({ name: 'euler', fit: true, padding: 25, animate: 'end' }).run(); }
	fcose() {
		var defaultOptions = {

			// 'draft', 'default' or 'proof' 
			// - "draft" only applies spectral layout 
			// - "default" improves the quality with incremental layout (fast cooling rate)
			// - "proof" improves the quality with incremental layout (slow cooling rate) 
			quality: "default",
			// Use random node positions at beginning of layout
			// if this is set to false, then quality option must be "proof"
			randomize: true,
			// Whether or not to animate the layout
			animate: true,
			// Duration of animation in ms, if enabled
			animationDuration: 500,
			// Easing of animation, if enabled
			animationEasing: undefined,
			// Fit the viewport to the repositioned nodes
			fit: true,
			// Padding around layout
			padding: 30,
			// Whether to include labels in node dimensions. Valid in "proof" quality
			nodeDimensionsIncludeLabels: false,
			// Whether or not simple nodes (non-compound nodes) are of uniform dimensions
			uniformNodeDimensions: false,
			// Whether to pack disconnected components - cytoscape-layout-utilities extension should be registered and initialized
			packComponents: true,
			// Layout step - all, transformed, enforced, cose - for debug purpose only
			step: "all",

			/* spectral layout options */

			// False for random, true for greedy sampling
			samplingType: true,
			// Sample size to construct distance matrix
			sampleSize: 25,
			// Separation amount between nodes
			nodeSeparation: 75,
			// Power iteration tolerance
			piTol: 0.0000001,

			/* incremental layout options */

			// Node repulsion (non overlapping) multiplier
			nodeRepulsion: node => 4500,
			// Ideal edge (non nested) length
			idealEdgeLength: edge => 50,
			// Divisor to compute edge forces
			edgeElasticity: edge => 0.45,
			// Nesting factor (multiplier) to compute ideal edge length for nested edges
			nestingFactor: 0.1,
			// Maximum number of iterations to perform - this is a suggested value and might be adjusted by the algorithm as required
			numIter: 2500,
			// For enabling tiling
			tile: true,
			// Represents the amount of the vertical space to put between the zero degree members during the tiling operation(can also be a function)
			tilingPaddingVertical: 10,
			// Represents the amount of the horizontal space to put between the zero degree members during the tiling operation(can also be a function)
			tilingPaddingHorizontal: 10,
			// Gravity force (constant)
			gravity: 0.25,
			// Gravity range (constant) for compounds
			gravityRangeCompound: 1.5,
			// Gravity force (constant) for compounds
			gravityCompound: 1.0,
			// Gravity range (constant)
			gravityRange: 3.8,
			// Initial cooling factor for incremental layout  
			initialEnergyOnIncremental: 0.3,

			/* constraint options */

			// Fix desired nodes to predefined positions
			// [{nodeId: 'n1', position: {x: 100, y: 200}}, {...}]
			fixedNodeConstraint: undefined,
			// Align desired nodes in vertical/horizontal direction
			// {vertical: [['n1', 'n2'], [...]], horizontal: [['n2', 'n4'], [...]]}
			alignmentConstraint: undefined,
			// Place two nodes relatively in vertical/horizontal direction
			// [{top: 'n1', bottom: 'n2', gap: 100}, {left: 'n3', right: 'n4', gap: 75}, {...}]
			relativePlacementConstraint: undefined,

			/* layout event callbacks */
			ready: () => { }, // on layoutready
			stop: () => { }, // on layoutstop
			name: 'fcose',
		};
		this.cy.layout(defaultOptions).run(); //{name: 'fcose'}).run(); 
	}
	gridLayout() { this.cy.layout({ name: 'grid', animate: true }).run(); }
	presetLayout() {
		let hasCenterProp = this.setPositionData();
		if (!hasCenterProp) {
			console.log('no positions are preset: store first!');
		} else {
			let options = {
				name: 'preset',
				positions: undefined, //function (n){return this.getNode(n.id()).data().center;}, //this.posDict, //undefined, // undefined, // map of (node id) => (position obj); or function(node){ return somPos; }
				zoom: undefined, // the zoom level to set (prob want fit = false if set)
				pan: undefined, // the pan level to set (prob want fit = false if set)
				fit: true, // whether to fit to viewport
				padding: 30, // padding on fit
				animate: true, // whether to transition the node positions
				animationDuration: 500, // duration of animation in ms if enabled
				animationEasing: undefined, // easing of animation if enabled
				animateFilter: function (node, i) { return true; }, // a function that determines whether the node should be animated.  All nodes animated by default on animate enabled.  Non-animated nodes are positioned immediately when the layout starts
				ready: undefined, // callback on layoutready
				stop: undefined, // callback on layoutstop
				transform: function (node, position) { return position; } // transform a given node position. Useful for changing flow direction in discrete layouts
			};
			this.cy.layout(options);
			this.reset();
		}
	}
	randomLayout() { this.cy.layout({ name: 'random', animate: 'true' }).run(); }
	klay() {
		let klayDefaults = {
			// Following descriptions taken from http://layout.rtsys.informatik.uni-kiel.de:9444/Providedlayout.html?algorithm=de.cau.cs.kieler.klay.layered
			addUnnecessaryBendpoints: false, // Adds bend points even if an edge does not change direction.
			aspectRatio: 1.6, // The aimed aspect ratio of the drawing, that is the quotient of width by height
			borderSpacing: 20, // Minimal amount of space to be left to the border
			compactComponents: false, // Tries to further compact components (disconnected sub-graphs).
			crossingMinimization: 'LAYER_SWEEP', // Strategy for crossing minimization.
			/* LAYER_SWEEP The layer sweep algorithm iterates multiple times over the layers, trying to find node orderings that minimize the number of crossings. The algorithm uses randomization to increase the odds of finding a good result. To improve its results, consider increasing the Thoroughness option, which influences the number of iterations done. The Randomization seed also influences results.
			INTERACTIVE Orders the nodes of each layer by comparing their positions before the layout algorithm was started. The idea is that the relative order of nodes as it was before layout was applied is not changed. This of course requires valid positions for all nodes to have been set on the input graph before calling the layout algorithm. The interactive layer sweep algorithm uses the Interactive Reference Point option to determine which reference point of nodes are used to compare positions. */
			cycleBreaking: 'GREEDY', // Strategy for cycle breaking. Cycle breaking looks for cycles in the graph and determines which edges to reverse to break the cycles. Reversed edges will end up pointing to the opposite direction of regular edges (that is, reversed edges will point left if edges usually point right).
			/* GREEDY This algorithm reverses edges greedily. The algorithm tries to avoid edges that have the Priority property set.
			INTERACTIVE The interactive algorithm tries to reverse edges that already pointed leftwards in the input graph. This requires node and port coordinates to have been set to sensible values.*/
			direction: 'UNDEFINED', // Overall direction of edges: horizontal (right / left) or vertical (down / up)
			/* UNDEFINED, RIGHT, LEFT, DOWN, UP */
			edgeRouting: 'ORTHOGONAL', // Defines how edges are routed (POLYLINE, ORTHOGONAL, SPLINES)
			edgeSpacingFactor: 0.5, // Factor by which the object spacing is multiplied to arrive at the minimal spacing between edges.
			feedbackEdges: false, // Whether feedback edges should be highlighted by routing around the nodes.
			fixedAlignment: 'NONE', // Tells the BK node placer to use a certain alignment instead of taking the optimal result.  This option should usually be left alone.
			/* NONE Chooses the smallest layout from the four possible candidates.
			LEFTUP Chooses the left-up candidate from the four possible candidates.
			RIGHTUP Chooses the right-up candidate from the four possible candidates.
			LEFTDOWN Chooses the left-down candidate from the four possible candidates.
			RIGHTDOWN Chooses the right-down candidate from the four possible candidates.
			BALANCED Creates a balanced layout from the four possible candidates. */
			inLayerSpacingFactor: 1.0, // Factor by which the usual spacing is multiplied to determine the in-layer spacing between objects.
			layoutHierarchy: false, // Whether the selected layouter should consider the full hierarchy
			linearSegmentsDeflectionDampening: 0.3, // Dampens the movement of nodes to keep the diagram from getting too large.
			mergeEdges: false, // Edges that have no ports are merged so they touch the connected nodes at the same points.
			mergeHierarchyCrossingEdges: true, // If hierarchical layout is active, hierarchy-crossing edges use as few hierarchical ports as possible.
			nodeLayering: 'NETWORK_SIMPLEX', // Strategy for node layering.
			/* NETWORK_SIMPLEX This algorithm tries to minimize the length of edges. This is the most computationally intensive algorithm. The number of iterations after which it aborts if it hasn't found a result yet can be set with the Maximal Iterations option.
			LONGEST_PATH A very simple algorithm that distributes nodes along their longest path to a sink node.
			INTERACTIVE Distributes the nodes into layers by comparing their positions before the layout algorithm was started. The idea is that the relative horizontal order of nodes as it was before layout was applied is not changed. This of course requires valid positions for all nodes to have been set on the input graph before calling the layout algorithm. The interactive node layering algorithm uses the Interactive Reference Point option to determine which reference point of nodes are used to compare positions. */
			nodePlacement: 'BRANDES_KOEPF', // Strategy for Node Placement
			/* BRANDES_KOEPF Minimizes the number of edge bends at the expense of diagram size: diagrams drawn with this algorithm are usually higher than diagrams drawn with other algorithms.
			LINEAR_SEGMENTS Computes a balanced placement.
			INTERACTIVE Tries to keep the preset y coordinates of nodes from the original layout. For dummy nodes, a guess is made to infer their coordinates. Requires the other interactive phase implementations to have run as well.
			SIMPLE Minimizes the area at the expense of... well, pretty much everything else. */
			randomizationSeed: 1, // Seed used for pseudo-random number generators to control the layout algorithm; 0 means a new seed is generated
			routeSelfLoopInside: false, // Whether a self-loop is routed around or inside its node.
			separateConnectedComponents: true, // Whether each connected component should be processed separately
			spacing: 20, // Overall setting for the minimal amount of space to be left between objects
			thoroughness: 7 // How much effort should be spent to produce a nice layout..
		};

		var options = {
			nodeDimensionsIncludeLabels: false, // Boolean which changes whether label dimensions are included when calculating node dimensions
			fit: true, // Whether to fit
			padding: 20, // Padding on fit
			animate: true, // Whether to transition the node positions
			animateFilter: function (node, i) { return true; }, // Whether to animate specific nodes when animation is on; non-animated nodes immediately go to their final positions
			animationDuration: 500, // Duration of animation in ms if enabled
			animationEasing: undefined, // Easing of animation if enabled
			transform: function (node, pos) { return pos; }, // A function that applies a transform to the final node position
			ready: this.reset.bind(this), // Callback on layoutready
			stop: undefined, // Callback on layoutstop
			klay: {
				addUnnecessaryBendpoints: false, // Adds bend points even if an edge does not change direction.
				aspectRatio: 1.6, // The aimed aspect ratio of the drawing, that is the quotient of width by height
				borderSpacing: 20, // Minimal amount of space to be left to the border
				compactComponents: false, // Tries to further compact components (disconnected sub-graphs).
				crossingMinimization: 'LAYER_SWEEP', // Strategy for crossing minimization.
				cycleBreaking: 'GREEDY', // Strategy for cycle breaking. Cycle breaking looks for cycles in the graph and determines which edges to reverse to break the cycles. Reversed edges will end up pointing to the opposite direction of regular edges (that is, reversed edges will point left if edges usually point right).
				direction: 'UNDEFINED', // Overall direction of edges: /* UNDEFINED, RIGHT, LEFT, DOWN, UP */
				edgeRouting: 'ORTHOGONAL', // Defines how edges are routed (POLYLINE, ORTHOGONAL, SPLINES)
				edgeSpacingFactor: 0.5, // Factor by which the object spacing is multiplied to arrive at the minimal spacing between edges.
				feedbackEdges: false, // Whether feedback edges should be highlighted by routing around the nodes.
				fixedAlignment: 'NONE', // node placer alignment: NONE | LEFTUP | RIGHTUP | LEFTDOWN | RIGHTDOWN | BALANCED
				inLayerSpacingFactor: 1.0, // Factor by which the usual spacing is multiplied to determine the in-layer spacing between objects.
				layoutHierarchy: false, // Whether the selected layouter should consider the full hierarchy
				linearSegmentsDeflectionDampening: 0.3,// 0.3, // Dampens the movement of nodes to keep the diagram from getting too large.
				mergeEdges: false, // Edges that have no ports are merged so they touch the connected nodes at the same points.
				mergeHierarchyCrossingEdges: true, // If hierarchical layout is active, hierarchy-crossing edges use as few hierarchical ports as possible.
				nodeLayering: 'NETWORK_SIMPLEX', // Strategy for node layering NETWORK_SIMPLEX (expensive!) | LONGEST_PATH | INTERACTIVE comparing their positions before the layout algorithm was started. The idea is that the relative horizontal order of nodes as it was before layout was applied is not changed. This of course requires valid positions for all nodes to have been set on the input graph before calling the layout algorithm. The interactive node layering algorithm uses the Interactive Reference Point option to determine which reference point of nodes are used to compare positions. */
				nodePlacement: 'INTERACTIVE', // Strategy for Node Placement BRANDES_KOEPF | LINEAR_SEGMENTS | INTERACTIVE | SIMPLE
				/* BRANDES_KOEPF Minimizes the number of edge bends at the expense of diagram size: diagrams drawn with this algorithm are usually higher than diagrams drawn with other algorithms.
				LINEAR_SEGMENTS Computes a balanced placement.
				INTERACTIVE Tries to keep the preset y coordinates of nodes from the original layout. For dummy nodes, a guess is made to infer their coordinates. Requires the other interactive phase implementations to have run as well.
				SIMPLE Minimizes the area at the expense of... well, pretty much everything else. */
				randomizationSeed: 1, // Seed used for pseudo-random number generators to control the layout algorithm; 0 means a new seed is generated
				routeSelfLoopInside: false, // Whether a self-loop is routed around or inside its node.
				separateConnectedComponents: true, // Whether each connected component should be processed separately
				spacing: 20, // Overall setting for the minimal amount of space to be left between objects
				thoroughness: 3 // How much effort should be spent to produce a nice layout..
			},
			name: 'klay',

			priority: function (edge) { return null; }, // Edges with a non-nil value are skipped when greedy edge cycle breaking is enabled
		};
		this.cy.layout(options).run();
	}
	//#endregion

	//#region ui functions
	fit() { this.cy.fit(); }
	center() { this.cy.center(); this.cy.fit(); }
	reset() { this.pan0(); this.zoom1(); this.center(); }
	pan0() { this.cy.pan({ x: 0, y: 0 }); }
	zoom1() { this.cy.zoom(1); }

	isPan() { return this.cy.panningEnabled(); }
	isZoom() { return this.cy.zoomingEnabled(); }
	enablePanZoom() { this.pan(true); this.zoom(true); }
	pan(isOn, reset = true) {
		this.cy.panningEnabled(isOn);
		this.cy.userPanningEnabled(isOn);
		if (!isOn && reset) { this.pan0(); this.center(); }
	}
	zoom(isOn, minZoom = .25, maxZoom = 1, reset = true) {
		this.cy.zoomingEnabled(isOn);
		this.cy.userZoomingEnabled(isOn);
		if (!isOn && reset) { this.zoom1(); this.center(); }
		else if (isOn) { this.cy.minZoom(minZoom); this.cy.maxZoom(maxZoom); }
	}

	closeLayoutControls() { if (isdef(this.sb)) hide(this.sb); }
	addLayoutControls(sb, buttonlist) {
		let buttons = {
			BFS: mButton('BFS', () => this.breadthfirst(), sb, {}, ['tbb']),
			circle: mButton('circle', () => this.circle(), sb, {}, ['tbb']),
			CC: mButton('CC', () => this.concentric(), sb, {}, ['tbb']),
			cola: mButton('cola', () => this.comcola(), sb, {}, ['tbb']),
			cose: mButton('cose', () => this.cose(), sb, {}, ['tbb']),
			// dagre: mButton('dagre', () => this.dagre(), sb, {}, ['tbb']),
			euler: mButton('euler', () => this.euler(), sb, {}, ['tbb']),
			fcose: mButton('fcose', () => this.fcose(), sb, {}, ['tbb']),
			grid: mButton('grid', () => this.gridLayout(), sb, {}, ['tbb']),
			klay: mButton('klay', () => this.klay(), sb, {}, ['tbb']),
			prest: mButton('prest', () => this.presetLayout(), sb, {}, ['tbb']),
			rand: mButton('rand', () => this.randomLayout(), sb, {}, ['tbb']),
			reset: mButton('reset', () => this.reset(), sb, {}, ['tbb']),
			fit: mButton('fit', () => this.fit(), sb, {}, ['tbb']),
			show: mButton('show', () => this.showGraph(), sb, {}, ['tbb']),
			hide: mButton('hide', () => this.hideGraph(), sb, {}, ['tbb']),
			store: mButton('store', () => this.storeCurrentPositions(), sb, {}, ['tbb']),
		};
		for (const b in buttons) {
			if (isdef(buttonlist) && !buttonlist.includes(b)) hide(buttons[b]);
		}
		return buttons;
	}
	addVisual(dParent, styles = {}) {

		if (this.hasVisual) return;
		this.hasVisual = true;
		this.id = nundef(dParent.id) ? getUID() : dParent.id;
		// mIfNotRelative(dParent);

		let styleDict = {
			node: { 'width': 25, 'height': 25, 'background-color': 'red', "color": "#fff", 'label': 'data(id)', "text-valign": "center", "text-halign": "center", },
			edge: { 'width': 2, 'line-color': 'silver', 'curve-style': 'haystack', },
			'node.highlight': { 'background-color': 'yellow' },
			'node.trans': { 'opacity': '0.5' },
		}
		for (const ks of ['node', 'edge', 'node.highlight', 'node.trans']) {
			if (isdef(styles[ks])) {
				for (const k in styles[ks]) {
					let [prop, val] = translateToCssStyle(k, styles[ks][k], false);
					styleDict[ks][prop] = val;
				}
			}
		}
		let cyStyle = [];
		for (const k in styleDict) { cyStyle.push({ selector: k, style: styleDict[k] }); }

		//let d1=
		let size = getSize(dParent);
		let d1 = mDiv(dParent, { position: 'relative', bg: 'green', w: size.w, left: 0, top: 0, h: size.h, align: 'left' });
		// let d1 = mDiv(dParent, { position: 'relative', bg: 'green', w: size.w - 80, left: 40, top: 0, h: size.h, align: 'left' });

		// // console.log('size',size)
		// // let dCy = mDiv(dParent, { position: 'absolute', left: 40, top: 0, w: 'calc( 100% - 80px )', h: '100%' });
		// // let dCy = mDiv(dParent, {display:'inline-block', position: 'absolute', left: 40, top: 0, w: size.w-80, h: size.h });
		this.cy.mount(d1);
		this.cy.style(cyStyle);
		// console.log('extent',g.cy.extent());
		this.enablePanZoom();
		iAdd(this, { div: dParent, dCy: d1 });
	}

	//#endregion

}

class SimpleGraph extends AbsGraph1 { //das wird jetzt schon ein Item!
	constructor(dParent, styles = {}) {
		super();
		upgradeToSimpleGraph(this, dParent, styles);
	}
}
//#endregion
function gTest02() {
	initTable();
	let d = mDiv(dTable, { w: 500, h: 300, bg: 'blue', align: 'left' });
	let g = new SimpleGraph(d);
	//g.addVisual(d);
	let nids = g.addNodes(10);
	let eids = g.addEdges(15);
	console.log('g', g.getNodeIds(), g.getEdgeIds());
	g.cose();
	g.addLayoutControls();
}
//abstract graph
function gTest01() {
	let g = new AbsGraph1();
	let nids = g.addNodes(10);
	let eids = g.addEdges(15);
	console.log('g', g.getNodeIds(), g.getEdgeIds());
}
function gTest00() {
	let g = new AbsGraph1();
	let nid1 = g.addNode();
	let nid2 = g.addNode();
	let eid1 = g.addEdge(nid1, nid2);
	console.log('g', g.getNodeIds(), g.getEdgeIds());
}


//#endregion

//#region house room tests
function houseTest00() {
	let s = '"a a b c" "d d e c" "f g e h"'; console.log(getRandomLetterMapping(s)); console.log('_____\n', s, '\n', getLetterSwapEncoding(s));

}
//#endregion

//#region test postData
async function serverTest00_postData() {
	console.log('hallo'); //return;
	let o = { liste: [1, 2, 3], hut: 'hutX' };
	let path = './DATA/file.yaml';
	let resp = await postData('http://localhost:3000/db', { obj: o, path: path });
	//return;
	console.log('response', resp); return;

}

//#endregion

//#region test areas
function cardGameTest09() {
	let state = {
		pl1: { hand: [1, 2, 3, 4, 5], trick: [[6], [7, 8, 9]] },
		pl2: { hand: [11, 12, 13, 14, 15], trick: [[16], [17, 18, 19]] },
	};
	let areaItems = makeAreasKrieg(dTable);
	presentState1(state, areaItems);
}
function presentState1(state, areas) {
	let trick1 = arrFlatten(state.pl1.trick)
	let trick2 = arrFlatten(state.pl2.trick);

	let pl1Hand = state.pl1.hand;
	let pl2Hand = state.pl2.hand;
	// let arrs = [[{trick1:trick1}, {trick2:trick2}], [{pl1Hand:pl1Hand}], [{pl2Hand:pl2Hand}]];
	let arrs = [[trick1, trick2], [pl1Hand], [pl2Hand]];
	let hands = [];
	for (let i = 0; i < 3; i++) {
		let area = areas[i];
		let d = diContent(area);
		iMessage(area, '');
		for (let j = 0; j < arrs[i].length; j++) {
			let arr = arrs[i][j]; //arr is an object {key:cardArr} cardArr can be empty!
			//if (isEmpty(arr)) continue;
			//let key =
			let id = 'a' + i + '_h' + j;
			let what = iH00(arr, d, {}, id);
			hands.push(what);
			//console.log('iH00 returns', what)
		}
	}
	//turn around all the cards in tricks except last one!
	for (let i = 0; i < 2; i++) {
		let cards = hands[i].iHand.items;
		if (isEmpty(hands[i].arr)) continue;
		console.log('cards', cards, 'hands[i]', hands[i])
		for (let j = 0; j < cards.length - 1; j++) {
			Card52.turnFaceDown(cards[j]);
		}
	}
}

function cardGameTest08() {
	let state = {
		pl1: { hand: [1, 2, 3, 4, 5], trick: [[6]] },
		pl2: { hand: [11, 12, 13, 14, 15], trick: [[16]] },
	};
	let trick = arrFlatten(state.pl1.trick).concat(arrFlatten(state.pl2.trick));
	let pl1Hand = state.pl1.hand;
	let pl2Hand = state.pl2.hand;
	let arrs = [trick, pl1Hand, pl2Hand];
	let items = makeAreasKrieg(dTable); //cardGameTest07_helper();
	for (let i = 0; i < 3; i++) {
		let arr = arrs[i];
		let item = items[i];
		let d = diContent(item);
		let id = 'h' + i;
		iMessage(item, '');
		// iMakeHand_test(d, arr, id);
		iH00(arr, d, { bg: 'blue' }, id);

	}
}
function cardGameTest07() {
	let items = cardGameTest07_helper();
	// let card = Card52._createUi('Q', 'H', 70, 110);
	// console.log(card);
	// let item = items[0];
	// let dContent = diContent(item);
	// console.log(item, dContent);
	//iAddContent(item,iDiv(card));

	for (let i = 0; i < 3; i++) {
		let arr = [0, 1, 2, 10, 11].map(x => 1 + (x + i * 13) % 52);
		let d = diContent(items[i]);
		let id = 'h' + i;
		// iMakeHand_test(d, arr, id);
		iH00(arr, d, { bg: 'blue' }, id);

	}
}
function cardGameTest07_helper() {
	setBackgroundColor('random');
	let dGrid = mDiv(dTable, { gap: 10, bg: 'white', w: '90%', padding: 10, display: 'inline-grid', rounding: 10 }, 'dGrid');
	let layout = ['T', 'H A'];
	//let layout = ['t', 'H A'];

	//more intricate layout!
	let areaStyles = { bg: 'green', rounding: 6 };//,box:true, padding:10};
	let contentStyles = { lowerRounding: 6 };
	let messageStyles = { fg: 'yellow' };
	let titleStyles = { bg: 'dimgray', family: 'AlgerianRegular', upperRounding: 6 };
	let areas = {
		T: { title: 'table', id: 'dTrick', showTitle: true, messageArea: true, areaStyles: areaStyles, contentStyles: contentStyles, messageStyles: messageStyles, titleStyles: titleStyles },
		H: { title: 'YOU', id: 'dHuman', showTitle: true, messageArea: true, areaStyles: areaStyles, contentStyles: contentStyles, messageStyles: messageStyles, titleStyles: titleStyles },
		A: { title: 'opponent', id: 'dAI', showTitle: true, messageArea: true, areaStyles: areaStyles, contentStyles: contentStyles, messageStyles: messageStyles, titleStyles: titleStyles },
	};
	// areas.T.areaStyles.w='100%';

	let x = createGridLayout(dGrid, layout);
	console.log('result', x);

	//createAreas(dGrid, x, 'dGrid');
	let items = [];
	for (const k in areas) {
		let item = areas[k];
		item.areaStyles['grid-area'] = k;
		let dCell = mTitledMessageDiv(item.title, dGrid, item.id, item.areaStyles, item.contentStyles, item.titleStyles, item.messageStyles)
		iRegister(item, item.id);
		iAdd(item, { div: dCell, dTitle: dCell.children[0], dMessage: dCell.children[1], dContent: dCell.children[2] });
		mCenterCenterFlex(diContent(item));
		mStyleX(diContent(item), { gap: 10 });//,padding:10, box:true});
		items.push(item);
	}
	return items;


}
function cardGameTest06_clean_OK() {
	setBackgroundColor('random');
	let dGrid = mDiv(dTable, { gap: 10, bg: 'white', w: '90%', hmin: 400, padding: 10, display: 'inline-grid', rounding: 10 }, 'dGrid');
	let layout = ['T', 'H A'];
	//let layout = ['t', 'H A'];

	//more intricate layout!
	let areaStyles = { bg: 'green', rounding: 6 };//,box:true, padding:10};
	let contentStyles = { lowerRounding: 6 };
	let messageStyles = { fg: 'yellow' };
	let titleStyles = { bg: 'dimgray', family: 'AlgerianRegular', upperRounding: 6 };
	let areas = {
		T: { title: 'table', id: 'dTrick', showTitle: true, messageArea: true, areaStyles: areaStyles, contentStyles: contentStyles, messageStyles: messageStyles, titleStyles: titleStyles },
		H: { title: 'YOU', id: 'dHuman', showTitle: true, messageArea: true, areaStyles: areaStyles, contentStyles: contentStyles, messageStyles: messageStyles, titleStyles: titleStyles },
		A: { title: 'opponent', id: 'dAI', showTitle: true, messageArea: true, areaStyles: areaStyles, contentStyles: contentStyles, messageStyles: messageStyles, titleStyles: titleStyles },
	};
	areas.T.areaStyles.w = '100%';

	let x = createGridLayout(dGrid, layout);
	console.log('result', x);

	//createAreas(dGrid, x, 'dGrid');
	let items = [];
	for (const k in areas) {
		let item = areas[k];
		item.areaStyles['grid-area'] = k;
		let dCell = mTitledMessageDiv(item.title, dGrid, item.id, item.areaStyles, item.contentStyles, item.titleStyles, item.messageStyles)
		iRegister(item, item.id);
		iAdd(item, { div: dCell, dTitle: dCell.children[0], dMessage: dCell.children[1], dContent: dCell.children[2] });
		mCenterCenterFlex(diContent(item));
		mStyleX(diContent(item), { gap: 10 });//,padding:10, box:true});
		items.push(item);
	}
	return items;


}
function cardGameTest05() {
	setBackgroundColor('random');
	let dGrid = mDiv(dTable, { gap: 10, bg: 'white', w: '80%', h: 400, padding: 10, display: 'inline-grid', rounding: 10 }, 'dGrid');
	// let dGrid = mDiv(dTable, { gap: 10, bg: 'white', w: '80%', h: 400, padding: 10, display: 'inline-grid' }, 'dGrid');
	//mStyleX(dTable, { h: 400, bg: 'black', padding: 10 });
	//let dGrid = mDiv100(dTable, { display: 'inline-grid' });//,'dGrid');


	let layout = ['T', 'H A'];

	//more intricate layout!
	let areaStyles = { bg: 'random', rounding: 6 };//,box:true };
	let contentStyles = { bg: 'dimgray', lowerRounding: 6 };
	let messageStyles = { bg: 'dimgray', fg: 'yellow' };
	let titleStyles = { family: 'AlgerianRegular', upperRounding: 6 };
	let areas = {
		T: { title: 'table', id: 'dTrick', showTitle: true, messageArea: true, areaStyles: areaStyles, contentStyles: contentStyles, messageStyles: messageStyles, titleStyles: titleStyles },
		H: { title: 'YOU', id: 'dHuman', showTitle: true, messageArea: true, areaStyles: areaStyles, contentStyles: contentStyles, messageStyles: messageStyles, titleStyles: titleStyles },
		A: { title: 'opponent', id: 'dAI', showTitle: true, messageArea: true, areaStyles: areaStyles, contentStyles: contentStyles, messageStyles: messageStyles, titleStyles: titleStyles },
	};

	let x = createGridLayout(dGrid, layout);
	console.log('result', x);

	//createAreas(dGrid, x, 'dGrid');
	let items = [];
	for (const k in areas) {
		let item = areas[k];
		item.areaStyles['grid-area'] = k;
		let dCell = mTitledMessageDiv(item.title, dGrid, item.id, item.areaStyles, item.contentStyles, item.titleStyles, item.messageStyles)

		// let dCell = mDiv(dGrid, { h:'100%', w:'100%', bg: 'random', 'grid-area': k, });
		// if (shadeAreaBackgrounds) { dCell.style.backgroundColor = palette[ipal]; ipal = (ipal + 1) % palette.length; }
		// if (a.showTitle) { 
		// 	dCell=mTitledDiv(a.title,dCell,{bg: 'green',},{h:'100%', w:'100%', bg: 'yellow',},a.id)
		// 	// dCell.innerHTML = makeAreaNameDomel(areaName); 
		// }else {dCell.id=a.id;}
		iRegister(item, item.id);
		iAdd(item, { div: dCell, dTitle: dCell.children[0], dMessage: dCell.children[1], dContent: dCell.children[2] });
		// item.div = dCell;item.dTitle=dCell.children[0];item.dMessage=dCell.children[1];item.dContent=dCell.children[2];
		items.push(item);
	}
	return items;


}
function cardGameTest04() {
	setBackgroundColor('random');
	let dGrid = mDiv(dTable, { bg: 'red', w: '80%', h: 400, padding: 10, display: 'inline-grid', rounding: 10 }, 'dGrid');
	//mStyleX(dTable, { h: 400, bg: 'black', padding: 10 });
	//let dGrid = mDiv100(dTable, { display: 'inline-grid' });//,'dGrid');
	let layout = ['T', 'H A'];
	let x = createGridLayout(dGrid, layout);
	console.log('result', x);

	createAreas(dGrid, x, 'dGrid');


}
function cardGameTest03_OK() {
	setBackgroundColor('random');
	mStyleX(dTable, { h: 400, bg: 'black', padding: 10 });
	let dGrid = mDiv100(dTable, { display: 'inline-grid' });//,'dGrid');
	let layout = ['T', 'H A'];
	let x = createGridLayout(dGrid, layout);
	console.log('result', x);

	createAreas(dGrid, x, 'a');


}
function cardGameTest02() {
	setBackgroundColor('random');
	mStyleX(dTable, { h: 400, bg: 'black', padding: 10 });

	let SPEC = { layout: ['T', 'H A'], showAreaNames: true };
	let s = '';
	let m = [];
	for (const line of SPEC.layout) {
		s += '"' + line + '" ';
		let letters = line.split(' ');
		let arr = [];
		for (const l of letters) { if (!isEmpty(l)) arr.push(l); }
		m.push(arr);
	}
	console.log('m', m, '\ns', s); return;

}
function cardGameTest01() {

	rAreas();
}
//#endregion

//#region testing cards
function cTest03_2HandsRandom() {
	let h1 = iMakeHand_test(dTable, [33, 7, 1, 2, 3, 4], 'h1');
	let h2 = iMakeHand_test(dTable, [13, 14, 15, 16, 17], 'h2');
	//console.log('DA', DA)

	setTimeout(cTest03_2Hands_transferStarts, 1000);

}
function cTest03_2Hands_transferStarts() {

	let h1 = DA.h1.iHand;
	let n1 = h1.items.length;
	//console.log('hand h1 has', n1, 'cards');
	let h2 = DA.h2.iHand;
	let n2 = h2.items.length;
	//console.log('hand h2 has', n2, 'cards');
	//console.assert(n2 == DA.h2.deck.count());

	let c = chooseRandom(h2.items);
	DA.item = c;

	let w = c.w;
	let ov = w / 4;
	let xOffset = n1 * ov;
	console.log('w', w, 'ov', ov, 'xOffset', xOffset)

	iMoveFromTo(c, h2.div, h1.div, cTest03_2Hands_transfer, { x: xOffset, y: 0 });
}
function cTest03_2Hands_transfer() {
	//modify the deck object
	let deck1 = DA.h1.deck;
	let deck2 = DA.h2.deck;
	let item = DA.item;

	deck1.addTop(item.val);
	deck2.remove(item.val);

	iPresentHand_test(dTable, DA.h1);
	iPresentHand_test(dTable, DA.h2);
	iSortHand_test(dTable, DA.h1)

}
function cTest10() {
	//let SPEC = { layout: ['T T', 'H A'], showAreaNames: true };
	let layout = ['T', 'H A'];
	let x = createGridLayout(dTable, layout);
	console.log('x', x);
}
function cTest05() {
	setBackgroundColor('random')
	mStyleX(dTable, { h: 400, bg: 'black', padding: 10 });

	let SPEC = { layout: ['T T', 'H A'], showAreaNames: true };
	let s = '';
	let m = [];
	for (const line of SPEC.layout) {
		s += '"' + line + '" ';
		let letters = line.split(' ');
		let arr = [];
		for (const l of letters) { if (!isEmpty(l)) arr.push(l); }
		m.push(arr);
	}
	console.log('m', m, '\ns', s); return;

	//was ist diese m?
	let rows = SPEC.layout.length;
	let hCard = 110;
	let hTitle = 20;
	let gap = 4;
	let hGrid = rows * (hCard + hTitle) + gap * (rows + 1);
	let wGrid = '80%';

	let dGrid = mDiv(dTable, { h: hGrid, w: wGrid, 'grid-template-areas': s, bg: 'yellow' });




}
function cTest05B() {
	//let dParent = mDiv100(dTable,{bg:'green'});
	let dGridContainer = mDiv100(dTable, { bg: 'yellow' });

	let areas = mAreas(dGridContainer);
	areas.map(x => mCenterCenterFlex(x.div));
	let dGrid = dGridContainer.children[0];
	mStyleX(dGrid, { gap: 5, bg: 'blue', box: true, padding: 5 })
	console.log(dTrick, dGridContainer.children[0]);

	//what is the size of the content div in any of the areas?
	areas.map(x => mStyleX(x.div, { h: 110 }));
}
function cTest04_2HandsRandom() {
	// let h1 = iMakeHand([33, 7, 1, 2, 3, 4], dTable,{}, 'h1');
	let iarr = [33, 7, 1, 2, 3, 4], dParent = dTable, id = 'h1';
	let data = DA[id] = {};
	let h = data.deck = new Deck();
	h.init(iarr);
	//iPresentHand_test(dParent, data);
	let redo = true;
	h = data;
	if (nundef(h.zone)) {
		let nmax = 10, padding = 10;
		let sz = netHandSize(nmax);
		//h.zone = iHandZone_test(dParent);
		h.zone = mZone(dParent, { w: sz.w, h: sz.h, bg: 'random', padding: padding, rounding: 10 });
	} else {
		clearElement(h.zone);
	}
	if (nundef(h.iHand)) {
		let items = i52(h.deck.cards());
		h.iHand = iSplay(items, h.zone);
	} else if (redo) {
		clearElement(h.zone);
		let items = i52(h.deck.cards());
		h.iHand = iSplay(items, h.zone);
	}
	// return h;
	// return data;


	let h2 = iMakeHand([13, 14, 15, 16, 17], dParent, {}, 'h2');
	//console.log('DA', DA)

	setTimeout(cTest03_2Hands_transferStarts, 1000);

}

//#endregion

//#region testing board
function bTest01() {
	let arr = [1, 1, 1, 1, 2, 1, 0, 1, 0], rows = 3, cols = 3, irow = 0;// =>1
	console.log(bFullRow(arr, irow, rows, cols));
	console.log('____________')
	arr = [1, 1, 1, 1, 2, 1, 1, 1, 0], rows = 3, cols = 3, irow = 2;// =>null
	console.log(bFullRow(arr, irow, rows, cols));
	console.log('____________')
	arr = [1, 1, 1, 1, 2, 1, 1, 1, 0], rows = 3, cols = 3, icol = 0;// =>1
	console.log(bFullCol(arr, icol, rows, cols));
	console.log('____________')
	arr = [1, 1, 0, 2, 1, 1, 1, 0, 1], rows = 3, cols = 3;// =>1
	console.log(bFullDiag(arr, rows, cols));
	console.log('____________')
	arr = [2, 1, 0, 2, 1, 1, 1, 0, 1], rows = 3, cols = 3;// =>null
	console.log(bFullDiag(arr, rows, cols));
	console.log('____________')
	arr = [2, 1, 0, 0, 2, 1, 1, 0, 1], rows = 3, cols = 3;// =>null
	console.log(bFullDiag(arr, rows, cols));
	console.log('____________')
	arr = [2, 2, 1, 2, 1, 2, 1, 2, 2], rows = 3, cols = 3;// =>1
	console.log(bFullDiag2(arr, rows, cols));
	console.log('____________')
	arr = [2, 1, 0, 0, 0, 1, 0, 0, 1], rows = 3, cols = 3;// =>0
	console.log(bFullDiag2(arr, rows, cols));
	console.log('============================')
}
function bTest02() {
	let arr = [1, null, 1, 1, 2, 1, 0, 1, 0], rows = 3, cols = 3, irow = 0;// =>1
	console.log(bPartialRow(arr, irow, rows, cols));
	console.log('____________')
	arr = [1, 1, 1, 1, 0, 1, 1, 1, 2], rows = 3, cols = 3, irow = 2;// =>null
	console.log(bPartialRow(arr, irow, rows, cols));
	console.log('____________')
	arr = [1, 1, 1, null, 2, 1, 1, 1, 0], rows = 3, cols = 3, icol = 0;// =>1
	console.log(bPartialCol(arr, icol, rows, cols));
	console.log('____________')
	arr = [1, 1, 0, 2, null, 1, 1, 0, 1], rows = 3, cols = 3;// =>1
	console.log(bPartialDiag(arr, rows, cols));
	console.log('____________')
	arr = [2, 1, 0, 2, 1, 1, 1, 0, 1], rows = 3, cols = 3;// =>null
	console.log(bPartialDiag(arr, rows, cols));
	console.log('____________')
	arr = [2, 1, 0, 0, 2, 1, 1, 0, 1], rows = 3, cols = 3;// =>null
	console.log(bPartialDiag(arr, rows, cols));
	console.log('____________')
	arr = [2, 2, 1, 2, null, 2, 1, 2, 2], rows = 3, cols = 3;// =>1
	console.log(bPartialDiag2(arr, rows, cols));
	console.log('____________')
	arr = [2, 1, 0, 0, 0, 1, 0, 0, 1], rows = 3, cols = 3;// =>0
	console.log(bPartialDiag2(arr, rows, cols));
}
//connect4 tests: stride
function bTest03() {
	let arr = [[0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0],
	['O', 'X', 0, 0, 0, 0, 0],
	['O', 'O', 'O', 'O', 0, 0, 0]]
	let arrf = arrFlatten(arr), rows = 6, cols = 7, irow = 5, stride = 4;// =>1
	console.log('arr', arr[5]);
	console.log('stride in row', irow + ':', bStrideRow(arrf, irow, rows, cols, stride));
	console.log('____________');
	arr = [[0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0],
	['O', 'X', 0, 0, 0, 0, 0],
	[0, 0, 0, 'O', 'O', 'O', 0]]
	arrf = arrFlatten(arr), rows = 6, cols = 7, irow = 5, stride = 4;// =>1
	console.log('arr', arr[5]);
	console.log('stride in row', irow + ':', bStrideRow(arrf, irow, rows, cols, stride));
	console.log('____________');
	arr = [[0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0],
	['O', 'X', 0, 0, 0, 0, 0],
	[0, 'O', 'O', 'O', 'O', 0, 0]]
	arrf = arrFlatten(arr), rows = 6, cols = 7, irow = 5, stride = 4;// =>1
	console.log('arr', arr[5]);
	console.log('stride in row', irow + ':', bStrideRow(arrf, irow, rows, cols, stride));
	console.log('____________');
	arr = [[0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0],
	['O', 'X', 0, 0, 0, 0, 0],
	[0, 0, 0, 'O', 'O', 'O', 'O']]
	arrf = arrFlatten(arr), rows = 6, cols = 7, irow = 5, stride = 4;// =>1
	console.log('arr', arr[5]);
	console.log('stride in row', irow + ':', bStrideRow(arrf, irow, rows, cols, stride));
	console.log('____________');

}
function bTest04() {
	let arr = [[0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0],
	['O', 0, 0, 0, 0, 0, 0],
	['O', 0, 0, 0, 0, 0, 0],
	['O', 'X', 0, 0, 0, 0, 0],
	['O', 'O', 'O', 'O', 0, 0, 0]]
	let arrf = arrFlatten(arr), rows = 6, cols = 7, icol = 0, stride = 4;// =>1
	console.log('stride in col', icol + ':', bStrideCol(arrf, icol, rows, cols, stride));
	console.log('____________');
	arr = [[0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 'X', 0, 0],
	['O', 0, 0, 0, 'X', 0, 0],
	['O', 0, 0, 0, 'O', 0, 0],
	['O', 'X', 0, 0, 'X', 0, 0],
	['O', 'O', 'O', 'O', 0, 0, 0]]
	arrf = arrFlatten(arr), rows = 6, cols = 7, icol = 4, stride = 4;// =>1
	console.log('stride in col', icol + ':', bStrideCol(arrf, icol, rows, cols, stride));
	console.log('____________');
	arr = [[0, 0, 'X', 0, 'X', 0, 0],
	[0, 0, 0, 0, 'X', 0, 0],
	['O', 0, 0, 0, 'X', 0, 0],
	['O', 0, 0, 0, 'X', 0, 0],
	['O', 'X', 0, 0, 'O', 0, 0],
	['O', 'O', 'O', 'O', 0, 0, 0]]
	arrf = arrFlatten(arr), rows = 6, cols = 7, icol = 4, stride = 4;// =>1
	console.log('stride in col', icol + ':', bStrideCol(arrf, icol, rows, cols, stride));
	console.log('____________');
}
function bTest05() {
	let arr = [
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		['O', 0, 0, 0, 0, 0, 0],
		[0, 'O', 0, 0, 0, 0, 0],
		['O', 'X', 'O', 0, 0, 0, 0],
		['O', 'O', 'O', 'O', 0, 0, 0]]
	let arrf = arrFlatten(arr), rows = 6, cols = 7, irow = 2, icol = 0, stride = 4;// =>1
	console.log('stride in diag', irow, icol + ':', bStrideDiagFrom(arrf, irow, icol, rows, cols, stride));
	console.log('____________');
	arr = [
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 'X', 0],
		['O', 0, 0, 0, 0, 0, 'X'],
		[0, 'O', 0, 0, 0, 0, 0],
		['O', 'X', 'O', 0, 0, 0, 0],
		['O', 'O', 'O', 'O', 0, 0, 0]]
	arrf = arrFlatten(arr), rows = 6, cols = 7, irow = 1, icol = 5, stride = 4;// =>1
	console.log('stride in diag', irow, icol + ':', bStrideDiagFrom(arrf, irow, icol, rows, cols, stride));
	console.log('____________');
	arr = [
		[0, 0, 0, 0, 0, 0, 'X'],
		[0, 0, 0, 0, 0, 'X', 0],
		['O', 0, 0, 0, 'X', 0, 'X'],
		[0, 'O', 0, 'X', 0, 0, 0],
		['O', 'X', 'O', 0, 0, 0, 0],
		['O', 'O', 'O', 'O', 0, 0, 0]]
	arrf = arrFlatten(arr), rows = 6, cols = 7, irow = 0, icol = 6, stride = 4;// =>1
	console.log('stride in diag2', irow, icol + ':', bStrideDiag2From(arrf, irow, icol, rows, cols, stride));
	console.log('____________');
	arr = [
		[0, 0, 0, 0, 0, 0, 'X'],
		[0, 0, 0, 0, 0, 'X', 0],
		['O', 0, 0, 'O', 'X', 0, 'X'],
		[0, 'O', 'O', 'X', 0, 0, 0],
		['O', 'O', 'O', 0, 0, 0, 0],
		['O', 'O', 'O', 'O', 0, 0, 0]]
	arrf = arrFlatten(arr), rows = 6, cols = 7, irow = 2, icol = 3, stride = 4;// =>1
	console.log('stride in diag2', irow, icol + ':', bStrideDiag2From(arrf, irow, icol, rows, cols, stride));
	console.log('____________');
}
function bTest06() {
	let pos = [
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 'X', 0, 0, 0, 0, 0],
		[0, 'X', 0, 'O', 0, 0, 0],
		['O', 'X', 0, 'O', 0, 0, 0],
		['O', 'X', 0, 'O', 0, 0, 0]];

	let arr = arrFlatten(pos);
	let str = bStrideCol(arr, 1, 6, 7, 4);
	console.log('stride', str)
	let w = checkWinnerC4(arr, 6, 7, 4);
	printState(arr)
	console.log('w', w);

}
function bTest07() {
	let arr = [0, 0, 0, 0, 0, 0, 0, "X", 0, 0, 0, 0, 0, 0, "X", 0, 0, "X", "X", 0, "O", "X", 0, "X", "O", "O", "O", "X", "O", "X", "O", "O", "O", "X", "O", "O", "X", "O", "O", "O", "X", "O"];
	let w = checkWinnerC4(arr, 6, 7, 4);
	printState(arr)
	console.log('w', w);
}
function bTest08() {
	let arr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, "X", 0, 0, 0, "X", 0, 0, "O", 0, 0, 0, "O", "X", 0, "O", 0, 0, 0, "O", "X", "O", "O", "O", "O", 0];
	let w = checkWinnerC4(arr, 6, 7, 4);
	printState(arr)
	console.log('w', w);
}
function bTest09() {
	let pos = [
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0],
		[0, 'X', 0, 0, 0],
		[0, 'X', 0, 'O', 0],
		['O', 'X', 0, 'O', 0]];

	let arr = arrFlatten(pos);
	let nei = bNei(arr, 6, 5, 5);
	console.log(nei)
	nei = bNei(arr, 0, 5, 5);
	console.log(nei)
	nei = bNei(arr, 24, 5, 5);
	console.log(nei)
}
function bTest10() {
	let pos = [
		[0, 1, 2, 3, 4, 5],
		[6, 7, 8, 9, 10, 11],
		[12, 13, 14, 15, 16, 17],
		[18, 19, 20, 21, 22, 23],
		[24, 25, 26, 27, 28, 29]];

	let arr = arrFlatten(pos);
	printState(arr);
	let nei = bNei(arr, 6, 6, 6);
	console.log(nei);
	nei = bNei(arr, 7, 6, 6);
	console.log(nei);
	nei = bNei(arr, 16, 6, 6);
	console.log(nei);
}

function btest11_fractions() {

	let a = math.fraction(1, 4);
	let b = math.fraction(1, 4);
	let c = math.multiply(a, b);
	console.log(a, b, c);
	let d = math.add(a, b);
	console.log(d)
	let e = math.multiply(2, a);
	console.log(e)
}
//#endregion

//#region test krieg game!
function kriegTest00(game) {
	game.load({ pl1: { hand: ['TH', 'KH'] }, pl2: { hand: ['9C', 'QC'] } }); game.deck.sort(); game.print_state();
	// game.load({ pl1: { hand: ['TH', 'QH'], trick: [['QD']] }, pl2: { hand: ['TC', 'QC'], trick: [['KC']] }, deck:['AH','AC'] },);	game.deck.sort();game.print_state();
	for (let i = 0; i < 2; i++) { game.make_random_move(); game.make_random_move(); game.print_state(); if (game.is_out_of_cards()) { console.log('game over!'); break; } }

}
function kriegTest01(game) {
	game.load({ pl1: { hand: ['TH', 'QH'] }, pl2: { hand: ['9C', 'KC'] } }); game.deck.sort(); //game.print_state();
	// game.load({ pl1: { hand: ['TH', 'QH'], trick: [['QD']] }, pl2: { hand: ['TC', 'QC'], trick: [['KC']] }, deck:['AH','AC'] },);	game.deck.sort();game.print_state();
	game.print_state();
	for (let i = 0; i < 8; i++) {
		game.make_random_moveX();
		game.print_state();

		// game.make_random_move();
		if (game.is_out_of_cards()) { console.log('game over!'); break; }
	}

}

function kriegTest02(game) {
	game.load({ pl1: { hand: ['TH'], trick: [['2H']] }, pl2: { hand: ['9C', 'KC'] } }); game.deck.sort(); //game.print_state();
	// game.load({ pl1: { hand: ['TH', 'QH'], trick: [['QD']] }, pl2: { hand: ['TC', 'QC'], trick: [['KC']] }, deck:['AH','AC'] },);	game.deck.sort();game.print_state();
	game.print_state('start:');
	for (let i = 0; i < 12; i++) {
		game.make_random_move();
		game.print_state('move:');
		game.resolve();
		game.swap_turn();
		if (i % 2 == 0) game.print_state('after resolve:');

		// game.make_random_move();
		if (game.is_out_of_cards()) { console.log('game over!'); break; }
	}

}

function kriegTest03(game) {
	game.load({ pl1: { hand: ['TH'], trick: [['2H']] }, pl2: { hand: ['9C'], trick: [['KC']] } }); game.deck.sort(); //game.print_state();
	// game.load({ pl1: { hand: ['TH', 'QH'], trick: [['QD']] }, pl2: { hand: ['TC', 'QC'], trick: [['KC']] }, deck:['AH','AC'] },);	game.deck.sort();game.print_state();
	game.print_state('start:');

	//es sollte resolve passieren! und dann sollte 0 dran sein!
	//return;

	for (let i = 0; i < 10; i++) {
		game.make_random_move();
		game.print_state('move:');
		game.resolve();
		game.swap_turn();
		if (i % 2 == 1) game.print_state('after resolve:');

		// game.make_random_move();
		if (game.is_out_of_cards()) { console.log('game over!'); break; }
	}

}

function kriegTest04(game) {
	game.load({ pl1: { name: 'felix', hand: ['TH'], trick: [['2H']] }, pl2: { name: 'max', hand: ['9C'], trick: [['2C']] } }); game.deck.sort(); //game.print_state();
	// game.load({ pl1: { hand: ['TH', 'QH'], trick: [['QD']] }, pl2: { hand: ['TC', 'QC'], trick: [['KC']] }, deck:['AH','AC'] },);	game.deck.sort();game.print_state();
	game.print_state('start:');

	for (let i = 0; i < 2; i++) {
		game.make_random_move();
		game.print_state('move:');

		//only resolve if second player has played!!!!!!!!!
		console.log('turn', game.iturn)
		if (game.iturn == 1) {
			game.resolve();
			game.swap_turn();
			game.print_state('after resolve:');
		} else game.swap_turn();

		// game.make_random_move();
		if (game.is_out_of_cards()) { console.log('game over! winner', game.winner().name); break; }
	}

}

function kriegTest05(game) {
	game.load();//{ pl1: { name:'felix',hand: ['TH'], trick: [['2H']] }, pl2: { name:'max',hand: ['9C'], trick: [['2C']] } }); game.deck.sort(); //game.print_state();
	// game.load({ pl1: { hand: ['TH', 'QH'], trick: [['QD']] }, pl2: { hand: ['TC', 'QC'], trick: [['KC']] }, deck:['AH','AC'] },);	game.deck.sort();game.print_state();
	game.print_state('start:');

	for (let i = 0; i < 25; i++) {
		game.make_random_move();
		game.print_state('move:');

		//only resolve if second player has played!!!!!!!!!
		console.log('turn', game.iturn)
		if (game.iturn == 1) {
			game.resolve();
			game.swap_turn();
			game.print_state('after resolve:');
		} else game.swap_turn();

		// game.make_random_move();
		if (game.is_out_of_cards()) { console.log('game over! winner', game.winner().index); break; }
	}

}

function kriegTest06(game) {
	game.load();//{ pl1: { name:'felix',hand: ['TH'], trick: [['2H']] }, pl2: { name:'max',hand: ['9C'], trick: [['2C']] } }); game.deck.sort(); //game.print_state();
	// game.load({ pl1: { hand: ['TH', 'QH'], trick: [['QD']] }, pl2: { hand: ['TC', 'QC'], trick: [['KC']] }, deck:['AH','AC'] },);	game.deck.sort();game.print_state();
	game.print_state('start:');
	let front = new GKriegFront(130, dTable);
	front.presentState(game.get_state(), dTable);
	return;

	for (let i = 0; i < 25; i++) {
		game.make_random_move();
		game.print_state('move:');

		//only resolve if second player has played!!!!!!!!!
		console.log('turn', game.iturn)
		if (game.iturn == 1) {
			game.resolve();
			game.swap_turn();
			game.print_state('after resolve:');
		} else game.swap_turn();

		// game.make_random_move();
		if (game.is_out_of_cards()) { console.log('game over! winner', game.winner().index); break; }
	}

}
function kriegTest00UI() {
	setBackgroundColor('random');
	clearElement(dTable)
	let back = new GKriegBack();
	back.load({ pl1: { name: 'felix', hand: ['TH', 'KH'] }, pl2: { name: 'tom', hand: ['9C', 'QC'] } }); back.deck.sort(); back.print_state();
	let front = new GKriegFront(130, dTable);
	front.presentState(back.get_state(), dTable);

	mLinebreak(dTable, 50);
	mButton('Move!', () => kriegTest00UI_engine(back, front), dTable, { fz: 28, matop: 10, rounding: 10, padding: 16, border: 8 }, ['buttonClass']);

}
function kriegTest00UI_engine(back, front) {
	if (back.is_out_of_cards()) { console.log('!!!!!!!!!!!!!!!!'); front.presentGameover(back.winner(), kriegTest00UI); return; }

	clearTable(dTable);
	back.make_random_moveX();
	back.make_random_moveX();
	back.print_state();
	front.presentState(back.get_state(), dTable);
	if (back.is_out_of_cards()) { console.log('game over!'); front.presentGameover(back.winner(), kriegTest00UI); return; }

	mLinebreak(dTable, 50);
	mButton('Move!', () => kriegTest00UI_engine(back, front), dTable, { fz: 28, matop: 10, rounding: 10, padding: 16, border: 8 }, ['buttonClass']);
}

//#endregion


























