const express = require("express");
const router = express.Router();
const { loginCheck, isAdmin } = require("../middleware/auth");
const {
  createContact,
  getAllContacts,
  getContact,
  updateContactStatus,
  deleteContact,
} = require("../controller/contactController");

// Public route - anyone can submit a contact form
router.post("/", createContact);

// Protected routes - only admin can access these
router.get("/", loginCheck, isAdmin, getAllContacts);
router.get("/:id", loginCheck, isAdmin, getContact);
router.put("/:id/status", loginCheck, isAdmin, updateContactStatus);
router.delete("/:id", loginCheck, isAdmin, deleteContact);

module.exports = router; 