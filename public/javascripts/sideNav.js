const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");
const drawer = document.getElementById("drawer");
const closeMenu = document.getElementById("closeMenu");
const backdrop = document.getElementById("menuBackdrop");

function openMenu() {
    mobileMenu.classList.remove("hidden");
    setTimeout(() => {
      drawer.classList.remove("-translate-x-full");
    }, 300);
}

function closeDrawer() {
    drawer.classList.add("-translate-x-full");
    setTimeout(() => {
      mobileMenu.classList.add("hidden");
    }, 300);
}

menuBtn?.addEventListener("click", openMenu);
closeMenu?.addEventListener("click", closeDrawer);
backdrop?.addEventListener("click", closeDrawer);