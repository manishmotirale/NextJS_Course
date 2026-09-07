import ProjectView from "@/modules/projects/components/project-view";
import React from "react";

const Page = async ({ params }) => {
  // The dynamic segment is [projectsId], so it must be read as `projectsId`.
  const { projectsId } = await params;
  return <ProjectView projectId={projectsId} />;
};

export default Page;
