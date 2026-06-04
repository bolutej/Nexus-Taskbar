// js/projects.js
import { supabase } from '../supabase.js';
import { logOut } from './auth.js';

// ✅ Protect page and fill in user info
supabase.auth.onAuthStateChange((event, session) => {
  if (session?.user) {
    const user = session.user;
    const nameEl = document.getElementById('user-name');
    const emailEl = document.getElementById('user-email');

    if (emailEl) emailEl.textContent = user.email;
    if (nameEl) nameEl.textContent = user.user_metadata?.full_name ?? user.email;

    const loading = document.getElementById('loading');
    const content = document.getElementById('projects-content');
    if (loading) loading.style.display = 'none';
    if (content) content.style.display = 'block';
    loadProjects();
  } else {
    window.location.href = 'auth.html';
  }
});

document.getElementById('logout-btn')?.addEventListener('click', async () => {
  try {
    await logOut();
  } catch (error) {
    console.error('Logout failed:', error.message);
  }
});

    // ✅ Load projects from Supabase
async function loadProjects() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
  
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
  
    if (error) { console.error('Error loading projects:', error.message); return; }
  
    const container = document.getElementById('projects-container');
    container.innerHTML = '';
  
    if (projects.length === 0) {
      container.innerHTML = '<p class="text-slate-400 text-sm p-4">No projects yet. Create one!</p>';
      return;
    }
  
    projects.forEach(p => createProjectCard(p.name, p.description, p.id));
  
    const taskSummary = document.getElementById('task-summary');
    if (taskSummary) taskSummary.textContent = `— ${projects.length} Project${projects.length !== 1 ? 's' : ''} across 2 teams`;
  }
  
  // ✅ Save project to Supabase
  async function saveProject(name, description) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
  
    const { data, error } = await supabase
      .from('projects')
      .insert([{ name, description, user_id: session.user.id }])
      .select()
      .single();
  
    if (error) { console.error('Error saving project:', error.message); throw error; }
    return data;
  }

//Create Project Modal 
const openBtn = document.getElementById('open-modal-btn');
const closeBtn = document.getElementById('close-modal-btn');
const backdrop = document.getElementById('modal-backdrop');
const panel = document.getElementById('modal-panel');
const cancelBtn = document.getElementById('cancel-btn');
const form = document.getElementById('project-form')
const titleInput = document.getElementById('project-title');
const descInput = document.getElementById('project-desc');
const titleCount = document.getElementById('title-count');
const descCount = document.getElementById('desc-count');
const descBar = document.getElementById('desc-bar');
const titleError = document.getElementById('title-error')
const submitBtn = document.getElementById('submit-btn');
const toast = document.getElementById('toast');
const toastMsg = document.getElementById('toast-msg');

//Profile Modal
import { initProfileModal } from './profileModal.js';

initProfileModal();


function openModal() {
    backdrop.classList.remove('hidden');
    requestAnimationFrame(() => {
        backdrop.classList.add('open');
        panel.classList.add('open');
    });
}
function closeModal() {
    backdrop.classList.remove('open');
    panel.classList.remove('open');
    setTimeout(() => backdrop.classList.add('hidden'), 220);
}

function resetForm() {
    form.reset();
    titleCount.textContent = '0';
    descCount.textContent = '0';
    descBar.style.width = '0%';
    titleError.classList.add('hidden');
    titleInput.classList.remove('border-red-40', 'bg-red-50');
}

openBtn.addEventListener('click', openModal);

[closeBtn, cancelBtn].forEach(btn => btn.addEventListener('click', () => {
    closeModal();
    setTimeout(resetForm, 220);
}))

backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
        closeModal();
        setTimeout(resetForm, 220);
    }
})

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && backdrop.classList.contains('open')) {
        closeModal();
        setTimeout(resetForm, 220);
    }
});

titleInput.addEventListener('input', () => {
    titleCount.textContent = titleInput.value.length;
    if (titleInput.value.trim()) {
        titleError.classList.add('hidden');
        titleInput.classList.remove('border-red-400', 'bg-red-50');
    }
})

descInput.addEventListener('input', () => {
    const len = descInput.value.length;
    descCount.textContent = len;
    const pct = (len / 500) * 100;
    descBar.style.width = pct + '%';
    if (pct < 70) {
        descBar.style.background = '#818cf8';
    }
    else if (pct < 90) {
        descBar.style.background = '#fbbf24';
    }
    else {
        descBar.style.background = '#f87171';
    }
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = titleInput.value.trim();
    const description = descInput.value.trim();

    if (!title) {
        titleError.classList.remove('hidden');
        titleInput.classList.add('border-red-500', 'bg-red-500');
        titleInput.focus();
        return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="spinner"></span> Creating...`;

    setTimeout(async () => {
        try {
          const project = await saveProject(title, description);
          createProjectCard(title, description, project.id);
          submitBtn.disabled = false;
          submitBtn.innerHTML = `<svg ...></svg> Create project`;
          closeModal();
          setTimeout(resetForm, 220);
          showToast('"' + title + '" created successfully');
        } catch (error) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Create project';
          showToast('Error creating project. Try again.');
        }
      }, 900);
}); 

let toastTimer;

function showToast(msg) {
    toastMsg.textContent = msg;
    toast.classList.remove('opacity-0', 'translate-y-2', 'pointer-events-none');
    toast.classList.add('opacity-100', 'translate-y-0');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-2');
        toast.classList.remove('opacity-100', 'translate-y-0');
    }, 3000)
}

function createProjectCard(title, description, projectId) {
    const container = document.getElementById('projects-container');

    const card = document.createElement('div');
    card.className = 'bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200 px-8 py-5 w-[32%]'

    card.innerHTML = `
       <div class="">
        <div class="flex justify-between">
          <span class="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-600 text-xs font-medium rounded-full">
            <i class="fa-solid fa-circle text-[6px]"></i>
            Active
          </span>
        <svg
              class="text-[#5e6c84] mt-3"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              stroke-width="2.4"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="5" cy="12" r="1.2" />
              <circle cx="12" cy="12" r="1.2" />
              <circle cx="19" cy="12" r="1.2" />
            </svg>
          </div>
        <h1 class="font-bold text-xl pt-3">${title}</h1>
        <p class="font-bold text-lg text-slate-200">${description}</p>
        <p class="pt-2">100% completed</p>
        <div class="flex justify-between pt-10">
        <a href="dashboard.html?project=${encodeURIComponent(title)}&id=${projectId}">
  <button class="hover:underline">View</button>
</a>
        <span><i class="fa-regular fa-calendar mr-1"></i>${new Date().toLocaleDateString()}</span>
      </div>
      </div>
    `;

    card.style.opacity = '0';
    card.style.transform = 'translateY(-10px)';
    container.insertBefore(card, container.firstChild);

    requestAnimationFrame(() => {
        card.style.transition = 'opacity 300ms ease, transform 300ms ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    })
    // container.insertBefore(card, container.firstChild);

    const totalCards = container.children.length;
    const taskSummary = document.getElementById('task-summary');
    taskSummary.textContent = `— ${totalCards} Project${totalCards !== 1 ? 's' : ''} across 2 teams`
}


//Profile Modal

// export function openProfileModal() {
//     profileBackdrop.classList.remove('hidden');
//     requestAnimationFrame(() => {
//         profileBackdrop.classList.add('open');
//         profilePanel.classList.add('open');
//     });
// }

// export function closeProfileModal() {
//     profileBackdrop.classList.remove('open');
//     profilePanel.classList.remove('open');
//     setTimeout(() => profileBackdrop.classList.add('hidden'), 220);
// }

// openProfileBtn.addEventListener('click', openProfileModal);

// [closeProfileBtn, cancelProfileBtn].forEach(btn => btn.addEventListener('click', closeProfileModal));

// profileBackdrop.addEventListener('click', (e) => {
//     if(e.target === profileBackdrop) 
//         closeProfileModal();
// })

// document.addEventListener('keydown', (e) => {
//     if(e.key === 'Escape' && profileBackdrop.classList.contains('open')) 
//         closeProfileModal();
// });

// //Live avatar initials update
// export function updateAvatar() {
//     const first = firstInput.value.trim();
//     const last = lastInput.value.trim();
//     const initials = (first[0] || '') + (last[0] || '');
//     avatarCircle.textContent = initials.toUpperCase() || 'T';
//     avatarName.textContent = [first, last].filter(Boolean).join('') || 'Your Name';
//     avatarName.textContent = roleSelect.value;
// }

// [firstInput, lastInput].forEach(i => i.addEventListener('input', updateAvatar));
// roleSelect.addEventListener('change', updateAvatar);

// //Avatar image uplaod preview
// avatarUpload.addEventListener('change', (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = (ev) => {
//         avatarCircle.style.backgroundImage = `url(${ev.target.result})`;
//         avatarCircle.style.backgroundSize = 'cover';
//         avatarCircle.style.backgroundPosition = 'center';
//         avatarCircle.textContent = '';
//     }
//     reader.readAsDataURL(file);
// });

//Email validation

// function isValidEmail(val) {
//     return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
// }
// emailInput.addEventListener('input', () => {
//     if (isValidEmail(emailInput.value)) {
//         emailError.classList.add('hidden');
//         emailInput.classList.remove('border-red-400');
//     }
// });


//Form submit
form.addEventListener('submit', (e) => {
    e.preventDefault();
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<span class="spinner></span> Saving...';

    setTimeout(() => {
        saveBtn.disabled = false;
        saveBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        Save changes`;
        closeModal();
        showToast('Profile updated successfully');
    }, 900);
});

// if (!isValidEmail(emailInput.value)) {
//     emailError.classList.remove('hidden');
//     emailInput.classList.add('border-red-400');
//     emailInput.focus();
//     return;
// }

