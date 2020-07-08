import tile from "./tile-client";

const addSupervisor = async params => {
    if (!params.supervisorId || !params.targetId) {
        throw new Error("A supervisor id and target id must be provided");
    }

    const supervisor = await tile.jget("supervisor", params.supervisorId).catch(e => console.warn(e));
    if (!supervisor) throw new Error("This supervisor does not exist!");

    const target = await tile.jget("target", params.targetId).catch(e => console.warn(e));
    if (!target) throw new Error("This target does not exist!");

    let targetSupervisors = await tile.jget("targetSupervisor", params.targetId).catch(e => console.warn(e));
    if (!targetSupervisors) {
        targetSupervisors = [params.supervisorId]
    } else {
        targetSupervisors = JSON.parse(JSON.parse(targetSupervisors)["supervisors"]);
        targetSupervisors = [...new Set([...targetSupervisors, params.supervisorId])];
    }
    await tile.jset("targetSupervisor", params.targetId, `supervisors`, JSON.stringify(targetSupervisors));
};

const removeSupervisor = async params => {
    if (!params.targetId) {
        throw new Error("A target id must be provided");
    }

    const target = await tile.jget("target", params.targetId).catch(e => console.warn(e));
    if (!target) throw new Error("This target does not exist!");

    let targetSupervisors = await tile.jget("targetSupervisor", params.targetId).catch(e => console.warn(e));
    if (!targetSupervisors) return;

    targetSupervisors = JSON.parse(JSON.parse(targetSupervisors)["supervisors"]).filter(id => id !== params.supervisorId);
    await tile.jset("targetSupervisor", params.targetId, `supervisors`, JSON.stringify(targetSupervisors));
};

export {addSupervisor, removeSupervisor};
