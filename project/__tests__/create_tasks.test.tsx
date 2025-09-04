/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { Column, Task, teamMember } from "@/types";
import userEvent from "@testing-library/user-event";
import { CreateColumnModal } from '@/components/modals/create-col-modal';
import { CreateTaskModal } from '@/components/modals/create-task-modal';
import { useProjectTasks } from '@/hooks/use-tasks';


const mockTask: Task = {
    id:101,
    columnId: 10,
    assigneeId: 'huiuheiqwe',
    title: "new task",
    description: "something to play with" ,
    
    priority:'low',
    position: 0,
    openStatus:true,
    created_at: new Date("2025-01-01T00:00:00Z"),
    updated_at: new Date("2025-01-10T12:00:00Z"),
    due_date: new Date("2025-01-10T12:00:00Z"),
};
const mockSetLocked = jest.fn() as React.Dispatch<React.SetStateAction<boolean>>;
const createColumnMock = jest.fn();
jest.mock("../hooks/use-tasks", () => ({
    useProjectTasks: jest.fn(),
}));
const mockTeamMembers: teamMember[] = [
  {
    id: "1",
    firstName: "Alice",
    lastName: "Johnson",
    email: "alice@example.com",
    avatar: null,
    role: "Developer",
    joinedAt: new Date("2023-01-01"),
    teamManager: false,
  },
  {
    id: "2",
    firstName: "Bob",
    lastName: "Smith",
    email: "bob@example.com",
    avatar: "https://example.com/avatar/bob.png",
    role: "Team Leader",
    joinedAt: new Date("2023-02-15"),
    teamManager: true,
  },
];
const mockCreateTask = jest.fn();
const mockUpdateTask = jest.fn();

(useProjectTasks as jest.Mock).mockReturnValue({
  projectTasks: [],
  isLoading: false,
  error: null,

  isCreating: false,
  createError: null,
  createTask: mockCreateTask,   // ✅ mocked

  isPending: false,
  updateError: null,
  updateTask: mockUpdateTask,   // ✅ mocked

  isDeleting: false,
  deleteError: null,
  deleteTask: jest.fn(),

  isClosing: false,
  isOpening: false,
  closeError: null,
  openError: null,
  closeTask: jest.fn(),
  openTask: jest.fn(),
});

describe("Create Task Modal", () => {
    beforeEach(() => {
        jest.clearAllMocks(); // reset calls between tests
    });

    it("renders create column dialog", async () => {
        const user = userEvent.setup();
        render(<CreateTaskModal projectId='mockProject' colId={mockTask.columnId} setLocked={mockSetLocked} teamMembers={mockTeamMembers}/>);

        const trigger = screen.getByRole("button", { name: /\+ Add Task/i })

        await user.click(trigger);

        expect(screen.getByText("New Task")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Add Task" })).toBeInTheDocument();
        //expect(screen.getByText("Edit Team")).toBeInTheDocument();
    });

    it("cancel team creation", async () => {
        const user = userEvent.setup();
        render(<CreateTaskModal projectId='mockProject' colId={mockTask.columnId} setLocked={mockSetLocked} teamMembers={mockTeamMembers}/>);


        const trigger = screen.getByRole("button", { name: /\+ Add Task/i })

        await user.click(trigger);

        expect(screen.getByText("New Task")).toBeInTheDocument();

        //Click Cancel
        await user.click(screen.getByRole("button", { name: "Cancel" }));

        expect(
            screen.queryByText("New Task")
        ).not.toBeInTheDocument();

        // deleteTeam should NOT have been called
        expect(mockUpdateTask).not.toHaveBeenCalled()


    });

    
    /*it("column creation", async () => {
               const user = userEvent.setup();
        render(<CreateColumnModal projectId={mockColumn.projectId}/>);

        const trigger = screen.getByRole("button", { name: /\+ Add Column/i })

        await user.click(trigger);

        expect(screen.getByText("Add Column Form")).toBeInTheDocument();
        
        //Input Data
        const columnNameInput = screen.getByLabelText(/column name/i);
        const columnDescriptionInput = screen.getByLabelText(/column description/i);
        
        expect(columnNameInput).toBeInTheDocument()
        expect(columnDescriptionInput).toBeInTheDocument()

        await user.clear(columnNameInput); 
        await user.type(columnNameInput, mockColumn.name);

        await user.clear(columnDescriptionInput); 
        await user.type(columnDescriptionInput, mockColumn.description);

        
        const colorTrigger = screen.getByRole("combobox", { name: /color/i });
        await user.click(colorTrigger);
        
        // select the option
        const option = await screen.findByRole("option", { name: /blue/i });
        await user.click(option);

        // assert that the selected value shows up in the button
        expect(colorTrigger).toHaveTextContent("Blue");
        
        const submitBtn = screen.getAllByRole("button", { name: "Add Column" })
        .find(btn => btn.getAttribute("type") === "submit")!;

        await user.click(submitBtn);

        //Closes Dialog
        expect(
            screen.queryByText("Add Column Form")
        ).not.toBeInTheDocument();

        expect(createColumnMock).toHaveBeenCalledWith(
            {
                name: mockColumn.name,
                description:mockColumn.description,
                color: "",
                position:mockColumn.position,
                projectId:mockColumn.projectId
            }
        );

    });*/
    
   


})
