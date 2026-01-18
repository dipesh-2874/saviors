const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");
const drawer = document.getElementById("drawer");
const closeMenu = document.getElementById("closeMenu");
const backdrop = document.getElementById("menuBackdrop");

const botIcon = document.getElementById("botIcon");
const chatBox = document.getElementById("chatBox");
const openChat = document.getElementById("openChat");
const closeChat = document.getElementById("closeChat");
const chatBackdrop = document.getElementById("chatBackdrop");

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

function openCh() {
    chatBox.classList.remove("hidden");
    setTimeout(() => {
      openChat.classList.remove("translate-x-full");
    }, 300);
}

function closeCh() {
    openChat.classList.add("translate-x-full");
    setTimeout(() => {
      chatBox.classList.add("hidden");
    }, 300);
}

menuBtn?.addEventListener("click", openMenu);
closeMenu?.addEventListener("click", closeDrawer);
backdrop?.addEventListener("click", closeDrawer);

botIcon?.addEventListener("click", openCh);
closeChat?.addEventListener("click", closeCh);
chatBackdrop?.addEventListener("click", closeCh);