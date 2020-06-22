import tile from "./tile-client";
import notify from "./notify";

const checkOffroad = async id => {
    let isNear: boolean;
    const targetDetails = JSON.parse(await tile.jget("targetDetails", id));
    const coords = JSON.parse(targetDetails.fence.coords);

    for (let point of coords) {
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
    const targetDetails = JSON.parse(await tile.jget("targetDetails", id));
    const customAreas = JSON.parse(targetDetails.fence.customAreas);
    if (!customAreas.length) return;
    const notificationsCustoArea = JSON.parse(targetDetails.notifications.customArea);
    for (let area of customAreas) {
        let nearBy = await tile.nearbyQuery("target").point(area.point[0], area.point[1], 30).match(id).execute();
        if (!nearBy.count) continue;
        if (!notificationsCustoArea.includes(area.id)) {
            const payload = JSON.stringify({ title: 'Custom Area', body: `Target reached ${area.id}` });
            await notify(id, payload);
            notificationsCustoArea.push(area.id);
            // try to remove the area from array
            await tile.jset("targetDetails", id, "notifications.customArea", JSON.stringify(notificationsCustoArea));
            break;
        }
    }
};

export { checkOffroad, checkCustomAreas };