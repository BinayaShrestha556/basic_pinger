// Import necessary modules
import express from "express";
// For making HTTP requests
import dotenv from "dotenv"; // For environment variables

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3003; // Use port from environment or default to 3000

// Configuration for the target server to ping
const TARGET_SERVER_URL =
  process.env.TARGET_SERVER_URL || "http://localhost:3001"; // Replace with your actual server URL
// Changed PING_INTERVAL_MINUTES to 14 to ping every 14 minutes.
const PING_INTERVAL_MINUTES = parseInt(
  process.env.PING_INTERVAL_MINUTES || "1",
  10
); // Ping every 14 minutes by default

// Simple GET endpoint for the pinging server itself (optional, but useful for health checks)
app.get("/", (req, res) => {
  res.send(
    `Pinging server is running. Target: ${TARGET_SERVER_URL}, Interval: ${PING_INTERVAL_MINUTES} minutes.`
  );
});

// Function to send a ping request to the target server
const sendPing = async () => {
  console.log(
    `[${new Date().toISOString()}] Attempting to ping: ${TARGET_SERVER_URL}`
  );
  try {
    const response = await fetch(TARGET_SERVER_URL);
    if (response.ok) {
      console.log(
        `[${new Date().toISOString()}] Successfully pinged ${TARGET_SERVER_URL}. Status: ${
          response.status
        }`
      );
    } else {
      console.error(
        `[${new Date().toISOString()}] Failed to ping ${TARGET_SERVER_URL}. Status: ${
          response.status
        } ${response.statusText}`
      );
    }
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] Error pinging ${TARGET_SERVER_URL}:`,
      error.message
    );
  }
};

// Start the pinging interval
// We set the interval to 14 minutes (slightly less than typical 15-minute spin-down times)
setInterval(sendPing, PING_INTERVAL_MINUTES * 60 * 1000);

// Start the Express server
app.listen(port, () => {
  console.log(`Pinging server listening on port ${port}`);
  // Send an initial ping when the server starts
  sendPing();
});
