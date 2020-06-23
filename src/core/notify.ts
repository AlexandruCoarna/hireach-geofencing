import tile from "./tile-client";
import webpush from "web-push";
import config from "../config";

const notify = async (targetId, payload) => {
    if (!config.webPush.privateKey || !config.webPush.publicKey || !config.webPush.mailTo) {
        return;
    }
    const targetSupervisors = await tile.jget("targetSupervisor", targetId).catch(() => null);
    if (!targetSupervisors) return;
    const supervisorIds = JSON.parse(JSON.parse(targetSupervisors)["supervisors"]);
    for (let id of supervisorIds) {
        const supervisor = JSON.parse(await tile.jget("supervisor", id));
        webpush.sendNotification(JSON.parse(supervisor.subscription), payload).catch(e => console.warn(e));
    }
};

export default notify;