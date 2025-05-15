const Contact = require("../models/contactModel");

// Create a new contact message
exports.createContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: contact,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Error sending message",
    });
  }
};

// Get all contact messages (admin only)
exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find()
      .sort({ createdAt: -1 })
      .select("-__v");

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Error fetching messages",
    });
  }
};

// Get a single contact message (admin only)
exports.getContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id).select("-__v");

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Error fetching message",
    });
  }
};

// Update contact message status (admin only)
exports.updateContactStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Validate status
    if (!["new", "read", "replied"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).select("-__v");

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Status updated successfully",
      data: contact,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Error updating message status",
    });
  }
};

// Delete a contact message (admin only)
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Error deleting message",
    });
  }
}; 