import express from 'express';
import tile from "../core/tile-client";
import inBetween from "../core/in-between";
import { checkCustomAreas, checkOffroad } from "../core/target-checks";
import { addSupervisor, removeSupervisor } from "../core/target-supervisor";
import Handle from "../core/handle";

const router = express.Router();

router.post('', Handle(async (request, response) => {
    const params: any = request.body;
    await tile.set("target", params.id, params.fence.coords[0]);
    await tile.jset("targetDetails", params.id, "fence.type", "line");
    await tile.jset("targetDetails", params.id, "fence.coords", JSON.stringify(inBetween(params.fence.coords)));
    await tile.jset("targetDetails", params.id, "fence.customAreas", JSON.stringify(params.fence.customAreas) || '[]');
    await tile.jset("targetDetails", params.id, "notifications.customArea", "[]");
    await tile.jset("targetDetails", params.id, "notifications.offRoad", '');

    response.status(200);
    response.json({ ok: true });

}));

router.put('', Handle(async (request, response) => {
    const params: any = request.body;
    // todo check first if target exits !!
    await tile.set("target", params.id, params.position);

    await checkOffroad(params.id);
    await checkCustomAreas(params.id);

    response.status(200);
    response.json({ ok: true });
}));

router.put("/supervisor", Handle(async (request, response) => {
    const params: any = request.body;
    await addSupervisor(params);

    response.status(200);
    response.json({ ok: true });
}));

router.delete("/supervisor", Handle(async (request, response) => {
    const params: any = request.body;
    await removeSupervisor(params);

    response.status(200);
    response.json({ ok: true });
}));


export default router;
