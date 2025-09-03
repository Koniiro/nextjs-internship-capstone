/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import { Team } from "@/types";
import {CreateTeamModal} from '@/components/modals/create-team-modal'
import userEvent from "@testing-library/user-event";


const createTeamMock = jest.fn();
jest.mock("../hooks/use-teams", () => ({
    useTeams: () => ({
        createTeam: createTeamMock, 
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



describe("Create Team Form", () => {

    it("renders create team dialog", async () => {
        const user = userEvent.setup();
        render(<CreateTeamModal/>);

        const trigger = screen.getByRole("button");

        await user.click(trigger);

        expect(screen.getByText("Team Creation Form")).toBeInTheDocument();
        expect(screen.getByText("Cancel")).toBeInTheDocument();
        //expect(screen.getByText("Edit Team")).toBeInTheDocument();
    });

    it("cancel team creation", async () => {
        const user = userEvent.setup();

        render(<CreateTeamModal/>);

        const trigger = screen.getByRole("button", { name: /create team/i });

        await user.click(trigger);

        expect(screen.getByText("Team Creation Form")).toBeInTheDocument();

        
        //Click Cancel
        await user.click(screen.getByText("Cancel"));

        expect(
            screen.queryByText("Team Creation Form")
        ).not.toBeInTheDocument();

        // deleteTeam should NOT have been called
        expect(createTeamMock).not.toHaveBeenCalledWith(
            mockTeam.id,
            {teamName: "Mock Team"}
        );

    });

    it("team creation", async () => {
        const user = userEvent.setup();

        render(<CreateTeamModal/>);

        const trigger = screen.getByRole("button", { name: /create team/i });
       

        await user.click(trigger);

        expect(screen.getByText("Team Creation Form")).toBeInTheDocument();
        
        //Input Data
        const input = screen.getByLabelText(/team name/i);

        await user.clear(input); // clear default value
        await user.type(input, "Mock Team");
        const submitBtn = screen.getAllByRole("button", { name: "Create Team" })
        .find(btn => btn.getAttribute("type") === "submit")!;

        await user.click(submitBtn);

        //Closes Dialog
        expect(
            screen.queryByText("Team Creation Form")
        ).not.toBeInTheDocument();

        expect(createTeamMock).toHaveBeenCalledWith(
            { team_name: "Mock Team" }
        );

    });

   


})
