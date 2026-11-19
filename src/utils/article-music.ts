function formatTime(seconds: number): string {
	const whole = Math.floor(seconds);
	return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
}

class ArticleMusic extends HTMLElement {
	private listeners?: AbortController;

	connectedCallback() {
		const audio = this.querySelector("audio");
		const toggle = this.querySelector<HTMLButtonElement>(".track-toggle");
		const timeline = this.querySelector<HTMLElement>(".track-timeline");
		const seek = timeline?.querySelector("input");
		const time = timeline?.querySelector(".track-time");
		const status = this.querySelector(".track-status");
		if (!audio || !toggle || !timeline || !seek || !time || !status) return;

		this.listeners = new AbortController();
		const { signal } = this.listeners;
		const title = audio.getAttribute("aria-label");
		const syncPlayback = () => {
			const playing = !audio.paused && !audio.ended;
			toggle.toggleAttribute("data-playing", playing);
			toggle.setAttribute(
				"aria-label",
				`${playing ? "暂停" : "播放"} ${title}`,
			);
		};
		const syncTime = () => {
			const duration = audio.duration;
			const known = Number.isFinite(duration) && duration > 0;
			const elapsed = formatTime(audio.currentTime);
			const total = known ? formatTime(duration) : "–:––";
			seek.disabled = !known;
			seek.max = known ? String(duration) : "0";
			seek.value = String(audio.currentTime);
			seek.style.setProperty(
				"--progress",
				known ? `${(100 * audio.currentTime) / duration}%` : "0%",
			);
			seek.setAttribute("aria-valuetext", `${elapsed} / ${total}`);
			time.textContent = `${elapsed} / ${total}`;
		};
		const showError = () => {
			audio.pause();
			status.textContent = "音频暂时无法播放，点击重试";
			syncPlayback();
		};
		toggle.addEventListener(
			"click",
			async () => {
				if (!audio.paused) {
					audio.pause();
					return;
				}
				if (status.textContent) audio.load();
				status.textContent = "";
				try {
					await audio.play();
				} catch (error) {
					if (
						!signal.aborted &&
						!(error instanceof DOMException && error.name === "AbortError")
					)
						showError();
				}
			},
			{ signal },
		);
		seek.addEventListener(
			"input",
			() => {
				audio.currentTime = seek.valueAsNumber;
				syncTime();
			},
			{ signal },
		);
		audio.addEventListener(
			"play",
			() => {
				if (audio.paused) return;
				for (const other of document.querySelectorAll<HTMLAudioElement>(
					"article-music audio",
				)) {
					if (other !== audio && !other.paused) other.pause();
				}
				status.textContent = "";
				syncPlayback();
			},
			{ signal },
		);
		for (const event of ["pause", "ended"])
			audio.addEventListener(event, syncPlayback, { signal });
		for (const event of ["timeupdate", "durationchange", "emptied"])
			audio.addEventListener(event, syncTime, { signal });
		audio.addEventListener("error", showError, { signal });
		// With <source> children, browsers can report exhaustion on the last source alone.
		audio
			.querySelector("source:last-of-type")
			?.addEventListener("error", showError, { signal });

		const cover = toggle.querySelector("img");
		if (cover) {
			cover.addEventListener(
				"error",
				() => {
					cover.hidden = true;
				},
				{ signal },
			);
			cover.hidden = cover.complete && !cover.naturalWidth;
		}
		syncTime();
		syncPlayback();
		audio.controls = false;
		audio.hidden = true;
		toggle.hidden = timeline.hidden = false;
	}

	disconnectedCallback() {
		this.listeners?.abort();
		this.querySelector("audio")?.pause();
	}
}

if (!customElements.get("article-music"))
	customElements.define("article-music", ArticleMusic);
