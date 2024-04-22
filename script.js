// Get elements from HTML
const todoList = document.getElementById("todoList");
const addTodoForm = document.getElementById("addTodoForm");
const radio = Array.from(document.querySelector(".input-filter"));
const menu = document.querySelector(".menu");
const removeDoneTodos = document.getElementById("removeDoneTodos");

// State
let state = {
  todos: [
    { description: "Learn HTML", id: Date.now(), done: true },
    { description: "Learn CSS", id: Date.now(), done: false },
  ],
  filter: "all",
};

// Load from Local Storage
function loadFromLocalStorage() {
  const loadedState = localStorage.getItem("todoStateV1");
  if (loadedState == null) {
    return;
  }
  state = JSON.parse(loadedState);
}

// Render Function
function render() {
  // Clear Todo List
  todoList.innerHTML = "";

  // Create HTML list item and iterate over each to check filter
  generateFilter().forEach((todo) => {
    const input = document.createElement("input");
    input.type = "checkbox";
    input.name = "done";
    input.id = "checkbox";
    input.checked = todo.done;

    // Event Listener for state update in local storage
    input.addEventListener("change", () => {
      // State update when checkbox is changed
      todo.done = input.checked;
      localStorage.setItem("todoStateV1", JSON.stringify(state));

      render();
    });

    const span = document.createElement("span");
    span.textContent = todo.description;

    const label = document.createElement("label");
    label.append(input, span);
    label.for = "check";

    const form = document.createElement("form");
    form.append(label);

    const li = document.createElement("li");
    li.append(form);

    // Add a class to the list item based on the todo's done status
    if (todo.done) {
      li.classList.add("strike");
    }

    todoList.append(li);
  });
}

// Filter Function
function generateFilter() {
  if (state.filter == "all") {
    return state.todos;
  } else if (state.filter == "open") {
    return state.todos.filter((item) => !item.done);
  } else if (state.filter == "done") {
    return state.todos.filter((item) => item.done);
  }
}

// Remove Done Todos Function
function removeDone() {
  state.todos = state.todos.filter((todo) => !todo.done);
  localStorage.setItem("todoStateV1", JSON.stringify(state));
  render();
}

// Event Listener for Filter
menu.addEventListener("change", (e) => {
  if (e.target.type === "radio") {
    radio.forEach((radioBtn) => {
      radioBtn.checked = false;
    });
    state.filter = e.target.id;
    render();
  }
});

// Event Listener for Remove Done Todos Button
removeDoneTodos.addEventListener("click", (event) => {
  event.preventDefault();
  removeDone();
});

// Event Listener for Form Submission
addTodoForm.addEventListener("submit", (event) => {
  // Prevent from refreshing form
  event.preventDefault();

  // Validate and trim input value
  const inputValue = newTodo.value.trim();

  // Input field can't be empty
  if (inputValue == "") {
    alert("Please insert Description");
    return;
  }

  // Remove Duplicate
  if (
    state.todos.some((todo) => {
      return todo.description.toLowerCase() == inputValue.toLowerCase();
    })
  ) {
    alert("Todo already exists");
    return;
  }

  // Update State with new Todo
  const id = Date.now();

  state.todos.push({
    description: inputValue,
    id: id,
    done: false,
  });

  // Reset Form
  addTodoForm.reset();

  localStorage.setItem("todoStateV1", JSON.stringify(state));

  // Render
  render();
});

// Load State from Local Storage
loadFromLocalStorage();

// Initial Render
render();
