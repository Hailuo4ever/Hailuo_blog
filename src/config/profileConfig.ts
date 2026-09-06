import type { ProfileConfig } from "../types/profileConfig";
export const profileConfig: ProfileConfig = {
	avatar: "assets/images/avatar.jpg",
	name: "Hailuo",
	bio: "Welcome to my world!!",
	links: [
		{
			name: "Luogu",
			icon: "material-symbols:code",
			url: "https://www.luogu.com.cn/user/1821990",
			showName: false,
		},
		{
			name: "Steam",
			icon: "fa7-brands:steam",
			url: "https://steamcommunity.com/id/Hailuomafumafu/",
			showName: false,
		},
		{
			name: "GitHub",
			icon: "fa7-brands:github",
			url: "https://github.com/Hailuo4ever",
			showName: false,
		},
	],
};
