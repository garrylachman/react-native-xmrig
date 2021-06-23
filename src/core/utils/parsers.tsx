import { IMinerLog } from "../session-data/session-data.interface";

export const parseLogLineRegex = /^\[[0-9-]+\s([0-9]+\:[0-9]+\:[0-9]+).*\]\s+([a-z]+)\s+(.*)$/mi;
export const parseLogLine = (line:string):IMinerLog => {
    let m;
    if ((m = parseLogLineRegex.exec(line)) !== null) {
        // The result can be accessed through the `m`-variable.
        if (m.length > 0)   {
            return {
                ts: m[1],
                module: m[2],
                message: m[3]
            }
        }
    }
    return {
        message: line
    }
}