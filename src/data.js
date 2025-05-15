function darkMode() {
	const isDark = sessionStorage.getItem("darkModeState") === "1";

	if (!isDark) {
		sessionStorage.setItem("darkModeState", "1");
		document.querySelector("body").classList.add("dark-mode");
	} else {
		sessionStorage.setItem("darkModeState", "0");
		document.querySelector("body").classList.remove("dark-mode");
	}
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

function showRecipes(recipes, container = document.querySelector(".content")) {
	container.innerHTML = "";

	recipes.forEach(recipe => {
		const img = recipe.img || "assets/default-image.jpg";
		const name = recipe.name || "Unnamed Recipe";
		container.insertAdjacentHTML("beforeend", template(img, name));
	});
}

