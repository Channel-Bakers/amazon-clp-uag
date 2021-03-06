'use strict';

const env = require('../../../../env');
const puppeteer = require('puppeteer');
// const colors = require('colors/safe');

/**
 *
 * @param {array} asins list of asins to scrape
 */
const scrape = async (asins) => {
	const data = [];

	await Promise.all(
		asins.map(async (asin) => {
			const asinData = await (async () => {
				try {
					console.log(asin);

					// const args = [
					// 	'--disable-gl-drawing-for-tests',
					// 	'--window-size=1280,1024',
					// 	'--no-sandbox',
					// 	'--disable-setuid-sandbox',
					// 	'--proxy-server=socks5://127.0.0.1:9050'
					// ];
					// const browser = await puppeteer.launch({args});
					// const page = await browser.newPage();
					// await page.goto('https://check.torproject.org/');
					// const isUsingTor = await page.$eval('body', (el) =>
					// 	el.innerHTML.includes(
					// 		'Congratulations. This browser is configured to use Tor'
					// 	)
					// );

					// if (!isUsingTor) {
					// 	console.log(
					// 		colors.red.bold('Not using Tor. Closing...')
					// 	);
					// 	return await browser.close();
					// }

					const browser = await puppeteer.launch({
						ignoreHTTPSErrors: true,
						dumpio: false,
						// headless: true,
						devtools: false,
						// ignoreDefaultArgs: true,
						ignoreDefaultFlags: true,
						defaultViewport: {
							//--window-size in args
							width: 1280,
							height: 1024,
						},
						timeout: 0,
						args: [
							/* TODO : https://peter.sh/experiments/chromium-command-line-switches/
							there is still a whole bunch of stuff to disable
							*/
							//'--crash-test', // Causes the browser process to crash on startup, useful to see if we catch that correctly
							// not idea if those 2 aa options are usefull with disable gl thingy
							// '--disable-canvas-aa', // Disable antialiasing on 2d canvas
							// '--disable-2d-canvas-clip-aa', // Disable antialiasing on 2d canvas clips
							'--disable-gl-drawing-for-tests', // BEST OPTION EVER! Disables GL drawing operations which produce pixel output. With this the GL output will not be correct but tests will run faster.
							// '--disable-dev-shm-usage', // ???
							// '--no-zygote', // wtf does that mean ?
							'--use-gl=desktop', // better cpu usage with --use-gl=desktop rather than --use-gl=swiftshader, still needs more testing.
							'--enable-webgl',
							'--hide-scrollbars',
							'--mute-audio',
							'--no-first-run',
							'--disable-infobars',
							'--disable-breakpad',
							'--ignore-gpu-blacklist',
							'--window-size=1280,1024', // see defaultViewport
							'--no-sandbox',
							'--disable-setuid-sandbox',
							'--ignore-certificate-errors',
							// '--proxy-server=socks5://127.0.0.1:9050',
							'--proxy-bypass-list=*',
						],
					});

					const page = await browser.newPage();

					// let currentIpAddress = '';

					// page.on('response', response => {
					//   if (response.ok() === false) {
					//     exec('(echo authenticate \'""\'; echo signal newnym; echo quit) | nc localhost 9051', (error, stdout, stderr) => {
					//       if (stdout.match(/250/g).length === 3) {
					//         console.log('Success: The IP Address has been changed.');
					//       } else {
					//         console.log('Error: A problem occured while attempting to change the IP Address.');
					//       }
					//     });
					//   } else {
					//     console.log('Success: The Page Response was successful (no need to change the IP Address).');
					//   }
					// });

					await page.setUserAgent(
						'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.70 Safari/537.36'
					);

					await page.goto(
						`https://www.amazon.com/dp/${asin}?smid=${env.merchantID}&th=1&psc=1`,
						{
							waitUntil: 'load',
						}
					);

					const pageData = await page.evaluate(() => {
						const asin = window.location.pathname.split('/')[2];
						let title = document.getElementById('productTitle');
						let image = document.getElementById('landingImage');
						let price = document.getElementById(
							'priceblock_ourprice'
						);
						let offeringID = document.getElementById(
							'offerListingID'
						);
						let details = document.getElementById(
							'variation_color_name'
						);

						let series = null;
						let color = null;

						if (price) price = price.innerText;
						if (title) title = title.innerText;
						if (image) image = image.src;
						if (offeringID) offeringID = offeringID.value;
						if (details) {
							if (details.innerText.includes('-')) {
								series = details.querySelector('.selection')
									? details
											.querySelector('.selection')
											.innerText.split('-')[0]
											.trim()
									: null;

								color = details.querySelector('.selection')
									? details
											.querySelector('.selection')
											.innerText.split('-')[1]
											.trim()
									: null;
							} else {
								color = details.querySelector('.selection')
									? details.querySelector('.selection')
											.innerText
									: null;
							}
						}

						return {
							asin,
							title,
							image,
							series,
							color,
							price,
							offeringID,
						};
					});

					await browser.close();

					return pageData;
				} catch (error) {
					console.log(`Error scraping ${asin}`);
					console.log(error);
				}
			})();

			data.push(asinData);
		})
	);

	return data;
};

module.exports = scrape;
