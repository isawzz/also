//#region drag drop example mit letters und inputs: TODO: generalize!
var DragElem = null; //is the clone of HTML element from which drag started
var DDInfo = null;
function addDDSource(source, isCopy=true) {
	DDInfo.sources.push(source);
	let d=getDiv(source);
	d.onmousedown = (ev) => ddStart(ev, source, isCopy); 
}
function enableDD(sources, targets,dropHandler, isCopy) {
	DDInfo = { sources: sources, targets: targets, dropHandler:dropHandler };
	let sourceDivs = getDivs(sources);
	for(let i=0;i<sources.length;i++){
		let source=sources[i];
		let d=sourceDivs[i];
		d.onmousedown = (ev) => ddStart(ev, source, isCopy); 
	}
}
function ddStart(ev, source, isCopy = true) {
	if (!canAct()) return;
	ev.preventDefault();

	//console.log('ev',ev,'source',source);

	DDInfo.source = source;
	let d = getDiv(source);
	var clone = DragElem = DDInfo.clone = d.cloneNode(true);
	// clone.eliminateSource = !isCopy;
	clone.isCopy = isCopy;
	mAppend(document.body, clone);//mClass(clone, 'letter')
	mClass(clone, 'dragelem');//der clone muss class 'dragelem' sein
	mStyleX(clone, { left: ev.clientX - ev.offsetX, top: ev.clientY - ev.offsetY });//der clone wird richtig plaziert
	clone.drag = { offsetX: ev.offsetX, offsetY: ev.offsetY };
	// von jetzt an un solange DragElem != null ist muss der clone sich mit der maus mitbewegen
	document.body.onmousemove = onMovingCloneAround;
	document.body.onmouseup = onReleaseClone;// ev=>console.log('mouse up')
}
function onMovingCloneAround(ev) {
	if (DragElem === null) return;

	let mx = ev.clientX;
	let my = ev.clientY;
	let dx = mx - DragElem.drag.offsetX;
	let dy = my - DragElem.drag.offsetY;
	mStyleX(DragElem, { left: dx, top: dy });
}
function onReleaseClone(ev) {
	let els = allElementsFromPoint(ev.clientX, ev.clientY);
	//console.log('_________',els);
	let source = DDInfo.source;
	let dSource = getDiv(source);
	let dropHandler = DDInfo.dropHandler;
	for (const target of DDInfo.targets) {
		let dTarget = getDiv(target);
		if (els.includes(dTarget)) {
			if (isdef(dropHandler)){
				dropHandler(source,target,DragElem.isCopy);
			}else console.log('dropped',source,'on',target);
			//console.log('yes, we are over',dTarget);
			// dTarget.innerHTML = DragElem.innerHTML;

		}
	}
	//destroy clone
	//if (DragElem.eliminateSource) dSource.remove();
	DragElem.remove();
	DragElem = null;
	//DDInfo = null;
	document.body.onmousemove = document.body.onmouseup = null;
}
//#endregion

function canAct() { return true; }
function getDiv(x){if (isdef(x.div)) return x.div; else return x;}
function getDivs(list) {
	if (isdef(list[0].div)) return list.map(x => x.div); else return list;
}














