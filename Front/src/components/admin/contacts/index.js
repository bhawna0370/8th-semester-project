import React, { Fragment, createContext, useReducer, useEffect, useState } from "react";
import AdminLayout from "../layout";
import ContactMenu from "./ContactMenu";
import AllContacts from "./AllContacts";
import ViewContactModal from "./ViewContactModal";
import axios from "axios";

const apiURL = process.env.REACT_APP_API_URL;

/* This context manage all of the contact component's data */
export const ContactContext = createContext();

const contactState = {
  loading: false,
  viewContactModal: false,
  currentContact: null,
  contacts: [],
};

const contactReducer = (state, action) => {
  switch (action.type) {
    case "loading":
      return {
        ...state,
        loading: action.payload,
      };
    case "viewContactModal":
      return {
        ...state,
        viewContactModal: action.payload,
      };
    case "currentContact":
      return {
        ...state,
        currentContact: action.payload,
      };
    case "contacts":
      return {
        ...state,
        contacts: action.payload,
      };
    default:
      return state;
  }
};

const Contacts = () => {
  const [data, dispatch] = useReducer(contactReducer, contactState);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        dispatch({ type: "loading", payload: true });
        const response = await axios.get(`${apiURL}/api/contact`);
        dispatch({ type: "contacts", payload: response.data.data });
        dispatch({ type: "loading", payload: false });
      } catch (err) {
        setError("Failed to fetch contact messages");
        dispatch({ type: "loading", payload: false });
      }
    };

    fetchContacts();
  }, []);

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <ContactContext.Provider value={{ data, dispatch }}>
      <AdminLayout>
        <div className="grid grid-cols-1 space-y-4 p-4">
          <ContactMenu />
          <AllContacts />
          <ViewContactModal />
        </div>
      </AdminLayout>
    </ContactContext.Provider>
  );
};

export default Contacts; 