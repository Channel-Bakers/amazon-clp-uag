'use strict';

import {strToNumber} from './string';

const numToCurrency = (val, currency = 'USD') =>
	Number(0 + strToNumber(val)).toLocaleString(undefined, {
		style: 'currency',
		currency: currency,
	});

export {numToCurrency};
