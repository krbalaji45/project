import { useEffect, useRef, useState } from "react";
import { INDIAN_STATES_AND_TERRITORIES } from "../indianStates";
import "./StateSearchSelect.css";

function StateSearchSelect({
  value,
  onChange,
  id = "region",
  name = "region",
  invalid = false,
  describedBy,
}) {
  const rootRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const filteredStates = INDIAN_STATES_AND_TERRITORIES.filter((state) =>
    state.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const inputValue = isOpen ? query : value;

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (!rootRef.current?.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  const selectState = (state) => {
    setQuery("");
    setIsOpen(false);
    onChange({ target: { name, value: state } });
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      setIsOpen(false);
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        setActiveIndex(0);
      } else {
        setActiveIndex((index) =>
          Math.min(index + 1, Math.max(filteredStates.length - 1, 0)),
        );
      }
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter" && isOpen && filteredStates[activeIndex]) {
      event.preventDefault();
      selectState(filteredStates[activeIndex]);
    }
  };

  return (
    <div className="state-search-select" ref={rootRef}>
      <input
        id={id}
        name={name}
        type="text"
        role="combobox"
        value={inputValue}
        onFocus={() => {
          setQuery("");
          setActiveIndex(0);
          setIsOpen(true);
        }}
        onChange={(event) => {
          const nextQuery = event.target.value;
          setQuery(nextQuery);
          setActiveIndex(0);
          setIsOpen(true);
          if (value) onChange({ target: { name, value: "" } });
        }}
        onBlur={(event) => {
          if (!rootRef.current?.contains(event.relatedTarget)) setIsOpen(false);
        }}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        aria-autocomplete="list"
        aria-expanded={isOpen}
        aria-controls={`${id}-options`}
        aria-activedescendant={
          isOpen && filteredStates[activeIndex]
            ? `${id}-option-${activeIndex}`
            : undefined
        }
        aria-invalid={invalid}
        aria-describedby={describedBy}
        aria-required="true"
        placeholder="Search or select a state"
        required
      />
      {isOpen && (
        <ul className="state-search-options" id={`${id}-options`} role="listbox">
          {filteredStates.length ? (
            filteredStates.map((state, index) => (
              <li key={state} role="presentation">
                <button
                  id={`${id}-option-${index}`}
                  type="button"
                  role="option"
                  aria-selected={value === state}
                  className={index === activeIndex ? "is-active" : ""}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => selectState(state)}
                >
                  {state}
                </button>
              </li>
            ))
          ) : (
            <li className="state-search-empty" role="option" aria-disabled="true">
              No matching states found.
            </li>
          )}
        </ul>
      )}
    </div>
  );
}

export default StateSearchSelect;
