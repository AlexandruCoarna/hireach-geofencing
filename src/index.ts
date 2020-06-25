import express, { Request, Response } from 'express';
import bodyParser from "body-parser";
import cors from "cors";

import tile from "./core/tile-client";
import target from "./controller/target";
import supervisor from "./controller/supervisor";
import config from "./config";
import webpushInit from "./core/webpush-init";

const app = express();

webpushInit();

// generic middlewares
app.use(bodyParser.json());
app.use(cors())

// controllers
app.use("/target", target);
app.use("/supervisor", supervisor);


// dev purpose
app.get("/", async (req: Request, res: Response) => {
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

    res.status(200);
    res.json(response);
});

app.get("/flush", async (request: Request, response: Response) => {
    response.status(200);
    if (process.env.env === 'development') {
        await tile.flushdb();
        response.send("ALL DELETED!");
    } else {
        response.send("You are not on DEV env");
    }
});

app.get("/delete/:key/:id", async (request: Request, response: Response) => {
    response.status(200);
    if (process.env.env === 'development') {
        const params = request.params;
        await tile.del(params.key, params.id);
        response.send(`Deleted ${params.key} - ${params.id}`);
    } else {
        response.send("You are not on DEV env");
    }
});

// import express, { Request, Response } from 'express';
// const app = express();
app.listen(config.port || 80);