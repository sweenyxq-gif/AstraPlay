import { createAddon } from "../../packages/addon-sdk/src";
import manifest from "./manifest.json";
const addon = createAddon(manifest);
addon.registerStream(async () => [{ name: "Authorized sample", quality: "1080p", type: "hls" }]);
export default addon;
