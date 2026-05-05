// js/ui.js
function switchTab(tab) {
  document.querySelectorAll(".form-panel").forEach((p) => {
    p.classList.add("hidden");
    p.classList.remove("block");
  });

  document.querySelectorAll(".tab").forEach((t) => {
    t.classList.add("opacity-50", "border-transparent");
    t.classList.remove("opacity-100", "border-[#0F0C29]");
  });

  document.getElementById(tab).classList.remove("hidden");
  document.getElementById(tab).classList.add("block");

  const activeTab = document.getElementById(`tab-${tab}`);
  activeTab.classList.remove("opacity-50", "border-transparent");
  activeTab.classList.add("opacity-100", "border-[#0F0C29]");
}