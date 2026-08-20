// Config
import {setGlobalsConf} from "../../../node/vite/globalConf.js";
import {getInteractConfig} from "../../../node/config/interactConfig";
try {
    getInteractConfig()
} catch (e) {
    await setGlobalsConf()
}