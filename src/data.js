function darkMode() {
	document.querySelector("body").classList.toggle("dark-mode");
}

function template(img, name) {
	return  `
		<div class="box">
			<div class="top">
				<img src="${img}" alt="${name}">
			</div>
			<div class="bot">${name}</div>
		</div>
	`;
}

function showRecipes(recipes) {
	const content = document.querySelector(".content");
	let img, name;

	for (recipe in recipes) {
		img = recipe.img;
		name = recipe.name;

		content.appendChild(template(img, name));
	}
}
