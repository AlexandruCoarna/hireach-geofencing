import express from 'express';
import tile from "../core/tile-client";
import Handle from "../core/handle";

const router = express.Router();

router.post("", Handle(async (request, response) => {
    const params = request.body;

    if (!params.id || !params.subscription) {
        throw new Error('An id and a subscription must be provided for supervisor');
    }
    await tile.jset("supervisor", params.id, "subscription", JSON.stringify(params.subscription));

    response.status(200);
    response.json({ok: true});
}));

export default router;
