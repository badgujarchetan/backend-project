export const UserRoleEnum = {
  ADMIN: "admin",
  PROJECT_ADMIN: "project_admin",
  MEMBER: "member",
};

export const TaskstatusEnum = {
  TODO: "todo",
  DONE: "done",
  IN_PROGRESS: "in_progress",
};
export const AvalibaleTaskStatus = Object.values(TaskstatusEnum);
export const AvailabelUserRole = Object.values(UserRoleEnum);
