import React, { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import Todo from "./components/Todo";
import Form from "./components/Form";
import FilterButton from "./components/FilterButton";
//tutorial here: https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/React_interactivity_events_state#state_and_the_usestate_hook

const FILTER_MAP = {
  All: () => true,
  Complete: (task) => task.completed === true,
  Active: (task) => task.completed === false,
};
const FILTER_NAMES = Object.keys(FILTER_MAP);

function App(props) {
  const [tasks, setTasks] = useState(props.tasks);
  const [filter, setFilter] = useState("All");

  useEffect(
    function updateTaskListCookie() {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    },
    [tasks]
  )

  function addTask(name) {
    const newTask = {id: `task-${nanoid()}`, name, completed: false};
    setTasks([...tasks, newTask]);
  }

  function toggleTaskCompleted(id) {
    const updatedTasks = tasks.map((task) => {
      if(task.id === id) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setTasks(updatedTasks);
  }

  function deleteTask(id) {
    const updatedTasks = tasks.filter((task) => 
      id !== task.id
    );
    setTasks(updatedTasks);
  }

  function editTask(id, newName) {
    const updatedTasks = tasks.map((task) => {
      if(task.id === id) {
        return { ...task, name: newName};
      }
      return task;
    });
    setTasks(updatedTasks);
  }
  
  const filterList = FILTER_NAMES.map((name) =>
    <FilterButton 
      key={name} 
      name={name} 
      isPressed={name === filter}
      setFilter={setFilter}
    />
  );

  const taskList = tasks
    .filter(FILTER_MAP[filter])
    .map((task) => (
      <Todo 
        id={task.id} 
        name={task.name} 
        completed={task.completed} 
        key={task.id}
        toggleTaskCompleted={toggleTaskCompleted}
        deleteTask={deleteTask}
        editTask={editTask}
      />
  ));

  const taskPlural = taskList.length === 1 ? "task" : "tasks";
  const headingText = `${taskList.length} ${taskPlural} remaining`;

  return (
    <div className="todoapp stack-large">
      <h1>TodoMatic</h1>
      <Form addTask={addTask}/>
      <div className="filters btn-group stack-exception">
        {
        filterList
        }
      </div>
      <h2 id="list-heading">{headingText}</h2>
      <ul
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading">
        {taskList}
      </ul>
    </div>
  );
}

export default App;
