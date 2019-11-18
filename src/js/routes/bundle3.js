'use strict';

import Bundle from '../util/lib/Bundle';
import * as note10 from '../../../data/bundles/bundle-3/galaxyNote10.json';
import * as note10Plus from '../../../data/bundles/bundle-3/galaxyNote10Plus.json';
import * as s10 from '../../../data/bundles/bundle-3/galaxyS10.json';
import * as s10Plus from '../../../data/bundles/bundle-3/galaxyS10Plus.json';
import * as s10e from '../../../data/bundles/bundle-3/galaxyS10e.json';
import * as s105G from '../../../data/bundles/bundle-3/galaxyS105G.json';
import * as straps from '../../../data/bundles/bundle-3/galaxyWatchStrap.json';

export default {
	init() {
		const WATCH_STRAPS = straps.default;

		const GALAXY_NOTE_10 = note10.default;
		const GALAXY_NOTE_10_OPTIONS = {
			target: 'bundle3-note10',
			image: {
				position: 'top',
			},
			dropdowns: [
				{
					id: 'watchBand',
					data: GALAXY_NOTE_10,
				},
				{
					id: 'watchCase',
					data: WATCH_STRAPS,
				},
			],
			discount: {
				amount: '50%',
				product: 'Galaxy Watch Strap',
			},
		};

		const GALAXY_NOTE_10_BUILDER = new Bundle({
			...GALAXY_NOTE_10_OPTIONS,
		});


		const GALAXY_NOTE_10_PLUS = note10Plus.default;
		const GALAXY_NOTE_10_PLUS_OPTIONS = {
			target: 'bundle3-note10_plus',
			image: {
				position: 'top',
			},
			dropdowns: [
				{
					id: 'watchBand',
					data: GALAXY_NOTE_10_PLUS,
				},
				{
					id: 'watchCase',
					data: WATCH_STRAPS,
				},
			],
			discount: {
				amount: '50%',
				product: 'Galaxy Watch Strap',
			},
		};

		const GALAXY_NOTE_10_PLUS_BUILDER = new Bundle({
			...GALAXY_NOTE_10_PLUS_OPTIONS,
		});
	},

	finalize() {},
};
