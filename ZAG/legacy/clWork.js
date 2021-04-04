function visNumber(n, dParent, color, or = 'h', asNumber = [0]) {
	//small grid w/ inside n dots in color

	if (!isNumber(n) || asNumber.includes(n)) return zText(''+n, dParent, { fg: 'white', fz: 64 });
	return _visualizeNumber(n, dParent, color, or);
}
function visOperator(s, dParent, styles = { fg: 'white', fz: 64 }) {
	zText(s, dParent, styles);
}
function visOperation(op, a, b, dParent, symResult) {
	switch (op) {
		case 'plus':
		case 'minus': return _visualizeAritOp(op, a, b, dParent,symResult); break;
		case 'mult': return _visualizeMult(a, b, dParent,symResult); break;
	}
}
function _visualizeMult(a, b, dParent, symResult) {
	//opKey is one of the keys in OPS (plus, minus,mult,) or the object OPS[key]
	op = OPS.mult;
	//console.log('op', op)
	let dx = mDiv(dParent); mFlex(dx); mStyleX(dx, { 'align-items': 'center', gap: 16 });
	visNumber(a, dx, 'blue', 'v');
	for (let i = 1; i < b; i++) {
		let d2 = visOperator('+', dx);
		visNumber(a, dx, 'blue', 'v');
	}
	let d4 = visOperator('=', dx);
	let result = isdef(symResult)?symResult:op.f(a, b);
	let d5 = visNumber(result, dx, 'red');
	return dx;
}
function _visualizeAritOp(op, a, b, dParent, symResult) {
	//opKey is one of the keys in OPS (plus, minus,mult,) or the object OPS[key]
	op = isString(op) ? OPS[op] : op;
	//console.log('op', op)
	let dx = mDiv(dParent); mFlex(dx); mStyleX(dx, { 'align-items': 'center', gap: 16 });
	let d1 = visNumber(a, dx, 'blue');
	let d2 = visOperator(op.wr, dx);
	let d3 = visNumber(b, dx, 'green');
	let d4 = visOperator('=', dx);
	// let result = op.f(a, b);
	let result = isdef(symResult)?symResult:op.f(a, b);
	let d5 = visNumber(result, dx, 'red');
	return dx;

}
function _visualizeNumber(n, dParent, color, or = 'h') {
	let root = Math.sqrt(n);
	let rows = Math.floor(root);
	let cols = Math.ceil(root);
	if (or == 'v') { let h = rows; rows = cols; cols = h; }
	let dArea = mDiv(dParent, { display: 'inline-grid', 'grid-template-columns': `repeat(${cols}, 1fr)`, bg: 'white', fg: color });
	for (let i = 0; i < n; i++) {
		let item = getItem('plain-circle');
		//console.log('item', item)
		let d = miPic(item, dArea, { fz: 12, margin: 6 });
		iAdd(item, { div: d });
		mAppend(dArea, d);
	}
	return dArea;
}
function zText(text, dParent, textStyles, hText, vCenter = false) {
	let tSize = getSizeWithStyles(text, textStyles);
	let extra = 0, lines = 1;
	if (isdef(hText)) {
		extra = hText - tSize.h;
		if (textStyles.fz) lines = Math.floor(tSize.h / textStyles.fz);
	}
	let dText = isdef(text) ? mText(text, dParent, textStyles) : mDiv(dParent);
	if (extra > 0 && vCenter) {
		dText.style.paddingTop = (extra / 2) + 'px';
		dText.style.paddingBottom = (extra / 2) + 'px';
	}
	return { text: text, div: dText, extra: extra, lines: lines, h: tSize.h, w: tSize.w, fz: textStyles.fz };
}


