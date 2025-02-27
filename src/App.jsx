import React, { useState } from "react";
import "@ant-design/v5-patch-for-react-19";

import {
  useGetTodosApiQuery,
  usePostToTheApiMutation,
  useDeleteFromApiMutation,
  useEditTheDataOnTHEApiMutation,
} from "./redux/api/todos/get-todo";
import { Button, Checkbox, notification, Progress } from "antd";
import { DeleteOutlined, EditOutlined, SaveTwoTone } from "@ant-design/icons";

const App = () => {
  const [editID, setEditID] = useState(null);
  const gettingDate = () => {
    let date = new Date();
    let hours = date.getHours().toString().padStart(2, "0");
    let minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };
  const [postToTheApi] = usePostToTheApiMutation();
  const [deleteFromApi] = useDeleteFromApiMutation();
  const [editTheDataOnTHEApi] = useEditTheDataOnTHEApiMutation();
  const [newTask, setNewTask] = useState("");
  const [editTask, setEditTask] = useState("");
  // method get
  const { data, isLoading, isError } = useGetTodosApiQuery();
  //method post
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newTask.trim()) {
      let date = gettingDate();
      await postToTheApi({ text: newTask, date: gettingDate() });
      setNewTask("");

      notification.success({
        message: "Task added successfully!",
      });
    }
  };

  //method delete
  const handleDelete = async (id) => {
    await deleteFromApi({ id }).unwrap();
    notification.success({
      message: "Task deleted successfully!",
    });
  };

  //method edit
  const handleSave = async (id) => {
    await editTheDataOnTHEApi({
      id,
      text: editTask,
      date: `Edited ${gettingDate()}`,
    });
    setEditID(null);

    notification.success({
      message: "Task edited successfully!",
    });
  };
  const completedTasks = data?.filter((task) => task.isChecked)?.length;
  const progress = data?.length > 0 ? (completedTasks / data?.length) * 100 : 0;
  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-50 rounded-lg shadow-md mt-10 font-sans">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Todo List
      </h1>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200">
            Add Task
          </button>
        </div>
      </form>

      {isError && (
        <div className="bg-red-50 text-red-600 text-center p-3 rounded-md mb-6">
          Error fetching data!
        </div>
      )}

      {isLoading ? (
        <div className="text-center text-gray-600 text-lg">Loading...</div>
      ) : (
        <div className="space-y-4">
          <Progress percent={Math.round(progress)} className="mb-4" />
          {data?.map((item, idx) => (
            <div
              key={item.id}
              className="flex justify-between items-center relative p-3 border-b">
              <div className="flex items-center gap-2">
                <p className="pr-3"> {idx + 1}.</p>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={item?.isChecked}
                    onChange={async (e) => {
                      await editTheDataOnTHEApi({
                        id: item.id,
                        text: item.text,
                        isChecked: e.target.checked,
                        date: item.date,
                      });
                    }}
                  />
                  <span
                    className={
                      item?.isChecked ? "line-through text-gray-500" : ""
                    }>
                    {editID === item?.id ? (
                      <input
                        type="text"
                        defaultValue={item?.text}
                        className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setEditTask(e.target.value)}
                      />
                    ) : (
                      item?.text
                    )}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 relative">
                {editID === item?.id ? (
                  <Button
                    type="text"
                    icon={<SaveTwoTone />}
                    className="!text-blue-500"
                    onClick={() => handleSave(item.id)}></Button>
                ) : (
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    className="!text-blue-500"
                    onClick={() => setEditID(item?.id)}></Button>
                )}
                <Button
                  title="note that you can't delete the task if it's not checked"
                  disabled={!item?.isChecked}
                  type="text"
                  color="danger"
                  icon={<DeleteOutlined />}
                  className="!text-red-500"
                  onClick={() => handleDelete(item?.id)}></Button>
                <p className="text-xs absolute text-end mt-3 -bottom-3 right-0 w-[100px] text-gray-500">
                  {item.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
