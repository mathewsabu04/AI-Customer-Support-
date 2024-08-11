"use client"; // Indicates that this is a client-side component in Next.js

import { Box, Stack, TextField, Button, Typography } from "@mui/material"; // Import necessary components from Material UI
import { useState } from "react"; // Import the useState hook from React

export default function Home() {
  // Define the main functional component 'Home'
  // State to store chat messages, initializing with a greeting message from the assistant
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hi, I'm the Headstarter Support Agent. How can I assist you today?`,
    },
  ]);

  // State to store the user's input message
  const [message, setMessage] = useState("");

  // Function to handle sending messages
  const sendMessage = async () => {
    // Update the state to add the user's message and an empty assistant message
    setMessages((messages) => [
      ...messages,
      { role: "user", content: message },
      { role: "assistant", content: "" },
    ]);

    setMessage(""); // Clear the input field

    // Send the user's message to the API and await the response
    const response = await fetch("/api/chat", {
      method: "POST", // Specify the HTTP method as POST
      headers: {
        "Content-Type": "application/json", // Set the request content type to JSON
      },
      // Send the messages array (including the user's new message) as the request body
      body: JSON.stringify([...messages, { role: "user", content: message }]),
    });

    // Create a reader to read the response stream
    const reader = response.body.getReader();
    const decoder = new TextDecoder(); // Decoder to convert the stream to text

    // Function to process the response stream
    const processText = async ({ done, value }) => {
      if (done) return; // Exit if the stream is done

      const text = decoder.decode(value, { stream: true }); // Decode the text chunk
      // Update the last assistant message with the new text chunk
      setMessages((messages) => {
        const lastMessage = messages[messages.length - 1];
        const otherMessages = messages.slice(0, messages.length - 1);
        return [
          ...otherMessages,
          {
            ...lastMessage,
            content: lastMessage.content + text,
          },
        ];
      });

      return reader.read().then(processText); // Continue reading the next chunk
    };

    await reader.read().then(processText); // Start reading the response stream
  };

  // Render the chat UI
  return (
    <Box
      width="100vw" // Full viewport width
      height="100vh" // Full viewport height
      display="flex" // Use flexbox for layout
      flexDirection="column" // Arrange children vertically
      justifyContent="center" // Center content vertically
      alignItems="center" // Center content horizontally
      bgcolor="#f0f2f5" // Light gray background color
    >
      <Typography variant="h4" gutterBottom>
        Headstarter Support
      </Typography>
      <Stack
        direction="column" // Stack children vertically
        width="600px" // Fixed width of the chat box
        height="700px" // Fixed height of the chat box
        border="1px solid #ccc" // Light gray border
        borderRadius="12px" // Rounded corners
        p={2} // Padding inside the box
        bgcolor="white" // White background color for the chat box
        boxShadow={3} // Apply shadow for a raised effect
        spacing={3} // Space between child elements
      >
        <Stack
          direction="column" // Stack messages vertically
          spacing={2} // Space between messages
          flexGrow={1} // Allow the stack to grow and fill the available space
          overflow="auto" // Enable scrolling for overflow
          maxHeight="100%" // Limit the height of the stack
          sx={{ scrollbarWidth: "thin" }} // Custom styling for scrollbar
        >
          {messages.map((msg, index) => (
            <Box
              key={index} // Unique key for each message
              display="flex" // Use flexbox for layout
              justifyContent={
                msg.role === "assistant" ? "flex-start" : "flex-end"
              } // Align messages to the left or right based on role
            >
              <Box
                bgcolor={
                  msg.role === "assistant" ? "primary.main" : "secondary.main"
                } // Background color based on the role
                color="white" // White text color
                borderRadius={16} // Rounded corners for messages
                p={2} // Padding inside the message bubble
                maxWidth="80%" // Limit the width of the message bubble
                boxShadow={1} // Apply a subtle shadow
              >
                {msg.content}
              </Box>
            </Box>
          ))}
        </Stack>
        <Stack direction="row" spacing={2}>
          <TextField
            label="Type your message..." // Placeholder label for the input
            variant="outlined" // Outlined style for the text field
            fullWidth // Full width input
            value={message} // Bind input value to state
            onChange={(e) => setMessage(e.target.value)} // Update state on input change
            sx={{
              backgroundColor: "white", // White background for input
              borderRadius: "8px", // Rounded corners for input
            }}
          />
          <Button
            variant="contained" // Contained style for the button
            onClick={sendMessage} // Trigger sendMessage function on click
            sx={{ padding: "10px 20px", borderRadius: "8px" }} // Custom padding and rounded corners for the button
          >
            Send
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
