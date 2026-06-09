import { supabase } from '../supabase.js';
import { initProfileModal } from "./profileModal.js";
import { initInfoModal } from './infoModal.js';
import { initNotiModal } from './notiModal.js';



let tasks = [];
let taskCounter = 1;
let selectedTags = ['frontend'];
let draggedCard = null;
let toastTimer;
let userInitials = 'T';
let currentTaskId = null;

// Add this near the top of the file, with your other helpers
function parseTags(raw) {
  if (Array.isArray(raw)) return raw;
  if (!raw) return [];
  if (typeof raw === 'string') {
    try { return JSON.parse(raw); } catch {
      return raw.split(',').map(t => t.trim()).filter(Boolean);
    }
  }
  return [];
}

// ✅ Load tasks from Supabase
async function loadTasks(projectId) {
  if (!projectId) return;

  const { data: tasks, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  if (error) { console.error('Error loading tasks:', error.message); return; }

  tasks.forEach(task => {
    const t = {
      id: task.id,
      title: task.title,
      tags: parseTags(task.tags),
      col: task.col,
      priority: task.priority
    };
    renderCard(t);
  });

  updateCounts();
}

// ✅ Save task to Supabase
async function saveTask(task, projectId) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return;

  const { data, error } = await supabase
    .from('tasks')
    .insert([{
      title: task.title,
      description: task.description,
      tags: JSON.stringify(task.tags),
      col: task.col,
      priority: task.priority,
      project_id: projectId,
      user_id: session.user.id
    }])
    .select()
    .single();

  if (error) { console.error('Error saving task:', error.message); throw error; }
  return data;
}

// ✅ Update task column in Supabase (for drag and drop)
async function updateTaskCol(taskId, newCol) {
  const { error } = await supabase
    .from('tasks')
    .update({ col: newCol })
    .eq('id', taskId);

  if (error) console.error('Error updating task:', error.message);
}

// ✅ Delete task from Supabase
async function deleteTask(taskId) {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId);

  if (error) console.error('Error deleting task:', error.message);
}


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
  if (!opt) return;
  const tag = opt.dataset.tag;
  selectedTags = selectedTags.includes(tag) ? selectedTags.filter(t => t !== tag) : [...selectedTags, tag];
  renderTagSelector();
});

//submit task
document.getElementById('modal-submit').addEventListener('click', createTask);
document.getElementById('task-title-input').addEventListener('keydown', e => { if (e.key === 'Enter') createTask(); });
document.getElementById('modal-delete')?.addEventListener('click', async () => {
  if (!currentTaskId) return;
  try {
    await deleteTask(currentTaskId);
    const card = document.querySelector(`[data-id="${currentTaskId}"]`);
    if (card) card.remove();
    tasks = tasks.filter(t => t.id !== currentTaskId);
    updateCounts();
    closeModal();
    showToast('Task deleted');
  } catch (error) {
    showToast('Error deleting task.');
  }
});

async function createTask() {
  const title = document.getElementById('task-title-input').value.trim();
  const description = document.getElementById('modaldesc')?.value.trim() ?? '';
  if (!title) {
    document.getElementById('title-error').classList.remove('hidden');
    document.getElementById('task-title-input').focus();
    return;
  }

  const col = document.getElementById('task-col-select').value;
  const priority = document.getElementById('task-priority-select').value;

  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('id');

  const task = { title, description, tags: [...selectedTags], col, priority };

  try {
    const saved = await saveTask(task, projectId);
    task.id = saved.id;
    tasks.push(task);
    renderCard(task);
    updateCounts();
    closeModal();
    showToast(`"${title}" added`);
  } catch (error) {
    showToast('Error creating task. Try again.');
  }
}


//Render card
function renderCard(task) {
  const body = document.getElementById(`body-${task.col}`);
  const empty = body.querySelector('.empty-state');
  if (empty) empty.remove();

  const card = document.createElement('div');
  card.className = 'task-card bg-white border border-[#e8eaed] rounded-lg px-3.5 py-3 cursor-grab transition-all duration-150 relative';
  card.dataset.id = task.id;
  card.draggable = true;
  // Add this inside renderCard() after card.draggable = true
  card.addEventListener('click', () => {
    currentTaskId = task.id;
    openModal(task.col);
  }); 
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
      <span class="text-[0.75rem] text-[#97a0af] font-medium">NEX-${task.id.slice(0, 4).toUpperCase()}</span>
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
  body.addEventListener('drop', async e => {
    e.preventDefault();
    body.classList.remove('drag-over');
    if (draggedCard) {
      const newCol = body.dataset.col;
      const taskId = draggedCard.dataset.id;
      const task = tasks.find(t => t.id === taskId);
      if (task) task.col = newCol;
      body.insertBefore(draggedCard, body.firstChild);
      updateCounts();
      showToast(`Moved to ${newCol}`);
      await updateTaskCol(taskId, newCol);
    }
  });
})

//Update counts + empty status
function updateCounts() {
  let total = 0;
  ['backlog', 'inprogress', 'done'].forEach(col => {
    const count = document.getElementById(`body-${col}`).querySelectorAll('.task-card').length;
    document.getElementById(`count-${col}`).textContent = count;
    total += count;
    const body = document.getElementById(`body-${col}`);
    if (count === 0 && !body.querySelector('.empty-state')) {
      body.innerHTML = `<div class="empty-state flex flex-col items-center justify-center py-8 text-[#97a0af] text-[0.8rem] gap-1 text-center"><div class="text-2xl opacity-40">○</div><span>No tasks yet</span></div>`;
    }
  });
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

async function init() {
  // Auth check FIRST
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    window.location.href = 'auth.html';
    return; // ✅ stop everything if not signed in
  }

  // Fill in user info
  const user = session.user;
  userInitials = (user.user_metadata?.full_name || user.email).slice(0, 2).toUpperCase();
  const avatarBtn = document.getElementById('avatar-btn');
  if (avatarBtn) avatarBtn.textContent = userInitials;

  // Fill in project name
  const urlParams = new URLSearchParams(window.location.search);
  const projectName = urlParams.get('project') || 'Board';
  const projectId = urlParams.get('id');

  const projectNameEl = document.getElementById('project-name');
  const boardTitleEl = document.getElementById('board-title');
  if (projectNameEl) projectNameEl.textContent = projectName;
  if (boardTitleEl) boardTitleEl.textContent = projectName;

  // Logout
  document.getElementById('logout-btn')?.addEventListener('click', async () => {
    await supabase.auth.signOut();
    window.location.href = 'auth.html';
  });

  initProfileModal();
  initInfoModal();
  initNotiModal();
  updateCounts();

  if (projectId) await loadTasks(projectId);
}

// Start
init();