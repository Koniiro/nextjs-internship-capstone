/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { Column } from "@/types";
import userEvent from "@testing-library/user-event";
import { CreateColumnModal } from '@/components/modals/create-col-modal';


const mockColumn: Column = {
    id:101,
    name: "new col",
    description: "something to play with" ,
    projectId: "mock-proj-123",
    color:"blue-500",
    position:0,
    created_at: new Date("2025-01-01T00:00:00Z"),
    updated_at: new Date("2025-01-10T12:00:00Z"),
};

const createColumnMock = jest.fn();
jest.mock("../hooks/use-columns", () => ({
    useColumns: () => ({
        createCol: createColumnMock, 
    }),
}));


describe("Create Column Modal", () => {

    it("renders create column dialog", async () => {
        const user = userEvent.setup();
        render(<CreateColumnModal projectId={mockColumn.projectId}/>);

        const trigger = screen.getByRole("button", { name: /\+ Add Column/i })

        await user.click(trigger);

        expect(screen.getByText("Add Column Form")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Add Column" })).toBeInTheDocument();
        //expect(screen.getByText("Edit Team")).toBeInTheDocument();
    });

    it("cancel team creation", async () => {
        const user = userEvent.setup();
        render(<CreateColumnModal projectId={mockColumn.projectId}/>);

        const trigger = screen.getByRole("button", { name: /\+ Add Column/i })

        await user.click(trigger);

        expect(screen.getByText("Add Column Form")).toBeInTheDocument();

        //Click Cancel
        await user.click(screen.getByRole("button", { name: "Cancel" }));

        expect(
            screen.queryByText("Team Creation Form")
        ).not.toBeInTheDocument();

        // deleteTeam should NOT have been called
        expect(createColumnMock).not.toHaveBeenCalledWith(
            mockColumn.id,
            {
                name: mockColumn.name,
                description:mockColumn.description,
                color: mockColumn.color,
            }
        );

    });

    
    it("column creation", async () => {
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

        
        /*const colorTrigger = screen.getByRole("combobox", { name: /color/i });
        await user.click(colorTrigger);
        
        // select the option
        const option = await screen.findByRole("option", { name: /blue/i });
        await user.click(option);

        // assert that the selected value shows up in the button
        expect(colorTrigger).toHaveTextContent("Blue");
        */
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

    });
    
   


})
