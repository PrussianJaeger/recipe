document.addEventListener('DOMContentLoaded', () => {

	applyDarkMode();

	const darkModeBtn = document.getElementById("darkModeButton");
	if (darkModeBtn) {
		darkModeBtn.addEventListener("click", darkMode);
	}
  

// Home Page ========================================================================================================================
	if (document.querySelector("title").textContent == "Home | Recipe App") {

		loadAndShowRecipes();

		/*      // for some reason this is much faster, but we'll go with the one above anyway

		const endpoint = "https://sik7nmmji9.execute-api.us-east-1.amazonaws.com/stage1/data/get_all_data";
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
			}); */
	}

  
// Add Page ========================================================================================================================
	if (window.location.pathname.endsWith("addRecipe.html")) {
		const form = document.getElementById("add");
		const ingredientsContainer = document.getElementById("ingredients");
		const addIngredientBtn = document.getElementById("addIngredient");
		const statusMessage = document.getElementById("statusMessage");

		addIngredientBtn.addEventListener("click", () => {
			const div = document.createElement("div");
			div.classList.add("ingredient");

			div.innerHTML = `
				<input type="text" placeholder="Ingredient name" class="ingredient-name" required>
				<input type="text" placeholder="Amount" class="ingredient-amount" required>
			`;

			ingredientsContainer.appendChild(div);
		});

		form.addEventListener("submit", async (e) => {
			e.preventDefault();

			const recipeID = crypto.randomUUID();
			const name = document.getElementById("name").value.trim();
			const description = document.getElementById("description").value.trim();
			const instructions = document.getElementById("instructions").value.trim();

			const ingredientElements = ingredientsContainer.querySelectorAll(".ingredient");
			const ingredients = Array.from(ingredientElements).map(div => ({
				name: div.querySelector(".ingredient-name").value.trim(),
				amount: div.querySelector(".ingredient-amount").value.trim()
			}));

			const payload = {
				recipeID,
				name,
				description,
				instructions,
				ingredients
			};

			try {
				const response = await fetch("https://sik7nmmji9.execute-api.us-east-1.amazonaws.com/stage1/data/upload_data", {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify(payload)
				});

				const result = await response.json();
				statusMessage.textContent = response.ok ? "Recipe added successfully!" : `Error: ${result.error}`;
				statusMessage.style.color = response.ok ? "green" : "red";
			} catch (err) {
				console.error(err);
				statusMessage.textContent = "Error submitting recipe.";
				statusMessage.style.color = "red";
			}
		});
	}


// Remove Page ========================================================================================================================
	if (document.querySelector("title").textContent == "Remove | Recipe App") {
		const endpoint = "https://sik7nmmji9.execute-api.us-east-1.amazonaws.com/stage1/data/get_all_data";
		fetch(endpoint)
			.then(response => {
				if (!response.ok) throw new Error("Network response was not ok");
				return response.json();
			})
			.then(data => {
				populateSelect(data);
			})
			.catch(error => {
				console.error("Error fetching recipes:", error);
			});
	}


// Search Page ========================================================================================================================
	if (document.querySelector("title").textContent == "Search | Recipe App") {
		const endpoint = "https://sik7nmmji9.execute-api.us-east-1.amazonaws.com/stage1/data/get_title_cards";
		const searchBtn = document.getElementById("searchSubmit");
		const searchInput = document.getElementById("searchInput");
		const resultsContainer = document.getElementById("searchResults");

		searchBtn.addEventListener("click", async () => {
			const query = searchInput.value.trim().toLowerCase();
			if (!query) return;

			try {
				const response = await fetch(endpoint);
				if (!response.ok) throw new Error(`API error: ${response.status}`);

				const data = await response.json();
				const filtered = data.filter(recipe =>
					recipe.name && recipe.name.toLowerCase().includes(query)
				);

				showRecipes(filtered, resultsContainer);
			} catch (err) {
				console.error("Search failed:", err);
			}
		});
	}

});


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
				<img src="${img}" alt="image of ${name}">
			</div>
			<div class="bot">${name}</div>
		</div>
	`;
}

function showRecipes(recipes, container = document.querySelector(".content")) {
	container.innerHTML = "";

	recipes.forEach(recipe => {
		recipe = JSON.parse(recipe);

// ============> TODO: GET IMAGES WORKING <=================================================================================================
		const img = recipe.img || "assets/default-image.jpg";

		const name = recipe.name || "Unnamed Recipe";
		container.insertAdjacentHTML("beforeend", template(img, name));
	});
}

function option(name, recipeId) {
	return `
		<option value="${recipeId}">${name}</option>
	`;
}

function populateSelect(recipes, container = document.querySelector("#remove-recipe")) {
	container.innerHTML = "";
	recipes.forEach(recipe => {
		recipe = JSON.parse(recipe);
		console.log(recipe);
		const name = recipe.name || "Unnamed Recipe";
		const recipeId = recipe.recipeID;
		container.insertAdjacentHTML("beforeend", option(name, recipeId));
	});
}

async function fetchRecipeImages(recipeID) {
	try {
		const response = await fetch(
			"https://sik7nmmji9.execute-api.us-east-1.amazonaws.com/stage1/image/get_image",
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ recipeID }),
			}
		);

		if (!response.ok) throw new Error("Failed to fetch images");

		const data = await response.json();
		return data.image_urls || [];
	} catch (err) {
		console.error(`Error fetching images for recipe ${recipeID}:`, err);
		return [];
	}
}

async function loadAndShowRecipes() {
	const endpoint =
		"https://sik7nmmji9.execute-api.us-east-1.amazonaws.com/stage1/data/get_title_cards";

	try {
		const res = await fetch(endpoint);
		if (!res.ok) throw new Error("Failed to fetch recipes");
		const recipes = await res.json();


		for (const recipe of recipes) {
			const images = await fetchRecipeImages(recipe.recipeID);
			recipe.img = images.length > 0 ? images[0] : "assets/default-image.jpg";
		}

		showRecipes(recipes);
	} catch (err) {
		console.error("Error loading recipes:", err);
	}
}
