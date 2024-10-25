// @deno-types="npm:@types/express@4"
import express, { Request, Response } from "npm:express@4.18.2";

import { reqLogger } from "./logger.ts";

import candies from './data.json' with { type: "json" };

const app = express();
const port = Number(Deno.env.get("PORT")) || 3000;

app.use(reqLogger);

app.use('/images', express.static("images"))

app.get("/candies", (_req: Request, res: Response) => {
  res.status(200).send(candies);
});

app.get("/candies/special", (_req, res) => {
  res.status(200).json({ msg: "special test" });
});

app.get("/candies/:id", (req, res) => {
  const id = Number(req.params.id);
  const candy = candies.find(c => c.id == id);
  if (candy != null) return res.status(200).json(candy);
  res.status(400).json({ msg: "Candy not found" });
});


app.listen(port, () => {
  console.log(`Listening on ${port}...`);
});