"use client";

import React, { useState } from "react";
import { 
  Mail, 
  Terminal, 
  MessageSquare, 
  Send, 
  Bug, 
  HelpCircle, 
  Layers 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const ContactAlgoArenaPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "FEEDBACK",
    message: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required field coordinates.");
      return;
    }

    try {
      setIsLoading(true);

      // Sends real-time payload downstream to your custom email API route
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success("Transmission successful! Signal received at motiralemanish@gmail.com");
        setFormData({ name: "", email: "", subject: "FEEDBACK", message: "" });
      } else {
        throw new Error(result.error || "Packet drop detected.");
      }
    } catch (error: any) {
      console.error("Transmission exception: ", error);
      toast.error(error.message || "Failed to transmit signal. Try again shortly.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-slate-900 dark:text-zinc-100 transition-colors pt-28 pb-16 relative overflow-hidden select-none">
      {/* Immersive Background Cyber Mesh */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-violet-500/5 via-fuchsia-500/5 to-blue-500/5 blur-[160px] rounded-full pointer-events-none -z-10" />

      <div className="container mx-auto px-4 max-w-5xl space-y-8 relative z-10">
        
        {/* Meta Header */}
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <Badge variant="outline" className="text-[10px] font-mono font-bold uppercase tracking-widest bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20 px-3 py-1 rounded-lg">
            comms_channel_
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-black font-mono tracking-tight text-slate-900 dark:text-zinc-50 uppercase">
            Contact Support_
          </h1>
          <p className="text-sm sm:text-base font-normal leading-relaxed text-slate-600 dark:text-zinc-400 font-sans">
            Encountering compilation drops or execution limits? Submit a transmission directly to the platform engineers to trace pipeline glitches or submit platform feedback.
          </p>
        </div>

        {/* Contact Page Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Column: Comms Directory Info Card */}
          <div className="md:col-span-5 space-y-6 flex flex-col justify-between">
            <Card className="rounded-xl border border-slate-200 dark:border-zinc-800/80 bg-white/80 dark:bg-slate-950/40 backdrop-blur-md shadow-sm overflow-hidden flex-1 flex flex-col justify-between">
              <div>
                <CardHeader className="pb-3 border-b border-slate-100 dark:border-zinc-900/60 bg-slate-50/50 dark:bg-zinc-900/10">
                  <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-zinc-200">
                    <Terminal className="size-4 stroke-[2.5] text-violet-500" />
                    <span className="text-xs font-mono font-extrabold tracking-wider uppercase">Comms Directory_</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  {/* Comms Options */}
                  <div className="flex items-start gap-4 font-mono">
                    <div className="p-2.5 rounded-xl border border-violet-500/10 bg-violet-500/5 text-violet-500 shrink-0">
                      <Bug className="w-4 h-4 stroke-[2.5]" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-zinc-200">Bug Reports</h4>
                      <p className="text-[11px] text-slate-400 dark:text-zinc-500 font-sans font-normal leading-relaxed">
                        Encountering sandbox compiler panics? Share execution codes and specific language IDs to help patch execution matrices.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 font-mono">
                    <div className="p-2.5 rounded-xl border border-blue-500/10 bg-blue-500/5 text-blue-500 shrink-0">
                      <Layers className="w-4 h-4 stroke-[2.5]" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-zinc-200">Pipeline Features</h4>
                      <p className="text-[11px] text-slate-400 dark:text-zinc-500 font-sans font-normal leading-relaxed">
                        Submit feature queries for custom problem options, editor controls, or supplemental test environment components.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 font-mono">
                    <div className="p-2.5 rounded-xl border border-emerald-500/10 bg-emerald-500/5 text-emerald-500 shrink-0">
                      <HelpCircle className="w-4 h-4 stroke-[2.5]" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-zinc-200">General Support</h4>
                      <p className="text-[11px] text-slate-400 dark:text-zinc-500 font-sans font-normal leading-relaxed">
                        For user profile modifications, credential resets, or playlist compilation issues, report details inside the transmission form.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </div>

              {/* Bottom Support Address */}
              <div className="p-6 border-t border-slate-100 dark:border-zinc-900/60 bg-slate-50/20 dark:bg-zinc-900/5 text-xs font-mono text-slate-400 dark:text-zinc-500 flex items-center justify-center gap-2">
                <Mail className="size-4 text-violet-500" />
                <span>motiralemanish@gmail.com</span>
              </div>
            </Card>
          </div>

          {/* Right Column: Interactive Form Card */}
          <Card className="md:col-span-7 rounded-xl border border-slate-200 dark:border-zinc-800/80 bg-white/80 dark:bg-slate-950/40 backdrop-blur-md shadow-sm overflow-hidden flex flex-col font-mono">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-zinc-900/60 bg-slate-50/50 dark:bg-zinc-900/10">
              <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-zinc-200">
                <MessageSquare className="size-4 stroke-[2.5] text-violet-500" />
                <span className="text-xs font-mono font-extrabold tracking-wider uppercase">Send Message Vector_</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleFormSubmit} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name field */}
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-zinc-400">
                      Operator Name *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter identity"
                      className="h-10 bg-slate-50/50 dark:bg-zinc-900/20 border border-slate-200 dark:border-zinc-800/60 rounded-xl text-xs focus-visible:ring-1 focus-visible:ring-violet-500 font-medium"
                      required
                    />
                  </div>

                  {/* Email field */}
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-zinc-400">
                      Return Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="address@comms.io"
                      className="h-10 bg-slate-50/50 dark:bg-zinc-900/20 border border-slate-200 dark:border-zinc-800/60 rounded-xl text-xs focus-visible:ring-1 focus-visible:ring-violet-500 font-medium"
                      required
                    />
                  </div>
                </div>

                {/* Subject selector */}
                <div className="space-y-1.5">
                  <Label htmlFor="subject" className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-zinc-400">
                    Transmission Subject
                  </Label>
                  <select
                    id="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="flex h-10 w-full items-center justify-between rounded-xl border border-slate-200 dark:border-zinc-800/60 bg-slate-50/50 dark:bg-zinc-900/20 px-3 py-2 text-xs font-medium text-slate-600 dark:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-transparent select-none cursor-pointer"
                  >
                    <option value="FEEDBACK">PLATFORM_FEEDBACK_</option>
                    <option value="BUG">COMPILER_BUG_EXCEPTION_</option>
                    <option value="FEATURE">PIPELINE_FEATURE_QUERY_</option>
                    <option value="OTHER">UNCLASSIFIED_INQUIRY_</option>
                  </select>
                </div>

                {/* Message field */}
                <div className="space-y-1.5">
                  <Label htmlFor="message" className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-zinc-400">
                    Message Body *
                  </Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Input detailed context logs..."
                    className="min-h-[120px] bg-slate-50/50 dark:bg-zinc-900/20 border border-slate-200 dark:border-zinc-800/60 rounded-xl text-xs focus-visible:ring-1 focus-visible:ring-violet-500 font-medium font-sans"
                    required
                  />
                </div>

                {/* Submit button */}
                <div className="flex items-center justify-end pt-2">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="h-10 px-5 rounded-xl font-bold text-xs uppercase tracking-wider gap-2 bg-violet-600 hover:bg-violet-700 dark:bg-violet-600 dark:hover:bg-violet-500 text-white shadow-md shadow-violet-500/10 active:scale-[0.98] transition-all disabled:opacity-40"
                  >
                    <Send className="h-3.5 w-3.5 stroke-[2.5]" />
                    {isLoading ? "Transmitting..." : "Transmit Signal"}
                  </Button>
                </div>

              </form>
            </CardContent>
          </Card>

        </div>

      </div>
    </div>
  );
};

export default ContactAlgoArenaPage;