const API_BASE = "https://sik7nmmji9.execute-api.us-east-1.amazonaws.com/stage1";
const S3_BASE = "https://recipe-picture-bucket.s3.us-east-1.amazonaws.com";

function darkMode() {
  document.body.classList.toggle("dark-mode");
}

function template(img, name) {
  const box = document.createElement("div");
  box.classList.add("box");

  const top = document.createElement("div");
  top.classList.add("top");

  const image = document.createElement("img");
  image.src = img;
  image.alt = name;

  // 🔁 Fallback to local placeholder if image fails to load
  image.onerror = () => {
    image.onerror = null;
    image.src = "placeholder.jpg";  // or use "assets/placeholder.jpg" if it's in a folder
  };

  const bot = document.createElement("div");
  bot.classList.add("bot");
  bot.textContent = name;

  top.appendChild(image);
  box.appendChild(top);
  box.appendChild(bot);

  return box;
}


function showRecipes(recipes) {
  const content = document.querySelector(".content");
  content.innerHTML = "";

  for (const wrapped of recipes) {
    let recipe;

    try {
      recipe = typeof wrapped[0] === "string" ? JSON.parse(wrapped[0]) : wrapped[0];
    } catch (e) {
      console.error("Invalid JSON:", wrapped[0]);
      continue;
    }

    let s3Key = null;
    try {
      if (recipe.keys && recipe.keys.length > 0) {
        const keyEntry = recipe.keys[0];
        const parsedKey = typeof keyEntry === "string" ? JSON.parse(keyEntry) : keyEntry;
        s3Key = parsedKey.key;
      }
    } catch (e) {
      console.warn("Could not parse S3 key:", recipe.keys);
    }

    const isValidKey = s3Key && s3Key.match(/\.(jpg|jpeg|png|webp)$/i);
    const img = isValidKey ? `${S3_BASE}/${s3Key}` : "https://via.placeholder.com/150";

    const name = recipe.name || "Untitled";
    console.log("Image URL:", img);

    const card = template(img, name);
    content.appendChild(card);
  }
}

async function loadRecipes() {
  try {
    const res = await fetch(`${API_BASE}/data/get_all_data`);
    if (!res.ok) throw new Error("Failed to fetch recipes");
    const recipes = await res.json();
    console.log("Recipes:", recipes);
    showRecipes(recipes);
  } catch (err) {
    console.error("Failed to load recipes:", err);
  }
}

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

window.onload = loadRecipes;
