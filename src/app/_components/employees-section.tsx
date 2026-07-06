"use client";

import { useEmployeesWorkspace } from "./employees-section/use-employees-workspace";
import { WorkspaceContent } from "./employees-section/workspace-content";
import {
  WorkspaceGuestState,
  WorkspaceLoadingState,
} from "./employees-section/workspace-states";

export function EmployeesSection() {
  const workspace = useEmployeesWorkspace();

  if (workspace.isLoading) {
    return <WorkspaceLoadingState />;
  }

  if (!workspace.session?.user) {
    return <WorkspaceGuestState />;
  }

  return <WorkspaceContent workspace={workspace} />;
}
