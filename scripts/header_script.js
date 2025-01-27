// Pobranie elementów
addDefaultAccount();
checkLoginStatus();
updateCartCount();
// Pobranie elementów
const userIcon = document.querySelector(".user-icon");
const userDropdown = document.querySelector(".user-dropdown");
const loginPopup = document.getElementById("login-popup");
const registerPopup = document.getElementById("register-popup");

// Funkcja do przełączania klasy 'active' dla ikony użytkownika
userIcon.addEventListener("click", function (event) {
  // Zapobieganie propagacji kliknięcia, aby nie zamykać menu po kliknięciu na ikonę
  event.stopPropagation();

  // Przełączanie klasy 'active' na ikonie użytkownika
  userIcon.classList.toggle("active");

  // Przełączanie widoczności menu użytkownika
  if (userIcon.classList.contains("active")) {
    // Wyświetlenie dropdown menu z animacją
    userDropdown.style.opacity = "1";
    userDropdown.style.transform = "translateY(0)";
  } else {
    // Ukrycie dropdown menu z animacją
    userDropdown.style.opacity = "0";
    userDropdown.style.transform = "translateY(-20px)";
  }
});

function showPopupMessage(message) {
  // Utworzenie elementu popupu
  const messagePopup = document.createElement("div");
  messagePopup.className = "message-popup";

  // Zawartość popupu
  const messageContent = `
    <div class="message-popup-content">
      <p>${message}</p>
      <button class="close-popup">OK</button>
    </div>
  `;

  messagePopup.innerHTML = messageContent;

  // Dodanie popupu do dokumentu
  document.body.appendChild(messagePopup);

  // Dodanie obsługi zamykania popupu
  messagePopup.querySelector(".close-popup").addEventListener("click", () => {
    document.body.removeChild(messagePopup);
  });
}

function validateEmail(email) {
  // Wyrażenie regularne sprawdzające poprawność e-maila
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Funkcja otwierająca popup logowania po kliknięciu "ZALOGUJ"
document
  .querySelector(".user-dropdown ul li:nth-child(1)")
  .addEventListener("click", function () {
    loginPopup.style.display = "flex";
    registerPopup.style.display = "none"; // Ukryj popup rejestracji, jeśli jest otwarty
  });

// Funkcja otwierająca popup rejestracji po kliknięciu "ZAREJESTRUJ"
document
  .querySelector(".user-dropdown ul li:nth-child(2)")
  .addEventListener("click", function () {
    registerPopup.style.display = "flex";
    loginPopup.style.display = "none"; // Ukryj popup logowania, jeśli jest otwarty
  });

// Zamknięcie popupów przy kliknięciu na krzyżyk
document
  .getElementById("close-login-popup")
  .addEventListener("click", function () {
    loginPopup.style.display = "none";
  });

document
  .getElementById("close-register-popup")
  .addEventListener("click", function () {
    registerPopup.style.display = "none";
  });

// Funkcja do zamknięcia menu, gdy klikniesz gdziekolwiek poza nim
document.addEventListener("click", function (event) {
  // Zamknięcie menu użytkownika, jeśli kliknięto poza ikoną lub dropdown
  if (
    !userIcon.contains(event.target) &&
    !userDropdown.contains(event.target)
  ) {
    userIcon.classList.remove("active");
    userDropdown.style.opacity = "0";
    userDropdown.style.transform = "translateY(-20px)";
  }

  // Sprawdzenie, czy kliknięto w tło popupu, ale nie w zawartość
  if (
    (event.target.classList.contains("popup") || event.target === loginPopup) &&
    !event.target.closest(".popup-content")
  ) {
    // Zamknięcie popupu logowania, jeśli kliknięto w tło
    loginPopup.style.display = "none";
    // Zamknięcie popupu rejestracji, jeśli kliknięto w tło
    registerPopup.style.display = "none";
  }
});

document.addEventListener("DOMContentLoaded", function () {
  addDefaultAccount();
  checkLoginStatus();
  updateCartCount()
});

function loadSearch() {
  // Get the URL parameters
  const urlParams = new URLSearchParams(window.location.search);

  // Get the value of 'q' from the URL parameters
  const query = urlParams.get("q");

  // Get the search input element
  const searchInput = document.getElementById("search-input");

  // If a query exists and is not empty after trimming, set it in the search input field
  if (query && query.trim() !== "") {
    searchInput.value = decodeURIComponent(query.trim());
  } else {
    // Clear the input field to ensure the placeholder is displayed
    searchInput.value = "";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  // Get the URL parameters
  const urlParams = new URLSearchParams(window.location.search);

  // Get the value of 'q' from the URL parameters
  const query = urlParams.get("q");

  // If a query exists, set it in the search input field
  if (query) {
    document.getElementById("search-input").value = decodeURIComponent(query);
  }
});

// Funkcja do obsługi wyszukiwania
document.getElementById("search-button").addEventListener("click", function () {
  const searchInput = document.getElementById("search-input").value.trim();
  if (searchInput) {
    window.location.href = `searching.html?q=${encodeURIComponent(searchInput)}`;
  } else {
    alert("Wprowadź frazę do wyszukiwania.");
  }
});

// Obsługuje wyszukiwanie po wciśnięciu klawisza Enter
document.getElementById("search-input").addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    const searchInput = document.getElementById("search-input").value.trim();
    if (searchInput) {
      window.location.href = `searching.html?q=${encodeURIComponent(searchInput)}`;
    } else {
      alert("Wprowadź frazę do wyszukiwania.");
    }
  }
});

function updateCartCount() {
  const cartCountElement = document.querySelector(".cart-count");
  const loggedInUser = getFromLocalStorage("loggedInUser");
  let count = 0;
  if (loggedInUser && loggedInUser.cart) {
    count = loggedInUser.cart.reduce((total, item) => total + item.quantity, 0);
  }
  if(count === 0){
    cartCountElement.style.display = "none";
  }else if(count > 99){
    cartCountElement.textContent = "99+";
    cartCountElement.style.display = "block";
  }
  else{
    cartCountElement.textContent = count;
    cartCountElement.style.display = "block";
  }
}

function addDefaultAccount() {
  const defaultUser = {
    email: "test@gmail.com",
    password: "test",
    firstName: "Test",
    lastName: "User",
    address: "123 Test St",
    city: "Test City",
    zipcode: "12345",
    watchlist: [],
    cart: [],
    orderHistory: [],
  };

  let users = getFromLocalStorage("users") || [];
  const userExists = users.some((user) => user.email === defaultUser.email);

  if (!userExists) {
    users.push(defaultUser);
    saveToLocalStorage("users", users);
  }
}

function checkLoginStatus() {
  const loggedInUser = getFromLocalStorage("loggedInUser");
  const userIconElement = document.querySelector(".user-icon i");

  if (loggedInUser) {
    // Hide default icon and show first letter
    userIconElement.classList.remove("fa-circle-user");
    userIconElement.classList.add("letter");

    userIconElement.textContent = loggedInUser.firstName[0].toUpperCase();

    document.querySelector(".user-dropdown li:nth-child(1)").style.display = "none";
    document.querySelector(".user-dropdown li:nth-child(2)").style.display = "none";
    document.querySelector(".user-dropdown li:nth-child(3)").style.display = "block";
    document.querySelector(".user-dropdown li:nth-child(4)").style.display = "block";
  } else {
    // Revert to default icon
    userIconElement.classList.add("fa-solid", "fa-circle-user");
    userIconElement.classList.remove("letter");
    userIconElement.textContent = "";

    document.querySelector(".user-dropdown li:nth-child(1)").style.display = "block";
    document.querySelector(".user-dropdown li:nth-child(2)").style.display = "block";
    document.querySelector(".user-dropdown li:nth-child(3)").style.display = "none";
    document.querySelector(".user-dropdown li:nth-child(4)").style.display = "none";
  }
}

document.getElementById("login-form").addEventListener("submit", function (event) {
  event.preventDefault();

  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  const users = getFromLocalStorage("users") || [];
  const user = users.find(
    (user) => user.email === email && user.password === password
  );
  if (user) {
    saveToLocalStorage("loggedInUser", user);
    showPopupMessage("Zalogowano pomyślnie!");
    checkLoginStatus();
    document.getElementById("login-popup").style.display = "none";
    updateCartCount();
  } else {
    showPopupMessage("Nieprawidłowy email lub hasło!");
  }
});

document.getElementById("register-form").addEventListener("submit", function (event) {
  event.preventDefault();

  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;
  const confirmPassword = document.getElementById("register-confirm-password").value;
  const firstName = document.getElementById("register-first-name").value;
  const lastName = document.getElementById("register-last-name").value;
  const address = document.getElementById("register-address").value;
  const city = document.getElementById("register-city").value;
  const zipcode = document.getElementById("register-zipcode").value;

  if (!email || !password || !confirmPassword || !firstName || !lastName || !address || !city || !zipcode) {
    showPopupMessage("Wypełnij wszystkie pola!");
    return;
  }

  if (!validateEmail(email)) {
    showPopupMessage("Podany email jest nieprawidłowy!");
    return;
  }

  if (password !== confirmPassword) {
    showPopupMessage("Podane hasła nie są takie same!");
    return;
  }

  if (password.length < 8) {
    showPopupMessage("Hasło musi składać się z co najmniej 8 znaków.");
    return;
  }

  if (zipcode.length !== 5) {
    showPopupMessage("Kod pocztowy musi składać się z 5 cyfr.");
    return;
  }

  const user = {
    email,
    password,
    firstName,
    lastName,
    address,
    city,
    zipcode,
    watchlist: [],
    cart: [],
    orderHistory: [],
  };

  let users = getFromLocalStorage("users") || [];
  users.push(user);
  saveToLocalStorage("users", users);

  showPopupMessage("Rejestracja udana!");
  document.getElementById("register-popup").style.display = "none";
  checkLoginStatus();
});

document.getElementById("logout").addEventListener("click", function () {
  localStorage.removeItem("loggedInUser");
  showPopupMessage("Wylogowano pomyślnie!");
  setTimeout(() => {
    window.location.href = "index.html";
  }, 1000);
  checkLoginStatus();
});

document.getElementById("profile").addEventListener("click", function () {
  const loggedInUser = getFromLocalStorage("loggedInUser");
  if (!loggedInUser) {
    alert("Musisz być zalogowany, aby uzyskać dostęp do tej strony.");
  } else {
    window.location.href = "profile.html";
  }
});

function saveToLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function getFromLocalStorage(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

//budowanie header
// FUNKCJA DO BUDOWANIA MENU W NAGLOWKU
function buildMenu(data) {
  // Znajdź element <ul> o klasie "menu" wewnątrz elementu z klasą "header"
  const menu = document.querySelector(".header ul.menu");

  if (!menu) {
    console.error(
      "Nie znaleziono elementu <ul> z klasą 'menu' wewnątrz '.header'."
    );
    return;
  }

  // Iteracja przez kategorie
  Object.keys(data).forEach((category) => {
    const menuItem = document.createElement("li");
    menuItem.className = "menu-item dropdown";

    const link = document.createElement("a");
    link.href = `searching.html?q= &category=${encodeURIComponent(category)}`;
    link.textContent = category.toUpperCase();

    const dropdown = document.createElement("div");
    dropdown.className = "dropdown-menu";

    // Tworzenie kolumn dla podkategorii
    Object.keys(data[category]).forEach((subCategory) => {
      const column = document.createElement("div");
      column.className = "menu-column";

      const heading = document.createElement("h3");
      heading.textContent = subCategory;

      const hr = document.createElement("hr");
      const list = document.createElement("ul");

      // Dodawanie elementów listy
      data[category][subCategory].forEach((item) => {
        const listItem = document.createElement("li");
        listItem.textContent = item;
        // Make the listItem clickable
        listItem.style.cursor = "pointer"; // Add pointer cursor to indicate clickability
        listItem.onclick = () => {
          window.location.href = `searching.html?q= &category=${encodeURIComponent(category)}&filters=${encodeURIComponent(item)}`;
        };
      
        list.appendChild(listItem);
      });

      column.appendChild(heading);
      column.appendChild(hr);
      column.appendChild(list);
      dropdown.appendChild(column);
    });

    menuItem.appendChild(link);
    menuItem.appendChild(dropdown);
    menu.appendChild(menuItem);
  });
}

// Funkcja do załadowania danych z pliku JSON i przekształcenia ich do odpowiedniej struktury
function loadCategoryData() {
  console.log("Ładowanie danych...");
  return fetch("../jsons/categoryData.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Błąd ładowania danych");
      }
      return response.json();
    })
    .then((data) => {
      // Struktura docelowa
      const transformedData = {
        ona: {},
        on: {},
        dziecko: {},
      };

      // Konwersja danych
      Object.keys(data).forEach((category) => {
        Object.keys(data[category]).forEach((subCategory) => {
          // Ustawienie danych w odpowiedniej kategorii
          transformedData[category][subCategory] = data[category][subCategory];
        });
      });

      // Zwrócenie przekształconych danych
      return transformedData;
    })
    .catch((error) => {
      console.error("Błąd:", error);
      return null; // Jeśli wystąpił błąd, zwróci null
    });
}

// Wywołanie funkcji po załadowaniu strony
loadCategoryData().then((categoryData) => {
  if (categoryData) {
    buildMenu(categoryData);
  } else {
    console.log("Błąd w ładowaniu lub przekształcaniu danych");
  }
});

loadSearch();
