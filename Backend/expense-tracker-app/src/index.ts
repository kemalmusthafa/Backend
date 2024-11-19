import express, { Application, Request, Response } from "express";
import { ExpenseRouter } from "./routers/expense.router";


const PORT: number = 5000;

const app: Application = express();
app.use(express.json());

const expenseRouter = new ExpenseRouter();

app.get("/api", (req: Request, res: Response) => {
  res.status(200).send("Expense Tracker");
});

app.use("/api/expense", expenseRouter.getRouter());

app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}`);
});
