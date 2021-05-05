class Banner {
	constructor(dParent) { this.dParent = isdef(dParent) ? dParent : dBanner; this.init(); }
	clear() { clearElement(this.dParent); this.dParent.onclick = null; hide(this.dParent); }
	_createDivs() {
		this.dInstruction = mDiv(this.dContent);
		this.dMain = mDiv(this.dContent);
		this.dHint = mDiv(this.dContent); this.dHint.innerHTML = 'hallo'; this.dHint.style.opacity = 0;
	}
	_createScreen() {
		show(this.dParent);
		let bg = colorTrans('silver', .25);
		let d = mScreen(this.dParent, { bg: bg, display: 'flex', layout: 'fvcc' });
		let dContent = mDiv(d, { display: 'flex', layout: 'fvcs', fg: 'contrast', fz: 24, bg: 'silver', patop: 50, pabottom: 50, matop: -50, w: '100vw' });
		return [d, dContent];
	}
	init() {
		//console.log('banner init!!!!');
		[this.div, this.dContent] = this._createScreen();
		this.dParent.onclick = () => this.clear();
		this._createDivs();
	}
	message(arr, callback) {
		this.dInstruction.innerHTML = arr.join(' ');
		if (isdef(callback)) this.dParent.onclick = () => { this.clear(); callback(); };
	}
}
