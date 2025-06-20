"use client";

import React, { useState } from "react";
import axios from "axios";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Heading } from "@/components/heading";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/loader";

interface ChatTurn {
  role: "user" | "assistant";
  message: string;
}

const AssistantInterface = () => {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [chatLog, setChatLog] = useState<ChatTurn[]>([]);

  const urlSchema = z.object({
    url: z.string().url("Please provide a valid URL."),
  });

  const querySchema = z.object({
    message: z.string().min(1, "Message cannot be empty."),
  });

  const urlForm = useForm({ resolver: zodResolver(urlSchema) });
  const messageForm = useForm({ resolver: zodResolver(querySchema) });

  const handleUrlSubmit = async (data: z.infer<typeof urlSchema>) => {
    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: data.url }),
      });
      const result = await res.json();
      setStatusMessage(result.message || "Site processed successfully.");
    } catch (err) {
      console.error("Failed to scrape URL:", err);
      setStatusMessage("An error occurred while processing the site.");
    }
  };

  const handleMessageSubmit = async (data: z.infer<typeof querySchema>) => {
    setLoading(true);
    try {
      const response = await axios.post("/api/chat", { message: data.message });
      setChatLog((prev) => [
        ...prev,
        { role: "user", message: data.message },
        { role: "assistant", message: response.data },
      ]);
      messageForm.reset();
    } catch (err) {
      console.error("Chat submission failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Heading
        title="Custom AI Assistant"
        description="Provide a webpage to extract context, then chat naturally."
      />

      {/* Website input section */}
      <div className="px-4 lg:px-8 mt-4">
        <Form {...urlForm}>
          <form
            onSubmit={urlForm.handleSubmit(handleUrlSubmit)}
            className="grid grid-cols-12 gap-2 rounded-lg border p-4 px-3 md:px-6 focus-within:shadow-sm"
          >
            <FormField
              name="url"
              render={({ field }) => (
                <FormItem className="col-span-12 lg:col-span-10">
                  <FormControl>
                    <Input {...field} placeholder="https://your-site.com" />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button className="col-span-12 lg:col-span-2 w-full" type="submit">
              Load Context
            </Button>
          </form>
        </Form>
        {statusMessage && <p className="mt-4 text-muted-foreground">{statusMessage}</p>}
      </div>

      {/* Chat interface */}
      <div className="px-4 lg:px-8 mt-4">
        <Form {...messageForm}>
          <form
            onSubmit={messageForm.handleSubmit(handleMessageSubmit)}
            className="grid grid-cols-12 gap-2 rounded-lg border p-4 px-3 md:px-6 focus-within:shadow-sm"
          >
            <FormField
              name="message"
              render={({ field }) => (
                <FormItem className="col-span-12 lg:col-span-10">
                  <FormControl>
                    <Input {...field} placeholder="Ask me anything..." />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              className="col-span-12 lg:col-span-2 w-full bg-green text-white"
              type="submit"
            >
              Ask
            </Button>
          </form>
        </Form>

        <div className="space-y-4 mt-4">
          {loading && (
            <div className="p-8 flex items-center justify-center rounded-lg w-full bg-muted">
              <Loader />
            </div>
          )}

          <div className="flex flex-col-reverse gap-y-4">
            {chatLog.map((entry, index) => (
              <div
                key={index}
                className={`p-8 flex items-start gap-x-8 rounded-lg w-full ${
                  entry.role === "user"
                    ? "bg-white border border-black/10"
                    : "bg-muted"
                }`}
              >
                <span className="font-semibold">
                  {entry.role === "user" ? "User" : "Assistant"}
                </span>
                <p className="text-sm">{entry.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssistantInterface;
