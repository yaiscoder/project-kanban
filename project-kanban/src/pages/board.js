import {
  getTasks,
  getUsers,
  createTask,
  updateTask,
  deleteTask
} from '../services/taskService'

import {
  getSession,
  removeSession
} from '../utils/session'

const user = getSession()

const COLUMNS = [
  { key: 'todo', label: 'To Do' },
  { key: 'in progress', label: 'In Progress' },
  { key: 'in review', label: 'In Review' },
  { key: 'done', label: 'Done' },
]

export const boardPage = {
  tasks: [],
  users: [],
  draggedId: null,

  render() {
    return `
    <div class="bg-background text-on-background overflow-hidden h-screen flex">

      <!-- Sidebar -->
      <aside
        class="hidden md:flex flex-col pt-md pb-xl gap-xs h-full bg-surface-container-low border-r border-outline-variant w-[280px] shrink-0"
      >
        <div class="px-gutter mb-xl">
          <h1 class="font-headline-md text-headline-md font-bold text-primary">
            Riwiflow
          </h1>

          <p class="font-body-sm text-body-sm text-on-surface-variant">
            Product Team
          </p>
        </div>

        <nav class="flex-1 space-y-1">
          <a
            class="flex items-center bg-primary-fixed text-on-primary-fixed-variant rounded-lg mx-2 px-4 py-3"
            href="#"
          >
            <span class="material-symbols-outlined mr-3">
              dashboard
            </span>

            <span>Dashboard</span>
          </a>

          <a
            class="flex items-center text-secondary hover:text-primary hover:bg-primary-container/10 px-4 py-3 mx-2 rounded-lg"
            href="#"
          >
            <span class="material-symbols-outlined mr-3">
              assignment
            </span>

            <span>Projects</span>
          </a>

          <a
            class="flex items-center text-secondary hover:text-primary hover:bg-primary-container/10 px-4 py-3 mx-2 rounded-lg"
            href="#"
          >
            <span class="material-symbols-outlined mr-3">
              group
            </span>

            <span>Team</span>
          </a>

          <a
            class="flex items-center text-secondary hover:text-primary hover:bg-primary-container/10 px-4 py-3 mx-2 rounded-lg"
            href="#"
          >
            <span class="material-symbols-outlined mr-3">
              bar_chart
            </span>

            <span>Reports</span>
          </a>
        </nav>

        <div class="px-4 mt-auto space-y-3">

          ${
            user.role === 'admin'
              ? `
                <button
                  id="newTaskBtn"
                  class="w-full bg-primary text-on-primary py-3 rounded-xl flex items-center justify-center gap-2"
                >
                  <span class="material-symbols-outlined">
                    add
                  </span>

                  New Task
                </button>
              `
              : ''
          }

          <button
            id="logoutBtn"
            class="w-full border border-outline-variant py-3 rounded-xl"
          >
            Logout
          </button>
        </div>
      </aside>

      <!-- Main -->
      <main class="flex-1 flex flex-col min-w-0">

        <!-- Topbar -->
        <header
          class="flex justify-between items-center h-16 px-gutter w-full bg-surface border-b border-outline-variant"
        >
          <h2 class="font-title-lg text-title-lg">
            Kanban Board
          </h2>

          <div class="flex items-center gap-4">

            <div
              class="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold"
            >
              ${user.name[0].toUpperCase()}
            </div>

          </div>
        </header>

        <!-- Board -->
        <div class="flex-1 overflow-x-auto p-gutter custom-scrollbar">

          <div
            id="board"
            class="flex gap-gutter h-full"
          ></div>

        </div>
      </main>

      <!-- Side Panel -->
      <div
        id="sidePanel"
        class="fixed top-0 right-[-400px] w-[350px] h-full bg-surface border-l border-outline-variant p-6 transition-all duration-300 z-50"
      >

        <div class="flex items-center justify-between mb-6">
          <h3
            id="panelTitle"
            class="text-xl font-bold"
          >
            New Task
          </h3>

          <button id="closePanel">
            ✕
          </button>
        </div>

        <form
          id="taskForm"
          class="space-y-4"
        >

          <input
            type="hidden"
            id="taskId"
          />

          ${
            user.role === 'admin'
              ? `
                <div>
                  <label class="block mb-2">
                    Title
                  </label>

                  <input
                    id="fTitle"
                    type="text"
                    class="w-full border border-outline-variant rounded-xl p-3 bg-transparent"
                  />
                </div>
              `
              : ''
          }

          <div>
            <label class="block mb-2">
              Description
            </label>

            <textarea
              id="fDesc"
              rows="4"
              class="w-full border border-outline-variant rounded-xl p-3 bg-transparent"
            ></textarea>
          </div>

          <div>
            <label class="block mb-2">
              Status
            </label>

            <select
              id="fStatus"
              class="w-full border border-outline-variant rounded-xl p-3 bg-transparent"
            >
              <option value="todo">To Do</option>
              <option value="in progress">In Progress</option>
              <option value="in review">In Review</option>
              <option value="done">Done</option>
            </select>
          </div>

          ${
            user.role === 'admin'
              ? `
                <div>
                  <label class="block mb-2">
                    Assigned to
                  </label>

                  <select
                    id="fUser"
                    class="w-full border border-outline-variant rounded-xl p-3 bg-transparent"
                  ></select>
                </div>
              `
              : ''
          }

          <button
            type="submit"
            class="w-full bg-primary text-on-primary py-3 rounded-xl"
          >
            Save Task
          </button>

        </form>

      </div>

    </div>
    `
  },

  async mounted() {
    this.tasks = await getTasks()
    this.users = await getUsers()

    this.renderBoard()
    this.populateUsers()
    this.attachEvents()
  },

  renderBoard() {
    const board = document.getElementById('board')

    board.innerHTML = COLUMNS.map(column => {

      const tasks = this.tasks.filter(
        task => task.status === column.key
      )

      return `
        <div
          class="kanban-column flex flex-col w-1/4 h-full"
          data-status="${column.key}"
        >

          <div class="flex items-center justify-between mb-md">

            <div class="flex items-center gap-2">
              <h3 class="font-title-sm text-title-sm">
                ${column.label}
              </h3>

              <span
                class="bg-surface-container-high px-2 py-0.5 rounded-full"
              >
                ${tasks.length}
              </span>
            </div>

          </div>

          <div
            class="flex-1 space-y-md p-2 bg-surface-container-low/50 rounded-xl overflow-y-auto custom-scrollbar"
          >

            ${tasks.map(task => this.renderCard(task)).join('')}

          </div>

        </div>
      `
    }).join('')

    this.attachDragDrop()
  },

  renderCard(task) {
    const assignedUser = this.users.find(
      u => u.id === task.userId
    )

    const isAdmin = user.role === 'admin'
    const isOwner = user.id === task.userId

    const canEdit = isAdmin || isOwner

    return `
      <div
        class="task-card bg-surface border border-outline-variant rounded-xl p-md shadow-sm"
        draggable="true"
        data-id="${task.id}"
      >

        <div class="flex justify-between items-start mb-2">

          <span
            class="bg-primary-fixed text-on-primary-fixed-variant px-2 py-1 rounded-full text-sm"
          >
            ${task.status}
          </span>

          <div class="flex gap-2">

            ${
              canEdit
                ? `
                  <button
                    class="edit-btn text-sm"
                    data-id="${task.id}"
                  >
                    ✏️
                  </button>
                `
                : ''
            }

            ${
              isAdmin
                ? `
                  <button
                    class="delete-btn text-sm"
                    data-id="${task.id}"
                  >
                    🗑️
                  </button>
                `
                : ''
            }

          </div>

        </div>

        <h4 class="font-bold mb-2">
          ${task.title}
        </h4>

        <p class="text-sm text-on-surface-variant">
          ${task.description}
        </p>

        <div class="mt-4 flex justify-between items-center">
          <span class="text-sm">
            ${assignedUser ? assignedUser.name : 'No user'}
          </span>
        </div>

      </div>
    `
  },

  attachEvents() {

    // Logout
    document
      .getElementById('logoutBtn')
      ?.addEventListener('click', () => {

        removeSession()
        window.location.hash = '#/'

      })

    // Open panel
    document
      .getElementById('newTaskBtn')
      ?.addEventListener('click', () => {

        this.openPanel()

      })

    // Close panel
    document
      .getElementById('closePanel')
      .addEventListener('click', () => {

        this.closePanel()

      })

    // Edit / Delete
    document
      .getElementById('board')
      .addEventListener('click', async (e) => {

        const editBtn = e.target.closest('.edit-btn')
        const deleteBtn = e.target.closest('.delete-btn')

        if (editBtn) {
          this.openPanel(
            parseInt(editBtn.dataset.id)
          )
        }

        if (deleteBtn) {

          await deleteTask(
            parseInt(deleteBtn.dataset.id)
          )

          this.tasks = await getTasks()

          this.renderBoard()
        }

      })

    // Form
    document
      .getElementById('taskForm')
      .addEventListener('submit', async (e) => {

        e.preventDefault()

        const id = document.getElementById('taskId').value

        const data = {
          description: document.getElementById('fDesc').value,
          status: document.getElementById('fStatus').value,
        }

        if (user.role === 'admin') {
          data.title = document.getElementById('fTitle').value
          data.userId = parseInt(
            document.getElementById('fUser').value
          )
        }

        if (id) {
          await updateTask(parseInt(id), data)
        } else {
          await createTask(data)
        }

        this.tasks = await getTasks()

        this.renderBoard()

        this.closePanel()
      })
  },

  openPanel(taskId = null) {

    const panel = document.getElementById('sidePanel')

    panel.classList.remove('right-[-400px]')
    panel.classList.add('right-0')

    document.getElementById('taskForm').reset()

    if (!taskId) return

    const task = this.tasks.find(
      t => t.id === taskId
    )

    document.getElementById('panelTitle').textContent = 'Edit Task'

    document.getElementById('taskId').value = task.id

    document.getElementById('fDesc').value = task.description

    document.getElementById('fStatus').value = task.status

    if (user.role === 'admin') {
      document.getElementById('fTitle').value = task.title

      document.getElementById('fUser').value = task.userId
    }
  },

  closePanel() {
    const panel = document.getElementById('sidePanel')

    panel.classList.remove('right-0')
    panel.classList.add('right-[-400px]')
  },

  populateUsers() {

    const select = document.getElementById('fUser')

    if (!select) return

    select.innerHTML = this.users.map(user => `
      <option value="${user.id}">
        ${user.name} (${user.role})
      </option>
    `).join('')
  },

  attachDragDrop() {

    // Cards
    document.querySelectorAll('.task-card')
      .forEach(card => {

        card.addEventListener('dragstart', () => {

          this.draggedId = parseInt(card.dataset.id)

        })

      })

    // Columns
    document.querySelectorAll('.kanban-column')
      .forEach(column => {

        column.addEventListener('dragover', (e) => {
          e.preventDefault()
        })

        column.addEventListener('drop', async () => {

          const task = this.tasks.find(
            t => t.id === this.draggedId
          )

          if (!task) return

          await updateTask(task.id, {
            status: column.dataset.status
          })

          this.tasks = await getTasks()

          this.renderBoard()

        })

      })
  }

}