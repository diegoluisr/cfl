import { Application, NextFunction, Request, Response } from "express";
import SP from "./SP";

export default class CF {

  private _sps: SP[] = [];
  private _authorized: boolean = false;

  public init(app: Application): Application {

    app.get('/items/with-contollers', this.auth, this.controllers.getItems);
    app.get('/items/with-middlewares', this.middlewares.getItems);

    return app;
  }

  public addSp(sp: SP) {
    this._sps.push(sp);
  }

  public isAuthorized(): boolean {
    return this._authorized;
  }

  public set authorized(value: boolean) {
    this._authorized = value
  }

  private async auth(req: Request, res: Response, next: NextFunction) {

    if (!('authorization' in req.headers)) {
      next();
      return;
    }

    if (req.headers.authorization?.indexOf("Bearer") !== -1) {
      this._authorized = true;
    }
    next();
  }

  public handlers = {
    index: () => {
      return {
        data: []
      }
    },
    getItems: async () => {
      if (this._sps.length > 0) {
        return await this._sps[0].items();
      }
      return [];
    }
  }

  public middlewares = {
    getItems: async (req: Request, res: Response) => {
      return new Promise<void>((resolve) => {
        this.auth(req, res, async () => {
          if (this.isAuthorized()) {
            res.json(await this.handlers.getItems());
          }
          else {
            return {"message": "fail"};
          }
          resolve();
        });
      });
    },
    getItemsAlt: async (req: Request, res: Response) => {
      this.auth(req, res, async () => {
        if (this.isAuthorized()) {
          res.json(await this.handlers.getItems());
        }
        else {
          res.status(405).json({ "message": "fail" });
        }
      });
    }
  }

  public controllers = {
    getItems: async (req: Request, res: Response) => {
      if (this.isAuthorized()) {
        res.json(await this.handlers.getItems())
      }
      else {
        res.status(405).json({"message": "fail"});
      }
    }
  }
}
