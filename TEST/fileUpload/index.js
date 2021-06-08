window.onload = start;

function start() {
	form_el.addEventListener('submit', async function (e) {
		const files = e.target.uploadedImages.files;
		if (files.length != 0) {
			for (const single_file of files) {
				data.append('uploadedImages', single_file)
			}
		}
	});

	const submit_data_fetch = await fetch('/projects', {
		method: 'POST',
		body: data
	});
}
