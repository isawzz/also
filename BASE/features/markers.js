//#region Markers
const MarkerText = ['✔️', '❌'];
const MarkerId = { SUCCESS: 0, FAIL: 1 };
var Markers = [];

function mpOver(d, dParent, fz, color, picStyle) {
	let b = getRect(dParent);
	let cx = b.w / 2 + b.x;
	let cy = b.h / 2 + b.y;
	d.style.top = picStyle == 'segoeBlack' ? ((cy - fz * 2 / 3) + 'px') : ((cy - fz / 2) + 'px');
	d.style.left = picStyle == 'segoeBlack' ? ((cx - fz / 3) + 'px') : ((cx - fz * 1.2 / 2) + 'px');
	d.style.color = color;
	d.style.fontSize = fz + 'px';
	d.style.display = 'block';
	let { isText, isOmoji } = getParamsForMaPicStyle(picStyle);
	d.style.fontFamily = isString(isOmoji) ? isOmoji : isOmoji ? 'emoOpen' : 'emoNoto';
	return d;
}
function getParamsForMaPicStyle(desc = 'segoeBlack') {
	desc = desc.toLowerCase();
	switch (desc) {
		case 'twittertext': return { isText: true, isOmoji: false };
		case 'twitterimage': return { isText: false, isOmoji: false };
		case 'openmojitext': return { isText: true, isOmoji: true };
		case 'openmojiimage': return { isText: false, isOmoji: true };
		case 'openmojiblacktext': return { isText: true, isOmoji: 'openmoBlack' };
		case 'segoe': return { isText: true, isOmoji: 'segoe ui emoji' };
		case 'segoeblack': return { isText: true, isOmoji: 'segoe ui symbol' };
		default: return { isText: true, isOmoji: false };
	}

}

function markerSuccess() { return createMarker(MarkerId.SUCCESS); }
function markerFail() { return createMarker(MarkerId.FAIL); }
function createMarker(markerId) {
	//<div class='feedbackMarker'>✔️</div>
	//console.log('markers', Markers, markerId);
	let divs = document.getElementsByClassName('feedbackMarker');
	//console.log('divs', divs);
	let d;
	// if (isdef(divs[0])) {
	// 	console.log('there is already a feedbackMarker!!!!!!');
	// 	d = divs[0];
	// 	console.log('Markers',Markers)
	// } else {
	d = mCreate('div');
	d.innerHTML = MarkerText[markerId]; //>0? '✔️':'❌';
	mClass(d, 'feedbackMarker');
	document.body.appendChild(d);
	Markers.push(d);
	// }
	return d;
}
function mRemoveGracefully(elem) {
	mClass(elem, 'aniFastDisappear');
	setTimeout(() => mRemove(elem), 500);
}
function removeMarkers() {
	for (const m of Markers) {
		mRemoveGracefully(m);
	}
	Markers = [];
}
