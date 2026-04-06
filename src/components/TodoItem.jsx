import { useRef } from "react";
import clickSoundFile from "../sound/done-task.mp3"

export default function TodoItem({
  item,
  onAction,
  screenSize,
  editTodoId,
  setEditTodoId,
  editValue,
  setEditValue,
}) {
  const inputRef = useRef(null);
  const clickSound = useRef(new Audio(clickSoundFile));

  const handleFindEvent = (e) => {
    e.stopPropagation();
    clickSound.current.currentTime = 0;
    clickSound.current.play();
  }

  return (
    <div className="todo">
      <label className="checkbox">
        <input
          ref={inputRef}
          type="checkbox"
          checked={item.done}
          className="checkbox__input"
          onChange={(e) => {
            {(!item.done && handleFindEvent(e))}
            onAction("TOGGLE_DONE", item.id, e.target.checked);
          }}
        />
        <span
          className={`checkbox__custom ${
            item.done ? "checkbox__custom--done" : ""
          }`}
        />
        <span className="checkbox__label">done</span>
      </label>

      {screenSize > 320 && (
        <p>
          {item.createAt.split(" ").map((part, index) => (
            <span
              key={index}
              className={`todo__date ${item.done ? "todo__date--done" : ""}`}
            >
              {part}
            </span>
          ))}
        </p>
      )}

      <p className={`todo__priority todo__priority--${item.priorityLevel}`}>
        {item.priorityLevel.charAt(0)}
      </p>

      {editTodoId === item.id ? (
        <input
          value={editValue}
          type="text"
          autoFocus
          className={`todo__text ${item.done ? "todo__text--done" : ""}`}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={(e) => {
            onAction("EDIT", item.id, e.target.value);
            setEditTodoId(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onAction("EDIT", item.id, e.target.value);
              setEditTodoId(null);
            }
          }}
        />
      ) : (
        <p
          className={`todo__text ${item.done ? "todo__text--done" : ""}`}
          onDoubleClick={() => {
            setEditValue(item.text);
            setEditTodoId(item.id);
          }}
        >
          {item.text}
        </p>
      )}

      <button
        onClick={(e) => onAction("DELETE", item.id, e.target.parentElement)}
        className="todo__btn todo__btn--delete"
      >
        Delete
      </button>
    </div>
  );
};
