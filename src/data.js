document.addEventListener('DOMContentLoaded', () => {


	if (document.querySelector("title").textContent == "Home | Recipe App") {
		showRecipes(recipes);  // add lambda connection
	}

	if (document.querySelector("title").textContent == "Add | Recipe App") {
		document.querySelector("#add").addEventListener('click', (event) => {

		});
	}

	if (document.querySelector("title").textContent == "Remove | Recipe App") {
		populateSelect(recipes);
	}

});

document.addEventListener("DOMContentLoaded", () => {
	applyDarkMode();

	const darkModeBtn = document.getElementById("darkModeButton");
	if (darkModeBtn) {
		darkModeBtn.addEventListener("click", darkMode);
	}
})

function darkMode() {
	const isDark = localStorage.getItem("darkModeState") === "1";
	const body = document.querySelector("body");

	localStorage.setItem("darkModeState", isDark ? "0" : "1");
	body.classList.toggle("dark-mode", !isDark);
}

function applyDarkMode() {
	const isDark = localStorage.getItem("darkModeState") === "1";
	if (isDark) {
		document.body.classList.add("dark-mode");
	}
}

function template(img, name) {
	return  `
		<div class="box" onClick="">
			<div class="top">
				<img src="${img}" alt="${name}">
			</div>
			<div class="bot">${name}</div>
		</div>
	`;
}

<<<<<<< HEAD
function showRecipes(recipes, container = document.querySelector(".content")) {
	container.innerHTML = "";

=======

function showRecipes(recipes, container = document.querySelector(".content")) {
	container.innerHTML = "";
>>>>>>> fedb0cbc3fafacf78cd975afc756308c44f090fd
	recipes.forEach(recipe => {
		const img = recipe.img || "assets/default-image.jpg";
		const name = recipe.name || "Unnamed Recipe";
		container.insertAdjacentHTML("beforeend", template(img, name));
	});
}

function option(name) {
	return `
		<option>${name}</option>
	`;
}

function populateSelect(recipes) {
	const removeList = document.querySelector("select");
	let name;

	for (recipe in recipes) {
		name = recipe.name;
		removeList.appendChild(option(name));
	}
}
