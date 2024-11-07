import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals"
import CF from "../src/CF";
import { SP } from "../src";
jest.mock('express', () => {
  return require('jest-express');
});
import express, { Request, Response } from "express";

let cf:CF;
let sp: SP;

describe('CF class', () => {

  beforeEach(() => {
    cf = new CF();
    sp = new SP();
    sp.id = "ID";
    sp.name = "NAME";
    cf.addSp(sp);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it ('must be defined', () => {
    expect(CF).toBeDefined();
  });

  it ('Getting data via controller', async () => {

    cf.authorized = true;

    const mockReq = {} as Request;

    let responseObject = {};
    let mockRes: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockImplementation((data) => {
        responseObject = data;
      }),
    } as Partial<Response>;

    let expectedData = [];

    await cf.controllers.getItems(mockReq, mockRes);
    expect(mockRes.json).toBeCalled();
    expect(responseObject).toStrictEqual(expectedData);
  });

  it('Getting data via middleware', async () => {

    const mockReq = {
      headers: {
        authorization: "Bearer valid-token",
      }
    } as Request;

    let responseObject = {};
    let mockRes: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockImplementation((data) => {
        responseObject = data;
      }),
    } as Partial<Response>;

    let expectedData = [];

    await cf.middlewares.getItems(mockReq, mockRes);
    expect(mockRes.json).toBeCalled();
    expect(responseObject).toStrictEqual(expectedData);
  });

  it('Getting data via middleware with alternative function', async () => {

    const mockReq = {
      headers: {
        authorization: "Bearer valid-token",
      }
    } as Request;

    let responseObject = {};
    let mockRes: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockImplementation((data) => {
        responseObject = data;
      }),
    } as Partial<Response>;

    let expectedData = [];

    await cf.middlewares.getItemsAlt(mockReq, mockRes);
    await new Promise((resolve) => {setTimeout(resolve, 1)});
    expect(mockRes.json).toBeCalled();
    expect(responseObject).toStrictEqual(expectedData);
  });

  describe('Express init()', () => {
    it('with middlewares', () => {
      let app = express();

      cf.auth = jest.fn();
      cf.controllers.getItems = jest.fn();

      app = cf.init(app);
      expect(app.get).toBeCalledWith('/items/controllers-without-auth', cf.controllers.getItems)
    });

  });

  describe('Express init()', () => {
    it('with controllers', () => {
      let app = express();

      cf.auth = jest.fn();
      cf.controllers.getItems = jest.fn();

      app = cf.init(app);
      expect(app.get).toBeCalledWith('/items/with-controllers', cf.auth, cf.controllers.getItems);
    });

  });
});
