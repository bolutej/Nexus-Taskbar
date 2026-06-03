// import { supabase } from '../supabase.js';
import { initProfileModal } from "./profileModal.js";
 
// const urlParams = new URLSearchParams(window.location.search);
// const projectName = urlParams.get('project') || 'Board';
// document.getElementById('project-name').textContent = projectName;
// document.getElementById('board-title').textContent = projectName;

// // Auth check
// const { data: { session } } = await supabase.auth.getSession();
// if (!session) {
//   window.location.href = 'auth.html';
// } else {
//   const user = session.user;
//   const initials = (user.user_metadata?.full_name || user.email).slice(0, 2).toUpperCase();
//   document.getElementById('avatar-btn').textContent = initials;
// }

// // Logout
// document.getElementById('logout-btn').addEventListener('click', async () => {
//   await supabase.auth.signOut();
//   window.location.href = 'auth.html';
// });

//profie modal
  // projects.js — add this at the top
initProfileModal(); // ← call it to set up the modal



let tasks = [];
let taskCounter = 1;
let selectedTags = ['frontend'];
let draggedCard = null;
let toastTimer;

const backdrop = document.getElementById('modal-backdrop');

const openModal = (col = 'backlog') => {
  document.getElementById('task-col-select').value = col;
  backdrop.classList.add('open');
  setTimeout(() => document.getElementById('task-title-input').focus(), 50);
};

const closeModal = () => {
  backdrop.classList.remove('open');
  document.getElementById('task-title-input').value = '';
  document.getElementById('title-error').classList.add('hidden');
  selectedTags = ['frontend'];
  renderTagSelector();
};

document.getElementById('add-task-btn').addEventListener('click', () => openModal());
// ✅ Replace with this — handles X button, Done button, and backdrop all at once
document.querySelectorAll('[data-close]').forEach(el => {
  el.addEventListener('click', closeModal);
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && backdrop.classList.contains('open')) closeModal();
});

document.querySelectorAll('.column-add-btn').forEach(btn => {
  btn.addEventListener('click', () => openModal(btn.dataset.col));
});

function renderTagSelector() {
  document.querySelectorAll('.tag-option').forEach(opt => {
    opt.classList.toggle('selected', selectedTags.includes(opt.dataset.tag));
  });
}

document.getElementById('tag-selector').addEventListener('click', e => {
  const opt = e.target.closest('.tag-option');
  if(!opt) return;
  const tag = opt.dataset.tag;
  selectedTags = selectedTags.includes(tag) ? selectedTags.filter(t => t !== tag) : [...selectedTags, tag];
  renderTagSelector();
});

//submit task
document.getElementById('modal-submit').addEventListener('click', createTask);
document.getElementById('task-title-input').addEventListener('keydown', e => {if(e.key === 'Enter') createTask(); });


function createTask() {
  const title = document.getElementById('task-title-input').value.trim();
  if(!title) {
    document.getElementById('title-error').classList.remove('hidden');
    document.getElementById('task-title-input').focus();
    return;
  }
  const col = document.getElementById('task-col-select').value;
  const priority = document.getElementById('task-priority-select').value;
  const id = `NEX-${taskCounter++}`;
  const task = {id, title, tags: [...selectedTags], col, priority};
  tasks.push(task);
  renderCard(task);
  updateCounts();
  closeModal();
  showToast(`"${title}" added`);
}


//Render card
function renderCard(task) {
  const body = document.getElementById(`body-${task.col}`);
  const empty = body.querySelector('.empty-state');
  if(empty) empty.remove();

  const card = document.createElement('div');
  card.className = 'task-card bg-white border border-[#e8eaed] rounded-lg px-3.5 py-3 cursor-grab transition-all duration-150 relative';
  card.dataset.id = task.id;
  card.draggable = true;

  const priorityIcon = task.priority === 'high'
  ? `<svg class="priority-high" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>`
  : task.priority === 'low'
  ? `<svg class="priority-low" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>`
  : `<svg class="priority-medium" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/></svg>`;

const iconClass = task.col === 'done' ? 'done' : task.col === 'inprogress' ? 'progress' : 'todo';
const iconContent = task.col === 'done'
  ? `<svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>`
  : task.col === 'inprogress'
  ? `<svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="3"><polyline points="5 12 12 5 19 12"/><line x1="12" y1="5" x2="12" y2="19"/></svg>`
  : `<svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>`;

  const tagsHTML = task.tags.map(t =>
    `<span class="tag-${t} text-[0.68rem] font-semibold px-1.5 py-0.5 rounded uppercase tracking-[0.04em]">${t}</span>`
  ).join('');

  card.innerHTML = `
  <div class="flex flex-wrap gap-1 mb-2">${tagsHTML}</div>
  <div class="text-[0.88rem] font-medium text-[#172b4d] leading-snug mb-2.5">${task.title}</div>
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-1.5">
      <div class="task-id-icon ${iconClass} w-4 h-4 rounded-[3px] flex items-center justify-center">${iconContent}</div>
      <span class="text-[0.75rem] text-[#97a0af] font-medium">${task.id}</span>
    </div>
    <div class="flex items-center gap-1.5">
      ${priorityIcon}
      
    </div>
  </div>
`;
//<div class="w-[22px] h-[22px] rounded-full bg-gradient-to-br from-[#ff8f73] to-[#ff5630] text-white text-[0.62rem] font-semibold flex items-center justify-center">${document.getElementById('avatar-btn').textContent}</div>
card.addEventListener('dragstart', () => {
  draggedCard = card;
  setTimeout(() => card.classList.add('dragging'), 0);
});
card.addEventListener('dragend', () => {
  card.classList.remove('dragging');
  draggedCard = null;
});

body.insertBefore(card, body.firstChild);
card.style.opacity = '0';
card.style.transform = 'translateY(-8px)';
requestAnimationFrame(() => {
  card.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
  card.style.opacity = '1';
  card.style.transform = 'translateY(0)';
});
}


//Drag and drop
document.querySelectorAll('.column-body').forEach(body => {
  body.addEventListener('dragover', e => { e.preventDefault(); body.classList.add('drag-over'); }); 
  body.addEventListener('dragleave', () => body.classList.remove('drag-over'));
      body.addEventListener('drop', e => {
        e.preventDefault();
        body.classList.remove('drag-over');
        if (draggedCard) {
          const newCol = body.dataset.col;
          const task = tasks.find(t => t.id === draggedCard.dataset.id);
          if (task) task.col = newCol;
          body.insertBefore(draggedCard, body.firstChild);
          updateCounts();
          showToast(`Moved to ${newCol}`);
        }
      });
})

//Update counts + empty status
function updateCounts() {
  ['backlog', 'inprogress', 'done'].forEach(col => {
    const count = document.getElementById(`body-${col}`).querySelectorAll('.task-card').length;
    document.getElementById(`count-${col}`).textContent = count;
    const body = document.getElementById(`body-${col}`);
    if (count === 0 && !body.querySelector('.empty-state')) {
      body.innerHTML = `<div class="empty-state flex flex-col items-center justify-center py-8 text-[#97a0af] text-[0.8rem] gap-1 text-center"><div class="text-2xl opacity-40">○</div><span>No tasks yet</span></div>`;
    }
  });
  const total = tasks.length;
  document.getElementById('task-count').textContent = `${total} task${total !== 1 ? 's' : ''}`;
}

//Toast
function showToast(msg) {
  const toast = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

// Init + sample tasks
updateCounts();
const samples = [
  { id: `NEX-${taskCounter++}`, title: 'Implement dashboard metrics', tags: ['frontend', 'design'], col: 'backlog', priority: 'high' },
  { id: `NEX-${taskCounter++}`, title: 'Revamp navigation state', tags: ['backend'], col: 'inprogress', priority: 'medium' },
  { id: `NEX-${taskCounter++}`, title: 'Set up Supabase tables', tags: ['backend'], col: 'done', priority: 'low' },
];
samples.forEach(t => { tasks.push(t); renderCard(t); });
updateCounts();