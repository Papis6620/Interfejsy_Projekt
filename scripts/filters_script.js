console.log("filters_script.js loaded");

// Select filter elements
const filterSections = document.querySelectorAll(".filter-section h3");
const priceMin = document.getElementById("price-min");
const priceMax = document.getElementById("price-max");
const minValueDisplay = document.getElementById("min-value");
const maxValueDisplay = document.getElementById("max-value");
const clearFiltersBtn = document.getElementById("clear-filters-btn");
const applyFiltersBtn = document.querySelector(".apply-btn"); // Button for applying filters
const dynamicCategoryContent = document.getElementById(
  "dynamic-category-content"
);

// Variables to store category data (loaded dynamically)
let categoryData = {};

// Toggle filter sections
filterSections.forEach((header) => {
  header.addEventListener("click", () => {
    const section = header.parentElement;
    section.classList.toggle("collapsed");
  });
});

// Clear all filters and redirect to keep only `q`
clearFiltersBtn.addEventListener("click", function () {
  // Retrieve the current `q` parameter
  const params = new URLSearchParams(window.location.search);
  const query = params.get("q");

  // Check if `query` is null, empty, or only contains whitespace
  let newURL = "searching.html";
  if (query && query.trim()) {
    // If `q` has non-whitespace characters, preserve it
    newURL += `?q=${encodeURIComponent(query)}`;
  } else {
    // Otherwise, set `q` to `%20`
    newURL += "?q=%20";
  }
  
  // Redirect to the updated URL
  window.location.href = newURL;
});

// Update price values dynamically
function updatePriceValues() {
  const minValue = Math.min(priceMin.value, priceMax.value);
  const maxValue = Math.max(priceMin.value, priceMax.value);
  minValueDisplay.textContent = `${minValue} zł`;
  maxValueDisplay.textContent = `${maxValue} zł`;
}

priceMin.addEventListener("input", updatePriceValues);
priceMax.addEventListener("input", updatePriceValues);

updatePriceValues(); // Initialize displayed values

// Load category data from JSON file
function loadCategoryData() {
  return fetch("../jsons/categoryData.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load category data");
      }
      return response.json();
    })
    .then((data) => {
      categoryData = data;
    })
    .catch((error) => {
      console.error("Error loading category data:", error);
    });
}

// Dynamically generate category checkboxes
function generateCategoryContent(category) {
  dynamicCategoryContent.innerHTML = ""; // Clear existing content

  if (categoryData[category]) {
    Object.keys(categoryData[category]).forEach((section) => {
      const sectionTitle = document.createElement("h4");
      sectionTitle.textContent = section;
      dynamicCategoryContent.appendChild(sectionTitle);

      categoryData[category][section].forEach((item) => {
        const label = document.createElement("label");
        label.innerHTML = `<input type="checkbox" class="filter-checkbox" /> ${item}`;
        dynamicCategoryContent.appendChild(label);
      });
    });
  }
}

// Load category data and handle category selection
loadCategoryData().then(() => {
  console.log("Category data loaded!");
  const categoryRadios = document.querySelectorAll('input[name="category"]');

  categoryRadios.forEach((radio) => {
    radio.addEventListener("change", (e) => {
      const selectedCategory = e.target.value;
      if (selectedCategory === "none") {
        dynamicCategoryContent.innerHTML = ""; // Clear content for "Brak preferencji"
      } else {
        generateCategoryContent(selectedCategory);
      }
    });
  });
});

// Funkcja dodająca labele do istniejącego diva
function addLabelsToDivFromMap(divId, colorMap) {
  // Pobranie istniejącego diva
  const targetDiv = document.getElementById(divId);

  if (!targetDiv) {
    console.error(`Nie znaleziono elementu o id "${divId}"`);
    return;
  }

  // Iteracja przez mapę i dodawanie checkboxów
  Object.entries(colorMap).forEach(([labelText, colorValue]) => {
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.type = "checkbox";
    input.className = "filter-checkbox";
    input.value = colorValue; // Ustawienie wartości jako kod koloru (np. "red")
    label.appendChild(input);
    label.append(` ${labelText}`);
    targetDiv.appendChild(label);
  });
}
const colorMap = {
  Czerwony: "red",
  Niebieski: "blue",
  Czarny: "black",
  Biały: "white",
  Zielony: "green",
  Żółty: "yellow",
  Różowy: "pink",
};

addLabelsToDivFromMap("filter-section-colors", colorMap);

// Construct the search URL by appending to the current query
function constructSearchURL() {
  const params = new URLSearchParams(window.location.search);

  // Preserve the `q` parameter if it exists, otherwise leave it out
  const query = params.get("q");

  // Add or update price range in the parameters
  params.set("priceMin", priceMin.value);
  params.set("priceMax", priceMax.value);

  // Add or update selected category in the parameters
  const selectedCategory = document.querySelector(
    'input[name="category"]:checked'
  );
  if (selectedCategory && selectedCategory.value !== "none") {
    params.set("category", selectedCategory.value);
  } else {
    params.delete("category"); // Remove category if "none" is selected
  }

  // Add or update selected sort option in the parameters
  const selectedSort = document.querySelector('input[name="sort"]:checked');
  if (selectedSort && selectedSort.id !== "no-sort") {
    params.set("sort", selectedSort.id); // Add the selected sort method to the URL
  } else {
    params.delete("sort"); // Remove sort if "Brak sortowania" is selected
  }

  // Separate colors, sizes, and general filters
  const selectedCheckboxes = Array.from(
    document.querySelectorAll(".filter-checkbox:checked")
  );
  const sizeList = [
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "XXL",
    "36",
    "37",
    "38",
    "39",
    "40",
    "41",
    "42",
    "43",
    "44",
    "45",
    "46",
  ]; // Add all valid sizes here

  const selectedColors = [];
  const selectedSizes = [];
  const selectedFilters = [];

  selectedCheckboxes.forEach((checkbox) => {
    const filterName = checkbox.nextSibling.textContent.trim();
    const mappedColor = colorMap[filterName];

    if (mappedColor) {
      selectedColors.push(mappedColor); // Add to colors if it matches a color
    } else if (sizeList.includes(filterName)) {
      selectedSizes.push(filterName); // Add to sizes if it matches a valid size
    } else {
      selectedFilters.push(filterName); // Otherwise, add to general filters
    }
  });

  // Add or update the `colors` parameter
  if (selectedColors.length > 0) {
    params.set("colors", selectedColors.join(","));
  } else {
    params.delete("colors"); // Remove colors if none are selected
  }

  // Add or update the `sizes` parameter
  if (selectedSizes.length > 0) {
    params.set("sizes", selectedSizes.join(","));
  } else {
    params.delete("sizes"); // Remove sizes if none are selected
  }

  // Add or update the `filters` parameter
  if (selectedFilters.length > 0) {
    params.set("filters", selectedFilters.join(","));
  } else {
    params.delete("filters"); // Remove filters if none are selected
  }

  // Construct the new URL with preserved filters
  let newURL = `searching.html?${params.toString()}`;

  // If `q` parameter doesn't exist, remove it from the URL
  if (!query) {
    newURL = `searching.html?${params.toString().replace(/&?q=[^&]*/, "q=%20")}`; // Remove `q` if it doesn't exist
  }

  // Redirect to the new URL
  window.location.href = newURL;
}

// Add event listener to the "Apply Filters" button
applyFiltersBtn.addEventListener("click", constructSearchURL);

function initializeFiltersFromURL() {
  const params = new URLSearchParams(window.location.search);

  const priceMinValue = params.get("priceMin");
  const priceMaxValue = params.get("priceMax");

  if (priceMinValue) {
    priceMin.value = priceMinValue;
    minValueDisplay.textContent = `${priceMinValue} zł`;
  }

  if (priceMaxValue) {
    priceMax.value = priceMaxValue;
    maxValueDisplay.textContent = `${priceMaxValue} zł`;
  }

  const categoryValue = params.get("category");
  const filtersValue = params.get("filters");

  if (categoryValue) {
    // Load category data and wait for it to resolve
    loadCategoryData().then(() => {
      console.log("Category data loaded!");
      const categoryRadio = document.querySelector(
        `input[name="category"][value="${categoryValue}"]`
      );

      if (categoryRadio) {
        categoryRadio.checked = true;

        // Uncollapse the "Kategorie" section
        const categorySection = document.querySelector(".filter-section");
        if (categorySection.classList.contains("collapsed")) {
          categorySection.classList.remove("collapsed");
        }

        if (categoryValue !== "none")
        {
          generateCategoryContent(categoryValue);
        }

        if (filtersValue)
        {
          if (categoryValue !== "none")
          {
            const selectedFilters = filtersValue.split(",");
            selectedFilters.forEach((filter) => {
              const filterCheckbox = Array.from(
                document.querySelectorAll(".filter-checkbox")
              ).find(
                (checkbox) =>
                  checkbox.nextSibling.textContent.trim() === filter
              );

              if (filterCheckbox) filterCheckbox.checked = true;
            });
          }
        }
      }
    });
  }

  const sortValue = params.get("sort");
  if (sortValue) {
    const sortRadio = document.querySelector(
      `input[name="sort"][id="${sortValue}"]`
    );
    if (sortRadio) sortRadio.checked = true;
  }

  const colorsValue = params.get("colors");
  
  if (colorsValue)
  {
    const selectedColors = colorsValue.split(",");
    selectedColors.forEach((color) => {
      const colorCheckbox = Array.from(
        document.querySelectorAll(".filter-checkbox")
      ).find((checkbox) => checkbox.value === color);

      if (colorCheckbox) colorCheckbox.checked = true;
    });
  }

  if (colorsValue)
  {
    const colorSection = document.querySelector("#color-unroll");
    if (colorSection.classList.contains("collapsed")) {
      colorSection.classList.remove("collapsed");
    }
  }

  const sizesValue = params.get("sizes");
  if (sizesValue)
    {
    const selectedSizes = sizesValue.split(",");
    selectedSizes.forEach((size) => {
      const sizeCheckbox = Array.from(
        document.querySelectorAll(".filter-checkbox")
      ).find(
        (checkbox) =>
          checkbox.name === "size" &&
          checkbox.nextSibling.textContent.trim() === size
      );

      if (sizeCheckbox) sizeCheckbox.checked = true;
    });
  }

  if (sizesValue)
  {
    const sizeSection = document.querySelector("#size-unroll");
    if (sizeSection.classList.contains("collapsed"))
    {
      sizeSection.classList.remove("collapsed");
    }
  }

  updatePriceValues();
}

// Call the function when the page loads
initializeFiltersFromURL();
