import express, { Request, Response } from 'express';
import tile from "../core/tile-client";

const router = express.Router();

router.post("", async (request: Request, response: Response) => {
    try {
        const params = request.body;
        await tile.jset("supervisor", params.id, "subscription", JSON.stringify(params.subscription));

        response.status(200);
        response.json({ ok: true });
    } catch (e) {
        response.status(400);
        response.json({ ok: false, error: e.message });
    }
});

export default router;