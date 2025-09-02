type ProjectAction =
  | "view"
  | "edit/delete"
  | "manageBoard"
  | "createTask"
  | "updateTask";

export type Role =
  | "Developer"
  | "QA"
  | "Scrum Master"
  | "Product Owner"
  | "Designer"
  | "DevOps"
  | "Business Analyst"
  | "Team Leader";

const rolePermissions: Record<Role, ProjectAction[]> = {
  "Team Leader": [
    "view",
    "edit/delete",
    "manageBoard",
    "createTask",
    "updateTask",
  ],
  "Product Owner": [
    "view",
    "edit/delete",
    "manageBoard",
    "createTask",
    "updateTask",
  ],
  "Scrum Master": [
    "view",
    "edit/delete",
    "manageBoard",
    "createTask",
    "updateTask",
  ],
  Developer: ["view", "createTask", "updateTask"],
  QA: ["view", "createTask", "updateTask"],
  Designer: ["view", "createTask", "updateTask"],
  DevOps: ["view", "createTask", "updateTask"],
  "Business Analyst": ["view", "createTask", "updateTask"],
};

export function hasProjectPermission(role: Role, action: ProjectAction): boolean {
  const permissions = rolePermissions[role];
  return permissions ? permissions.includes(action) : false;
}