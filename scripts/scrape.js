'use strict';

const fs = require('fs');
const ASINS = require('../src/js/scrape/asins');
const chunk = require('../src/js/scrape/helpers/chunk');
const scrape = require('../src/js/scrape/helpers/scrape');

(async () => {
	const asins = Object.entries(ASINS);

	for (let [key, value] of asins) {
		const CHUNKED_ASIN_LIST = chunk(value.asinList, 10);
		const FILE_NAME = key;
		const DATE = new Date();
		const DAY = DATE.getDate();
		const MONTH = DATE.getMonth() + 1;
		const YEAR = DATE.getFullYear();
		const DATE_PATH = `${MONTH}-${DAY}-${YEAR}`;

		for (let i = 0; i < CHUNKED_ASIN_LIST.length; i++) {
			try {
				const data = await scrape(CHUNKED_ASIN_LIST[i]);
				const bundle = value.bundle;

				if (!data) return;

				if (
					!fs.existsSync(`./data/asins/${DATE_PATH}`) ||
					!fs.existsSync(
						`./data/asins/${DATE_PATH}/bundle-${bundle}`
					)
				) {
					fs.mkdirSync(
						`./data/asins/${DATE_PATH}/bundle-${bundle}`,
						{recursive: true}
					);
				}

				const fileData = fs.existsSync(
					`./data/asins/${DATE_PATH}/bundle-${bundle}/${FILE_NAME}.json`
				)
					? fs.readFileSync(
							`./data/asins/${DATE_PATH}/bundle-${bundle}/${FILE_NAME}.json`,
							'utf8'
					  )
					: [];
				const failedAsinData = fs.existsSync(
					`./data/asins/${DATE_PATH}/failedAsins.json`
				)
					? fs.readFileSync(
							`./data/asins/${DATE_PATH}/failedAsins.json`,
							'utf8'
					  )
					: [];

				let asins = fileData.length ? JSON.parse(fileData) : [];
				let failedAsins = failedAsinData.length
					? JSON.parse(failedAsinData)
					: [];

				data.forEach((asin) => {
					if (
						asin &&
						asin.asin &&
						!asins.some((item) => item.asin === asin.asin) &&
						asin.offeringID &&
						asin.offeringID.length
					) {
						asins.push(asin);
					} else if (
						asin &&
						!failedAsins.some((item) => item.asin === asin.asin)
					) {
						failedAsins.push(asin);
					}
				});

				fs.writeFileSync(
					`./data/asins/${DATE_PATH}/bundle-${bundle}/${FILE_NAME}.json`,
					JSON.stringify(asins)
				);
				fs.writeFileSync(
					`./data/asins/${DATE_PATH}/failedAsins.json`,
					JSON.stringify(failedAsins)
				);
			} catch (error) {
				console.log(error);
			}
		}
	}
})();
