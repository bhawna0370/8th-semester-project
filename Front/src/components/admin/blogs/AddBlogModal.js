import React, { Fragment, useContext, useState } from "react";
import { BlogContext } from "./index";
import axios from "axios";

const apiURL = process.env.REACT_APP_API_URL;

const AddBlogModal = () => {
  const { data, dispatch } = useContext(BlogContext);
  const [blogData, setBlogData] = useState({
    title: "",
    content: "",
    author: "",
    status: "draft",
    tags: "",
    featuredImage: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    setBlogData({ ...blogData, featuredImage: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("title", blogData.title);
      formData.append("content", blogData.content);
      formData.append("author", blogData.author);
      formData.append("status", blogData.status);
      formData.append("tags", blogData.tags);
      if (blogData.featuredImage) {
        formData.append("featuredImage", blogData.featuredImage);
      }

      const response = await axios.post(`${apiURL}/api/blogs`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      dispatch({ type: "addBlog", payload: response.data });
      dispatch({ type: "addBlogModal", payload: false });
      setBlogData({
        title: "",
        content: "",
        author: "",
        status: "draft",
        tags: "",
        featuredImage: null,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Error creating blog post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fragment>
      {data.addBlogModal ? (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
              onClick={() => dispatch({ type: "addBlogModal", payload: false })}
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="mb-4">
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      id="title"
                      required
                      value={blogData.title}
                      onChange={(e) =>
                        setBlogData({ ...blogData, title: e.target.value })
                      }
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="content"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Content
                    </label>
                    <textarea
                      name="content"
                      id="content"
                      rows="6"
                      required
                      value={blogData.content}
                      onChange={(e) =>
                        setBlogData({ ...blogData, content: e.target.value })
                      }
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    ></textarea>
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="author"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Author
                    </label>
                    <input
                      type="text"
                      name="author"
                      id="author"
                      required
                      value={blogData.author}
                      onChange={(e) =>
                        setBlogData({ ...blogData, author: e.target.value })
                      }
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="status"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Status
                    </label>
                    <select
                      name="status"
                      id="status"
                      required
                      value={blogData.status}
                      onChange={(e) =>
                        setBlogData({ ...blogData, status: e.target.value })
                      }
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="tags"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      name="tags"
                      id="tags"
                      value={blogData.tags}
                      onChange={(e) =>
                        setBlogData({ ...blogData, tags: e.target.value })
                      }
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="featuredImage"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Featured Image
                    </label>
                    <input
                      type="file"
                      name="featuredImage"
                      id="featuredImage"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300"
                    />
                  </div>
                  {error && (
                    <div className="mb-4 text-red-600 text-sm">{error}</div>
                  )}
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  >
                    {loading ? "Creating..." : "Create Blog Post"}
                  </button>
                  <button
                    type="button"
                    onClick={() => dispatch({ type: "addBlogModal", payload: false })}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </Fragment>
  );
};

export default AddBlogModal; 