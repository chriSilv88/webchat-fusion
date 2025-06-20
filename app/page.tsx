"use client";
import React, { useState } from "react";
import axios from "axios";
import * as z from "zod";
import { Heading } from "@/components/heading";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/loader";

interface ChatEntry {
  role: "user" | "bot";
  content: string;
}

const ChatInterface = () => {
  const [statusMessage, setStatusMessage] = useState("");
  const [chatLog, setChatLog] = useState<ChatEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const urlForm = useForm({
    resolver: zodResolver(
      z.object({
        url: z.string().url({ message: "Please enter a valid URL." }),
      })
    ),
  });

  const messageForm = useForm({
    resolver: zodResolver(
      z.object({
        message: z.string().min(1, { message: "Message is required." }),
      })
    ),
  });

  const handleUrlSubmit = async (formData: any) => {
    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: formData.url }),
      });

      const data = await res.json();
      console.log("Scrape response:", data);
      setStatusMessage("URL processed. You may now start chatting.");
    } catch (err) {
      console.error("Scraping failed:", err);
      setStatusMessage("Could not process the provided URL.");
    }
  };

  const handleChatSubmit = async (formData: any) => {
    setLoading(true);
    try {
      const res = await axios.post("/api/chat", { message: formData.message });
      setChatLog([
        ...chatLog,
        { role: "user", content: formData.message },
        { role: "bot", content: res.data },
      ]);
    } catch (err) {
      console.error("Chat error:", err);
    }
    setLoading(false);
    messageForm.reset();
  };

  return (
    <div>
      <Heading
        title="Smart Site Chat"
        description="Insert a website URL and start chatting with its content."
      />

      <div className="px-4 lg:px-8 mt-4">
        <Form {...urlForm}>
          <form
            onSubmit={urlForm.handleSubmit(handleUrlSubmit)}
            className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
          >
            <FormField
              name="url"
              render={({ field }) => (
                <FormItem className="col-span-12 lg:col-span-10">
                  <FormControl className="m-0 p-0">
                    <Input {...field} placeholder="Paste website URL here" />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button className="col-span-12 lg:col-span-2 w-full" type="submit">
              Load Site
            </Button>
          </form>
        </Form>
        {statusMessage && <p className="mt-4">{statusMessage}</p>}
      </div>

      <div className="px-4 lg:px-8 mt-4">
        <Form {...messageForm}>
          <form
            onSubmit={messageForm.handleSubmit(handleChatSubmit)}
            className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
          >
            <FormField
              name="message"
              render={({ field }) => (
                <FormItem className="col-span-12 lg:col-span-10">
                  <FormControl className="m-0 p-0">
                    <Input {...field} placeholder="Ask something..." />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              className="col-span-12 lg:col-span-2 w-full bg-green text-white"
              type="submit"
            >
              Send
            </Button>
          </form>
        </Form>

        <div className="space-y-4 mt-4">
          {loading && (
            <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
              <Loader />
            </div>
          )}
          <div className="flex flex-col-reverse gap-y-4">
            {chatLog.map((entry, idx) => (
              <div
                key={idx}
                className={`p-8 w-full flex items-start gap-x-8 rounded-lg ${
                  entry.role === "user"
                    ? "bg-white border border-black/10"
                    : "bg-muted"
                }`}
              >
                {entry.role === "user" ? "User" : "Assistant"}
                <p className="text-sm">{entry.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
