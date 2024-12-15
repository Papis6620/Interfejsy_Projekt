document.addEventListener("DOMContentLoaded", function () {
    loadCart();
  });
  
  function loadCart() {
    const cartItemsContainer = document.getElementById("cart-items");
    const cartTotalContainer = document.getElementById("cart-total");
    const loggedInUser = getFromLocalStorage("loggedInUser");
  
    if (loggedInUser && loggedInUser.cart.length > 0) {
      cartItemsContainer.innerHTML = loggedInUser.cart.map((item, index) => `
        <div class="cart-item">
          <h3>${item.name}</h3>
          <p>Cena: ${item.price} PLN</p>
          <p>Ilość: <input type="number" value="${item.quantity}" min="1" data-index="${index}" class="quantity-input"></p>
          <button data-index="${index}" class="remove-button">Usuń</button>
        </div>
      `).join('');
  
      const total = loggedInUser.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      cartTotalContainer.innerHTML = `<h2>Łączna kwota: ${total} PLN</h2>`;
  
      document.querySelectorAll(".quantity-input").forEach(input => {
        input.addEventListener("change", updateQuantity);
      });
  
      document.querySelectorAll(".remove-button").forEach(button => {
        button.addEventListener("click", removeItem);
      });
    } else {
      cartItemsContainer.innerHTML = "<p>Twój koszyk jest pusty.</p>";
      cartTotalContainer.innerHTML = "";
    }
  }
  
  function updateQuantity(event) {
    const index = event.target.getAttribute("data-index");
    const newQuantity = parseInt(event.target.value);
    const loggedInUser = getFromLocalStorage("loggedInUser");
  
    if (loggedInUser && loggedInUser.cart[index]) {
      loggedInUser.cart[index].quantity = newQuantity;
      saveToLocalStorage("loggedInUser", loggedInUser);
      updateUsers(loggedInUser);
      loadCart();
      updateCartCount();
    }
  }
  
  function removeItem(event) {
    const index = event.target.getAttribute("data-index");
    const loggedInUser = getFromLocalStorage("loggedInUser");
  
    if (loggedInUser && loggedInUser.cart[index]) {
      loggedInUser.cart.splice(index, 1);
      saveToLocalStorage("loggedInUser", loggedInUser);
      updateUsers(loggedInUser);
      loadCart();
      updateCartCount();
    }
  }
  
  function updateUsers(updatedUser) {
    let users = getFromLocalStorage("users") || [];
    const userIndex = users.findIndex(user => user.email === updatedUser.email);
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      saveToLocalStorage("users", users);
    }
  }
  
  function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }
  
  function getFromLocalStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  function updateCartCount() {
    const cartCountElement = document.querySelector(".cart-count");
    const loggedInUser = getFromLocalStorage("loggedInUser");
    let count = 0;
    if (loggedInUser && loggedInUser.cart) {
      count = loggedInUser.cart.reduce((total, item) => total + item.quantity, 0);
    }
    if(count === 0){
      cartCountElement.style.display = "none";
    }else{
      cartCountElement.textContent = count;
      cartCountElement.style.display = "block";
    }
  }