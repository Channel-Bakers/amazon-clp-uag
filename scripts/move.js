'use strict';

const fs = require('fs');

const entry = './data/asins/11-14-2019/bundle-2/iPhone11Case.json';
const output = './data/bundles/bundle-2/iPhone11Pro.json'
const data = {};
const asinList = [
	'B07XGMSWZM',
	'B07XMMX3G3',
	'B07XHNHG3X',
	'B07XHNHMHP',
	'B07XKDDV31',
	'B07XJ7JQGH',
	'B07XKDDXH9',
	'B07XKDD84Z',
	'B07XGMT6F1',
	'B07XKD9K49',
	'B07XHNHG4B',
	'B07XHNHG4J',
	'B07XHNJ6SJ',
	'B07XMFVGB1',
	'B07XMHDHN5',
	'B07XGMS4H9',
	'B07XMNB42J',
	'B07XHNHYQR',
	'B07XGMT6FC',
	'B07XMMX3HL',
];

let fileData = fs.readFileSync(entry, 'utf8');
fileData = JSON.parse(fileData);

Object.entries(fileData).forEach(([key, value]) => {
	const SERIES = value.series.toLowerCase();
	
	if (asinList.includes(value.asin)) {
		if (!data[SERIES])
			data[SERIES] = [];

		data[SERIES].push(value);
	}
});

fs.writeFileSync(output, JSON.stringify(data));
