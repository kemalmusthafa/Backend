import { Request, Response } from "express";
import fs from "fs";
import { IExpense } from "../../types/expense";

export class ExpsenseController {
  getExpense(req: Request, res: Response) {
    const { category, start, end } = req.query
    let expense: IExpense[] = JSON.parse(
      fs.readFileSync("./db/expense-tracker.json", "utf-8")
    );

    expense = expense.filter((item) => {
        let isValid: boolean = true;
        if (category) {
            isValid = isValid && item.category == category;
        }
        if (start && end) {
            const startDate = new Date (start as string)
            const endDate = new Date (end as string)
            const expenseDate = new Date (item.date)
            
            isValid = isValid && expenseDate >= startDate && expenseDate <= endDate
        }
        return isValid;
    })
    const nominal_income = expense
      .filter((item) => item.type == "income")
      .reduce((a, b) => a + b.nominal, 0);
    const nonimal_expense = expense
      .filter((item) => item.type == "expense")
      .reduce((a, b) => a + b.nominal, 0);
    res.status(200).send({ nominal_income, nonimal_expense, expense });
  }

  getExpenseId(req: Request, res: Response) {
    const { id } = req.params;
    const expense: IExpense[] = JSON.parse(
      fs.readFileSync("./db/expense-tracker.json", "utf-8")
    );
    const data = expense.find((item) => item.id == +id);
    if (data) {
      res.status(200).send({ user: data });
    } else {
      res.status(404).send({ message: "User Not Found!" });
    }
  }

  addExpense(req: Request, res: Response) {
    const expense: IExpense[] = JSON.parse(
      fs.readFileSync("./db/expense-tracker.json", "utf-8")
    );
    const maxId = Math.max(...expense.map((item) => item.id));
    const id = expense.length == 0 ? 1 : maxId + 1;
    const { title, nominal, type, category, date } = req.body;
    const newExpense: IExpense = { id, title, nominal, type, category, date };
    expense.push(newExpense);
    fs.writeFileSync(
      "./db/expense-tracker.json",
      JSON.stringify(expense),
      "utf-8"
    );

    res.status(200).send("Expense Added !");
  }

  editExpense(req: Request, res: Response) {
    const { id } = req.params;
    const expense: IExpense[] = JSON.parse(
      fs.readFileSync("./db/expense-tracker.json", "utf-8")
    );
    const idx: number = expense.findIndex((item) => item.id == +id);
    expense[idx] = { ...expense[idx], ...req.body };

    fs.writeFileSync(
      "./db/expense-tracker.json",
      JSON.stringify(expense),
      "utf-8"
    );

    res.status(200).send(`Expense with id ${id} success edited!`);
  }

  deleteExpense(req: Request, res: Response) {
    const { id } = req.params;
    const expense: IExpense[] = JSON.parse(
      fs.readFileSync("./db/expense-tracker.json", "utf-8")
    );
    const newExpense = expense.filter((item) => item.id != +id);
    fs.writeFileSync(
      "./db/expense-tracker.json",
      JSON.stringify(newExpense),
      "utf-8"
    );

    res.status(200).send("Delete Succesful!");
  }

  getCategory(req: Request, res: Response) {
    const { category } = req.query;
    const expense: IExpense[] = JSON.parse(
      fs.readFileSync("./db/expense-tracker.json", "utf-8")
    );

    const data = expense.filter((item) => item.category === category);
    if (data.length > 0) {
      res.status(200).send({ category: data });
    } else {
      res.status(404).send({ message: "No category found for this expenses!" });
    }
  }

  getType(req: Request, res: Response) {
    const { type } = req.query;
    const expense: IExpense[] = JSON.parse(
      fs.readFileSync("./db/expense-tracker.json", "utf-8")
    );

    const normalizedType = (type as string).toLowerCase().trim();

    const data = expense.filter(
      (item) => item.type.toLowerCase() === normalizedType
    );
    if (data.length > 0) {
      res.status(200).send({ type: data });
    } else {
      res.status(404).send({ message: "No type found for this expenses!" });
    }
  }
}
