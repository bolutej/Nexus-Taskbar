// js/profileModal.js
export function initProfileModal() {
const profileBackdrop = document.getElementById('profile-backdrop');
const profilePanel = document.getElementById('profile-panel');
const openProfileBtn = document.getElementById('open-profile-btn');
const closeProfileBtn = document.getElementById('close-profile-btn');
const cancelProfileBtn = document.getElementById('cancel-profile-btn');
const profileForm = document.getElementById('profile-form');
const firstInput = document.getElementById('first-name');
const lastInput = document.getElementById('last-name');
const emailInput = document.getElementById('profile-email');
const roleSelect = document.getElementById('profile-role');
const saveBtn = document.getElementById('save-profile-btn');
const avatarCircle = document.getElementById('avatar-circle');
const avatarName = document.getElementById('avatar-name');
const avatarRole = document.getElementById('avatar-role');
const emailError = document.getElementById('email-error');
const profileToast = document.getElementById('profile-toast');
const profileToastMsg = document.getElementById('profile-toast-msg');
const avatarUpload = document.getElementById('avatar-upload');
    // Guard — only run if elements exist on this page
    if (!profileBackdrop) return;
  
    function openProfileModal() {
      profileBackdrop.classList.add('open');
      profilePanel.classList.add('open');
    }
    
    function closeProfileModal() {
      profileBackdrop.classList.remove('open');
      profilePanel.classList.remove('open');
    }
  
    function updateAvatar() {
      const first = firstInput?.value.trim();
      const last = lastInput?.value.trim();
      const initials = ((first?.[0] || '') + (last?.[0] || '')).toUpperCase() || 'T';
      if (avatarCircle) avatarCircle.textContent = initials;
      if (avatarName) avatarName.textContent = [first, last].filter(Boolean).join(' ') || 'Your Name';
    }
  
    openProfileBtn?.addEventListener('click', openProfileModal);
    closeProfileBtn?.addEventListener('click', closeProfileModal);
    cancelProfileBtn?.addEventListener('click', closeProfileModal);
    firstInput?.addEventListener('input', updateAvatar);
    lastInput?.addEventListener('input', updateAvatar);
    avatarUpload?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (avatarCircle) {
          avatarCircle.style.backgroundImage = `url(${ev.target.result})`;
          avatarCircle.style.backgroundSize = 'cover';
          avatarCircle.style.backgroundPosition = 'center';
          avatarCircle.textContent = '';
        }
      };
      reader.readAsDataURL(file);
    });
//     profileForm.addEventListener('submit', (e) => {
//   e.preventDefault();
//   saveBtn.disabled = true;
//   saveBtn.innerHTML = '<span class="spinner></span> Saving...';

//   setTimeout(() => {
//       saveBtn.disabled = false;
//       saveBtn.innerHTML = `
//           <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
//       Save changes`;
//       closeModal();
//       showToast('Profile updated successfully');
//   }, 900);
// });
  }