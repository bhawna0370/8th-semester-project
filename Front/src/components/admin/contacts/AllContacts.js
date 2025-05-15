import React, { Fragment, useContext } from "react";
import { ContactContext } from "./index";
import axios from "axios";

const apiURL = process.env.REACT_APP_API_URL;

const AllContacts = () => {
  const { data, dispatch } = useContext(ContactContext);

  const viewContact = (contact) => {
    dispatch({ type: "currentContact", payload: contact });
    dispatch({ type: "viewContactModal", payload: true });
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${apiURL}/api/contact/${id}/status`, { status });
      dispatch({
        type: "contacts",
        payload: data.contacts.map((contact) =>
          contact._id === id ? { ...contact, status } : contact
        ),
      });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const deleteContact = async (id) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        await axios.delete(`${apiURL}/api/contact/${id}`);
        dispatch({
          type: "contacts",
          payload: data.contacts.filter((contact) => contact._id !== id),
        });
      } catch (error) {
        console.error("Error deleting contact:", error);
      }
    }
  };

  if (data.loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <svg
          className="w-12 h-12 animate-spin text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          ></path>
        </svg>
      </div>
    );
  }

  if (data.contacts.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <svg
          className="w-16 h-16 text-gray-400 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <h2 className="text-xl font-semibold text-gray-600 mb-2">No Messages Yet</h2>
        <p className="text-gray-500">When customers contact you, their messages will appear here.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              From
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Subject
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.contacts.map((contact) => (
            <tr key={contact._id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col">
                  <div className="text-sm font-medium text-gray-900">
                    {contact.name}
                  </div>
                  <div className="text-sm text-gray-500">{contact.email}</div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">{contact.subject}</div>
                <div className="text-sm text-gray-500 truncate max-w-xs">
                  {contact.message}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <select
                  value={contact.status}
                  onChange={(e) => updateStatus(contact._id, e.target.value)}
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    contact.status === "new"
                      ? "bg-indigo-100 text-indigo-800"
                      : contact.status === "read"
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  <option value="new">New</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                </select>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(contact.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => viewContact(contact)}
                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  View
                </button>
                <button
                  onClick={() => deleteContact(contact._id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllContacts; 