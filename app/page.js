"use client";
import { Box, Stack, TextField, Button } from "@mui/material";
import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hi I'm the Headstarter Support Agent, how can I assist you today?`,
    },
  ]);

  const [message, setMessage] = useState("");

  // const sendMessage = async () =>
  // {
  //   setMessages((messages) => [
  //     ...messages,
  //     { role: "user", content: message },
  //     { role: "assistant", content: "" },
  //   ]);
  //   setMessage("");

  //   try {
  //     const response = await fetch("/api/chat", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ role: "user", content: message }),
  //     });

  //     if (!response.body) {
  //       console.error("No response body");
  //       return;
  //     }

  //     const reader = response.body.getReader();
  //     const decoder = new TextDecoder();

  //     const processText = async ({ done, value }) => {
  //       if (done) {
  //         return;
  //       }

  //       const text = decoder.decode(value, { stream: true });
  //       setMessages((messages) => {
  //         const lastMessage = messages[messages.length - 1];
  //         const otherMessages = messages.slice(0, messages.length - 1);
  //         return [
  //           ...otherMessages,
  //           {
  //             ...lastMessage,
  //             content: lastMessage.content + text,
  //           },
  //         ];
  //       });

  //       await reader.read().then(processText); // Continue processing the next chunk
  //     };

  //     await reader.read().then(processText); // Start processing
  //   } catch (error) {
  //     console.error("Error fetching or processing message", error);
  //   }
  // };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        direction="column"
        width="600px"
        height="700px"
        border="1px solid black"
        p={2}
        spacing={3}
      >
        <Stack
          direction="column"
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
        >
          {messages.map((msg, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                msg.role === "assistant" ? "flex-start" : "flex-end"
              }
            >
              <Box
                bgcolor={
                  msg.role === "assistant" ? "primary.main" : "secondary.main"
                }
                color="white"
                borderRadius={16}
                p={3}
              >
                {msg.content}
              </Box>
            </Box>
          ))}
        </Stack>
        <Stack direction="row" spacing={2}>
          <TextField
            label="message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button variant="contained">Send</Button>
        </Stack>
      </Stack>
    </Box>
  );
}
