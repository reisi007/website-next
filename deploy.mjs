import {config} from 'dotenv-flow'
import {deploy, excludeDefaults} from "@samkirkland/ftp-deploy";

config()
const env = process.env;

const host = env["ftp_host"];
const user = env["ftp_user"]
const password = env["ftp_password"]

console.log("🚚 Deploy started");
await deploy({
    server: host,
    username: user,
    password: password,
    protocol: "ftps",
    "local-dir": "out/",
    "server-dir": "/reisinger.pictures/",
    exclude: [...excludeDefaults, "images/**/*.jpg", "images/**/*.jpeg", "images/**/*.json", "**/.gitignore"]
});
console.log("🚀 Deploy done!");
