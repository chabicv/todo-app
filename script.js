document.addEventListener('DOMContentLoaded', () => {
  const todoForm = document.getElementById('todo-form');
  const todoInput = document.getElementById('todo-input');
  const todoStatus = document.getElementById('todo-status');

  const resolveNowList = document.getElementById('resolve-now').querySelector('ul');
  const resolveTodayList = document.getElementById('resolve-today').querySelector('ul');
  const resolveLaterList = document.getElementById('resolve-later').querySelector('ul');
  const indefinitelyPostponedList = document.getElementById('indefinitely-postponed').querySelector('ul');

  const todoLists = {
    'RESOLVER YA': resolveNowList,
    'RESOLVER EN EL DÍA': resolveTodayList,
    'RESOLVER CUANDO SE PUEDA': resolveLaterList,
    'POSTPUESTA INDEFINIDA': indefinitelyPostponedList,
  };

  // Cargar tareas desde localStorage
  loadTodos();

  todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const todo = {
      text: todoInput.value,
      status: todoStatus.value,
      completed: false
    };
    addTodoToDOM(todo);
    saveTodoToLocalStorage(todo);
    todoInput.value = '';
  });

  function addTodoToDOM(todo) {
    const todoItem = document.createElement('li');

    const todoText = document.createElement('span');
    todoText.textContent = todo.text;
    if (todo.completed) {
      todoText.classList.add('completed');
    }

    const controls = document.createElement('div');
    controls.classList.add('controls');

    const statusSelect = document.createElement('select');
    const statuses = ['RESOLVER YA', 'RESOLVER EN EL DÍA', 'RESOLVER CUANDO SE PUEDA', 'POSTPUESTA INDEFINIDA'];
    statuses.forEach(status => {
      const option = document.createElement('option');
      option.value = status;
      option.textContent = status;
      if (status === todo.status) {
        option.selected = true;
      }
      statusSelect.appendChild(option);
    });

    statusSelect.addEventListener('change', () => {
      const oldStatus = todo.status;
      todo.status = statusSelect.value;
      updateTodoInLocalStorage(todo);
      todoLists[oldStatus].removeChild(todoItem);
      todoLists[todo.status].appendChild(todoItem);
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete');
    deleteButton.addEventListener('click', () => {
      removeTodoFromLocalStorage(todo);
      todoItem.parentNode.removeChild(todoItem);
    });

    controls.appendChild(statusSelect);
    controls.appendChild(deleteButton);

    todoItem.appendChild(todoText);
    todoItem.appendChild(controls);

    todoItem.addEventListener('click', () => {
      todoItem.classList.toggle('completed');
      todo.completed = !todo.completed;
      updateTodoInLocalStorage(todo);
    });

    todoLists[todo.status].appendChild(todoItem);
  }

  function saveTodoToLocalStorage(todo) {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos.push(todo);
    localStorage.setItem('todos', JSON.stringify(todos));
  }

  function loadTodos() {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos.forEach(addTodoToDOM);
  }

  function removeTodoFromLocalStorage(todo) {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    const updatedTodos = todos.filter(t => t.text !== todo.text || t.status !== todo.status);
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
  }

  function updateTodoInLocalStorage(updatedTodo) {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    const todoIndex = todos.findIndex(t => t.text === updatedTodo.text && t.status === updatedTodo.status);
    if (todoIndex !== -1) {
      todos[todoIndex] = updatedTodo;
    }
    localStorage.setItem('todos', JSON.stringify(todos));
  }
});

