import express from 'express';
import bodyParser from "body-parser";
import cors from "cors";

import tile from "./core/tile-client";
import target from "./controller/target";
import supervisor from "./controller/supervisor";
import config from "./config";
import webpushInit from "./core/webpush-init";
import Handle from "./core/handle";

const app = express();

webpushInit();

// generic middlewares
app.use(bodyParser.json());
app.use(cors())

// controllers
app.use("/target", target);
app.use("/supervisor", supervisor);


// dev purpose
app.get("/", Handle(async (request, repsonse) => {
    const response: any = {
        status: `ok`,
        message: `App runs on port ${config.port}`,
        data: {}
    };

    response.data.keys = await tile.keys("*");
    response.data.target = await tile.scanQuery("target").execute();
    response.data.targetDetails = await tile.scanQuery("targetDetails").execute();
    response.data.targetSupervisor = await tile.scanQuery("targetSupervisor").execute();
    response.data.supervisor = await tile.scanQuery("supervisor").execute();

    repsonse.status(200);
    repsonse.json(response);
}));

app.get("/flush", Handle(async (request, response) => {
    response.status(200);
    if (process.env.env === 'development') {
        await tile.flushdb();
        response.send("ALL DELETED!");
    } else {
        response.send("You are not on DEV env");
    }
}));

app.get("/delete/:key/:id", Handle(async (request, response) => {
    response.status(200);
    if (process.env.env === 'development') {
        const params = request.params;
        await tile.del(params.key, params.id);
        response.send(`Deleted ${params.key} - ${params.id}`);
    } else {
        response.send("You are not on DEV env");
    }
}));

app.listen(config.port || 80);