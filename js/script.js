const API = "https://www.themealdb.com/api/json/v1/1/search.php";

const recipeContainer = document.getElementById("recipe-container");
const loader = document.querySelector(".loader");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search");

document.addEventListener("load", () => {
  loader.classList.remove("hidden");
});

const loadRecipe = (recipeImg, recipeName, shortDescription, idMeal) => {
  const cardTemplate = `<div class="rounded-2xl overflow-hidden shadow-xl">
                <div class="">
                  <img
                    class="w-full h-[180px] object-cover"
                    src="${recipeImg}"
                    loading="lazy"
                    alt=""
                  />
                </div>
                <div class="px-3 py-3">
                  <h3 class="text-xl font-medium text-primary">${recipeName}</h3>
                  <p class="mt-2 mb-3 text-primary">
                    ${shortDescription.slice(0, 100)}...
                  </p>
                  <div class="text-right">
                    <button
                      class="uppercase px-4 py-2.5 font-medium text-white text-sm bg-primary rounded cursor-pointer"
                      onclick="showModal(${idMeal})"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>`;

  recipeContainer.innerHTML += cardTemplate;
};

async function getRecipe(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Couldn't fetch data from server :(");
    } else {
      const recipeData = await response.json();
      if (recipeData.meals) {
        recipeData.meals.forEach((recipe) => {
          loadRecipe(
            recipe.strMealThumb,
            recipe.strMeal,
            recipe.strInstructions,
            recipe.idMeal
          );
        });
      } else {
        throw new Error("Recipe not found");
      }
    }
  } catch (error) {
    recipeContainer.innerHTML = `<h2 class="text-center text-2xl">${error.message}</h2>`;
  } finally {
    loader.classList.add("hidden");
  }
}

async function showModal(id) {
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${Number(id)}`
  );
  const recipe = await res.json();
  const singleRecipe = await recipe.meals[0];

  // here used .replace() method and regEx to replace the escape sequences with <br> tag.
  const modalTemplate = `    <div
        class="fixed z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full min-h-screen bg-black/50 flex items-center justify-center p-2 sm:p-3 md:p-5"
      >
        <div class="w-full max-w-[650px] max-h-[650px] p-2 sm:p-3 md:p-6 bg-white rounded-xl">
          <!-- Image Wrapper -->
        <div class="">
          <img
            class="w-full h-[300px] object-cover rounded-lg"
            src="${singleRecipe.strMealThumb}"
            alt="${singleRecipe.strMeal}"
          />
        </div>
        <h3 class="text-xl font-medium text-primary my-1.5">${
          singleRecipe.strMeal
        }</h3>
        <p class="mt-2 mb-3 text-primary max-h-[200px] overflow-y-scroll ">${singleRecipe.strInstructions.replace(
          /\r\n/g,
          "<br>"
        )}</p>
 <div class="text-right">
          <button
                      class="uppercase px-4 py-2.5 font-medium text-white text-sm bg-primary rounded cursor-pointer"
                      id="modal-close-btn"
                    >Close</button>
        </div>

        </div>
       
      </div> `;
  document.body.insertAdjacentHTML("beforeend", modalTemplate);
  const modalCloseBtn = document.getElementById("modal-close-btn");
  modalCloseBtn.addEventListener("click", closeModal);
}

function closeModal(e) {
  e.target.parentElement.parentElement.parentElement.remove();
}

// Debounce Function
function debounce(fn, delay) {
  let timeoutId;
  return function () {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      fn();
    }, delay);
  };
}

// Search Functionality
searchInput.addEventListener(
  "input",
  debounce(() => {
    // Clear previous recipes
    recipeContainer.innerHTML = "";
    console.log(searchInput.value);
    getRecipe(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchInput.value}`
    );
  }, 1000)
);

// search button
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  recipeContainer.innerHTML = "";
  getRecipe(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchInput.value}`
  );
});

getRecipe(`${API}?s=`);
// document.addEventLi.pstener("DOMContentLoaded", () => {});
