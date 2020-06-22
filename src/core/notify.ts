import tile from "./tile-client";
import webpush from "web-push";

const notify = async (targetId, payload) => {
    const targetSupervisors = await tile.jget("targetSupervisor", targetId).catch();
    if (!targetSupervisors) return;
    const supervisorIds = JSON.parse(JSON.parse(targetSupervisors)["supervisors"]);
    for (let id of supervisorIds) {
        const supervisor = JSON.parse(await tile.jget("supervisor", id));
        webpush.sendNotification(JSON.parse(supervisor.subscription), payload).catch(e => console.warn(e));
    }
};

export default notify;