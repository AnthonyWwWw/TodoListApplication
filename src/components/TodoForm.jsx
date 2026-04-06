import { useState } from 'react';

export default function TodoForm({ onSubmit }) {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const [priority, setPriority] = useState('LOW');

  const options = ['Low', 'Medium', 'High'];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (inputValue.trim() === '') {
      setError('The field must be filled in');
      return;
    }

    setError('');
    onSubmit(createNewTask());
    setInputValue("");
  };

  const createNewTask = () => {
    return {
      id: Date.now(),
      text: inputValue,
      done: false,
      createAt: new Date().toDateString(),
      priorityLevel: priority,
    };
  };

  return (
    <div className="todo-form">
      <form onSubmit={handleSubmit} className="todo-form__form">
        <div className="todo-form__field">
          <input
            type="text"
            className={`todo-form__input ${error ? 'todo-form__input--error' : ''}`}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="New task"
          />

          {error && (
            <p className="todo-form__error">
              {error}
            </p>
          )}

          <ul className="todo-form__priority">
            {options.map((option) => {
              const key = option.toUpperCase();
              return (
                <li
                  key={option}
                  className={`todo-form__priority-item ${
                    priority === key
                      ? `todo-form__priority-item--${option.toLowerCase()} todo-form__priority-item--${option.toLowerCase()}--active`
                      : ''
                  }`}
                  onClick={() => setPriority(key)}
                >
                  {option}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="todo-form__actions">
          <button className="todo-form__submit" type="submit">
            Add Task
          </button>
        </div>

      </form>
    </div>
  );
}