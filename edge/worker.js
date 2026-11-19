import { passwordGate } from "./password-gate.js";

export default {
	fetch(request, env) {
		return passwordGate(request, env, () => env.ASSETS.fetch(request));
	},
};
