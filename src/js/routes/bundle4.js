'use strict';

import Bundle from '../util/lib/Bundle';
import * as ipad from '../../../data/bundles/bundle-4/iPad.json';
import * as sreenProtector from '../../../data/bundles/bundle-4/iPadScreenProtector.json';

export default {
	init() {
		const IPADS = ipad.default;
		const SCREEN_PROTECTOR = sreenProtector.default;
		const IPAD_OPTIONS = {
			target: 'bundle4',
			dropdowns: [
				{
					id: 'iPad',
					data: IPADS,
				},
				{
					id: 'screenProtector',
					data: SCREEN_PROTECTOR,
				},
			],
			discount: {
				symbol: '$',
				amount: '14.95',
				product: 'iPad Screen Protector',
			},
		};

		const IPAD_BUNDLE = new Bundle({
			...IPAD_OPTIONS,
		});
	},

	finalize() {},
};
