// Config
import {setGlobalsConf} from "../../../node/vite/globalConf.ts";
import {getInteractConfig} from "../../../node/config/interactConfig.ts";

try {
    getInteractConfig()
} catch {
    await setGlobalsConf()
}