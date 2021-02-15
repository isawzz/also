function showItems(items, dParent, options = {}) {

	for (let i = 0; i < items.length; i++) {
		let item = items[i];
		let info = item.info;

		let [dOuter,dInner]=mCenterWrapper();
		item.div = dOuter;

		if (options.labelTop) item.dLabel = mText(item.label, dInner, options.labelStyles);

		let dPic = item.dPic = mDiv(dInner, { family: info.family });
		dPic.innerHTML = info.text;
		if (isdef(options.picStyles)) mStyleX(dPic, options.picStyles);

		if (options.labelBottom) item.dLabel = mText(item.label, dInner, options.labelStyles);

		if (isdef(options.outerStyles)) mStyleX(dOuter, options.outerStyles);

		if (isdef(options.handler)) dOuter.onclick = options.handler;
		item.options = options;
	}

	presentItems(items, dParent, options);
	return dParent;
}































