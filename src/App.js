import { useState, useEffect, useRef } from "react";
import Typewriter from "typewriter-effect";
import axios from "axios";
import "./App.scss";

function App() {
  const URL = "https://muopham-mern-todo.herokuapp.com/todo";

  const [text, setText] = useState("");
  const [updateText, setUpdateText] = useState("");
  const [listTodo, setListTodo] = useState([]);
  const [isUpdate, setIsUpdate] = useState("");
  const inputRef = useRef();

  // GET TODO
  useEffect(() => {
    const getTodo = async () => {
      const res = await axios.get(URL + "/get");
      // console.log(res.data);
      setListTodo(res.data);
    };
    getTodo();
  }, []);

  // ADD TODO
  const addTodo = async () => {
    try {
      const res = await axios.post(URL + "/add", {
        text: text,
      });
      setListTodo((prev) => [...prev, res.data]);
      setText("");
      inputRef.current.focus();
    } catch (err) {
      console.log(err);
    }
  };

  // DELETE TODO
  const deleteTodo = async (id) => {
    try {
      await axios.delete(URL + `/delete/${id}`);
      const newListTodo = listTodo.filter((item) => item._id !== id);
      setListTodo(newListTodo);
    } catch (err) {
      console.log(err);
    }
  };

  //  COMPLETE TODO
  const completeTodo = async (id) => {
    try {
      const res = await axios.put(URL + `/complete/${id}`);
      setListTodo(
        listTodo.map((todo) => {
          if (todo._id === id) {
            todo.complete = res.data.complete;
          }
          return todo;
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  // UPDATE TODO
  const updateTodo = async () => {
    try {
      await axios.put(URL + `/update/${isUpdate}`, {
        text: updateText,
      });
      const index = listTodo.findIndex((todo) => todo._id === isUpdate);
      listTodo[index].text = updateText;
      setUpdateText("");
      setIsUpdate("");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="wrapper">
      <h1 className="text">
        <Typewriter
          options={{
            strings: ["Hello guys!", "What's the plan for today?"],
            autoStart: true,
            loop: true,
            delay: 200,
            deleteSpeed: 200,
            pauseFor: 2000,
          }}
        />
      </h1>
      <div className="todo-form">
        <input
          ref={inputRef}
          type="text"
          className=""
          placeholder="Add todo..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="btn" onClick={() => addTodo()}>
          Add
        </div>
      </div>
      <div className="todo-list">
        {listTodo.map((todo) => (
          <div className={`todo-item ${todo.complete ? "is-complete" : ""}`}>
            {isUpdate === todo._id ? (
              <div className="update-form">
                <input
                  type="text"
                  placeholder="New todo..."
                  value={updateText}
                  onChange={(e) => setUpdateText(e.target.value)}
                />
                <div className="btn" onClick={() => updateTodo()}>
                  Update
                </div>
              </div>
            ) : (
              <>
                <div
                  onClick={() => completeTodo(todo._id)}
                  className="item-text"
                >
                  {todo.text}
                </div>
                <div className="item-icons">
                  <i
                    className="bx bxs-pencil"
                    onClick={() => setIsUpdate(todo._id)}
                  ></i>
                  <i
                    className="bx bxs-trash-alt"
                    onClick={() => deleteTodo(todo._id)}
                  ></i>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
