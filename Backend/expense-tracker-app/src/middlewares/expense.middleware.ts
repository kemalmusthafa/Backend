import { NextFunction, Request, Response } from "express";
import fs from "fs";
import { IExpense } from "../../types/expense";

export class ExpenseMiddleware {
  checkId(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const expense: IExpense[] = JSON.parse(
      fs.readFileSync("./db/expense-tracker.json", "utf-8")
    );
    const data = expense.find((item) => item.id == +id);
    if (data) {
      next();
      res.status(200).send({ user: data });
    } else {
      res.status(404).send({ message: "User Not Found!" });
    }
  }
}
