import { act, render, screen, waitFor } from "@testing-library/react";
import Home from "../src/app/page";
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event';

const mockData = [
    { id: 1, title: "Candy 1", date: "2001", company: "Company A" },
    { id: 2, title: "Candy 2", date: "2002", company: "Company B" },
];

global.fetch = jest.fn(() => 
    Promise.resolve(({
        json: () => Promise.resolve(mockData),
    }))
) as jest.Mock;

describe("Home component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders a table with candies data", async () => {
        render(await Home());

        expect(await screen.getByText("Title")).toBeInTheDocument();
        expect(await screen.getByText("Invented At")).toBeInTheDocument();
        expect(await screen.getByText("Date")).toBeInTheDocument();
        expect(await screen.getByText("A list of most favorite candies in the world")).toBeInTheDocument();

        mockData.forEach(async candy => {
            expect(await screen.getByText(candy.title)).toBeInTheDocument();
            expect(await screen.getByText(candy.company)).toBeInTheDocument();
            expect(await screen.getByText(candy.date)).toBeInTheDocument();
        });
    });

    it("renders correct image src and alt text for each image on hovercard", async () => {
        render(await Home());

        for (const item of mockData) {
            const row = await screen.getByText(item.title);
            
            // Hover over the row
            await userEvent.hover(row);
     
            // Find the image within the hover content
            const img = await screen.findByAltText(`${item.title} image`);
            
            // Verify the image src
            expect(img.getAttribute("src")).toContain(encodeURIComponent(`/images/${item.id}.jpg`));
            
            // Unhover to close the hover card
            await userEvent.unhover(row);

            // Wait for the hover content to be removed
            await waitFor(async () => {
              expect(await screen.queryByAltText(`${item.title} image`)).not.toBeInTheDocument();
            });
          }
    }, 15000);

    // can extend further ...
});