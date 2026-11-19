import { passwordGate } from "../edge/password-gate.js";

export function onRequest({ request, env, next }) {
	return passwordGate(request, env, next);
}
