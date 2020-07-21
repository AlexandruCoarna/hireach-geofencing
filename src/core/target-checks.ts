import tile from "./tile-client";
import notify from "./notify";
import deepParse from "./deep-parse";

const checkOffroad = async id => {
    let isNear: boolean;

    const targetDetails = deepParse(await tile.jget("targetDetails", id));
    if (!targetDetails) return;

    for (let point of targetDetails.fence.coords) {
        let nearBy = await tile.nearbyQuery("target").point(point[0], point[1], 50).match(id).execute();
        isNear = nearBy.count;
        if (isNear) break;
    }

    if (!isNear) {
        const payload = JSON.stringify({ title: 'WARNING!', body: 'Target went OffRoad!' });
        await notify(id, payload);
    }
};

const checkCustomAreas = async id => {
    const targetDetails = deepParse(await tile.jget("targetDetails", id));
    if (!targetDetails) return;

    const customAreas = targetDetails.fence.customAreas;
    if (!customAreas.length) return;

    const notificationsCustomArea = targetDetails.notifications.customArea;
    for (let area of customAreas) {
        let nearBy = await tile.nearbyQuery("target").point(area.point[0], area.point[1], 30).match(id).execute();

        if (!nearBy.count) continue;
        if (notificationsCustomArea.includes(area.id)) break

        const payload = JSON.stringify({ title: 'Custom Area', body: `Target reached ${ area.id }` });
        //todo add event system to trigger push notifications
        notify(id, payload).then();
        notificationsCustomArea.push(area.id);
        // todo to remove the area from array
        await tile.jset("targetDetails", id, "notifications.customArea", JSON.stringify(notificationsCustomArea));
        break;
    }
};

export { checkOffroad, checkCustomAreas };
