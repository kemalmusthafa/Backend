import { Router } from "express";
import { ExpsenseController } from "../controllers/expense.controller";
import { ExpenseMiddleware } from "../middlewares/expense.middleware";

export class ExpenseRouter {
  private router: Router;
  private expenseController: ExpsenseController;
  private expenseMiddleware: ExpenseMiddleware;

  constructor() {
    this.expenseController = new ExpsenseController();
    this.expenseMiddleware = new ExpenseMiddleware();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/", this.expenseController.getExpense);
    this.router.get("/category", this.expenseController.getCategory);
    this.router.get("/type", this.expenseController.getType);
    this.router.get(
      "/:id",
      this.expenseMiddleware.checkId,
      this.expenseController.getExpenseId
    );
    this.router.post("/", this.expenseController.addExpense);
    this.router.patch(
      "/:id",
      this.expenseMiddleware.checkId,
      this.expenseController.editExpense
    );
    this.router.delete(
      "/:id",
      this.expenseMiddleware.checkId,
      this.expenseController.deleteExpense
    );
  }
  getRouter(): Router {
    return this.router;
  }
}
