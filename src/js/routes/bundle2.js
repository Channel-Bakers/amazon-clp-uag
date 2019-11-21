'use strict';

import Bundle from '../util/lib/Bundle';
import * as bands from '../../../data/bundles/bundle-2/appleWatchBand.json';
import * as cases from '../../../data/bundles/bundle-2/appleWatchCase.json';

export default {
	init() {
		const WATCH_BANDS = bands.default;
		const WATCH_CASES = cases.default;
		const WATCH_BAND_OPTIONS = {
			target: 'bundle2',
			image: {
				position: 'top',
			},
			dropdowns: [
				{
					id: 'watchBand',
					data: WATCH_BANDS,
				},
				{
					id: 'watchCase',
					data: WATCH_CASES,
				},
			],
			discount: {
				symbol: '%',
				amount: '40',
				product: 'Apple Watch Case',
			},
		};

		const WATCH_BAND_BUILDER = new Bundle({
			...WATCH_BAND_OPTIONS,
		});
	},

	finalize() {},
};
