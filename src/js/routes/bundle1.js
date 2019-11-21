'use strict';

import Bundle from '../util/lib/Bundle';
import * as bands from '../../../data/bundles/bundle-1/appleWatchBand.json';
import * as iphone11 from '../../../data/bundles/bundle-1/iPhone11.json';
import * as iphone11Pro from '../../../data/bundles/bundle-1/iPhone11Pro.json';
import * as iphone11ProMax from '../../../data/bundles/bundle-1/iPhone11ProMax.json';

export default {
	init() {
		const WATCH_BANDS = bands.default;
		
		const IPHONE_11 = iphone11.default;
		const IPHONE_11_OPTIONS = {
			target: 'bundle1-iphone11',
			image: {
				position: 'top',
			},
			dropdowns: [
				{
					id: 'iPhone11',
					data: IPHONE_11,
				},
				{
					id: 'watchBand',
					data: WATCH_BANDS,
				},
			],
			discount: {
				symbol: '%',
				amount: '50',
				product: 'Apple Watch Band',
			},
		};

		const IPHONE_11_BUNDLE = new Bundle({
			...IPHONE_11_OPTIONS,
		});


		const IPHONE_11_PRO = iphone11Pro.default;
		const IPHONE_11_PRO_OPTIONS = {
			target: 'bundle1-iphone11_pro',
			image: {
				position: 'top',
			},
			dropdowns: [
				{
					id: 'iPhone11Pro',
					data: IPHONE_11_PRO,
				},
				{
					id: 'watchBand',
					data: WATCH_BANDS,
				},
			],
			discount: {
				symbol: '%',
				amount: '50',
				product: 'Apple Watch Band',
			},
		};

		const IPHONE_11_PRO_BUNDLE = new Bundle({
			...IPHONE_11_PRO_OPTIONS,
		});


		const IPHONE_11_PRO_MAX = iphone11ProMax.default;
		const IPHONE_11_PRO_MAX_OPTIONS = {
			target: 'bundle1-iphone11_pro-max',
			image: {
				position: 'top',
			},
			dropdowns: [
				{
					id: 'iPhone11ProMax',
					data: IPHONE_11_PRO_MAX,
				},
				{
					id: 'watchBand',
					data: WATCH_BANDS,
				},
			],
			discount: {
				symbol: '%',
				amount: '50',
				product: 'Apple Watch Band',
			},
		};

		const IPHONE_11_PRO_MAX_BUNDLE = new Bundle({
			...IPHONE_11_PRO_MAX_OPTIONS,
		});
	},

	finalize() {},
};
