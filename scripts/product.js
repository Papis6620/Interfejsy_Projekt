document.addEventListener("DOMContentLoaded", () => {
  let selectedSize = null;
  let selectedColor = null;
  let quantity = 1;

  // Funkcja do pobierania parametru z URL
  function getQueryParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }

  // Pobranie ID produktu z URL
  const productID = getQueryParameter("id");

  // Elementy do manipulacji na stronie
  const sizeElements = document.querySelectorAll(".size");
  const quantityMinus = document.querySelector(".quantity button:first-child");
  const quantityPlus = document.querySelector(".quantity button:last-child");
  const quantityDisplay = document.querySelector(".quantity span");
  const addToCartButton = document.querySelector(".add-to-cart");
  const addToWatchlistButton = document.querySelector(".add-to-watchlist");

  // Pobranie produktów z pliku JSON
  function loadProducts() {
    return fetch("../jsons/products.json")
      .then((response) => response.json())
      .catch((error) => {
        console.error("Błąd ładowania produktów:", error);
        return [];
      });
  }

  // Funkcja do wyświetlania produktu na stronie
  function displayProduct(product) {
    // Zmieniamy tytuł strony na nazwę produktu
    document.getElementById("page-title").textContent = product.name;

    // Zmieniamy nazwę produktu
    document.getElementById("product-name").textContent = product.name;

    // Zmieniamy kod produktu
    document.getElementById("product-code").textContent = product.product_code;

    // Zmieniamy cenę produktu
    document.getElementById("product-price").textContent = `${product.price} zł`;

    // Zmieniamy opis produktu
    document.getElementById("product-description").textContent = product.description || 'Brak opisu';

    // Zmieniamy zdjęcia produktu
    document.getElementById("main-img").src = `../img/products/product${product.id}/${product.main_img}`;
    document.getElementById("main-img").alt = product.name;
    document.getElementById("front-img").src = `../img/products/product${product.id}/${product.front_img}`;
    document.getElementById("back-img").src = `../img/products/product${product.id}/${product.back_img}`;
    document.getElementById("model-img").src = `../img/products/product${product.id}/${product.model_img}`;

    // Wyświetlamy dostępne kolory
    const colorOptionsContainer = document.getElementById("color-options");
    colorOptionsContainer.innerHTML = ""; // Czyścimy poprzednie kolory
    product.available_colors.forEach((color) => {
      const colorOption = document.createElement("span");
      colorOption.className = `color ${color}`;
      colorOptionsContainer.appendChild(colorOption);
    });

    // Aktywujemy tylko dostępne rozmiary
    const sizeOptionsContainer = document.getElementById("size-options");
    sizeElements.forEach((sizeElement) => {
      const size = sizeElement.textContent.trim();
      if (product.available_sizes.includes(size)) {
        sizeElement.classList.add("available");
        sizeElement.classList.remove("unavailable");
      } else {
        sizeElement.classList.add("unavailable");
        sizeElement.classList.remove("available");
      }
    });

    // Funkcja zaznaczania koloru
    const colorElements = document.querySelectorAll(".color");
    colorElements.forEach((color) => {
      color.addEventListener("click", () => {
        // Usunięcie zaznaczenia z innych kolorów
        colorElements.forEach((c) => c.classList.remove("selected"));
        // Zaznaczenie wybranego koloru
        color.classList.add("selected");
        selectedColor = color.classList[1]; // Aktualizacja zmiennej (klasa koloru)
      });
    });
  }

  // Funkcja zaznaczania rozmiaru
  function handleSizeSelection() {
    sizeElements.forEach((size) => {
      size.addEventListener("click", () => {
        if (size.classList.contains("available")) {
          sizeElements.forEach((s) => s.classList.remove("selected"));
          size.classList.add("selected");
          selectedSize = size.textContent.trim();
        }
      });
    });
  }

  // Funkcja zmniejszania ilości
  function handleQuantityChange() {
    quantityMinus.addEventListener("click", () => {
      if (quantity > 1) {
        quantity--;
        quantityDisplay.textContent = quantity;
      }
    });

    quantityPlus.addEventListener("click", () => {
      quantity++;
      quantityDisplay.textContent = quantity;
    });
  }

  // Funkcja dodawania do koszyka
function handleAddToCart() {
  addToCartButton.addEventListener("click", () => {
    // Sprawdzamy, czy użytkownik jest zalogowany
    const loggedInUser = getFromLocalStorage("loggedInUser");

    if (!loggedInUser) {
      // Jeśli użytkownik nie jest zalogowany, wyświetlamy komunikat
      alert("Musisz być zalogowany, aby dodać produkt do koszyka.");
      return;
    }

    if (!selectedSize || !selectedColor) {
      alert("Wybierz rozmiar i kolor przed dodaniem do koszyka.");
      return;
    }

    const productToAdd = {
      id: productID, // ID produktu
      product_code: document.getElementById("product-code").textContent, // Kod produktu
      name: document.getElementById("product-name").textContent, // Nazwa produktu
      price: parseFloat(document.getElementById("product-price").textContent.replace(' zł', '')), // Cena
      quantity: quantity, // Ilość
      size: selectedSize, // Rozmiar
      color: selectedColor // Kolor
    };

    // Sprawdzamy, czy użytkownik ma już koszyk, jeśli nie, tworzymy pusty
    if (!loggedInUser.cart) {
      loggedInUser.cart = [];
    }

    // Dodajemy produkt do koszyka
    loggedInUser.cart.push(productToAdd);

    // Zapisujemy zaktualizowanego użytkownika w LocalStorage
    saveToLocalStorage("loggedInUser", loggedInUser);

    // Zaktualizowanie liczby produktów w koszyku
    updateCartCount();

    alert("Produkt został dodany do koszyka!");
  });
}

function handleAddToWatchlist() {
  addToWatchlistButton.addEventListener("click", () => {
    // Pobranie danych użytkownika z LocalStorage
    const loggedInUser = getFromLocalStorage("loggedInUser");

    if (!loggedInUser) {
      alert("Musisz być zalogowany, aby dodać/usuwać produkt z listy obserwowanych.");
      return;
    }

    // Pobieranie szczegółów produktu z DOM
    const productToToggle = {
      id: document.getElementById("product-code").textContent, // ID produktu (kod)
      name: document.getElementById("product-name").textContent, // Nazwa produktu
      product_code: document.getElementById("product-code").textContent, // Kod produktu
      price: parseFloat(document.getElementById("product-price")?.textContent.replace(' zł', '')), // Cena
    };

    // Sprawdzamy, czy lista obserwowanych już istnieje, jeśli nie, tworzymy pustą
    if (!loggedInUser.watchlist) {
      loggedInUser.watchlist = [];
    }

    // Sprawdzamy, czy produkt jest już na liście obserwowanych
    const isProductInWatchlist = loggedInUser.watchlist.some(
      (item) => item.id === productToToggle.id
    );

    if (isProductInWatchlist) {
      // Jeśli produkt jest już na liście, usuwamy go
      loggedInUser.watchlist = loggedInUser.watchlist.filter(
        (item) => item.id !== productToToggle.id
      );

      // Zapisujemy zaktualizowanego użytkownika w LocalStorage
      saveToLocalStorage("loggedInUser", loggedInUser);

      // Zmiana stanu przycisku - usunięcie klasy "added"
      addToWatchlistButton.classList.remove("added");

      alert("Produkt został usunięty z listy obserwowanych.");
    } else {
      // Jeśli produkt nie jest na liście, dodajemy go
      loggedInUser.watchlist.push(productToToggle);

      // Zapisujemy zaktualizowanego użytkownika w LocalStorage
      saveToLocalStorage("loggedInUser", loggedInUser);

      // Zmiana stanu przycisku - dodanie klasy "added"
      addToWatchlistButton.classList.add("added");

      alert("Produkt został dodany do listy obserwowanych!");
    }
  });
}

function initializeWatchlistButton() {
  const loggedInUser = getFromLocalStorage("loggedInUser");
  const addToWatchlistButton = document.querySelector(".add-to-watchlist");
  const productCode = document.getElementById("product-code").textContent;

  // Sprawdzamy, czy użytkownik jest zalogowany i czy produkt znajduje się na liście obserwowanych
  if (loggedInUser && loggedInUser.watchlist) {
    const isProductInWatchlist = loggedInUser.watchlist.some(
      (item) => item.id === productCode
    );

    if (isProductInWatchlist) {
      // Jeśli produkt jest na liście, dodajemy klasę "added"
      addToWatchlistButton.classList.add("added");
    } else {
      // Jeśli produkt nie jest na liście, usuwamy klasę "added"
      addToWatchlistButton.classList.remove("added");
    }
  }
}
  // Ładujemy dane o produkcie i wyświetlamy je na stronie
  loadProducts()
    .then((products) => {
      const product = products.find(p => p.id == productID);
      if (product) {
        displayProduct(product);
        handleSizeSelection();
        handleQuantityChange();
        handleAddToCart();
        handleAddToWatchlist();
        initializeWatchlistButton();
      } else {
        console.error("Produkt o podanym ID nie istnieje!");
      }
    })
    .catch((error) => {
      console.error("Błąd podczas ładowania danych produktu:", error);
    });
});
