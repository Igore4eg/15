const imageLoad = async (file) => new Promise((resolve, reject) => {
	const image = new Image();
	const reader = new FileReader();
	reader.onerror = reject;
	reader.onload = () => {
		image.src = reader.result;
		image.onload = () => resolve(image);
	};
	reader.readAsDataURL(file);
});

// function imageSplit(image, size = 4) {
// 	const { iheight, iwidth } = image;
// 	const height = iheight / size;
// 	const width = iwidth / size;
// 	for (let x = 0; x < size; ++x) {
// 		for (let y = 0; y < size; ++y) {
// 			const canvas = document.createElement('canvas', { width, height });
// 			const context = canvas.getContext('2d');
// 			const source = [ y * width, x * height, width, height, ];
// 			const target = [ 0, 0, width, height, ];
// 			context.drawImage(image, ...source, ...target);
// 			const data = canvas.toDataURL();
// 			const k = x * size + y;
// 		}
// 	}
// } 



class MyScope {
	constructor(size = 4) {
		const items = Array(size*size)
			.fill(0)
			.map((_, index) => {
				return { index, };
			});

		Object.defineProperties(this, {
			items: { get: () => items, },
			size: { get: () => size, },
		});
		Object.freeze(this);
	}

	init(image) {
		function imagePart(image, index, size = 4) {
			const { iheight, iwidth } = image;
			const height = iheight / size;
			const width = iwidth / size;
			const x = index / size;
			const y = index % size;
			const canvas = document.createElement('canvas', { width, height });
			const context = canvas.getContext('2d');
			const source = [ y * width, x * height, width, height, ];
			const target = [ 0, 0, width, height, ];
			context.drawImage(image, ...source, ...target);
			return canvas.toDataURL();
		}

		this.items.forEach((item) => {
			item.data = item.index
				? imagePart(image, item.index, this.size)
				: null;
		});
	}


}
const fifteen = new MyScope(4);

window.onload(() => {

});