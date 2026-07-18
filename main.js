/**
 * ZERO DEGREE CAFE - Frontend Application Core Engine
 * Location: RR Nagar, Bengaluru
 */

const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? "http://localhost:3000/api"
  : "https://zero-degree-backend.onrender.com/api"; // We will replace this specific URL in Step 4!

let currentSelectedFoodItem = null;
const orderCartArrayMemory = [];

document.addEventListener("DOMContentLoaded", () => {
  fetchMenuData();
  fetchBreweryTelemetry();
  fetchHillWeatherTelemetry();
  setupModalListeners();
  initCartSystemLogics();
});

async function fetchMenuData() {
  const container = document.getElementById("menuContainer");
  try {
    const response = await fetch(`${API_BASE_URL}/menu`);
    const data = await response.json();
    if (data.success && data.menu.length > 0) renderMenuGrid(data.menu);
  } catch (error) {
    container.innerHTML = `<p class="text-rose-500 text-sm text-center col-span-full">⚠️ Server Offline.</p>`;
  }
}

function renderMenuGrid(menuItems) {
  const container = document.getElementById("menuContainer");
  container.innerHTML = "";
  menuItems.forEach(item => {
    const card = document.createElement("div");
    card.className = "group bg-zinc-900/30 border border-zinc-900 hover:border-cyan-500/30 p-4 transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4";
    card.innerHTML = `
      <div class="space-y-4">
        <div class="aspect-[4/3] w-full bg-zinc-950 overflow-hidden border border-zinc-900/50">
          <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"/>
        </div>
        <div class="space-y-1">
          <p class="text-[9px] tracking-[0.2em] text-cyan-400 uppercase font-semibold">${item.category}</p>
          <h3 class="text-lg font-serif-luxury text-zinc-100 tracking-wide">${item.name}</h3>
        </div>
      </div>
      <div class="flex justify-between items-center pt-2">
        <span class="text-sm font-medium text-zinc-300">${item.price}</span>
        <span class="text-[10px] tracking-widest text-zinc-500 group-hover:text-cyan-400 uppercase flex items-center gap-1">Details &rarr;</span>
      </div>
    `;
    card.addEventListener("click", () => openDescriptionModal(item));
    container.appendChild(card);
  });
}

/**
 * FEATURE 1: DYNAMIC BREWERY TELEMETRY LOGGER
 */
async function fetchBreweryTelemetry() {
  const container = document.getElementById("breweryTanksContainer");
  if (!container) return;
  try {
    const response = await fetch(`${API_BASE_URL}/brewery-tanks`);
    const data = await response.json();
    if (data.success) {
      container.innerHTML = "";
      data.tanks.forEach(tank => {
        const item = document.createElement("div");
        item.className = "bg-zinc-900/20 border border-zinc-900 p-6 space-y-4";
        item.innerHTML = `
          <div class="flex justify-between text-xs tracking-wider">
            <span class="font-serif-luxury text-zinc-300 font-medium">${tank.name}</span>
            <span class="text-cyan-400 font-semibold">${tank.level}%</span>
          </div>
          <div class="w-full bg-zinc-950 h-2.5 rounded-full overflow-hidden border border-zinc-900">
            <div class="bg-gradient-to-r from-cyan-600 to-cyan-400 h-full transition-all duration-1000" style="width: ${tank.level}%"></div>
          </div>
          <p class="text-[10px] uppercase tracking-widest text-zinc-500">${tank.status}</p>
        `;
        container.appendChild(item);
      });
    }
  } catch (err) { console.error("Telemetry failure", err); }
}

/**
 * FEATURE 2: HILL DECK METRIC ASSET SIGNAL
 */
async function fetchHillWeatherTelemetry() {
  try {
    const response = await fetch(`${API_BASE_URL}/hill-weather`);
    const data = await response.json();
    if (data.success) {
      document.getElementById("widgetVisibility").innerText = data.visibility;
      document.getElementById("widgetTemp").innerText = data.temperature;
    }
  } catch (err) { console.error("Weather asset offline", err); }
}

function openDescriptionModal(item) {
  currentSelectedFoodItem = item;
  const modal = document.getElementById("descriptionModal");
  const modalBox = document.getElementById("descModalBox");
  document.getElementById("modalImage").src = item.image;
  document.getElementById("modalCategory").innerText = item.category;
  document.getElementById("modalName").innerText = item.name;
  document.getElementById("modalDescription").innerText = item.description;
  document.getElementById("modalPrice").innerText = item.price;
  modal.classList.remove("hidden"); modal.classList.add("flex");
  setTimeout(() => { modal.classList.remove("opacity-0"); modalBox.classList.remove("scale-95", "opacity-0"); }, 10);
}

function closeDescriptionModal() {
  const modal = document.getElementById("descriptionModal");
  const modalBox = document.getElementById("descModalBox");
  modal.classList.add("opacity-0"); modalBox.classList.add("scale-95", "opacity-0");
  setTimeout(() => { modal.classList.remove("flex"); modal.classList.add("hidden"); }, 300);
}

function openBookingModal() {
  const modal = document.getElementById("bookingModal");
  const modalBox = document.getElementById("modalBox");
  document.getElementById("formState").classList.remove("hidden");
  document.getElementById("successState").classList.add("hidden");
  modal.classList.remove("hidden"); modal.classList.add("flex");
  setTimeout(() => { modal.classList.remove("opacity-0"); modalBox.classList.remove("scale-95", "opacity-0"); }, 10);
}

function closeBookingModal() {
  const modal = document.getElementById("bookingModal");
  const modalBox = document.getElementById("modalBox");
  modal.classList.add("opacity-0"); modalBox.classList.add("scale-95", "opacity-0");
  setTimeout(() => { modal.classList.remove("flex"); modal.classList.add("hidden"); }, 300);
}

/**
 * SHOPPING BAG / CART LOGIC ENGINE
 */
function initCartSystemLogics() {
  const addToOrderBtn = document.querySelector("#descriptionModal .modal-footer button");
  const cartToggleBtn = document.getElementById("cartToggleBtn");
  const closeCartBtn = document.getElementById("closeCartBtn");
  const checkoutBtn = document.getElementById("checkoutBtn");

  if (addToOrderBtn) {
    addToOrderBtn.onclick = () => {
      if (!currentSelectedFoodItem) return;
      
      // Check if item already exists in the bag
      const record = orderCartArrayMemory.find(el => el.id === currentSelectedFoodItem.id);
      if (record) {
        record.quantity += 1; 
      } else {
        orderCartArrayMemory.push({ ...currentSelectedFoodItem, quantity: 1 });
      }
      
      // Update UI components (Bag numbers update instantly)
      updateCartRenderUIStructures(); 
      
      // Close the item popup smoothly so you can keep browsing other items!
      closeDescriptionModal(); 
      
      // Visual feedback on the bag badge
      const badge = document.getElementById("cartCountBadge");
      badge.classList.add("scale-125", "bg-emerald-400");
      setTimeout(() => badge.classList.remove("scale-125", "bg-emerald-400"), 300);
    };
  }
  
  if (cartToggleBtn) cartToggleBtn.addEventListener("click", openCartDrawer);
  if (closeCartBtn) closeCartBtn.addEventListener("click", closeCartDrawer);
  
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (orderCartArrayMemory.length === 0) {
        alert("Your bag is empty! Add some craft brews or pizzas first.");
        return;
      }
      alert("🎉 Order placed successfully! Sending instructions to the Zero Degree deck kitchen.");
      orderCartArrayMemory.length = 0; // Reset array
      updateCartRenderUIStructures(); 
      closeCartDrawer();
    });
  }
}

function openCartDrawer() {
  const side = document.getElementById("cartSidebar");
  side.classList.remove("hidden"); 
  setTimeout(() => side.classList.remove("translate-x-full"), 10);
}

function closeCartDrawer() {
  const side = document.getElementById("cartSidebar");
  side.classList.add("translate-x-full"); 
  setTimeout(() => side.classList.add("hidden"), 300);
}

// Dynamically populates the cart drawer with everything added, individual breakdowns, and totals
function updateCartRenderUIStructures() {
  const itemsList = document.getElementById("cartItemsList");
  const badge = document.getElementById("cartCountBadge");
  const totalSum = document.getElementById("cartTotalSum");
  
  const totalItems = orderCartArrayMemory.reduce((sum, el) => sum + el.quantity, 0);
  badge.innerText = totalItems;

  if (orderCartArrayMemory.length === 0) {
    itemsList.innerHTML = `<p class="text-center py-8 text-zinc-600">Your order bag is currently empty.</p>`;
    totalSum.innerText = "₹0"; 
    return;
  }
  
  let cost = 0; 
  itemsList.innerHTML = "";
  
  orderCartArrayMemory.forEach(item => {
    const price = parseInt(item.price.replace(/[^0-9]/g, ""), 10) || 0;
    const sub = price * item.quantity; 
    cost += sub;
    
    const row = document.createElement("div");
    row.className = "flex justify-between items-center border-b border-zinc-900/50 pb-3 text-zinc-200 animate-fadeIn";
    row.innerHTML = `
      <div>
        <p class="font-medium text-zinc-100">${item.name}</p>
        <p class="text-[11px] text-zinc-500">${item.price} &times; ${item.quantity}</p>
      </div>
      <div class="flex items-center gap-4">
        <span class="font-medium text-zinc-300">₹${sub}</span>
      </div>
    `;
    itemsList.appendChild(row);
  });
  
  totalSum.innerText = `₹${cost}`;
}

function setupModalListeners() {
  const descModal = document.getElementById("descriptionModal");
  const closeDescBtn = document.getElementById("closeDescModalBtn");
  const bookingModal = document.getElementById("bookingModal");
  const closeBookingBtn = document.getElementById("closeModalBtn");
  const navBookBtn = document.getElementById("navFindTableBtn");
  const heroBookBtn = document.getElementById("heroBookTableBtn");
  const dismissSuccessBtn = document.getElementById("dismissSuccessBtn");
  const bookingForm = document.getElementById("bookingForm");

  closeDescBtn.addEventListener("click", closeDescriptionModal);
  descModal.addEventListener("click", (e) => { if (e.target === descModal) closeDescriptionModal(); });
  if (navBookBtn) navBookBtn.addEventListener("click", (e) => { e.preventDefault(); openBookingModal(); });
  if (heroBookBtn) heroBookBtn.addEventListener("click", openBookingModal);
  closeBookingBtn.addEventListener("click", closeBookingModal);
  dismissSuccessBtn.addEventListener("click", closeBookingModal);
  bookingModal.addEventListener("click", (e) => { if (e.target === bookingModal) closeBookingModal(); });

  bookingForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = document.getElementById("submitBtn"); btn.innerText = "Securing..."; btn.disabled = true;
    try {
      const res = await fetch(`${API_BASE_URL}/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: document.getElementById("bookingEmail").value,
          name: document.getElementById("bookingName").value,
          guests: document.getElementById("bookingGuests").value,
          time: document.getElementById("bookingTime").value
        })
      });
      const data = await res.json();
      if (data.success) {
        document.getElementById("formState").classList.add("hidden");
        document.getElementById("successState").classList.remove("hidden"); document.getElementById("successState").classList.add("flex");
        bookingForm.reset();
      }
    } catch (err) { alert("Network pipe mismatch."); }
    finally { btn.innerText = "Confirm Reservation"; btn.disabled = false; }
  });
}