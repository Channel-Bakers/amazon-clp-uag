'use strict';

const fs = require('fs');
const asinDir = './data/asins/11-15-2019/';
const dirents = fs.readdirSync(asinDir, {withFileTypes: true});
const bundles = dirents
	.filter((bundle) => bundle.isDirectory())
	.map((bundle) => bundle.name);

bundles.forEach((bundle) => {
	// Uncomment for testing
	// if (bundle !== 'bundle-1') return;

	const contents = fs.readdirSync(asinDir + bundle, {withFileTypes: true});
	const files = contents
		.filter((file) => !file.isDirectory())
		.map((file) => file.name);

	files.forEach((file) => {
		// Uncomment for testing
		// if (file !== 'appleWatchCase.json') return;

		const outputPath = `./data/bundles/${bundle}/${file}`;

		let fileData = fs.readFileSync(asinDir + bundle + `/${file}`, 'utf8');
		fileData = JSON.parse(fileData);

		// const items = Object.entries(fileData);
		const data = {};

		Object.entries(fileData).forEach(([key, value]) => {
			const SERIES = value.series.toLowerCase();

			if (!data[SERIES])
				data[SERIES] = [];
	
			data[SERIES].push(value);
		});

		if (
			!fs.existsSync(`./data/bundles`) ||
			!fs.existsSync(`./data/bundles/${bundle}`)
		) {
			fs.mkdirSync(`./data/bundles/${bundle}`, {recursive: true});
		}

		fs.writeFileSync(outputPath, JSON.stringify(data));
	});
});
