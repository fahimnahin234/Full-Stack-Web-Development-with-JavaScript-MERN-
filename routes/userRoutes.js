const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

// Create User
router.post("/create-user", userController.createUser);

// Read User
router.get("/read-user", userController.readUser);

// Update User
router.put("/update-user", userController.updateUser);

// Delete User
router.delete("/delete-user", userController.deleteUser);

// Get All Users
router.get("/all-users", userController.getAllUsers);

// Get User by ID
router.get("/user/:id", userController.getUserById);

// User Login
router.post("/login", userController.loginUser);

// User Logout
router.post("/logout", userController.logoutUser);

// Change Password
router.put("/change-password", userController.changePassword);

// Update Profile
router.put("/update-profile", userController.updateProfile);

// Make Admin
router.put("/make-admin/:id", userController.makeAdmin);

// Remove Admin
router.put("/remove-admin/:id", userController.removeAdmin);

// Search Users
router.get("/search", userController.searchUsers);

// Filter Users
router.get("/filter", userController.filterUsers);

// Block User
router.patch("/block-user/:id", userController.blockUser);

// Unblock User
router.patch("/unblock-user/:id", userController.unblockUser);

// Verify Email
router.post("/verify-email", userController.verifyEmail);

// Resend Verification
router.post("/resend-verification", userController.resendVerification);

// Upload Profile Picture
router.post("/upload-profile-picture", userController.uploadProfilePicture);

// Delete Account
router.delete("/delete-account", userController.deleteAccount);

module.exports = router;