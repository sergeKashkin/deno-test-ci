const stagingUrl = Deno.env.get("STAGING_URL") || "http://localhost:3000";

Deno.bench("Single Candy", async () => {
    await fetch(`${stagingUrl}/candies/1`);
});

Deno.bench("All Candies", async () => {
    await fetch(`${stagingUrl}/candies`);
});

Deno.bench("Special Candy", async () => {
    await fetch(`${stagingUrl}/candies/special`);
})