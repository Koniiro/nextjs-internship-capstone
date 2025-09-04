type ProjectAction =
  | "view"
  | "edit/delete"
  | "manageBoard"
  | "createTask"
  | "updateTask"
  | "deleteTask"
  | "markDone"
  | "manageTasks"

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
    "deleteTask",
    "manageTasks"
  ],
  "Product Owner": [
    "view",
    "edit/delete",
    "manageBoard",
    "createTask",
    "updateTask",
    "deleteTask",
    "manageTasks"
  ],
  "Scrum Master": [
    "view",
    "edit/delete",
    "manageBoard",
    "manageTasks",
    "createTask",
    "updateTask",
    "deleteTask"

  ],
  Developer: ["view", "createTask", ],
  QA: ["view", "createTask", ],
  Designer: ["view", "createTask", ],
  DevOps: ["view", "createTask", ],
  "Business Analyst": ["view", "createTask", ],
  "view":[]
};

export function hasProjectPermission(role: Role, action: ProjectAction): boolean {
  const permissions = rolePermissions[role];
  return permissions ? permissions.includes(action) : false;
}