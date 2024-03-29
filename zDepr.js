//#region old API nur fuer house => update!

class MGraph {
	//#region static
	static All = [];
	static SelectedNodes = [];
	static NodeNames = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	static NodeIds = [];
	static destroy() {
		for (const g of MGraph.All) {
			g.cy.unmount();
			g.cy.destroy();
			g.dOuter.remove();
		}
		MGraph.All = [];
		MGraph.SelectedNodes = [];
		MGraph.NodeIds = [];
	}
	//#endregion

	//#region init / constructor
	constructor(dParent, styleDict, els, addLayoutButtons=true) {
		//console.log('elements',els)

		let id = this.id = isdef(dParent.id) ? dParent.id : 'graph' + MGraph.All.length;
		dParent.id = id + '_outer';

		let options = {};
		mStyleX(dParent, { display: 'flex', pabottom: 20 });

		let wside = 0;
		if (addLayoutButtons){
			wside = 40;
			this.dSidebar = this.initSidebar(dParent, wside, addLayoutButtons);
		}else{
			dParent.ondblclick=()=>onClickReset(id);
		}
		this.dOuter = dParent;
		this.dParent = dParent = mDiv(dParent, { w: `calc( 100% - ${wside}px)`, margin: 10, h: '100%', 'border-radius': '0 10px 10px 0' });
		//let dLeiste = mSidebar('',dParent,{bg:'red',w:80,h:'100%'},'gSidebar');
		//dParent = mDiv(dParent, { w: 'calc ( 100% - 60px )', h: '100%', bg: 'green' });

		options.container = dParent;

		//#region extend styleDict based on defStyleDict 'width':12, 'height':12, 
		let defStyleDict = {
			node: { 'width':12, 'height':12,'background-color': 'red', "color": "#fff", 'label': 'data(id)', "text-valign": "center", "text-halign": "center", },
			edge: { 'width': 2, 'line-color': 'blue', 'curve-style': 'haystack', },
			'node.highlight': { 'background-color': 'yellow' },
			'node.semitransp': { 'opacity': '0.5' },
		}
		for (const k in styleDict) {
			if (isdef(defStyleDict)) addKeys(defStyleDict[k], styleDict[k]);
		}
		addKeys(defStyleDict, styleDict);
		//#endregion

		let style = [];
		for (const k in styleDict) { style.push({ selector: k, style: styleDict[k] }); }
		options.style = style;

		options.elements = els;
		//console.log('elements', els);

		let defOptions = {
			maxZoom: 1,
			minZoom: .2,
			motionBlur: true,
			//wheelSensitivity: 0.05,
			zoomingEnabled: true,
			userZoomingEnabled: true,
			panningEnabled: true,
			userPanningEnabled: true,
			boxSelectionEnabled: false,
			layout: { name: 'preset' },
		};
		addKeys(defOptions, options);
		this.cy = cytoscape(options);
		iAdd(this, { div: this.dOuter, dGraph: this.dParent, dSidebar: this.dSidebar });
		MGraph.All.push(this);
		// this.presetLayout();
	}
	initSidebar(dParent, wside) {
		let dl = mDiv(dParent, { h: '100%', w: wside, 'border-radius': '10px 0 0 10px', margin: 7 });
		let id = this.id;
		dl.id = id + '_sidebar';
		mCenterCenterFlex(dl);
		let html =`
		<div style='display:flex;flex-wrap:wrap;'>
			<button class='tbb' onclick='onClickReset(${id})'>reset</button>
			<button class='tbb' onclick='onClickBreadthfirst(${id})'>BFS</button>
			<button class='tbb' onclick='onClickCircle(${id})'>circle</button>
			<button class='tbb' onclick='onClickConcentric(${id})'>CC</button>
			<button class='tbb' onclick='onClickCose(${id})'>cose</button>
			<button class='tbb' onclick='onClickEuler(${id})'>euler</button>
			<button class='tbb' onclick='onClickFCose(${id})'>fcose</button>
			<button class='tbb' onclick='onClickGrid(${id})'>grid</button>
			<button class='tbb' onclick='onClickKlay(${id})'>klay</button>
			<button class='tbb' onclick='onClickPreset(${id})'>prest</button>
			<button class='tbb' onclick='onClickRandom(${id})'>rand</button>
		</div>
		`;
		let d = createElementFromHtml(html);
		mAppend(dl, d);
		return dl;
	}
	//#endregion

	//#region pan zoom center fit
	center() { this.cy.center(); this.cy.fit(); }
	reset() { this.pan0(); this.zoom1(); this.center(); }
	pan0() { this.cy.pan({ x: 0, y: 0 }); }
	zoom1() { this.cy.zoom(1); }

	isPan() { return this.cy.panningEnabled(); }
	isZoom() { return this.cy.zoomingEnabled(); }

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
	//#endregion
	getComponents(){return this.cy.elements().components();}
	getNumComponents(){return this.cy.elements().components().length;}
	getNode(id) { return this.cy.getElementById(id); }
	getNodes() { return this.cy.nodes(); }
	getNodeIds() { return this.cy.nodes().map(x => x.id()); }
	getNodeData() { return this.cy.nodes().map(x => x.data()); }
	getNodePositions() { return this.cy.nodes.map(x => x.position()); }
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

	addNode(data, coords) {
		if (nundef(data.id)) data.id = getNodeName();
		coords.x -= this.cy.pan().x;
		coords.y -= this.cy.pan().y;
		var ele = this.cy.add({
			group: 'nodes',
			data: data,
			position: coords
		});
		return ele;
	}
	addEdge(nid1, nid2, data) {
		data.id = nid1 +'_'+ nid2;
		data.source = nid1;
		data.target = nid2;
		var ele = this.cy.add({
			group: 'edges',
			data: data,
		});
		return ele;
	}

	//#region layouts
	breadthfirst() { this.cy.layout({ name: 'breadthfirst', animate: true }).run(); }
	circle() { this.cy.layout({ name: 'circle', animate: 'end' }).run(); }
	concentric() { this.cy.layout({ name: 'concentric', animate: true }).run(); }
	cose() { this.cy.layout({ name: 'cose', animate: 'end' }).run(); }
	euler() { this.cy.layout({ name: 'euler', animate: 'end' }).run(); }
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
	getPosition(id) {
		let node = this.cy.getElementById(id);
		console.log('node', node);
		let data = node.data();
		console.log('room', data);
		let pos = data.center;
		console.log('room center oben', Math.round(pos.x), Math.round(pos.y));
	}
	presetLayout() {
		// let positions = this.cy.nodes().map(x => x.position());
		setPositionData(this);
		//let ids = this.cy.nodes().map(x => x.id());
		//console.log('positions', positions, '\nids', ids);
		// for (let i = 0; i < ids.length; i++) {
		// 	console.log('node', ids[i], Math.round(positions[i].x), Math.round(positions[i].y));
		// }


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

		// this.cy.layout({
		// 	name: 'preset',
		// 	transform: function (node, position) { return node.position(); },
		// }).run(); this.cy.fit();
	}
	randomLayout() { this.cy.layout({ name: 'random', animate: 'true' }).run(); }

	klay() {
		var options = {
			nodeDimensionsIncludeLabels: false, // Boolean which changes whether label dimensions are included when calculating node dimensions
			fit: true, // Whether to fit
			padding: 20, // Padding on fit
			animate: true, // Whether to transition the node positions
			animateFilter: function (node, i) { return true; }, // Whether to animate specific nodes when animation is on; non-animated nodes immediately go to their final positions
			animationDuration: 500, // Duration of animation in ms if enabled
			animationEasing: undefined, // Easing of animation if enabled
			transform: function (node, pos) { return pos; }, // A function that applies a transform to the final node position
			ready: undefined, // Callback on layoutready
			stop: undefined, // Callback on layoutstop
			klay: {
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
			},
			name: 'klay',

			priority: function (edge) { return null; }, // Edges with a non-nil value are skipped when greedy edge cycle breaking is enabled
		};
		this.cy.layout(options).run();
	}
	//#endregion

}

function getNodeName() {
	let ids = MGraph.NodeIds;
	let letters = lettersToArray(MGraph.NodeNames);
	let newName = firstCond(letters, x => !ids.includes(x));
	ids.push(newName)
	//console.log('next node name is', newName);
	return newName;
}
function getSampleStyle() {
	let styleDict = {
		node: {
			'background-color': 'red', //color of node
			"color": "#fff", //color of text [black]
			'label': 'data(id)',
			"text-valign": "center", //sonst wird label ober node gemacht
			"text-halign": "center",
		},
		edge: {
			'width': 2,
			'line-color': 'blue',
			'curve-style': 'bezier'
		}
	};
	return styleDict;
}
function getSampleData(nNodes, nEdges) {
	let elements = [], x = 20, y = 70;
	for (let i = 0; i < nNodes; i++) {
		let id = getNodeName();
		let el = { data: { id: id }, position: { x: x, y: i % 2 ? y - 40 : y + 40 } };
		elements.push(el);
		x += 50; if (x > 300) { x = 20; y += 140; }
	}
	let combis = [];
	let nodeIds = elements.map(x => x.data.id);

	for (const id1 of nodeIds) {
		for (const id2 of nodeIds) {
			if (id1 == id2 || combis.includes(id2 + id1)) continue;
			combis.push(id1 + id2);
		}
	}
	let edgeIds = choose(combis, nEdges);
	//console.log('edge names',edgeIds);
	for (const id of edgeIds) {
		let el = { data: { id: id, source: id[0], target: id[1] } };
		elements.push(el);
	}
	return elements;
}
function getGraph(id) { return Items[id]; }
function onClickReset(id) { for (const g of MGraph.All) g.reset(); }// for (const g of MGraph.All) { g.reset(); } }
function onClickBreadthfirst(id) { for (const g of MGraph.All) g.breadthfirst(); }
function onClickCircle(id) { for (const g of MGraph.All) g.circle(); }
function onClickConcentric(id) { for (const g of MGraph.All) g.concentric(); }
function onClickCose(id) { for (const g of MGraph.All) g.cose(); }
function onClickEuler(id) { for (const g of MGraph.All) g.euler(); }
function onClickFCose(id) { for (const g of MGraph.All) g.fcose(); }
function onClickGrid(id) { for (const g of MGraph.All) g.gridLayout(); }
function onClickKlay(id) { for (const g of MGraph.All) g.klay(); }
function onClickPreset(id) { for (const g of MGraph.All) g.presetLayout(); }
function onClickRandom(id) { for (const g of MGraph.All) g.randomLayout(); }

function onClickTogglePan() { for (const g of MGraph.All) { let on = g.isPan(); g.pan(!on); } }
function onClickToggleZoom() { for (const g of MGraph.All) { let on = g.isZoom(); g.zoom(!on); } }

//#endregion



class MNaGraph {
	//#region static
	static All = [];
	static SelectedNodes = [];
	static NodeNames = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	static NodeIds = [];
	static destroy() {
		for (const g of MGraph.All) {
			g.cy.unmount();
			g.cy.destroy();
			g.dOuter.remove();
		}
		MNaGraph.All = [];
		MNaGraph.SelectedNodes = [];
		MNaGraph.NodeIds = [];
	}
	//#endregion

	//#region init / constructor
	constructor(dParent, styleDict, els, addLayoutButtons=true) {
		//console.log('elements',els)

		if (nundef(dParent)) {this.unmounted=true;dParent = mDiv(document.body);}

		let id = this.id = isdef(dParent.id) ? dParent.id : 'graph' + MNaGraph.All.length;
		dParent.id = id + '_outer';

		let options = {};
		mStyleX(dParent, { display: 'flex', pabottom: 20 });

		let wside = 0;
		if (addLayoutButtons){
			wside = 40;
			this.dSidebar = this.initSidebar(dParent, wside, addLayoutButtons);
		}else{
			dParent.ondblclick=()=>onClickReset(id);
		}
		this.dOuter = dParent;
		this.dParent = dParent = mDiv(dParent, { w: `calc( 100% - ${wside}px)`, margin: 10, h: '100%', 'border-radius': '0 10px 10px 0' });
		//let dLeiste = mSidebar('',dParent,{bg:'red',w:80,h:'100%'},'gSidebar');
		//dParent = mDiv(dParent, { w: 'calc ( 100% - 60px )', h: '100%', bg: 'green' });

		options.container = dParent;

		//#region extend styleDict based on defStyleDict 'width':12, 'height':12, 
		let defStyleDict = {
			node: { 'width':12, 'height':12,'background-color': 'red', "color": "#fff", 'label': 'data(id)', "text-valign": "center", "text-halign": "center", },
			edge: { 'width': 2, 'line-color': 'blue', 'curve-style': 'haystack', },
			'node.highlight': { 'background-color': 'yellow' },
			'node.semitransp': { 'opacity': '0.5' },
		}
		if (styleDict.noLabels) delete defStyleDict.node.label;
		if (nundef(styleDict.node)) styleDict.node={};
		if (nundef(styleDict.edge)) styleDict.edge={};
		if (isdef(styleDict.node.bg)) defStyleDict.node['background-color']=styleDict.node.bg;
		if (isdef(styleDict.node.fg)) defStyleDict.node['color']=styleDict.node.fg;
		if (isdef(styleDict.node.w)) defStyleDict.node.width=styleDict.node.w;
		if (isdef(styleDict.node.h)) defStyleDict.node.height=styleDict.node.h;
		if (isdef(styleDict.edge.fg)) defStyleDict.edge['line-color']=styleDict.edge.fg;
		if (isdef(styleDict.edge.w)) defStyleDict.edge.width=styleDict.edge.w;
		if (styleDict.noLabels) delete defStyleDict.node.label;

		// for (const k in styleDict) {
		// 	if (isdef(defStyleDict)) addKeys(defStyleDict[k], styleDict[k]);
		// }
		// addKeys(defStyleDict, styleDict);
		//#endregion

		let style = [];
		for (const k in defStyleDict) { style.push({ selector: k, style: defStyleDict[k] }); }
		options.style = style;

		options.elements = els;
		//console.log('elements', els);

		let defOptions = {
			maxZoom: 1,
			minZoom: .2,
			motionBlur: true,
			//wheelSensitivity: 0.05,
			zoomingEnabled: true,
			userZoomingEnabled: true,
			panningEnabled: true,
			userPanningEnabled: true,
			boxSelectionEnabled: false,
			layout: { name: 'preset' },
		};
		addKeys(defOptions, options);
		this.cy = cytoscape(options);
		iAdd(this, { div: this.dOuter, dGraph: this.dParent, dSidebar: this.dSidebar });
		MNaGraph.All.push(this);

		if (this.unmounted) this.cy.unmount();

		// this.presetLayout();
	}
	initSidebar(dParent, wside) {
		let dl = mDiv(dParent, { h: '100%', w: wside, 'border-radius': '10px 0 0 10px', margin: 7 });
		let id = this.id;
		dl.id = id + '_sidebar';
		mCenterCenterFlex(dl);
		let html =`
		<div style='display:flex;flex-wrap:wrap;'>
			<button class='tbb' onclick='onClickReset(${id})'>reset</button>
			<button class='tbb' onclick='onClickBreadthfirst(${id})'>BFS</button>
			<button class='tbb' onclick='onClickCircle(${id})'>circle</button>
			<button class='tbb' onclick='onClickConcentric(${id})'>CC</button>
			<button class='tbb' onclick='onClickCose(${id})'>cose</button>
			<button class='tbb' onclick='onClickEuler(${id})'>euler</button>
			<button class='tbb' onclick='onClickFCose(${id})'>fcose</button>
			<button class='tbb' onclick='onClickGrid(${id})'>grid</button>
			<button class='tbb' onclick='onClickKlay(${id})'>klay</button>
			<button class='tbb' onclick='onClickPreset(${id})'>prest</button>
			<button class='tbb' onclick='onClickRandom(${id})'>rand</button>
		</div>
		`;
		let d = createElementFromHtml(html);
		mAppend(dl, d);
		return dl;
	}
	//#endregion

	//#region pan zoom center fit
	center() { this.cy.center(); this.cy.fit(); }
	reset() { this.pan0(); this.zoom1(); this.center(); }
	pan0() { this.cy.pan({ x: 0, y: 0 }); }
	zoom1() { this.cy.zoom(1); }

	isPan() { return this.cy.panningEnabled(); }
	isZoom() { return this.cy.zoomingEnabled(); }

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
	//#endregion
	getComponents(){return this.cy.elements().components();}
	getComponentIds(){return this.cy.elements().components().map(x=>x.id());}
	getNumComponents(){return this.cy.elements().components().length;}
	getNode(id) { return this.cy.getElementById(id); }
	getNodes() { return this.cy.nodes(); }
	getNodeIds() { return this.cy.nodes().map(x => x.id()); }
	getNodeData() { return this.cy.nodes().map(x => x.data()); }
	getNodePositions() { return this.cy.nodes.map(x => x.position()); }
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
	getShortestPathFromTo(nid1,nid2){
		let funcs = this.dijkstra = this.getShortestPathsFrom(nid1);
		// let len = funcs.distanceTo('#' + nid2);
		let path = funcs.pathTo('#' + nid2);
		return path;

	}
	getLengthOfShortestPath(nid1,nid2){
		let funcs = this.dijkstra = this.getShortestPathsFrom(nid1);
		let len = funcs.distanceTo('#' + nid2);
		//let path = funcs.pathTo('#' + nid2);
		return len;
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

	addNode(data, coords) {
		if (nundef(data.id)) data.id = getNodeName();
		coords.x -= this.cy.pan().x;
		coords.y -= this.cy.pan().y;
		var ele = this.cy.add({
			group: 'nodes',
			data: data,
			position: coords
		});
		return ele;
	}
	addEdge(nid1, nid2, data) {
		//console.log('addEdge',nid1,nid2,data)
		data.id = nid1 +'_'+ nid2;

		data.source = nid1;
		data.target = nid2;
		var ele = this.cy.add({
			group: 'edges',
			data: data,
		});
		return ele;
	}
	removeEdge(edge){
		if (!isString(edge)) edge=edge.id(); 
		this.cy.getElementById(edge).remove();
	}

	//#region layouts
	breadthfirst() { this.cy.layout({ name: 'breadthfirst', animate: true }).run(); }
	circle() { this.cy.layout({ name: 'circle', animate: 'end' }).run(); }
	concentric() { this.cy.layout({ name: 'concentric', animate: true }).run(); }
	cose() { this.cy.layout({ name: 'cose', animate: 'end' }).run(); }
	euler() { this.cy.layout({ name: 'euler', animate: 'end' }).run(); }
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
	getPosition(id) {
		let node = this.cy.getElementById(id);
		console.log('node', node);
		let data = node.data();
		console.log('room', data);
		let pos = data.center;
		console.log('room center oben', Math.round(pos.x), Math.round(pos.y));
	}
	presetLayout() {
		// let positions = this.cy.nodes().map(x => x.position());
		setPositionData(this);
		//let ids = this.cy.nodes().map(x => x.id());
		//console.log('positions', positions, '\nids', ids);
		// for (let i = 0; i < ids.length; i++) {
		// 	console.log('node', ids[i], Math.round(positions[i].x), Math.round(positions[i].y));
		// }


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

		// this.cy.layout({
		// 	name: 'preset',
		// 	transform: function (node, position) { return node.position(); },
		// }).run(); this.cy.fit();
	}
	randomLayout() { this.cy.layout({ name: 'random', animate: 'true' }).run(); }

	klay() {
		var options = {
			nodeDimensionsIncludeLabels: false, // Boolean which changes whether label dimensions are included when calculating node dimensions
			fit: true, // Whether to fit
			padding: 20, // Padding on fit
			animate: true, // Whether to transition the node positions
			animateFilter: function (node, i) { return true; }, // Whether to animate specific nodes when animation is on; non-animated nodes immediately go to their final positions
			animationDuration: 500, // Duration of animation in ms if enabled
			animationEasing: undefined, // Easing of animation if enabled
			transform: function (node, pos) { return pos; }, // A function that applies a transform to the final node position
			ready: undefined, // Callback on layoutready
			stop: undefined, // Callback on layoutstop
			klay: {
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
			},
			name: 'klay',

			priority: function (edge) { return null; }, // Edges with a non-nil value are skipped when greedy edge cycle breaking is enabled
		};
		this.cy.layout(options).run();
	}
	//#endregion

}


class GColoku_w1 extends Game {
	startGame() {
		this.correctionFunc = () => {
			if (this.qName == 'isThisSudokuCorrect') {
				mStyleX(Goal.buttonCorrect, { bg: 'green' });
				animate(Goal.buttonCorrect, 'komisch', 1000);

				console.log('correct', Goal.correct)
				if (!Goal.correct) {
					animateColorScale(Goal.correctionFeedbackUI, Goal.item.color, 1.5, 1500);
					this.dComment.innerHTML = 'rule broken! duplicate in ' + Goal.err.type;
					// animate(Goal.correctionFeedbackUI, 'scaleInColor', 1000);
					//this.maze.breadCrumbs(this.path); else this.maze.colorComponents();
				} else {
					this.dComment.innerHTML = 'this coloku is correct!';
				}
			} else {

				this.dWordArea.remove();
				this.bDone.remove();
				this.dComment.innerHTML = 'rule broken! duplicate in ' + Goal.err.type;

				animateColorScale(Goal.correctionFeedbackUI, Goal.item.color, 1.5, 1500);

				// mXit(this.dGrid, 200);
			}

			return 20000;
		};
		this.failFunc = () => {
			if (this.qName == 'isThisSudokuCorrect') {
				if (Goal.choice == Goal.correctChoice) { mStyleX(Goal.buttonClicked, { bg: 'green' }); mCheckit(Goal.feedbackUI, 100); }
				else { mXit(Goal.buttonClicked, 100); }
				//mStyleX(this.dGraph, { opacity: 1 });
			} else {
				mXit(this.dGrid, 200);
			}
		}
		this.successFunc = () => {
			if (this.qName == 'isThisSudokuCorrect') {
				if (Goal.choice == Goal.correctChoice) { mStyleX(Goal.buttonClicked, { bg: 'green' }); mCheckit(Goal.feedbackUI, 100); }
				else { mXit(Goal.buttonClicked, 100); }
			} else {
				mCheckit(this.dGrid, 200);
			}
		}
	}
	prompt() {

		this.trials = 1;
		let [rows, cols] = [this.rows, this.cols];// = [4, 4];
		this.dGrid = mGrid(rows, cols, dTable, { position: 'relative', w: 300, h: 300, gap: 10, bg: 'white' });

		let o = getSudokuPatternFromDB(4, 4, 1);
		console.log('pattern', o.pattern, 'puzzle', o.puzzle);
		let [pattern, minPuzzle] = [this.pattern, this.minPuzzle] = [o.pattern, o.puzzle];
		// let pattern = this.pattern = getSudokuPattern(rows, cols);
		printMatrix(pattern, 'pattern');
		printMatrix(minPuzzle, 'puzzle');

		//jetzt kommt aehnliche frage wie bei maze
		mLinebreak(dTable, 20);
		this.dChoices = mDiv(dTable);
		mLinebreak(dTable);
		this.dComment = mDiv(dTable);
		mLinebreak(dTable);

		let qName = this.level == 0 && coin()? 'isThisSudokuCorrect':'solve';
		//let qName = this.qName = 'solve'; // solve | isThisSudokuCorrect
		this[qName]();
		//let q =this.q = this.solve.bind(this); //chooseRandom([this.isThisSudokuCorrect.bind(this),this.solve.bind(this)]);
		//q=this.isThisSudokuCorrect.bind(this);
		//q();

		this.controller.activateUi.bind(this.controller)();
	}
	fillGrid(pattern) {
		//fill grid w/ colored divs
		let items = this.items = [];
		let colors = this.colors = [RED, YELLOW, BLUE, GREEN];
		let [rows, cols, dGrid] = [this.rows, this.cols, this.dGrid];
		shuffle(colors);
		for (let r = 0; r < rows; r++) {
			let arr = [];
			for (let c = 0; c < cols; c++) {
				let nch = pattern[r][c];

				let color = isNumber(nch) ? colors[pattern[r][c]] : null;
				let d = mDiv(dGrid, { bg: color }, getUID());
				let item = { row: r, col: c, id: d.id, color: color, val: nch };
				iAdd(item, { div: d });
				arr.push(item);
			}
			items.push(arr);
		}
		return items;
	}
	makeLines(){
		let [wline,dGrid] = [2,this.dGrid];
		let gSize = getSize(dGrid);
		console.log('size:', gSize);
		let rh = makeRect((gSize.w - wline) / 2, 0, wline, gSize.h);
		let rv = makeRect(0, (gSize.h - wline) / 2, gSize.w, wline);
		let vLine = mDiv(dGrid, { bg: this.color, position: 'absolute', left: rh.l, top: rh.t, w: rh.w, h: rh.h });
		let hLine = mDiv(dGrid, { bg: this.color, position: 'absolute', left: rv.l, top: rv.t, w: rv.w, h: rv.h });


	}
	setGoal(pattern) {
		let err = checkSudokuRule(pattern);
		let answer = (err == null); console.log('correct', answer);
		if (err) console.log('err', err.type, '[' + err.row + ',' + err.col + ']');
		//find the tile where the error really is!
		Goal = { correct: answer, err: err };
	}
	isThisSudokuCorrect() {

		this.trials = 1;

		let [pattern, rows, cols, dGrid] = [this.pattern, this.rows, this.cols, this.dGrid];
		//if (coin()) destroySudokuRule(pattern, rows, cols);
		destroySudokuRule(pattern, rows, cols);

		this.setGoal(pattern);

		let items = this.fillGrid(pattern);
		this.makeLines();
		let wsp = {
			D: 'ist dieses coloku korrekt?',
			E: 'is this coloku correct?',
			S: 'es este coloku correcto?',
			F: 'est ce que ce coloku est exacte?',
		};
		let sp = wsp[this.language];
		showInstructionX(sp, dTitle, sp);

		showFleetingMessage('rule: each color must be unique in every row, column and quadrant!', 15000);

		console.log('answer', Goal.correct, Goal.err);
		let correct, incorrect;
		if (Goal.correct) { correct = { num: 1, text: 'yes' }; incorrect = [{ num: 0, text: 'no' }]; }
		else { correct = { num: 0, text: 'no' }; incorrect = [{ num: 1, text: 'yes' }]; }
		let feedbackUI = Goal.correctionFeedbackUI = Goal.correct ? this.dGrid : iDiv(this.items[Goal.err.row][Goal.err.col]);
		createMultipleChoiceElements(correct, incorrect, this.dChoices, feedbackUI, {});
		Goal.item = Goal.correct ? this.items[0] : this.items[Goal.err.row][Goal.err.col];



	}
	solve() {
		//take a few pieces out
		//this.numMissing = 1; //das wird dann automatisiert!

		//take a random number out of puzzle
		let [rrand, crand] = [randomNumber(0, this.rows - 1), randomNumber(0, this.cols - 1)];
		let puzzle = this.puzzle = jsCopy(this.pattern);

		//find all possible r,c that can be removed (=are empty in min version of puzzle)
		let [min, rows, cols] = [this.minPuzzle, this.rows, this.cols];
		let combis = [];
		for (let r = 0; r < rows; r++) {
			for (let c = 0; c < cols; c++) {
				if (min[r][c] === ' ') combis.push({ row: r, col: c });
			}
		}

		//take numMissing of these randomly
		let combisToRemove = choose(combis, this.numMissing);

		//remove these entries from pattern to get real puzzle!
		for (const o of combisToRemove) {
			puzzle[o.row][o.col] = ' ';
		}

		printMatrix(puzzle, 'puzzle');
		this.fillGrid(puzzle);
		this.makeLines();

		let sp = 'solve this coloku!'
		showInstructionX(sp, dTitle, sp);

		showFleetingMessage('rule: each color must be unique in every row, column and quadrant!', 15000);

		//containers should be divs of empty (unset) puzzle
		let itemlist = this.itemlist = arrFlatten(this.items);
		console.log('items', itemlist);
		let containers = this.containers = itemlist.filter(x => x.val === ' ');
		console.log('containers', containers)

		let dWordArea = this.dWordArea = mDiv(dTable, { h: 70, display: 'flex', 'flex-wrap': 'wrap', layout: 'fhcc' });
		let colorItems = this.colorItems = [];
		for (const color of this.colors) {
			let colorItem = { id: getUID(), color: color };
			let d = mDiv(dWordArea, { w: 40, h: 40, bg: color, margin: 10 }, colorItem.id);
			iAdd(colorItem, { div: d });
			colorItems.push(colorItem);
		}

		enableDD(colorItems, containers, this.dropHandler.bind(this), true);
		mLinebreak(dTable, 50);
		this.bDone = mButton('Done!', this.controller.evaluate.bind(this.controller), dTable, { fz: 28, matop: 10, rounding: 10, padding: 16, border: 8 }, ['buttonClass']);

	}
	dropHandler(source, target, isCopy = true) {
		let dSource = iDiv(source);
		let dTarget = iDiv(target);
		mStyleX(dTarget, { bg: source.color });
		target.color = source.color;
		target.val = this.colors.indexOf(source.color);

	}

	evalIsCorrect() {
		Selected = { feedbackUI: Goal.buttonClicked };
		//console.log('Selected', Selected);
		return Goal.buttonClicked == Goal.buttonCorrect;
	}
	evalSolve() {
		//compare pattern to item values
		let [items, pattern, rows, cols] = [this.items, this.pattern, this.rows, this.cols];
		//mach ein pattern!
		console.log('flat', arrFlatten(this.items));
		let pat = items.map(x => x.map(y => y.val));
		printMatrix(pat, 'trial!');

		this.setGoal(pat);
		if (Goal.err) {
			Goal.correctionFeedbackUI = iDiv(this.items[Goal.err.row][Goal.err.col]);
			Goal.item = this.items[Goal.err.row][Goal.err.col];
		}

		Selected = { feedbackUI: this.dGrid };
		return Goal.correct;
	}
	eval() {
		clearFleetingMessage();
		//console.log(Goal.buttonClicked)
		return this.qName == 'solve' ? this.evalSolve() : this.evalIsCorrect();
	}

}

class GColoku_v0 extends Game {
	prompt() {

		console.log('WAS?????????',0=='    ',0===' '); // das ist true!!!!!!!!!!!!!!!!!!!!!!!
		//iconViewer(SymKeys);
		let [rows, cols] = [this.rows, this.cols] = [4, 4];
		let dGrid = mGrid(rows, cols, dTable, { position: 'relative', w: 300, h: 300, gap: 10, bg: 'white' });
		let pattern = getSudokuPattern(rows, cols);
		printMatrix(pattern, 'pattern');

		//let correct = checkSudokuRule(pattern); console.log('correct', correct);

		//screw up some of the time		
		//if (coin()) destroySudokuRule(pattern, rows, cols);
		
		destroySudokuRule(pattern, rows, cols);
		
		let err = checkSudokuRule(pattern);
		let correct = err == null; console.log('correct', correct);
		if (err) console.log('err',err.type,'['+err.row+','+err.col+']');
		//find the tile where the error really is!
		Goal = {correct:correct, err:err};


		//fill grid w/ colored divs
		let colors = this.colors = [RED, YELLOW, BLUE, GREEN];
		shuffle(colors);
		for (let r = 0; r < rows; r++) {
			for (let c = 0; c < cols; c++) {
				let d = mDiv(dGrid, { bg: colors[pattern[r][c]] }, getUID());
			}
		}

		let wline = 2;
		let gSize = getSize(dGrid);
		console.log('size:', gSize);
		let rh = makeRect((gSize.w - wline) / 2, 0, wline, gSize.h);
		let rv = makeRect(0, (gSize.h - wline) / 2, gSize.w, wline);
		let vLine = mDiv(dGrid, { bg: this.color, position: 'absolute', left: rh.l, top: rh.t, w: rh.w, h: rh.h });
		let hLine = mDiv(dGrid, { bg: this.color, position: 'absolute', left: rv.l, top: rv.t, w: rv.w, h: rv.h });

		//jetzt kommt aehnliche frage wie bei maze
		mLinebreak(dTable, 20);
		this.dChoices = mDiv(dTable);
		mLinebreak(dTable);

		let q = chooseRandom([this.isThisSudokuCorrect.bind(this)]);
		q();

		this.controller.activateUi.bind(this.controller)();
	}
	isThisSudokuCorrect(){
		showInstruction(this.showWord ? Goal.label : '', this.language == 'E' ? 'drag letters to form' : "forme", dTitle, true);
		mLinebreak(dTable);

		this.inputs = createDropInputs();
		let x = mLinebreak(dTable, 50);
		this.letters = createDragLetters();

		if (this.hidden) showFleetingMessage('category: ' + Pictures[0].info.subgroup, 5000);
		else if (!this.showWord) { showLabelPercentHintAfter(50, 6000); }

		this.controller.activateUi.bind(this.controller)();

	}
	trialPrompt() {
		sayTryAgain();
		setTimeout(() => {
			this.inputs.map(x => iDiv(x).innerHTML = '_')
			// mClass(d, 'blink');
		}, 1500);

		return 10;
	}
	eval(w, word) {
		Selected = { answer: w, reqAnswer: word, feedbackUI: iDiv(Goal) }; //this.inputs.map(x => iDiv(x)) };
		//console.log(Selected);
		return w == word;
	}

}


class GMaze1 extends Game {
	constructor(name, o) { super(name, o); }
	clear(){super.clear();MNaGraph.destroy();}
	startGame() {
		this.correctionFunc = () => {
			mStyleX(Goal.buttonCorrect, { bg: 'green' });
			animate(Goal.buttonCorrect, 'komisch', 1000);
			if (Goal.correctChoice.text == 'yes') this.showPath(); else this.colorComponents();
			//this.showPath();
			return 20000;
		};
		this.failFunc = () => {
			if (Goal.choice == Goal.correctChoice) { mStyleX(Goal.buttonClicked, { bg: 'green' }); mCheckit(Goal.feedbackUI, 100); }
			else { mXit(Goal.buttonClicked, 100); }
			mStyleX(this.dGraph, { opacity: 1 });
		}
		this.successFunc = () => {
			if (Goal.choice == Goal.correctChoice) { mStyleX(Goal.buttonClicked, { bg: 'green' }); mCheckit(Goal.feedbackUI, 100); }
			else { mXit(Goal.buttonClicked, 100); }
			mStyleX(this.dGraph, { opacity: 1 });
		}
	}
	startRound(){MNaGraph.destroy();}
	prompt() {

		this.trials = 1;
		[this.rows, this.cols] = [6 + this.level * 2, 6 + this.level * 2];

		let [rows, cols, sz, gap, szDoor] = [this.rows, this.cols, this.sz, this.gap, this.szDoor];
		let [wCell, hCell] = [sz, sz];
		let wTotal = cols * (wCell + gap);
		let hTotal = rows * (hCell + gap);
		let dGridOuter = this.dMaze = mDiv(dTable, { bg: 'BLUE', wmin: wTotal, hmin: hTotal });

		let g = this.graph = new MNaGraph(null, { noLabels: true, node: { bg: 'blue', w: 5, h: 5 }, edge: { w: 1 } }, [], false);
		let m = this.maze = newMazePlusGraph(cols, rows, g);

		let id = 'tMaze';
		setCSSVariable('--wCell', `${wCell}px`);
		setCSSVariable('--hCell', `${hCell}px`);
		let tMaze = createElementFromHtml(`
			<table id="${id}">
			<tbody></tbody>
			</table>
		`);
		mAppend(dGridOuter, tMaze);
		//console.log('maze', m);
		let sBorder = `${gap}px solid black`;
		for (var i = 0; i < m.length; i++) {
			$('#tMaze > tbody').append("<tr>");
			for (var j = 0; j < m[i].length; j++) {
				var selector = getCommonIdTable(i, j);;
				$('#tMaze > tbody').append("<td id='" + selector + "'>&nbsp;</td>");
				if (m[i][j][0] == 0) { $('#' + selector).css('border-top', sBorder); }
				if (m[i][j][1] == 0) { $('#' + selector).css('border-right', sBorder); }
				if (m[i][j][2] == 0) { $('#' + selector).css('border-bottom', sBorder); }
				if (m[i][j][3] == 0) { $('#' + selector).css('border-left', sBorder); }
				//mStyleX(mBy(selector), { bg: coin(30) ? 'random' : 'lightgreen' });
			}
			$('tMmaze > tbody').append("</tr>");
		}

		//hier drin kommt der graph!
		let rect = getRect(tMaze);
		let dGridOuter2 = this.dGraph = mDiv(dTable, { align: 'left', bg: 'aliceblue', maleft: 20, w: rect.w, h: rect.h });
		hide(this.dGraph);

		//#region prep container for multiple choices
		mLinebreak(dTable, 20);
		this.dChoices = mDiv(dTable);

		mLinebreak(dTable);
		//#endregion

		let q = chooseRandom([this.isThereAPath.bind(this)]);
		q();

		this.controller.activateUi.bind(this.controller)();
	}

	//#region is there a path
	isThereAPath() {

		//this.showGraph(); //for testing!

		let [g, m, sz] = [this.graph, this.maze, this.sz];
		let cellFrom = getCommonIdTable(0, 0);
		let roomFrom = getCommonId(0, 0);
		let cell = mBy(cellFrom);

		mCellContent(cell, { w: sz / 2, h: sz / 2, fz: sz / 3, bg: 'green', fg: 'white', rounding: '50%' }, 'A');

		//get last cell!
		//this.rows-1,this.cols-1
		let [r2, c2] = [this.rows - 1, this.cols - 1];
		let tl2 = m[r2][c2];
		let cellTo = getCommonIdTable(r2, c2);
		let roomTo = getCommonId(r2, c2);
		let cell2 = mBy(cellTo);
		//console.log(cell2);
		// mStyleX(cell2, { bg: 'red' })
		// cell2.innerHTML = 'B';
		mCellContent(cell2, { w: sz / 2, h: sz / 2, fz: sz / 3, bg: 'red', fg: 'white', rounding: '50%' }, 'B');

		[this.roomFrom, this.roomTo] = [roomFrom, roomTo];
		//#region spoken and written instruction
		let sp1 = {
			D: ['gibt es einen weeg von', 'gibt es einen weg von'],
			E: ['is there a path from', 'is there a path from'],
			S: ['hay un camino de', 'hay un camino de'],
			F: ["y a 'til un chemin de", "y a 'til un chemin de"],
		};
		let sp2 = {
			D: ['zu', 'zu'],
			E: ['to', 'to'],
			S: ['a', 'a'],
			F: ['!. a! ', 'à'],
		};
		let fill1 = [`. "A"! `, ` A `];
		let fill2 = [`. "B"`, ` B`];
		let l = this.language;
		let sp = sp1[l][0] + fill1[0] + sp2[l][0] + fill2[0] + '?';
		let wr = sp1[l][1] + fill1[1] + sp2[l][1] + fill2[1] + '?';

		let voice = this.language == 'E' ? coin() ? 'ukMale' : 'zira' : this.language;

		//#endregion

		showInstructionX(wr, dTitle, sp, { voice: voice });

		let path = this.path = g.getShortestPathFromTo(this.roomFrom, this.roomTo);
		// let funcs = this.dijkstra = g.getShortestPathsFrom(idGraph);
		// let len = funcs.distanceTo('#' + roomTo);
		// let path = funcs.pathTo('#' + roomTo);

		if (coin(30)) this.rausSchneiden();
		//this.rausSchneiden();
		let len = g.getLengthOfShortestPath(this.roomFrom, this.roomTo); //verify that no longer a path!!!!!

		let answer = len != Infinity;
		console.log('answer', answer, len)
		let correct, incorrect;
		if (answer) { correct = { num: 1, text: 'yes' }; incorrect = [{ num: 0, text: 'no' }]; }
		else { correct = { num: 0, text: 'no' }; incorrect = [{ num: 1, text: 'yes' }]; }
		createMultipleChoiceElements(correct, incorrect, this.dChoices, this.dMaze, {});
	}

	rausSchneiden() {
		let [g, m, path] = [this.graph, this.maze, this.path];
		let ids = path.map(x => x.id());

		let edges = path.edges(); //get all edges of path

		//find random edge along the path
		let i = randomNumber(edges.length / 2, edges.length * 3 / 4);
		let edge = edges[i];
		let eid = edges[i].id();
		//console.log('edge id', eid);

		//remove this edge: right now, just color it!
		edge.style({ 'line-color': 'red' });
		g.removeEdge(edge);
		setTimeout(() => { g.removeEdge(edge); }, 2000);
		//verify that there is no longer a solution!

		//get maze cells connected by this edge
		let [r1, c1, i1, r2, c2, i2] = getRCI(edge.id());
		//console.log('row,col,idx', r1, c1, i1, r2, c2, i2)
		let [m1, cell1, m2, cell2] = [getMaze(m, r1, c1), getCell(r1, c1), getMaze(m, r2, c2), getCell(r2, c2)];

		//maze cells should set component i1,i2 from 1 to 0
		console.assert(m1[i1] && m2[i2], 'ERRRRRRRRRRRRRRRRRRRRR!!!!!!!!!!!!')
		m1[i1] = m2[i1] = 0;

		//table cells should set corresponding border
		setBorder(cell1, i1);
		setBorder(cell2, i2);



	}
	showPath() {
		let cells = getPathCells(this.path);
		leaveBreadCrumbs(cells);
		//for (const cell of cells) { mStyleX(cell, { bg: '#ffffff80' }); }
	}
	colorComponents() {
		//this.showGraph();
		let g=this.graph;

		let c1=g.getComponents();
		//get hue wheel!!!
		let wheel=getColorWheel('red',c1.length);
		console.log('wheel',wheel)
		let i=0;
		for(const c11 of c1){
			let nodes = c11.nodes();
			let ids = nodes.map(x=>x.id());

			console.log('nodes',ids);
			let cells = ids.map(x=>nodeIdToCell(x));
			leaveBreadCrumbs(cells,wheel[i]);i++;
		}

	}


	//#region helpers
	hideGraph() {
		this.graph.cy.unmount();
		hide(this.dGraph);
	}
	showGraph() {
		show(this.dGraph);
		this.graph.cy.mount(this.dGraph);
		// g.presetLayout();
		// g.reset();
	}

	eval() {
		clearFleetingMessage();
		Selected = { reqAnswer: G.correctAnswer, answer: Goal.choice.text, feedbackUI: Goal.buttonClicked };

		//console.log('Selected', Selected);
		return (Goal.buttonClicked == Goal.buttonCorrect);
	}

}

function bGetCols_trial1(arr2d){
	let res=[];
	let numCols = arr2d[0].length;
	for(let c=0;c<numCols;c++){res.push([]);}
	for(const r of arr2d){
		for(let c=0;c<r.length;c++){res[c].push(r[c]);}
	}
	return res;
}

function gridLabeled(list, picLabelStyles) {
	//cont,pic,text
	let dGrid = mDiv(mBy('table'));
	let elems = [];
	let isText = true;
	let isOmoji = false;
	let pictureSize = 200;
	let stylesForLabelButton = { rounding: 10, margin: pictureSize / 8 };

	for (const k of list) {
		let info = symbolDict[k];
		let label = info.type == 'emo' ? (isdef(info.bestE) ? info.bestE : lastOfLanguage(k, 'E')) + ' ' + lastIndex
			: k;
		let el = maPicLabelButtonFitText(info, label,
			{ w: pictureSize, h: pictureSize, bgPic: 'random', shade: null, contrast: null },
			onClickIVPicture, dGrid, stylesForLabelButton, 'frameOnHover', isText, isOmoji);
		el.id = 'pic' + lastIndex;
		elems.push(el);
		Pictures.push({ div: el, info: info, label: label, isSelected: false });
		lastIndex += 1;
	}
	let gridStyles = { 'place-content': 'center', gap: 4, margin: 4, padding: 4, bg: 'silver', rounding: 5 };
	let size = layoutGrid(elems, dGrid, gridStyles, { rows: 10, isInline: true });
	console.log('lastIndex', lastIndex)
}

function onClickIVPicture(ev) {
	ev.cancelBubble = true;
	//let id = evToClosestId(ev);	console.log(id, Pictures, Pictures[10]);//let i = firstNumber(id);	let pic = Pictures[i];
	let pic = findItemFromEvent(Pictures, ev);

	toggleSelectionOfPicture(pic);

}
function gridLabeledX(keyList, labelList, dParent, { rows, layout } = {}, clickHandler) {
	//cont,pic,text
	let dGrid = mDiv(dParent);
	let elems = [];
	let isText = true;
	let isOmoji = false;
	let pictureSize = 200;
	let stylesForLabelButton = { rounding: 10, margin: pictureSize / 8 };
	let pics = [];

	for (let i = 0; i < keyList.length; i++) {
		let k = keyList[i];
		let info = symbolDict[k];
		let label = labelList[i];
		let el = maPicLabelButtonFitText(info, label,
			{ w: pictureSize, h: pictureSize, bgPic: 'random', shade: null, contrast: null },
			clickHandler, dGrid, stylesForLabelButton, 'frameOnHover', isText, isOmoji);
		el.id = 'pic' + lastIndex;
		elems.push(el);
		pics.push({ div: el, info: info, label: label, isSelected: false });
		lastIndex += 1;
	}
	let gridStyles = { 'place-content': 'center', gap: 4, margin: 4, padding: 4, bg: 'silver', rounding: 5 };
	let func = (layout == 'flex' ? layoutFlex : layoutGrid);
	let size = func(elems, dGrid, gridStyles, { rows: rows, isInline: true });
	return pics;
}

function createGridLayout_dep(d, layout) {

	//first need to make each line of grid layout equal sized! do I? what happens if I dont?

	let s = '';
	let m = [];
	let maxNum = 0;
	let areaNames = [];
	//console.log('layout', layout)
	for (const line of layout) {
		let letters = line.split(' ');
		let arr = [];
		for (const l of letters) {
			if (!isEmpty(l)) {
				addIf(areaNames, l);
				arr.push(l);
			}
		}
		m.push(arr);
		if (arr.length > maxNum) maxNum = arr.length;
	}
	//console.log('jagged matrix:', m)

	//habe jagged array, muss into matrix verwandeln!
	//last letter of each row will be repeated!
	for (const line of m) {
		let el = line[line.length - 1];
		while (line.length < maxNum) line.push(el);
		s += '"' + line.join(' ') + '" ';

	}
	//console.log('matrix:', m)

	//console.log(m,s);
	d.style.gridTemplateAreas = s;// eg. '"z z z" "a b c" "d e f"';

	if (SPEC.collapseEmptySmallLetterAreas) { collapseSmallLetterAreas(m, d); }
	else fixedSizeGrid(m, d);

	return areaNames;
}
function createAreas_dep(d, areaNames, prefix, shadeAreaBackgrounds=false, showAreaNames=true) {
	console.log('creating areas',areaNames)
	let palette = getTransPalette9();
	let ipal = 1;
	for (const areaName of areaNames) {
		//create this area
		let d1 = document.createElement('div');
		let id = (isdef(prefix)?prefix + '.':'') + areaName;
		d1.id = id;
		d1.style.gridArea = areaName;
		mStyleX(d1,{bg:'random'});//,w:'100%',h:'100%'})
		d1.innerHTML='hallo'
		if (shadeAreaBackgrounds) { d1.style.backgroundColor = colorPalette[ipal]; ipal = (ipal + 1) % colorPalette.length; }
		
		if (showAreaNames) { d1.innerHTML = makeAreaNameDomel(areaName); }
		//UIS[id] = { elem: d1, children: [] };
		d.appendChild(d1);

	}

}


function mStyleToCy(k, v, di, cyGroup) {
	let [prop, val] = translateToCssStyle(k, v, true);
	//console.log('prop',prop)
	if (cyGroup == 'edge' && k == 'bg') di['line-color'] = val;
	else if (prop == 'shape' && val == 'hex') {
		//console.log('hallo!!!')
		di.shape = 'polygon';
		di['shape-polygon-points'] = [0, -1, 1, -0.5, 1, 0.5, 0, 1, -1, 0.5, -1, -0.5];
	}
	else di[prop] = val;
}
class GMaze extends Game {
	constructor(name, o) { super(name, o); }
	clear(){super.clear(); if (isdef(this.maze)) this.maze.clear();}
	startGame() {
		this.correctionFunc = () => {
			mStyleX(Goal.buttonCorrect, { bg: 'green' });
			animate(Goal.buttonCorrect, 'komisch', 1000);
			if (Goal.correctChoice.text == 'yes') this.maze.breadCrumbs(this.path); else this.maze.colorComponents();

			return 20000;
		};
		this.failFunc = () => {
			if (Goal.choice == Goal.correctChoice) { mStyleX(Goal.buttonClicked, { bg: 'green' }); mCheckit(Goal.feedbackUI, 100); }
			else { mXit(Goal.buttonClicked, 100); }
			//mStyleX(this.dGraph, { opacity: 1 });
		}
		this.successFunc = () => {
			if (Goal.choice == Goal.correctChoice) { mStyleX(Goal.buttonClicked, { bg: 'green' }); mCheckit(Goal.feedbackUI, 100); }
			else { mXit(Goal.buttonClicked, 100); }
		}
	}
	startRound(){if (isdef(this.maze)) this.maze.clear();}
	prompt() {

		this.trials = 1;
		[this.rows, this.cols] = [6 + this.level * 2, 6 + this.level * 2];

		let maze = this.maze = new MazeGraph(dTable,this.rows,this.cols,this.sz,this.gap);

		mLinebreak(dTable, 20);
		this.dChoices = mDiv(dTable);
		mLinebreak(dTable);

		let q = chooseRandom([this.isThereAPath.bind(this)]);
		q();

		this.controller.activateUi.bind(this.controller)();
	}

	isThereAPath() {

		//this.maze.showGraph(); //for testing!

		//set content of start and goal cells
		let cellStart = this.maze.getTopLeftCell();
		//console.log('cellStart',cellStart)
		mCellContent(iDiv(cellStart), { w: '50%', h: '50%', fz: '60%', bg: 'green', fg: 'white', rounding: '50%' }, 'A');

		let cellGoal = this.maze.getBottomRightCell();
		mCellContent(iDiv(cellGoal), { w: '50%', h: '50%', fz: '60%', bg: 'red', fg: 'white', rounding: '50%' }, 'B');

		[this.roomFrom, this.roomTo] = [cellStart.nodeId, cellGoal.nodeId];

		//#region spoken and written instruction
		let sp1 = {
			D: ['gibt es einen weeg von', 'gibt es einen weg von'],
			E: ['is there a path from', 'is there a path from'],
			S: ['hay un camino de', 'hay un camino de'],
			F: ["y a 'til un chemin de", "y a 'til un chemin de"],
		};
		let sp2 = {
			D: ['zu', 'zu'],
			E: ['to', 'to'],
			S: ['a', 'a'],
			F: ['!. a! ', 'à'],
		};
		let fill1 = [`. "A"! `, ` A `];
		let fill2 = [`. "B"`, ` B`];
		let l = this.language;
		let sp = sp1[l][0] + fill1[0] + sp2[l][0] + fill2[0] + '?';
		let wr = sp1[l][1] + fill1[1] + sp2[l][1] + fill2[1] + '?';

		let voice = this.language == 'E' ? coin() ? 'ukMale' : 'zira' : this.language;

		showInstructionX(wr, dTitle, sp, { voice: voice });
		//#endregion

		let path = this.path = this.maze.getShortestPathFromTo(this.roomFrom, this.roomTo);

		console.assert(path.length < Infinity,'WAAAAAAAAAAAAAAS?');
		if (coin(30)) this.maze.cutPath(this.path,.5,.75);
		// this.maze.cutPath(this.path,.5,.75);
		let len = this.maze.getLengthOfShortestPath(this.roomFrom, this.roomTo); //verify that no longer a path!!!!!

		let answer = len != Infinity;
		console.log('answer', answer, len)
		let correct, incorrect;
		if (answer) { correct = { num: 1, text: 'yes' }; incorrect = [{ num: 0, text: 'no' }]; }
		else { correct = { num: 0, text: 'no' }; incorrect = [{ num: 1, text: 'yes' }]; }
		createMultipleChoiceElements(correct, incorrect, this.dChoices, this.maze.dMaze, {});
	}

	hideGraph() {
		this.graph.cy.unmount();
		hide(this.dGraph);
	}
	showGraph() {
		//show(this.dGraph);
		//this.graph.cy.mount(this.dGraph);
		// g.presetLayout();
		// g.reset();
	}

	eval() {
		clearFleetingMessage();
		//console.log(Goal.buttonClicked)
		Selected = { reqAnswer: G.correctAnswer, answer: Goal.choice.text, feedbackUI: Goal.buttonClicked };

		//console.log('Selected', Selected);
		return (Goal.buttonClicked == Goal.buttonCorrect);
	}

}

class AbstractGraph {
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
		console.log(nid1, nid2)
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
	addLayoutControls_dep() {
		let [dParent, wside] = [iDiv(this), 40];
		mStyleX(dParent, { rounding: 6, hmin: 355 });

		let sb = this.sb = mDiv(dParent, { position: 'absolute', w: wside, h: '100%', bg: '#ffffff80', top: 0, 'border-radius': '6px 0 0 6px' });
		mCenterCenterFlex(sb);
		let id = this.id;
		mButton('BFS', () => this.breadthfirst(), sb, {}, ['tbb']);
		mButton('circle', () => this.circle(), sb, {}, ['tbb']);
		mButton('CC', () => this.concentric(), sb, {}, ['tbb']);
		mButton('cose', () => this.cose(), sb, {}, ['tbb']);
		mButton('euler', () => this.euler(), sb, {}, ['tbb']);
		mButton('fcose', () => this.fcose(), sb, {}, ['tbb']);
		mButton('grid', () => this.gridLayout(), sb, {}, ['tbb']);
		mButton('klay', () => this.klay(), sb, {}, ['tbb']);
		mButton('prest', () => this.presetLayout(), sb, {}, ['tbb']);
		mButton('rand', () => this.randomLayout(), sb, {}, ['tbb']);
		mButton('reset', () => this.reset(), sb, {}, ['tbb']);
		mButton('store', () => this.storeCurrentPositions(), sb, {}, ['tbb']);
		return sb;
	}
	addLayoutControls_dep2(buttonlist) {
		let [dParent, wside] = [iDiv(this), 40];
		mStyleX(dParent, { rounding: 6, hmin: 355 });

		let sb = this.sb = mDiv(dParent, { position: 'absolute', w: wside, h: '100%', bg: '#ffffff80', top: 0, 'border-radius': '6px 0 0 6px' });
		mCenterCenterFlex(sb);
		let id = this.id;
		let buttons = {
			BFS: mButton('BFS', () => this.breadthfirst(), sb, {}, ['tbb']),
			circle: mButton('circle', () => this.circle(), sb, {}, ['tbb']),
			CC: mButton('CC', () => this.concentric(), sb, {}, ['tbb']),
			cose: mButton('cose', () => this.cose(), sb, {}, ['tbb']),
			euler: mButton('euler', () => this.euler(), sb, {}, ['tbb']),
			fcose: mButton('fcose', () => this.fcose(), sb, {}, ['tbb']),
			grid: mButton('grid', () => this.gridLayout(), sb, {}, ['tbb']),
			klay: mButton('klay', () => this.klay(), sb, {}, ['tbb']),
			prest: mButton('prest', () => this.presetLayout(), sb, {}, ['tbb']),
			rand: mButton('rand', () => this.randomLayout(), sb, {}, ['tbb']),
			reset: mButton('reset', () => this.reset(), sb, {}, ['tbb']),
			store: mButton('store', () => this.storeCurrentPositions(), sb, {}, ['tbb']),
		};
		for (const b in buttons) {
			if (!buttonlist.includes(b)) hide(buttons[b]);
		}
		return sb;
	}
	addLayoutControls(sb, buttonlist) {
		//let [dParent, wside] = [iDiv(this), 40];
		//mStyleX(dParent, { rounding: 6, hmin: 355 });

		//let sb = this.sb = mDiv(dParent, { position: 'absolute', w: wside, h: '100%', bg: '#ffffff80', top: 0, 'border-radius': '6px 0 0 6px' });
		//mCenterCenterFlex(sb);
		// let id = this.id;
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
			store: mButton('store', () => this.storeCurrentPositions(), sb, {}, ['tbb']),
		};
		for (const b in buttons) {
			if (!buttonlist.includes(b)) hide(buttons[b]);
		}
		return buttons;
	}
	addVisual_dep(dParent, styles = {}) {

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
		let d1 = mDiv(dParent, { position: 'relative', bg: 'green', w: size.w - 80, left: 40, top: 0, h: size.h, align: 'left' });
		// console.log('size',size)
		// let dCy = mDiv(dParent, { position: 'absolute', left: 40, top: 0, w: 'calc( 100% - 80px )', h: '100%' });
		// let dCy = mDiv(dParent, {display:'inline-block', position: 'absolute', left: 40, top: 0, w: size.w-80, h: size.h });
		this.cy.mount(d1);
		this.cy.style(cyStyle);
		// console.log('extent',g.cy.extent());
		this.enablePanZoom();
		iAdd(this, { div: dParent, dCy: d1 });
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
class MazeGraph extends AbstractGraph {
	constructor(dParent, rows, cols, sz, gap = 4) {
		super();

		[this.cols, this.rows, this.sz, this.gap] = [cols, rows, sz, gap];
		let m = this.m = this.createMaze(cols, rows, sz, gap);
		let dMaze = this.dMaze = this.createDiv(dParent, cols, rows, sz, gap);

		let szMaze = getSize(dMaze);
		let dGraph = this.dGraph = mDiv(dParent, { align:'left', w: szMaze.w, h: szMaze.h, bg: 'pink', maleft: 20});//, opacity: 0 });
		this.sb = mDiv(dParent, { w: 40 }); mCenterCenterFlex(this.sb);


		this.items = this.createCellItems();
		console.log('items', this.items)
	}
	getTopLeftCell() { return this.getCell(0, 0); }
	getTopRightCell() { return this.getCell(0, this.cols - 1); }
	getBottomLeftCell() { return this.getCell(this.rows - 1, 0); }
	getBottomRightCell() { return this.getCell(this.rows - 1, this.cols - 1); }

	getCell(row, col) { return this.matrix[row][col]; }// mBy(this.getCommonIdTable(row, col)); }
	getCommonId(row, col) { return '' + row + "-" + col; }
	getCommonIdTable(row, col) { return 'td_' + this.getCommonId(row, col); }
	getRCI(edgeId) {
		//edge id is of the form r1-c1_r2-c2
		let [r1, c1, r2, c2] = allNumbers(edgeId).map(x => Math.abs(x));	//console.log('r,c 1:',r1,c1,'\nr,c 2:',r2,c2);
		let i1, i2; //indices that have to be switched form 1 to 0
		i1 = r1 < r2 ? 2 : r1 > r2 ? 0 : c1 < c2 ? 1 : 3;
		i2 = i1 == 0 ? 2 : i1 == 1 ? 3 : i1 == 2 ? 0 : 1;
		return [r1, c1, i1, r2, c2, i2];
	}
	getRelativeDirections(item1, item2) {
		//edge id is of the form r1-c1_r2-c2
		let [r1, c1, r2, c2] = [item1.row, item1.col, item2.row, item2.col];//allNumbers(edgeId).map(x=>Math.abs(x));	//console.log('r,c 1:',r1,c1,'\nr,c 2:',r2,c2);
		let i1, i2; //indices that have to be switched form 1 to 0
		i1 = r1 < r2 ? 2 : r1 > r2 ? 0 : c1 < c2 ? 1 : 3;
		i2 = i1 == 0 ? 2 : i1 == 1 ? 3 : i1 == 2 ? 0 : 1;
		return [i1, i2];
	}
	createCellItems() {
		//each cellItem should contain: div:table td, sz, row, col, maze arr, id=idNode, idCell
		let items = [];
		this.matrix = [];
		for (let r = 0; r < this.rows; r++) {
			this.matrix[r] = [];
			for (let c = 0; c < this.cols; c++) {
				let id = this.getCommonId(r, c);
				let item = { id: id, nid: id, nodeId: id, cellId: this.getCommonIdTable(r, c), row: r, col: c, sz: this.sz, marr: this.m[r, c] };
				delete Items[id];
				iAdd(item, { div: mBy(this.getCommonIdTable(r, c)) });
				items.push(item);

				this.matrix[r][c] = item;
				//console.log('item', item)
			}
		}
		return items;
	}
	createDiv(dParent, cols, rows, sz, gap) {
		let [wCell, hCell] = [sz, sz];
		let [wTotal, hTotal] = [cols * (wCell + gap), rows * (hCell + gap)];
		let dGridOuter = this.dMaze = mDiv(dParent, { bg: 'BLUE', wmin: wTotal, hmin: hTotal });

		let m = this.m;
		let id = 'tMaze';
		setCSSVariable('--wCell', `${wCell}px`);
		setCSSVariable('--hCell', `${hCell}px`);
		let tMaze = createElementFromHtml(`
			<table id="${id}">
			<tbody></tbody>
			</table>
		`);
		mAppend(dGridOuter, tMaze);
		//console.log('maze', m);
		let sBorder = `${gap}px solid black`;
		for (var i = 0; i < m.length; i++) {
			$('#tMaze > tbody').append("<tr>");
			for (var j = 0; j < m[i].length; j++) {
				var selector = this.getCommonIdTable(i, j);
				$('#tMaze > tbody').append("<td id='" + selector + "'>&nbsp;</td>");
				if (m[i][j][0] == 0) { $('#' + selector).css('border-top', sBorder); }
				if (m[i][j][1] == 0) { $('#' + selector).css('border-right', sBorder); }
				if (m[i][j][2] == 0) { $('#' + selector).css('border-bottom', sBorder); }
				if (m[i][j][3] == 0) { $('#' + selector).css('border-left', sBorder); }
				//mStyleX(mBy(selector), { bg: coin(30) ? 'random' : 'lightgreen' });
			}
			$('tMmaze > tbody').append("</tr>");
		}
		return dGridOuter;
	}
	createMaze(cols, rows, sz, gap) {
		// Establish variables and starting grid
		var dxy = sz + 2 * gap;
		var offs = dxy / 2 + gap;

		var totalCells = cols * rows;
		var cells = new Array();
		var unvis = new Array();
		for (var i = 0; i < rows; i++) {
			cells[i] = new Array();
			unvis[i] = new Array();
			for (var j = 0; j < cols; j++) {
				cells[i][j] = [0, 0, 0, 0];
				let pos = { x: offs + dxy * j, y: offs + dxy * i };
				this.addNode({ id: this.getCommonId(i, j), row: i, col: j, center: pos }, pos);
				unvis[i][j] = true;
			}
		}

		// Set a random position to start from
		var currentCell = [Math.floor(Math.random() * rows), Math.floor(Math.random() * cols)];
		var path = [currentCell];
		unvis[currentCell[0]][currentCell[1]] = false;
		var visited = 1;

		// Loop through all available cell positions
		while (visited < totalCells) {
			// Determine neighboring cells
			var pot = [[currentCell[0] - 1, currentCell[1], 0, 2],
			[currentCell[0], currentCell[1] + 1, 1, 3],
			[currentCell[0] + 1, currentCell[1], 2, 0],
			[currentCell[0], currentCell[1] - 1, 3, 1]];
			var neighbors = new Array();

			// Determine if each neighboring cell is in game grid, and whether it has already been checked
			for (var l = 0; l < 4; l++) {
				if (pot[l][0] > -1 && pot[l][0] < rows && pot[l][1] > -1 && pot[l][1] < cols && unvis[pot[l][0]][pot[l][1]]) { neighbors.push(pot[l]); }
			}

			// If at least one active neighboring cell has been found
			if (neighbors.length) {
				// Choose one of the neighbors at random
				let next = neighbors[Math.floor(Math.random() * neighbors.length)];

				// Remove the wall between the current cell and the chosen neighboring cell
				cells[currentCell[0]][currentCell[1]][next[2]] = 1;
				cells[next[0]][next[1]][next[3]] = 1;

				let row = currentCell[0];
				let col = currentCell[1];
				let row2 = next[0];
				let col2 = next[1];
				this.addEdge(this.getCommonId(row, col), this.getCommonId(row2, col2), {});

				// Mark the neighbor as visited, and set it as the current cell
				unvis[next[0]][next[1]] = false;
				visited++;
				currentCell = [next[0], next[1]];
				path.push(currentCell);
			}
			// Otherwise go back up a step and keep going
			else {
				currentCell = path.pop();
			}
		}
		return cells;
	}

	setItemBorder(item, dir) {
		let prop = getBorderPropertyForDirection(dir);
		iDiv(item).style[prop] = `${this.gap}px solid black`;
		//mStyleX(cell,{bg:'red'}); cell.innerHTML = dir;
	}
	setItemColor(item, color) { mStyleX(iDiv(item), { bg: color }); }
	setItemContent(item, text) { iDiv(item).innerHTML = text; }
	removeItemContent(item) { iDiv(item).innerHTML = ''; }
	disconnectCells(nid1, nid2) {
		this.removeEdge(this.getCommonEdgeId(nid1, nid2));
		let [item1, item2] = [Items[nid1], Items[nid2]];
		console.log('item1', item1, item2);

		let [dir1, dir2] = this.getRelativeDirections(item1, item2);
		// this.setItemColor(item1,'green');
		// this.setItemColor(item2,'lightgreen');
		//this.setItemContent(item1,'1');this.removeItemContent(item1);
		console.log('directions:', dir1, dir2);
		this.setItemBorder(item1, dir1);
		this.setItemBorder(item2, dir2);
	}
	cutPath(path, min, max) {
		let edges = path.edges();
		let len = edges.length;
		let [imin, imax] = [Math.floor(len * min), Math.floor(len * max)];
		let i = randomNumber(imin, imax);
		let edge = edges[i];
		let [nid1, nid2] = edge.connectedNodes().map(x => x.id());
		this.disconnectCells(nid1, nid2);
	}

	breadCrumbs(path, color = 'sienna', sz = 10) {
		for (const cell of path.nodes().map(x => Items[x.id()])) {
			mCellContent(iDiv(cell), { w: sz, h: sz, bg: color, fg: 'white', rounding: '50%' });
		}
	}
	colorComponents() {
		//this.showGraph();
		// let g = this.graph;

		let comps = this.getComponents();
		//get hue wheel!!!
		let wheel = getColorWheel('red', comps.length);
		//console.log('wheel', wheel)
		let i = 0;
		for (const comp of comps) {
			this.breadCrumbs(comp, wheel[i], 20); i += 1;
			// let nodes = comp.nodes();
			// let ids = nodes.map(x => x.id());

			// console.log('nodes', ids);
			// let cells = ids.map(x => nodeIdToCell(x));
			// leaveBreadCrumbs(cells, wheel[i]); i++;
		}

	}
	showGraph() {
		this.dGraph.style.opacity = 1;
		if (this.hasVisual) {show(this.dGraph); return;}
		this.addVisual(this.dGraph);
		this.storeCurrentPositions();
		this.addLayoutControls(this.sb, ['prest', 'grid', 'klay', 'rand', 'euler', 'reset', 'store']);//,'grid','euler','prest');		
		// setTimeout(() => {
		// 	this.comcola();
		// 	this.addLayoutControls(this.sb, ['cola', 'fit', 'prest', 'grid', 'klay', 'rand', 'euler', 'cose', 'reset', 'store']);//,'grid','euler','prest');
		// }, 2000);
	}
	hideGraph() {
		if (this.hasVisual) {
			this.dGraph.style.opacity = 0;
			hide(this.dGraph)
		}
	}

}
