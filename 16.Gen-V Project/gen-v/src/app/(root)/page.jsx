"use client";

import ProjectsForm from "@/modules/home/components/project-form";
import ProjectList from "@/modules/home/components/project-list";
import Image from "next/image";
import React from "react";

const Page = () => {
  return (
    <div className="relative flex w-full justify-center px-4 pt-6 pb-16">
      {/* Soft radial glow behind the hero. Pointer-events-none so it never
          swallows clicks on the form. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[380px] bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,theme(colors.emerald.500/10),transparent)]"
      />

      <div className="w-full max-w-5xl">
        <section className="flex flex-col items-center">
          <Image
            src="/logo.png"
            width={72}
            height={72}
            alt="Gen-V"
            priority
            className="hidden object-contain invert md:block dark:invert-0"
          />

          <div className="mt-4 space-y-3 text-center">
            <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
              Build something{" "}
              <span className="bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent">
                extraordinary
              </span>
            </h1>

            <p className="text-muted-foreground mx-auto max-w-xl text-base md:text-lg">
              Describe what you want and Gen-V builds a working Next.js app,
              live, in seconds.
            </p>
          </div>

          <div className="mt-8 w-full max-w-3xl">
            <ProjectsForm />
          </div>

          <ProjectList />
        </section>
      </div>
    </div>
  );
};

export default Page;
