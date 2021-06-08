import React, { useState } from 'react';
import Todo from './components/Todo';
import Form from './components/Form';
import FilterButton from './components/FilterButton';
import { nanoid } from "nanoid";

// FILTER_MAP AND FILTER_NAMES ARE DEFINED OUTSIDE THE APP FUNCTION BECAUSE 
// INSIDE THEY WOULD BE RECALCULATED EVERY TIME APP 
// COMPONENT RE-RENDERS! THIS INFO IS CONSTANT, IT WON'T 
// CHANGE REGARDLESS OF WHAT THE APPLICATION DOES

// values are functions used to filter the tasks data array
// All shows all tasks, returns true for all tasks
// Active shows tasks w/ completed prop set to false
// Completed shows tasks w/ completed prop set to true
const FILTER_MAP = {
  All: () => true,
  Active: (task) => !task.completed,
  Completed: (task) => task.completed,
};

// collect an array of filter names
const FILTER_NAMES = Object.keys(FILTER_MAP);

function App(props) {
  // reads and sets a filter, default is All so all tasks initially shown
  const [filter, setFilter] = useState('All');

  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton
      key={name}
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ));

  const [tasks, setTasks] = useState(props.tasks);


  function addTask(name) {
    // Prevents adding an empty task
    if (name.replace(/\s/g, '').length) {
      const newTask = {
        id: 'todo-' + nanoid(),
        name: name,
        completed: false
      };
      setTasks([...tasks, newTask]);
    }
  }


  function editTask(id, newName) {
    const editedTaskList = tasks.map((task) => {
      // if this task has the same ID as the edited task
      if (id === task.id && newName.replace(/\s/g, '').length) {
        //use object spread to make a new object that
        // has the name set as the new name provided
        return { ...task, name: newName }
      }
      return task;
    });
    setTasks(editedTaskList);
  }

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

  const tasksNoun = taskList.length !== 1 ? 'tasks' : 'task';
  const headingText = `${taskList.length} ${tasksNoun} remaining`;

  function toggleTaskCompleted(id) {
    const updatedTasks = tasks.map(task => {
      // if this task has THE SAME ID as the EDITED TASK
      if (id === task.id) {
        //use object spread to make a new object
        //that has the 'completed' prop inverted
        return { ...task, completed: !task.completed }
      }
      return task;
    });
    setTasks(updatedTasks);
  }

  function deleteTask(id) {
    //provide setTasks with an array of a copy of the existing tasks
    //EXCEPT for the one where the ID matches the id passed into deleteTask()
    const remainingTasks = tasks.filter(task => id !== task.id);
    setTasks(remainingTasks);
  }

  return (
    <div className="todoapp stack-large">
      <h1>Todo List!</h1>
      <Form addTask={addTask} />
      <div className="filters btn-group stack-exception">
        {filterList}
      </div>
      <h2 id="list-heading">
        {headingText}
      </h2>
      <ul
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading"
      >
        {taskList}
      </ul>
    </div>
  );
}
export default App;