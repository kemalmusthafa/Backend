import { Request, Response } from "express";
import prisma from "../prisma";
import { Prisma } from "@prisma/client";

export class UserController {
  async getUsers(req: Request, res: Response) {
    console.log(req.user);
    try {
      const { search, page = 1, limit = 5 } = req.query;
      const { user } = req.body;
      const filter: Prisma.UserWhereInput = {};
      if (search) {
        //filter .username = {contains: search as string}
        filter.OR = [
          { username: { contains: search as string, mode: "insensitive" } },
          { email: { contains: search as string, mode: "insensitive" } },
        ];
      }
      const countUser = await prisma.user.aggregate({ _count: { _all: true } });
      const total_page = Math.ceil(countUser._count._all / +limit);
      const users = await prisma.user.findMany({
        where: filter,
        orderBy: { id: "asc" },
        take: +limit,
        skip: +limit * (+page - 1),
      });
      res.status(200).send({ total_page, page, users });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
  async getUsersId(req: Request, res: Response) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user?.id },
      });
      res.status(200).send({ user });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
  async createUser(req: Request, res: Response) {
    try {
      await prisma.user.create({ data: req.body });
      res.status(201).send("User Created ✅");
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
  async editUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.user.update({ data: req.body, where: { id: +id } });
      res.status(200).send("User Updated ✅");
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.user.delete({ where: { id: +id } });
      res.status(200).send("User Deleted ✅");
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
}
