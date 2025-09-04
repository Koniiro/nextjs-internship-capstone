type ProjectAction =
  | "view"
  | "edit/delete"
  | "manageBoard"
  | "createTask"
  | "updateTask"
  | "deleteTask"
  | "markDone";

export type Role =
  | "Developer"
  | "QA"
  | "Scrum Master"
  | "Product Owner"
  | "Designer"
  | "DevOps"
  | "Business Analyst"
  | "Team Leader"
  | "view";

const rolePermissions: Record<Role, ProjectAction[]> = {
  "Team Leader": [
    "view",
    "edit/delete",
    "manageBoard",
    "createTask",
    "updateTask",
    "deleteTask"
  ],
  "Product Owner": [
    "view",
    "edit/delete",
    "manageBoard",
    "createTask",
    "updateTask",
    "deleteTask"
  ],
  "Scrum Master": [
    "view",
    "edit/delete",
    "manageBoard",
    "createTask",
    "updateTask",
    "deleteTask"

  ],
  Developer: ["view", "createTask", "updateTask"],
  QA: ["view", "createTask", "updateTask"],
  Designer: ["view", "createTask", "updateTask"],
  DevOps: ["view", "createTask", "updateTask"],
  "Business Analyst": ["view", "createTask", "updateTask"],
  "view":[]
};

export function hasProjectPermission(role: Role, action: ProjectAction): boolean {
  const permissions = rolePermissions[role];
  return permissions ? permissions.includes(action) : false;
}