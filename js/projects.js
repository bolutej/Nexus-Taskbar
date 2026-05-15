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

    setTimeout(() => {
        createProjectCard(title, description);
        
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Create project`;
        closeModal();
        setTimeout(resetForm, 220);
        showToast('"' + title + '"created successfully');
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

function createProjectCard(title, description) {
    const container = document.getElementById('projects-container');

    const card = document.createElement('div');
    card.className = 'bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200 px-8 py-5 w-[32%]'

    card.innerHTML = `
       <div class="">
        <div class="flex justify-between">
          <span class="ml-3 inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-600 text-xs font-medium rounded-full">
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
        <p class="font-bold text-lg">${description}</p>
        <p class="pt-2">100% completed</p>
        <div class="flex justify-between pt-10">
        <a href=""><button class="hover:underline">View</button></a>
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
