import { Router, Request, Response, NextFunction } from "express";
import { User } from "../models/user.model";
import { UserDB } from "../schemas/user.schema";
import * as userService from "../services/user.service";

import { InventoryItemDB } from "../schemas/inventoryItem.schema";

//create user
const userRouter = Router();

userRouter.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;
    let randomVariable: Error | User;

    try {
      randomVariable = await userService.postUser(body);
    } catch (ex) {
      return next(ex);
    }
    if (randomVariable instanceof Error) {
      return next(randomVariable);
    }

    res.send(randomVariable);
  }
);
//get
userRouter.get(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userById = await UserDB.findById(req.params.id);
      res.send(userById);
    } catch (ex) {
      return next(ex);
    }
  }
);

//get all
userRouter.get(
  "/",
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const userItems = await UserDB.find();
      res.send(userItems);
    } catch (ex) {
      return next(ex);
    }
  }
);
//update
userRouter.put(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;
    user: body;

    const user = await UserDB.findById(req.params.id);
    const fullname1 = user?.firstName?.concat(" ").concat(user.lastName);

    if (body.firstName || body.lastName || body.phoneNumber || body.email) {
      try {
        const findUser = await UserDB.findByIdAndUpdate(
          { _id: req.params.id },
          {
            firstName: body.firstName,
            lastName: body.lastName,
            phoneNumber: body.phoneNumber,
            email: body.email,
          }
        );
        if (findUser == null) res.send("Could not find user!");

        console.log("updated");
        const userById = await UserDB.findById(req.params.id);
        res.send(userById);

        const fullname2 = userById?.firstName.concat(" ", userById.lastName);
        await InventoryItemDB.findOneAndUpdate(
          { user: fullname1 },
          { user: fullname2 }
        );
      } catch (ex) {
        return next(ex);
      }
    } else {
      res.send("No attributes found!");
    }
  }
);

//delete
userRouter.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await UserDB.findById(req.params.id);
      const fullname = user?.firstName?.concat(" ").concat(user.lastName);

      await UserDB.findByIdAndDelete(req.params.id);

      await InventoryItemDB.findOneAndUpdate(
        { user: fullname },
        { user: null }
      );
      res.status(200).json({ message: "User deleted successfully", id: req.params.id });
    } catch (ex) {
      return next(ex);
    }
  }
);

export { userRouter };
