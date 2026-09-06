import type { BackgroundWallpaperConfig } from "../types/backgroundWallpaper";

export const backgroundWallpaper: BackgroundWallpaperConfig = {
	mode: "banner",
	playerEnable: false,
	src: {
		desktop: "assets/images/banner.jpeg",
		mobile: "assets/images/banner.jpeg",
		playerUrl: "",
	},
	common: {
		dimOpacity: 0.2,
		playerMode: "random",
		homeText: {
			enable: true,
			title: "Hailuo4ever",
			titleSize: "4.5rem",
			subtitle: ["Welcome to my world!!"],
			subtitleSize: "1.5rem",
			typewriter: {
				enable: false,
				speed: 100,
				deleteSpeed: 50,
				pauseTime: 2000,
			},
			linksEnable: false,
			links: [],
		},
		carousel: {
			enable: false,
			interval: 5000,
			transitionEffect: "zoom",
		},
		waves: {
			enable: {
				desktop: false,
				mobile: false,
			},
		},
		gradient: {
			enable: {
				desktop: true,
				mobile: true,
			},
			height: "10%",
		},
	},
	banner: {
		position: "top",
		postInfo: {
			mode: "description",
		},
		navbar: {
			transparentMode: "semi",
			blur: 12,
		},
	},
	overlay: {
		zIndex: -1,
		opacity: 0.8,
		blur: 10,
		cardOpacity: 0.6,
	},
	fullscreen: {
		layout: "classic",
		position: "center",
		navbar: {
			transparentMode: "semifull",
			blur: 12,
		},
		blurRamp: {
			enable: {
				desktop: true,
				mobile: true,
			},
		},
	},
};
