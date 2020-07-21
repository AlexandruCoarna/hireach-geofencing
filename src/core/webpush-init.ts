import webpush from "web-push";
import config from "../config";

const webpushInit = () => {
    if (!config.webPush.privateKey || !config.webPush.publicKey || !config.webPush.mailTo) {
        return;
    }

    webpush.setVapidDetails(config.webPush.mailTo, config.webPush.publicKey, config.webPush.privateKey);
};

export default webpushInit;
