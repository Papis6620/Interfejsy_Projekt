document.addEventListener("DOMContentLoaded", function () {
  // Funkcja do pobierania parametru z URL
  function getQueryParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }

  // Funkcja do pobierania produktów z pliku JSON
  function loadProducts() {
    return fetch("../jsons/products.json")
      .then((response) => response.json())
      .catch((error) => {
        console.error("Błąd ładowania produktów:", error);
        return [];
      });
  }

  function filterProducts(products) {
    const urlParams = new URLSearchParams(window.location.search);

    // Extract filtering criteria from the URL
    const query = urlParams.get("q") || null;
    const maxPrice = parseFloat(urlParams.get("priceMax")) || null;
    const minPrice = parseFloat(urlParams.get("priceMin")) || null;
    const category = urlParams.get("category") || null;
    const filters = urlParams.get("filters")
      ? urlParams.get("filters").split(",")
      : [];
    const sort = urlParams.get("sort") || null;

    // Extract selected colors and sizes from the URL
    const colors = urlParams.get("colors")
      ? urlParams.get("colors").split(",")
      : [];
    const sizes = urlParams.get("sizes")
      ? urlParams.get("sizes").split(",")
      : [];

    // Filter products based on the criteria
    const filteredProducts = products.filter((product) => {
      // Filter by query
      const matchesQuery =
        query === null ||
        product.name.toLowerCase().includes(query.toLowerCase());

      // Filter by price range
      const withinPriceRange =
        (!maxPrice || product.price <= maxPrice) &&
        (!minPrice || product.price >= minPrice);

      // Filter by category
      const matchesCategory =
        !category || product.categories.includes(category);

      // Filter by tags (filters)
      const matchesFilters =
        filters.length === 0 ||
        filters.some((filter) => product.tags.includes(filter));

      // Filter by colors
      const matchesColors =
        colors.length === 0 ||
        colors.some((color) => product.available_colors.includes(color));

      // Filter by sizes
      const matchesSizes =
        sizes.length === 0 ||
        sizes.some((size) => product.available_sizes.includes(size));

      // Return true if all criteria match
      return (
        matchesQuery &&
        withinPriceRange &&
        matchesCategory &&
        matchesFilters &&
        matchesColors &&
        matchesSizes
      );
    });

    // Sort products based on the selected sorting type
    if (sort === "low-to-high") {
      filteredProducts.sort((a, b) => a.price - b.price); // Sort by price ascending
    } else if (sort === "high-to-low") {
      filteredProducts.sort((a, b) => b.price - a.price); // Sort by price descending
    }

    return filteredProducts;
  }
  // Funkcja do tworzenia kafelków z wyników wyszukiwania
  function displayProducts(products) {
    const tilesContainer = document.getElementById("tiles");
    tilesContainer.innerHTML = ""; // Clear previous results
  
    if (products.length === 0) {
      // If no products match, display the empty text message
      const emptyMessage = document.createElement("p");
      emptyMessage.id = "empty-text";
      emptyMessage.textContent = "Nie znaleziono żadnych produktów.";
      tilesContainer.appendChild(emptyMessage);
      return;
    }
  
    // Iterate over filtered products
    products.forEach((product) => {
      const productLink = document.createElement("a");
      productLink.href = `./product.html?id=${product.id}`; // Link to product page with product id
  
      const productTile = document.createElement("div");
      productTile.className = "product-tile";
  
      const productPopup = document.createElement("div");
      productPopup.addEventListener("mouseover", () => {
        productPopup.style.visibility = "visible";
        productPopup.style.opacity = "1";
      });
  
      productPopup.addEventListener("mouseout", () => {
        productPopup.style.visibility = "hidden";
        productPopup.style.opacity = "0";
      });
  
      productPopup.addEventListener("mouseleave", () => {
        productPopup.style.visibility = "hidden";
        productPopup.style.opacity = "0";
      });
      productPopup.className = "product-popup";
  
      const productContent = document.createElement("div");
      productContent.className = "product-content";
  
      // Create an image container with gradient
      const imageContainer = document.createElement("div");
      imageContainer.className = "image-container"; // Add class for styling
  
      // Create image
      const productImage = document.createElement("img");
      productImage.src = `../img/products/product${product.id}/${product.main_img}`;
      productImage.alt = product.name;
      productImage.className = "product-image"; // Class for styling image
  
      // Add image to container
      imageContainer.appendChild(productImage);
  
      const productInfo = document.createElement("div");
      productInfo.className = "product-info";
  
      const productName = document.createElement("h3");
      productName.className = "product-name";
      productName.textContent = product.name;
  
      const productPrice = document.createElement("p");
      productPrice.className = "product-price";
      productPrice.textContent = `${product.price} zł`;
  
      function createProductColors(MAX_NUM) {
        const productColor = document.createElement("div");
        productColor.className = "product-color";
  
        const colorLabel = document.createElement("label");
        colorLabel.textContent = "Kolory:";
        productColor.appendChild(colorLabel);
  
        const colorOptions = document.createElement("div");
        colorOptions.className = "color-options";
  
        iteration_limit = MAX_NUM;
        if (product.available_colors.length > MAX_NUM) {
          iteration_limit = MAX_NUM - 1;
        }
        // Iterate through all colors, but limited to MAX_NUM
        product.available_colors.forEach((color, index) => {
          if (index < iteration_limit) {
            // Add normal colors if they fit in the limit
            const colorOption = document.createElement("span");
            colorOption.className = "color-option";
            colorOption.style.backgroundColor = color;
            colorOptions.appendChild(colorOption);
          } else if (index === MAX_NUM - 1) {
            // Add +N if it's the last element
            const remainingColorsCount =
              product.available_colors.length - (MAX_NUM - 1);
            if (remainingColorsCount > 0) {
              const moreColors = document.createElement("span");
              moreColors.className = "color-option-more-colors";
              moreColors.textContent = `+${remainingColorsCount}`;
              moreColors.addEventListener("mouseover", () => {
                productPopup.style.visibility = "visible";
                productPopup.style.opacity = "1";
              });
  
              moreColors.addEventListener("mouseout", () => {
                productPopup.style.visibility = "hidden";
                productPopup.style.opacity = "0";
              });
  
              moreColors.addEventListener("mouseleave", () => {
                productPopup.style.visibility = "hidden";
                productPopup.style.opacity = "0";
              });
              colorOptions.appendChild(moreColors);
            }
          }
          const colorOption = document.createElement("span");
          colorOption.className = "color-option";
          colorOption.style.backgroundColor = color;
          productPopup.appendChild(colorOption);
        });
  
        productColor.appendChild(colorOptions);
        return productColor;
      }
      const MAX_NUM = 6;
      productColor = createProductColors(MAX_NUM);
  
      // Add all elements to the tile
      productInfo.appendChild(productName);
      productInfo.appendChild(productPrice);
      productInfo.appendChild(productColor);
  
      productTile.appendChild(imageContainer);
      productContent.appendChild(productInfo);
  
      productTile.appendChild(productPopup);
      productTile.appendChild(productContent);
  
      productLink.appendChild(productTile);
  
      tilesContainer.appendChild(productLink);
    });
  
    // Update classes for tiles after loading products
    updateLastInRow();
  }

  // Funkcja do aktualizacji klasy dla ostatniego elementu w rzędzie
  function updateLastInRow() {
    const tiles = document.querySelectorAll("#tiles .product-tile");
    const container = document.getElementById("tiles");

    // Obliczamy liczbę kolumn na podstawie szerokości kontenera
    const columns = Math.floor(container.offsetWidth / 270); // Oblicza liczbę kolumn (przy założeniu, że szerokość kafelka to 250px)

    // Usuwamy klasę 'last-product-in-row' ze wszystkich kafelków
    tiles.forEach((tile) => {
      tile.classList.remove("last-product-in-row");
    });

    // Dodajemy klasę 'last-product-in-row' tylko do ostatniego kafelka w każdym rzędzie
    tiles.forEach((tile, index) => {
      // Indeks ostatniego elementu w danym rzędzie
      if ((index + 1) % columns === 0) {
        tile.classList.add("last-product-in-row");
      }
    });
  }

  // Pobierz zapytanie z URL
  const query = getQueryParameter("q");

  if (query) {
    loadProducts()
      .then((products) => {
        const filteredProducts = filterProducts(products, query);
        displayProducts(filteredProducts);
      })
      .catch((error) => {
        console.error("Błąd podczas ładowania produktów:", error);
      });
  }

  // Wywołanie funkcji przy zmianie rozmiaru okna
  window.addEventListener("resize", updateLastInRow);
});
