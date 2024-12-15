function updateLastInRow() {
  const tiles = document.querySelectorAll("#tiles .product-tile");
  const container = document.getElementById("tiles");

  // Obliczamy liczbę kolumn na podstawie szerokości kontenera
  const columns = Math.floor(container.offsetWidth / 270); // Oblicza liczbę kolumn (przy założeniu, że szerokość kafelka to 250px)

  // Usuwamy klasę 'last-in-row' ze wszystkich kafelków
  tiles.forEach((tile) => {
    tile.classList.remove("last-product-in-row");
  });

  // Dodajemy klasę 'last-in-row' tylko do ostatniego kafelka w każdym rzędzie
  tiles.forEach((tile, index) => {
    // Indeks ostatniego elementu w danym rzędzie
    if ((index + 1) % columns === 0) {
      tile.classList.add("last-product-in-row");
    }
  });
}

// Wywołanie funkcji przy załadowaniu strony
window.addEventListener("load", updateLastInRow);

// Wywołanie funkcji przy zmianie rozmiaru okna
window.addEventListener("resize", updateLastInRow);
