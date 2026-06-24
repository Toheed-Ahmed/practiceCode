
document.addEventListener('DOMContentLoaded', () => {
  
  // --- STATE ---
  let tasks = JSON.parse(localStorage.getItem('taskflow_tasks')) || [];
  let currentFilter = 'all';
  
  // --- DOM ELEMENTS ---
  const taskForm = document.getElementById('task-form');
  const taskInput = document.getElementById('task-input');
  const prioritySelect = document.getElementById('priority-select');
  const editTaskIdEl = document.getElementById('edit-task-id');
  const submitBtn = document.getElementById('submit-btn');
  const taskList = document.getElementById('task-list');
  const emptyState = document.getElementById('empty-state');
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  // Dashboard indicators
  const progressBar = document.getElementById('progress-bar');
  const progressText = document.getElementById('progress-text');
  const statsCount = document.getElementById('stats-count');
  const toastContainer = document.getElementById('notification-container');

  // --- RENDER PIPELINE ---
  
  function render() {
    // Clear dynamic element content safely
    taskList.innerHTML = '';
    
    // Filter logic execution
    const filteredTasks = tasks.filter(task => {
      if (currentFilter === 'active') return !task.completed;
      if (currentFilter === 'completed') return task.completed;
      return true; // 'all'
    });

    // Check empty state visibility
    if (filteredTasks.length === 0) {
      emptyState.style.display = 'block';
    } else {
      emptyState.style.display = 'none';
      
      // Node construction fragment strategy to optimize DOM paints
      const fragment = document.createDocumentFragment();
      
      filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.dataset.id = task.id;
        
        li.innerHTML = `
          <div class="task-left-wrapper">
            <label class="checkbox-container">
              <input type="checkbox" class="toggle-checkbox" ${task.completed ? 'checked' : ''}>
              <span class="checkmark"></span>
            </label>
            <div class="task-content-wrapper">
              <span class="task-text">${escapeHTML(task.text)}</span>
              <span class="badge ${task.priority}">${task.priority}</span>
            </div>
          </div>
          <div class="task-actions">
            <button class="action-btn edit-btn" aria-label="Edit task">✏️</button>
            <button class="action-btn delete-btn" aria-label="Delete task">🗑️</button>
          </div>
        `;
        fragment.appendChild(li);
      });
      
      taskList.appendChild(fragment);
    }
    
    updateDashboard();
    saveToLocalStorage();
  }

  function updateDashboard() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
    
    progressBar.style.width = `${percentage}%`;
    progressText.textContent = `${percentage}%`;
    statsCount.textContent = `${completed} of ${total} tasks completed`;
  }

  // --- MUTATION ACTIONS (CRUD) ---

  function handleFormSubmit(e) {
    e.preventDefault();
    const text = taskInput.value.trim();
    const priority = prioritySelect.value;
    const editId = editTaskIdEl.value;

    if (!text) return;

    if (editId) {
      // Edit mode execution
      tasks = tasks.map(task => task.id === editId ? { ...task, text, priority } : task);
      showToast('Task updated successfully!');
      
      // Reset form view state
      editTaskIdEl.value = '';
      submitBtn.textContent = 'Add Task';
      submitBtn.classList.remove('btn-secondary');
    } else {
      // Create mode execution
      const newTask = {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
        text,
        priority,
        completed: false,
        createdAt: new Date().toISOString()
      };
      tasks.unshift(newTask);
      showToast('New task added!');
    }

    taskForm.reset();
    prioritySelect.value = 'medium'; // reset value specifically to standard fallback
    render();
  }

  function toggleTaskStatus(id) {
    tasks = tasks.map(task => {
      if (task.id === id) {
        const nextState = !task.completed;
        showToast(nextState ? 'Task marked complete! 🎉' : 'Task reopened.');
        return { ...task, completed: nextState };
      }
      return task;
    });
    render();
  }

  function initEditTask(id) {
    const targetTask = tasks.find(t => t.id === id);
    if (!targetTask) return;

    taskInput.value = targetTask.text;
    prioritySelect.value = targetTask.priority;
    editTaskIdEl.value = targetTask.id;
    
    submitBtn.textContent = 'Save Changes';
    taskInput.focus();
  }

  function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    showToast('Task removed.');
    
    // Safety check if the user was editing the deleted element
    if (editTaskIdEl.value === id) {
      editTaskIdEl.value = '';
      submitBtn.textContent = 'Add Task';
      taskForm.reset();
    }
    render();
  }

  // --- EVENT DELEGATION & LISTENERS ---

  taskForm.addEventListener('submit', handleFormSubmit);

  // Unified list controller intercepting user interactions
  taskList.addEventListener('click', (e) => {
    const taskItem = e.target.closest('.task-item');
    if (!taskItem) return;
    const id = taskItem.dataset.id;

    if (e.target.classList.contains('toggle-checkbox')) {
      toggleTaskStatus(id);
    } else if (e.target.classList.contains('edit-btn')) {
      initEditTask(id);
    } else if (e.target.classList.contains('delete-btn')) {
      deleteTask(id);
    }
  });

  // Filter Event handling
  filterButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterButtons.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      currentFilter = e.target.dataset.filter;
      render();
    });
  });

  // --- UTILITIES ---

  function saveToLocalStorage() {
    localStorage.setItem('taskflow_tasks', JSON.stringify(tasks));
  }

  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${message}</span>`;
    
    toastContainer.appendChild(toast);
    
    // Automatically evict notifications after layout runtime
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }

  // Cross-Site Scripting (XSS) Sanitization Utility
  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  // Initialize runtime layout
  render();
});