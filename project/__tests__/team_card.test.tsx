/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { Team } from "@/types";
import TeamCard from '@/components/team/team-card'
import userEvent from "@testing-library/user-event";


const deleteTeamMock = jest.fn();
const editTeamMock = jest.fn();
jest.mock("../hooks/use-teams", () => ({
    useTeams: () => ({
        deleteTeam: deleteTeamMock, 
        updateTeam: editTeamMock,
    }),
}));




// 2. Mock Next.js Link (to avoid router issues)
jest.mock("next/link", () => {
    return ({ children, href }: any) => <a href={href}>{children}</a>;
});
jest.mock("next/router", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

const mockTeam: Team = {
    teamName: "Tracen",
    id: "umapyoi-678",
    created_at: new Date("2025-01-01T00:00:00Z"),
    updated_at: new Date("2025-01-10T12:00:00Z"),
    teamCreatorId:"trainer-123",
    teamCreatorName:"toreina-san"
};



describe("TeamCard", () => {

    it("renders team name", () => {
        render(<TeamCard team={mockTeam} managerRole={false} />);
        expect(screen.getByText("Tracen")).toBeInTheDocument();
    });

    it("does not renders team manager badge when not TM", () => {
        render(<TeamCard team={mockTeam} managerRole={false} />);
        expect(screen.queryByText("TM")).not.toBeInTheDocument();
    });

    it("renders team name when manager", () => {
        render(<TeamCard team={mockTeam} managerRole={true} />);
        expect(screen.getByText("Tracen")).toBeInTheDocument();
    });

    it("renders team manager badge", () => {
        render(<TeamCard team={mockTeam} managerRole={true} />);
        expect(screen.getByText("TM")).toBeInTheDocument();
    });

    it("navigates to team page when title clicked (TM)", async () => {
        const user = userEvent.setup();
        
        render(<TeamCard team={mockTeam} managerRole={true} />);

        const link = screen.getByText("Tracen").closest("a");
        expect(link).toHaveAttribute("href",`/team/${mockTeam.id}`);
    });

    it("navigates to team page when title clicked", async () => {
        const user = userEvent.setup();
        
        render(<TeamCard team={mockTeam} managerRole={false} />);

        const link = screen.getByText("Tracen").closest("a");
        expect(link).toHaveAttribute("href",`/team/${mockTeam.id}`);
    });

    it("opens dropdown menu when trigger is clicked (TM)", async () => {
        const user = userEvent.setup();

        render(<TeamCard team={mockTeam} managerRole={true} />);

        // 1️⃣ Find the trigger (usually has role="button")
        const trigger = screen.getByRole("button");

        // 2️⃣ Click it
        await user.click(trigger);

        // 3️⃣ Expect the menu content to show up
        expect(screen.getByText("Actions")).toBeInTheDocument();
        expect(screen.getByText("Edit Team")).toBeInTheDocument();
        expect(screen.getByText("Delete")).toBeInTheDocument();
    });

    it("no dropdown menu when not manager", async () => {
        const user = userEvent.setup();

        render(<TeamCard team={mockTeam} managerRole={false} />);

        expect(screen.queryByRole("button")).not.toBeInTheDocument()


    });

    it("trigger delete - cancel's action (TM)", async () => {
        const user = userEvent.setup();

        render(<TeamCard team={mockTeam} managerRole={true} />);

        // Trigger Menu
        await user.click(screen.getByRole("button"));
        // Click Delete
        await user.click(screen.getByText("Delete"));

        //Dialog is Open
        expect(screen.getByText("Delete this Team")).toBeInTheDocument();
        
        //Click Cancel
        await user.click(screen.getByText("Cancel"));

        expect(
            screen.queryByText("Delete this Team")
        ).not.toBeInTheDocument();

        // deleteTeam should NOT have been called
        expect(deleteTeamMock).not.toHaveBeenCalled();

    });

    it("trigger delete - delete's team (TM)", async () => {
        const user = userEvent.setup();

        render(<TeamCard team={mockTeam} managerRole={true} />);

        // Trigger Menu
        await user.click(screen.getByRole("button"));
        // Click Delete
        await user.click(screen.getByText("Delete"));

        //Dialog is Open
        expect(screen.getByText("Delete this Team")).toBeInTheDocument();
        
        //Click Cancel
        await user.click(screen.getByText("Yes, Remove."));

        //Closes Dialog
        expect(
            screen.queryByText("Delete this Team")
        ).not.toBeInTheDocument();

        // deleteTeam should NOT have been called
        expect(deleteTeamMock).toHaveBeenCalledWith(mockTeam.id);

    });

    
    it("trigger edit - cancel (TM)", async () => {
        const user = userEvent.setup();

        render(<TeamCard team={mockTeam} managerRole={true} />);

        // Trigger Menu
        await user.click(screen.getByRole("button"));
        // Click Delete
        await user.click(screen.getByText("Edit Team"));

        //Dialog is Open
        expect(screen.getByText("Edit Team Form")).toBeInTheDocument();
    

        await user.click(screen.getByText("Cancel"));
        //Closes Dialog
        expect(
            screen.queryByText("Edit Team Form")
        ).not.toBeInTheDocument();

        expect(editTeamMock).not.toHaveBeenCalledWith(
            mockTeam.id,
            {teamName: "Mock Team"}
        );

        // deleteTeam should NOT have been called
        //expect(deleteTeamMock).toHaveBeenCalledWith(mockTeam.id);

    });

    it("trigger edit - edit (TM)", async () => {
        const user = userEvent.setup();

        render(<TeamCard team={mockTeam} managerRole={true} />);

        // Trigger Menu
        await user.click(screen.getByRole("button"));
        // Click Delete
        await user.click(screen.getByText("Edit Team"));

        //Dialog is Open
        expect(screen.getByText("Edit Team Form")).toBeInTheDocument();
        
        const input = screen.getByLabelText(/team name/i);
        await user.clear(input); // clear default value
        await user.type(input, "Mock Team");

   

        await user.click(screen.getByText("Save"));
        //Closes Dialog
        expect(
            screen.queryByText("Edit Team Form")
        ).not.toBeInTheDocument();

        expect(editTeamMock).toHaveBeenCalledWith(
            "umapyoi-678",
            { team_name: "Mock Team" }
        );

        // deleteTeam should NOT have been called
        //expect(deleteTeamMock).toHaveBeenCalledWith(mockTeam.id);

    });
})
