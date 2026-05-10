const openBtn = document.getElementById('open-modal-btn');
const closeBtn = document.getElementById('close-btn');
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
    setTimeout(() => backdrop.classListadd('hidden'), 220);
}

function resetForm () {
    form.reset();
    titleCount.textContent ='0';
    descCount.textContent = '0';
    descBar.style.width = '0%';
    titleError.classList.add('hidden');
    titleInput.classList.remove('border-red-40', 'bg-red-50');
}

openBtn.addEventListener('click', openModal);