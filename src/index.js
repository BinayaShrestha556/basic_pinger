// Import necessary modules
import express from "express";
// For making HTTP requests
import dotenv from "dotenv"; // For environment variables

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3003; // Use port from environment or default to 3003

// Configuration for the target server to ping
const TARGET_SERVER_URL =
  process.env.TARGET_SERVER_URL || "http://localhost:3001"; // Replace with your actual server URL
// PING_INTERVAL_MINUTES is set to 14 to ping every 14 minutes.
const PING_INTERVAL_MINUTES = parseInt(
  process.env.PING_INTERVAL_MINUTES || "14", // Default to 14 minutes
  10
); // Ping every X minutes by default

let pingIntervalId = null; // Variable to hold the interval ID, initially null

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

// Simple GET endpoint for the pinging server itself (optional, but useful for health checks)
app.get("/", (req, res) => {
  res.send("Pinging server online. Hit /ping to start the pinging process.");
});

// Endpoint to display current ping settings
app.get("/ping-status", (req, res) => {
  res.send(
    `Pinging server is ${
      pingIntervalId ? "active" : "inactive"
    }. Target: ${TARGET_SERVER_URL}, Interval: ${PING_INTERVAL_MINUTES} minutes.`
  );
});

// New endpoint to start the pinging process
app.get("/ping", (req, res) => {
  if (pingIntervalId) {
    // If pinging is already active, clear the old interval to restart it
    // or simply inform the user it's already running.
    // For this example, we'll clear and restart to ensure fresh interval if needed.
    clearInterval(pingIntervalId);
    console.log("Existing ping interval cleared. Restarting...");
  }

  // Send an initial ping immediately
  sendPing();

  // Start the pinging interval and store its ID
  pingIntervalId = setInterval(sendPing, PING_INTERVAL_MINUTES * 60 * 1000);

  res.send(
    `Pinging started to ${TARGET_SERVER_URL} every ${PING_INTERVAL_MINUTES} minutes. (Initial ping sent)`
  );
  console.log(`Pinging initiated via /ping endpoint.`);
});

// Endpoint to stop the pinging process (optional, but useful)
app.get("/stop-ping", (req, res) => {
  if (pingIntervalId) {
    clearInterval(pingIntervalId); // Clear the interval
    pingIntervalId = null; // Reset the ID
    res.send("Pinging stopped.");
    console.log("Pinging stopped via /stop-ping endpoint.");
  } else {
    res.send("Pinging is not currently active.");
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Pinging server listening on port ${port}`);
  console.log(`To start pinging, visit /ping`);
});
