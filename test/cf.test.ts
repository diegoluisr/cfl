import { describe, expect, it, jest } from "@jest/globals"
import { Request, Response } from "express";
import CF from "../src/CF";
import { SP } from "../src";


describe('CF class', () => {
  it ('must be defined', () => {
    expect(CF).toBeDefined();
  });

  const cf: CF = new CF();
  const sp: SP = new SP();
  sp.id = "ID";
  sp.name = "NAME";
  cf.addSp(sp);

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
});

