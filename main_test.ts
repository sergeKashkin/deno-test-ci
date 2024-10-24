import { assertEquals } from "https://deno.land/std@0.182.0/testing/asserts.ts";
const stagingUrl = Deno.env.get("STAGING_URL") || "http://localhost:3000";

Deno.test("Plural Candies Route", async () => {
  const res = await fetch(`${stagingUrl}/candies`);
  const response = await res.json();
  console.log(response);
  assertEquals(res.status, 200);
});

Deno.test("Single Candy Route & Candy Data", async () => {
  const res = await fetch(`${stagingUrl}/candies/1`);
  const response = await res.json();
  assertEquals(res.status, 200);
  assertEquals(response.title, "Snickers");
});

Deno.test("Special Candy Route", async () => {
  const res = await fetch(`${stagingUrl}/candies/special`);
  const response = await res.json();
  assertEquals(res.status, 200);
  assertEquals(response.msg, "special test");
});