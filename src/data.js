document.addEventListener('DOMContentLoaded', () => {

	// Home Page
	if (document.querySelector("title").textContent == "Home | Recipe App") {
		const endpoint = "https://sik7nmmji9.execute-api.us-east-1.amazonaws.com/stage1";
		fetch(endpoint)
			.then(response => {
				if (!response.ok) throw new Error("Network response was not ok");
				return response.json();
			})
			.then(data => {
				showRecipes(data);
			})
			.catch(error => {
				console.error("Error fetching recipes:", error);
			});
	}

	// Add Page
	if (document.querySelector("title").textContent == "Add | Recipe App") {
		document.querySelector("#add").addEventListener('click', (event) => {

		});
	}

	// Remove Page
	if (document.querySelector("title").textContent == "Remove | Recipe App") {
		populateSelect(recipes);
	}

	// Search Page
	if (document.querySelector("title").textContent == "Search | Recipe App") {
		const searchBtn = document.getElementById("searchSubmit");
		const searchInput = document.getElementById("searchInput");
		const resultsContainer = document.getElementById("searchResults");

		searchBtn.addEventListener("click", () => {
			const query = searchInput.value.trim().toLowerCase();

			if (!query) return;

			fetch("https://sik7nmmji9.execute-api.us-east-1.amazonaws.com/stage1")
				.then(res => res.json())
				.then(data => {
					const filtered = data.filter(recipe =>
						recipe.name && recipe.name.toLowerCase().includes(query)
					);
					showRecipes(filtered, resultsContainer);
				})
				.catch(err => {
					console.error("Search failed:", err);
				});
		});
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

function showRecipes(recipes, container = document.querySelector(".content")) {
	container.innerHTML = "";
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


