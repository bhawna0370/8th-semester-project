import React, { Fragment, createContext, useReducer, useEffect, useState } from "react";
import AdminLayout from "../layout";
import BlogMenu from "./BlogMenu";
import AllBlogs from "./AllBlogs";
import AddBlogModal from "./AddBlogModal";
import EditBlogModal from "./EditBlogModal";
import axios from "axios";

const apiURL = process.env.REACT_APP_API_URL;

/* This context manage all of the blog component's data */
export const BlogContext = createContext();

const blogState = {
  loading: false,
  addBlogModal: false,
  editBlogModal: false,
  editBlog: null,
  blogs: [],
};

const blogReducer = (state, action) => {
  switch (action.type) {
    case "loading":
      return {
        ...state,
        loading: action.payload,
      };
    case "addBlogModal":
      return {
        ...state,
        addBlogModal: action.payload,
      };
    case "editBlogModal":
      return {
        ...state,
        editBlogModal: action.payload,
      };
    case "editBlog":
      return {
        ...state,
        editBlog: action.payload,
      };
    case "blogs":
      return {
        ...state,
        blogs: action.payload,
      };
    default:
      return state;
  }
};

const Blogs = () => {
  const [data, dispatch] = useReducer(blogReducer, blogState);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        dispatch({ type: "loading", payload: true });
        const response = await axios.get(`${apiURL}/api/blogs`);
        dispatch({ type: "blogs", payload: response.data.data });
        dispatch({ type: "loading", payload: false });
      } catch (err) {
        setError("Failed to fetch blogs");
        dispatch({ type: "loading", payload: false });
      }
    };

    fetchBlogs();
  }, []);

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <BlogContext.Provider value={{ data, dispatch }}>
      <AdminLayout>
        <div className="grid grid-cols-1 space-y-4 p-4">
          <BlogMenu />
          <AllBlogs />
          <AddBlogModal />
          <EditBlogModal />
        </div>
      </AdminLayout>
    </BlogContext.Provider>
  );
};

export default Blogs; 