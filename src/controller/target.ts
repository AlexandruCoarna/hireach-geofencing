import express, { Request, Response } from 'express';
import tile from "../core/tile-client";
import inBetween from "../core/in-between";
import { checkCustomAreas, checkOffroad } from "../core/target-checks";
import { addSupervisor, removeSupervisor } from "../core/target-supervisor";

const router = express.Router();

router.post('', async (request: Request, response: Response) => {
    try {
        const params: any = request.body;
        await tile.set("target", params.id, params.fence.coords[0]);
        await tile.jset("targetDetails", params.id, "fence.type", "line");
        await tile.jset("targetDetails", params.id, "fence.coords", JSON.stringify(inBetween(params.fence.coords)));
        await tile.jset("targetDetails", params.id, "fence.customAreas", JSON.stringify(params.fence.customAreas) || '[]');
        await tile.jset("targetDetails", params.id, "notifications.customArea", "[]");
        await tile.jset("targetDetails", params.id, "notifications.offRoad", '');

        response.status(200);
        response.json({ ok: true });
    } catch (e) {
        response.status(400);
        response.json({ ok: false, error: e.message });
    }
});

router.put('', async (request: Request, response: Response) => {
    try {
        const params: any = request.body;
        await tile.set("target", params.id, params.coords);

        await checkOffroad(params.id);
        await checkCustomAreas(params.id);

        response.status(200);
        response.json({ ok: true });
    } catch (e) {
        response.status(400);
        response.json({ ok: false, error: e.message });
    }

});

router.put("/supervisor", async (request: Request, response: Response) => {
    try {
        const params: any = request.body;
        await addSupervisor(params);

        response.status(200);
        response.json({ ok: true });
    } catch (e) {
        response.status(400);
        response.json({ ok: false, error: e.message });
    }
});

router.delete("/supervisor", async (request: Request, response: Response) => {
    try {
        const params: any = request.body;
        await removeSupervisor(params);

        response.status(200);
        response.json({ ok: true });
    } catch (e) {
        response.status(400);
        response.json({ ok: false, error: e.message });
    }
});


export default router;
