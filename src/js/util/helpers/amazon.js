const isAmazon = (url = false) => {
	try {
		const newUrl = new URL(url ? url : window.location.href);
		return (
			newUrl.host.includes('amazon') &&
			!newUrl.host.includes('advertising')
		);
	} catch (error) {
		return false;
	}
};

const isAmazonAdvertising = (url = false) => {
	try {
		const newUrl = new URL(url ? url : window.location.href);
		return (
			newUrl.host.includes('amazon') &&
			newUrl.host.includes('advertising')
		);
	} catch (error) {
		return false;
	}
};

const getCurrentAmazonTab = (url = false) => {
	try {
		const newUrl = new URL(url ? url : window.location.href);
		return newUrl.searchParams.has('tab')
			? newUrl.searchParams.get('tab').toLowerCase()
			: false;
	} catch (error) {
		return false;
	}
};

const removeAmazonNodes = (nodes) => {
	if (nodes) {
		try {
			nodes.forEach((node) => {
				if (node instanceof Node) node.remove();
			});
		} catch (error) {
			console.log(error);
		}
	}
};

export {isAmazon, isAmazonAdvertising, getCurrentAmazonTab, removeAmazonNodes};
