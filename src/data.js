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
function showRecipes(recipes) {
	const content = document.querySelector("#recipes");
	let img, name;
>>>>>>> 3b637392cce6a1c30d9b272b7da3432772ba1e3b

	recipes.forEach(recipe => {
		const img = recipe.img || "assets/default-image.jpg";
		const name = recipe.name || "Unnamed Recipe";
		container.insertAdjacentHTML("beforeend", template(img, name));
	});
}

<<<<<<< HEAD
=======
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
>>>>>>> 3b637392cce6a1c30d9b272b7da3432772ba1e3b
