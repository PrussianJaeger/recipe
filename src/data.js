const API_BASE = "https://sik7nmmji9.execute-api.us-east-1.amazonaws.com/stage1";
const S3_BASE = "https://recipe-picture-bucket.s3.us-east-1.amazonaws.com";
const BUCKET_NAME = "recipe-picture-bucket";
/*
const API_BASE = "https://sik7nmmji9.execute-api.us-east-1.amazonaws.com/stage1";

 */

document.addEventListener("DOMContentLoaded", () => {

	applyDarkMode();

	const darkModeBtn = document.getElementById("darkModeButton");
	if (darkModeBtn) {
		darkModeBtn.addEventListener("click", darkMode);
	}


// Home Page ========================================================================================================================
	if (document.querySelector("title").textContent == "Home | Recipe App") {

		loadAndShowRecipes();

		/*      // for some reason the below is much faster, but we'll go with the one above anyway

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

	///*
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
	//*/
	/*
		document.getElementById("recipeForm").addEventListener("submit", async function (e) {
			e.preventDefault();

			const recipeID = crypto.randomUUID();
			const name = document.getElementById("name").value;
			const description = document.getElementById("description").value;
			const instructions = document.getElementById("instructions").value;
			const imageFile = document.getElementById("imageInput").files[0];

			console.log("Uploading image:", imageFile.name); // ✅ Debug

			const recipeData = {
				recipeID,
			    name,
			    description,
			    instructions,
			    ingredients: []
			};

		    try {
		        const uploadRes = await fetch(`${API_BASE}/data/upload_data`, {
		            method: "POST",
				    headers: { "Content-Type": "application/json" },
				    body: JSON.stringify(recipeData)
				});

		        if (!uploadRes.ok) throw new Error("Failed to upload recipe data");

		        const imageRes = await fetch(`${API_BASE}/image/upload_image`, {
		            method: "POST",
		            headers: { "Content-Type": "application/json" },
		            body: JSON.stringify({ recipeID, filename: imageFile.name })
		        });

		        if (!imageRes.ok) throw new Error("Failed to get presigned image URL");

		        const { upload_url } = await imageRes.json();

		        const uploadImageRes = await fetch(upload_url, {
		            method: "PUT",
		            headers: {
						"Content-Type": imageFile.type || "image/jpeg"
		            },
		            body: imageFile
		        });

			    if (!uploadImageRes.ok) {
					const errorText = await uploadImageRes.text();
					console.error("Upload failed response:", errorText);
					throw new Error("Image upload failed");
			    }

			    alert("Recipe submitted!");
			    document.getElementById("recipeForm").reset();
			    loadRecipes();
			} catch (err) {
			    console.error("Error submitting recipe:", err);
			    alert("Something went wrong. Check console for details.");
		    }
		});
	*/

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


      	const parsed = data.map(row => {
        	try {
          		return JSON.parse(row[0]);
        	} catch {
          		return null;
        	}
      	}).filter(Boolean);

      
      	const filtered = parsed.filter(recipe =>
        	recipe.name && recipe.name.toLowerCase().includes(query)
      	);

      
      	const results = filtered.map(recipe => {
        	const keys = recipe.keys || [];
        	const img = keys.length
          		? `https://${BUCKET_NAME}.s3.amazonaws.com/${keys[0].key}`
          		: "assets/default-image.jpg";

        	return { name: recipe.name, img };
      	});

      	showRecipes(results, resultsContainer);
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
	const body = document.querySelector("body");
	if (isDark) {
		body.classList.add("dark-mode");
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
		const name = recipe.name || "Unnamed Recipe";
		const img = recipe.img || "assets/default-image.jpg";

		console.log(`Rendering: ${name}, Image: ${img}`);
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
	try {
		const response = await fetch(`${API_BASE}/data/get_title_cards`);
		if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);

		const rawRows = await response.json();

		const recipes = rawRows.map(row => {
			try {
				const parsed = JSON.parse(row[0]);
				const name = parsed.name || "Unnamed";
				const keys = parsed.keys || [];
				const img = keys.length
					? `https://${BUCKET_NAME}.s3.amazonaws.com/${keys[0].key}`
					: "assets/default-image.jpg";

				return { name, img };
			} catch (err) {
				console.warn("Failed to parse recipe row:", row);
				return null;
			}
		}).filter(Boolean);

		console.log("Final recipe list:", recipes);

		showRecipes(recipes);
	} catch (err) {
		console.error("loadAndShowRecipes failed:", err);
	}
}

async function searchRecipesByName(query) {
  if (!query) return [];

  try {
    const response = await fetch(`${API_BASE}/data/get_title_cards`);
    if (!response.ok) throw new Error(`API error: ${response.status}`);

    const rawData = await response.json();
	console.log("Raw data:", rawData);

    const parsedData = rawData.map(row => {
      try {
        return JSON.parse(row[0]);
      } catch {
        return null;
      }
    }).filter(Boolean);

    const filtered = parsedData.filter(recipe =>
      recipe.name && recipe.name.toLowerCase().includes(query.toLowerCase())
    );

    return filtered.map(recipe => {
      const keys = recipe.keys || [];
      const img = keys.length
        ? `https://${BUCKET_NAME}.s3.amazonaws.com/${keys[0].key}`
        : "assets/default-image.jpg";

      return {
        name: recipe.name,
        img
      };
    });
  } catch (err) {
    console.error("searchRecipesByName failed:", err);
    return [];
  }
}