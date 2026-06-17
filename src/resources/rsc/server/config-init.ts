// Config
import {setGlobalsConf} from "../../../interact/vite/globalConf.js";
import {getInteractConfig} from "../../../interact/config/interactConfig";
try {
    getInteractConfig()
} catch (e) {
    await setGlobalsConf()
}