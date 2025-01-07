document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll(".profile-btn");
  const sections = document.querySelectorAll(".profile-section");

  buttons.forEach(button => {
    button.addEventListener("click", function () {
      const sectionId = this.getAttribute("data-section");

      // Remove 'active' class from all buttons
      buttons.forEach(btn => btn.classList.remove("active"));
      // Add 'active' class to the clicked button
      this.classList.add("active");

      // Hide all sections
      sections.forEach(section => section.classList.remove("active"));

      // Show the selected section
      const activeSection = document.getElementById(sectionId);
      activeSection.classList.add("active");

      // Load corresponding content
      if (sectionId === "order-history") {
        loadOrderHistory();
      } else if (sectionId === "watchlist") {
        loadWatchlist();
      } else if (sectionId === "order-details") {
        loadOrderDetails();
      } else if (sectionId === "account-settings") {
        loadAccountSettings();
      }
    });
  });

  // Get the hash from the URL
  const hash = window.location.hash.substring(1);
  let activeSectionId = hash || sections[0].id;

  // Set the active button and section
  buttons.forEach(btn => {
    if (btn.getAttribute("data-section") === activeSectionId) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  sections.forEach(section => {
    section.classList.remove("active");
    if (section.id === activeSectionId) {
      section.classList.add("active");
      // Load the corresponding content
      if (activeSectionId === "order-history") {
        loadOrderHistory();
      } else if (activeSectionId === "watchlist") {
        loadWatchlist();
      } else if (activeSectionId === "order-details") {
        loadOrderDetails();
      } else if (activeSectionId === "account-settings") {
        loadAccountSettings();
      }
    }
  });
});
  
  function loadOrderHistory() {
    const orderHistoryContent = document.getElementById("order-history-content");
    const loggedInUser = getFromLocalStorage("loggedInUser");
  
    if (loggedInUser && loggedInUser.orderHistory.length > 0) {
      orderHistoryContent.innerHTML = loggedInUser.orderHistory.map(order => `
        <div class="order">
          <h3>Zamówienie #${order.id}</h3>
          <p>Data: ${order.date}</p>
          <p>Kwota: ${order.amount} PLN</p>
          <ul>
            ${order.items.map(item => `<li>${item.name} - ${item.quantity} szt.</li>`).join('')}
          </ul>
        </div>
      `).join('');
    } else {
      orderHistoryContent.innerHTML = "<p>Brak historii zamówień.</p>";
    }
  }
  
  function getFromLocalStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  function loadOrderDetails() {
    const loggedInUser = getFromLocalStorage("loggedInUser");
  
    if (loggedInUser) {
      document.getElementById("address").value = loggedInUser.address;
      document.getElementById("city").value = loggedInUser.city;
      document.getElementById("zipcode").value = loggedInUser.zipcode;
    }
  }
  
  document.getElementById("order-details-form").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const updatedUser = getFromLocalStorage("loggedInUser");
    updatedUser.address = document.getElementById("address").value;
    updatedUser.city = document.getElementById("city").value;
    updatedUser.zipcode = document.getElementById("zipcode").value;
  
    let users = getFromLocalStorage("users") || [];
    const userIndex = users.findIndex(user => user.email === updatedUser.email);
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      saveToLocalStorage("users", users);
    }
  
    // Save the updated user to loggedInUser
    saveToLocalStorage("loggedInUser", updatedUser);
    alert("Zmiany zostały zapisane!");
  });

  function loadAccountSettings() {
    const loggedInUser = getFromLocalStorage("loggedInUser");
  
    if (loggedInUser) {
      document.getElementById("first-name").value = loggedInUser.firstName;
      document.getElementById("last-name").value = loggedInUser.lastName;
      document.getElementById("password").value = loggedInUser.password;
    }
  }
  
  document.getElementById("account-settings-form").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const updatedUser = getFromLocalStorage("loggedInUser");
    updatedUser.firstName = document.getElementById("first-name").value;
    updatedUser.lastName = document.getElementById("last-name").value;
    updatedUser.password = document.getElementById("password").value;
  
    // Update the user in the users array
    let users = getFromLocalStorage("users") || [];
    const userIndex = users.findIndex(user => user.email === updatedUser.email);
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      saveToLocalStorage("users", users);
    }
  
    // Save the updated user to loggedInUser
    saveToLocalStorage("loggedInUser", updatedUser);
    alert("Zmiany zostały zapisane!");
  });

  function loadWatchlist() {
    const watchlistContent = document.getElementById("watchlist-content");
    const loggedInUser = getFromLocalStorage("loggedInUser");
  
    if (loggedInUser && loggedInUser.watchlist && loggedInUser.watchlist.length > 0) {
      watchlistContent.innerHTML = `
        <div id="tiles">
          ${loggedInUser.watchlist.map(item => `
            <a href="./product.html?id=${item.id}" class="product-link">
              <div class="product-tile">
                <div class="product-content">
                  <img src="../img/products/product${item.id}/product1.png" alt="${item.name}" class="product-image">
                  <div class="product-info">
                    <h3 class="product-name">${item.name}</h3>
                    <p class="product-price">${item.price} zł</p>
                  </div>
                </div>
              </div>
            </a>
          `).join('')}
        </div>
      `;
    } else {
      watchlistContent.innerHTML = "<p>Brak produktów na liście obserwowanych.</p>";
    }
  }
  
  function updateLastInRow() {
    const tiles = document.querySelectorAll("#tiles .product-tile");
    const container = document.getElementById("tiles");
  
    const columns = Math.floor(container.offsetWidth / 270);
  
    tiles.forEach((tile) => {
      tile.classList.remove("last-product-in-row");
    });
  
    tiles.forEach((tile, index) => {
      if ((index + 1) % columns === 0) {
        tile.classList.add("last-product-in-row");
      }
    });
  }
  