import { useState, useRef } from "react";
import TodoItem from "./TodoItem";

export default function TodoList({ 
  screenSize, 
  todoList, 
  onAction, 
  onFilter }) {
  
  const [previousFilter, setPreviousFilter] = useState();
  const [activeFilter, setActiveFilter] = useState('ACTIVE');
  const [editTodoId, setEditTodoId] = useState();
  const [editValue, setEditValue] = useState();
  const [isSearchActive, setIsSearchActive] = useState(false);
  const inputRef = useRef(null);

  const filters = [
    { key: "ACTIVE", label: "Active" },
    { key: "DONE", label: "Done" },
    { key: "ALL", label: "All" },
  ];

  const handleSearchEvent = (event) => {
      switch (event) {
      case "MOUSEDOWN":
        if (isSearchActive) {
          const prev = previousFilter;
          onFilter(prev);
          setActiveFilter(prev);
          setIsSearchActive(false);
          if (inputRef.current) inputRef.current.value = "";
        } else {
          const prev = activeFilter;
          setPreviousFilter(prev);
          setActiveFilter("");
          setIsSearchActive(true);
          onFilter(prev); 
          
          setTimeout(() => {
            inputRef.current?.focus();
          }, 100);
        }
        break;

      case "BLUR":
        if (inputRef.current?.value){
          onFilter("SEARCH", inputRef.current.value);
        } else {
          setActiveFilter(previousFilter);
          setIsSearchActive(false);
        }
        break;

      default:
        break;
    }
  }

  return (
    <div className="todo__list">
      <div className="search">
        <div>
          {filters.map((filter) => (
            <button
              key={filter.key}
              className={`search__btn btn--${filter.key} ${
                activeFilter === filter.key ? `btn--${filter.key}--active` : ""
              }`}
              onClick={() => {
                setPreviousFilter(filter.key);
                if (isSearchActive) {
                  handleSearchEvent("MOUSEDOWN");
                }
                setActiveFilter(filter.key);
                onFilter(filter.key);
              }}
            >
              {filter.label}
            </button>
          ))}
        </div>
        <div className="todo__find">
          <span className="find__icon" 
            onMouseDown={() => handleSearchEvent("MOUSEDOWN")}
          />
          <input
              ref={inputRef}
              type="text"
              onChange={(e) => onFilter("SEARCH", e.target.value)}
              className={`find__input ${isSearchActive ? "find__input--active" : ""}`}
              onBlur={() => handleSearchEvent("BLUR")}
            />
        </div>
        <span className="todo__counter">{`count task ${activeFilter.toLowerCase()}: ${todoList.length}`}</span>
      </div>

      {todoList.length > 0 ? (
        todoList.map((item) => (
          <TodoItem
            key={item.id}
            item={item}
            onAction={onAction}
            screenSize={screenSize}
            editTodoId={editTodoId}
            setEditTodoId={setEditTodoId}
            editValue={editValue}
            setEditValue={setEditValue}
          />
        ))
      ) : (
        <p className="todo__alert">You don't have any tasks yet</p>
      )}

      {activeFilter === "DONE" && (
        <button
          disabled={todoList.length === 0}
          className="button__clear--task"
          onClick={() => onAction("CLEAR")}
        >
          Clear all done task
        </button>
      )}
    </div>
  );
}