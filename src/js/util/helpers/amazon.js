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
		if (nodes instanceof NodeList) {
			try {
				nodes.forEach((node) => {
					if (node instanceof Node) node.remove();
				});
			} catch (error) {
				console.log(error);
			}
		} else {
			if (nodes instanceof Node) nodes.remove();
		}
	}
};

export {isAmazon, isAmazonAdvertising, getCurrentAmazonTab, removeAmazonNodes};
