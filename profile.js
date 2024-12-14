document.addEventListener("DOMContentLoaded", function () {

    const buttons = document.querySelectorAll(".profile-btn");
    const sections = document.querySelectorAll(".profile-section");
  
    buttons.forEach(button => {
      button.addEventListener("click", function () {
        const sectionId = this.getAttribute("data-section");
    
        sections.forEach(section => {
          section.classList.remove("active");
        });
    
        document.getElementById(sectionId).classList.add("active");
    
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
  
    // Display the first section by default
    if (sections.length > 0) {
      sections[0].classList.add("active");
      loadOrderHistory(); // Load order history if the first section is order history
    }
  });
  
  function loadOrderHistory() {
    const orderHistoryContent = document.getElementById("order-history-content");
    const loggedInUser = getFromLocalStorage("loggedInUser");
  
    if (loggedInUser && loggedInUser.orderHistory) {
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
  
    localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
    alert("Dane zostały zapisane!");
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
  
    localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
    alert("Zmiany zostały zapisane!");
  });

  function loadWatchlist() {
    const watchlistContent = document.getElementById("watchlist");
    const loggedInUser = getFromLocalStorage("loggedInUser");
  
    if (loggedInUser && loggedInUser.watchlist && loggedInUser.watchlist.length > 0) {
      watchlistContent.innerHTML = loggedInUser.watchlist.map(item => `
        <div class="watchlist-item">
          <h3>${item.name}</h3>
          <p>Cena: ${item.price} PLN</p>
        </div>
      `).join('');
    } else {
      watchlistContent.innerHTML = "<p>Brak produktów na liście obserwowanych.</p>";
    }
  }
  