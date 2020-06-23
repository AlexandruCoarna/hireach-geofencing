import tile from "./tile-client";

const addSupervisor = async params => {
    const supervisor = await tile.jget("supervisor", params.supervisorId).catch(e => console.warn(e));
    if (!supervisor) throw new Error("This supervisor does not exist!");
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
    let targetSupervisors = await tile.jget("targetSupervisor", params.targetId).catch(e => console.warn(e));
    if (!targetSupervisors) throw new Error("This target doesn't have supervisors");
    targetSupervisors = JSON.parse(JSON.parse(targetSupervisors)["supervisors"]).filter(id => id !== params.supervisorId);
    await tile.jset("targetSupervisor", params.targetId, `supervisors`, JSON.stringify(targetSupervisors));
};

export { addSupervisor, removeSupervisor };