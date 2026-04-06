import { Fragment, useState } from 'react';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import UseWindowWidth from './components/UseWindowWidth';
import './styles/App.scss';

export default function App() {
  const [taskList, setTaskList] = useState([]);
  const [activeFilter, setActiveFilter] = useState('ACTIVE');
  const [searchPayload, setSearchPayload] = useState(null);

  const handleSubmit = (newTask) => {
    setTaskList(prev => [...prev, {...newTask, done: false}]);
  };

  const actions = {
    TOGGLE_DONE: (id, checked) => {
      setTaskList(prev =>
        prev.map(task =>
          task.id === id ? {...task, done: checked} : task
        )
      );
    },

    DELETE: (id) => {
      setTaskList(prev => prev.filter(task => task.id !== id));
    },

    CLEAR: () =>{
      setTaskList(prev => prev.filter(task => task.done === false));
    },

    EDIT: (id, value) => {
      setTaskList(prev => prev.map(task => task.id === id ? {...task, text: value} : task));
    }
  };

  const filterTask = (filter, payload) => {setActiveFilter(filter); setSearchPayload(payload);  console.log(filter,payload)};

  const filteredTasks = taskList.filter(task => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'ACTIVE') return !task.done;
    if (activeFilter === 'DONE') return task.done;
    if (activeFilter === 'SEARCH' && searchPayload.trim().length !== 0) return task.text.toLowerCase().includes(searchPayload);
    return true;
  });

  const handleAction = (type, id, payload) => {
  switch (type) {
    case "DELETE": {
      payload.classList.add("todo__custom--pending");

      setTimeout(() => {
        const agree = confirm("Are you sure you want to remove this task?");

        if (agree) {
          payload.classList.add("todo__custom--remove");

          setTimeout(() => {
            actions[type]?.(id);
          }, 400);
        }

        payload.classList.remove("todo__custom--pending");
      }, 50);

      break;
    }

    case "CLEAR":
      actions[type]?.();
      break;

    case "TOGGLE_DONE":
      actions[type]?.(id, payload);
      break;
    
    case "EDIT":
      actions[type]?.(id,payload);
      break;

    default:
      break;
  }
};

  return (
    <Fragment>
      <div className='conteiner'> 
        <TodoForm onSubmit={handleSubmit} />
        <TodoList
          screenSize={UseWindowWidth()}
          onAction={handleAction}
          todoList={filteredTasks}
          onFilter={filterTask}
        />
      </div>
    </Fragment>
  );
}