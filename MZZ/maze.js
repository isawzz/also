class MazeGraph extends AGraph {
	constructor(dParent, rows, cols, sz, gap = 4) {
		super();

		[this.cols, this.rows, this.sz, this.gap] = [cols, rows, sz, gap];
		let m = this.m = this.createMaze(cols, rows, sz, gap);
		let dMaze = this.dMaze = this.createDiv(dParent, cols, rows, sz, gap);

		let szMaze = getSize(dMaze);
		let dGraph = this.dGraph = mDiv(dParent, { align:'left', w: szMaze.w, h: szMaze.h, bg: 'pink', maleft: 20});//, opacity: 0 });
		let sb = this.sb = mDiv(dParent, { w: 40 }); mCenterCenterFlex(this.sb);
		hide(dGraph);hide(sb);

		this.items = this.createCellItems();
		//console.log('items', this.items)
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
		//console.log('item1', item1, item2);

		let [dir1, dir2] = this.getRelativeDirections(item1, item2);
		// this.setItemColor(item1,'green');
		// this.setItemColor(item2,'lightgreen');
		//this.setItemContent(item1,'1');this.removeItemContent(item1);
		//console.log('directions:', dir1, dir2);
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
		this.addLayoutControls(this.sb, ['show','hide','prest', 'grid', 'klay', 'rand', 'euler', 'reset', 'store']);//,'grid','euler','prest');		
		// setTimeout(() => {
		// 	this.comcola();
		// 	this.addLayoutControls(this.sb, ['cola', 'fit', 'prest', 'grid', 'klay', 'rand', 'euler', 'cose', 'reset', 'store']);//,'grid','euler','prest');
		// }, 2000);
	}
	hideGraph() {
		if (isdef(this.dGraph) && this.hasVisual) {
			//this.dGraph.style.opacity = 0;
			this.dGraph.style.display = 'none';
			// hide(this.dGraph);
		}
	}

}
