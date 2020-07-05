import { Request, Response } from "express";

type HttpHandler = (request: Request, response: Response) => void | Promise<void>;

const Handle = (cb: HttpHandler): HttpHandler => {
    return async function (request: Request, response: Response): Promise<void> {
        try {
            await cb(request, response);
        } catch (e) {
            response.status(400);
            response.json({ ok: false, error: e.message });
        }
    }
}

export default Handle;