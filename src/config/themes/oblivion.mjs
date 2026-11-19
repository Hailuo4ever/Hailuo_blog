// Tango palette from https://gitlab.gnome.org/GNOME/gtksourceview/-/blob/master/data/styles/oblivion.xml
export default {
	name: "oblivion",
	type: "dark",
	colors: {
		"editor.background": "#2e3436",
		"editor.foreground": "#d3d7cf",
		"editor.selectionBackground": "#888a854d",
	},
	tokenColors: [
		{
			scope: ["keyword", "storage", "variable.language"],
			settings: { foreground: "#ffffff", fontStyle: "bold italic" },
		},
		{
			scope: ["keyword.operator", "storage.type.function.arrow"],
			settings: { foreground: "#d3d7cf", fontStyle: "" },
		},
		{
			scope: [
				"keyword.operator.word",
				"keyword.operator.new",
				"keyword.operator.delete",
				"keyword.operator.sizeof",
				"keyword.operator.logical.python",
				"keyword.operator.expression.instanceof",
				"keyword.operator.expression.typeof",
			],
			settings: { foreground: "#ffffff", fontStyle: "bold italic" },
		},
		{
			scope: [
				"storage.type",
				"support.type",
				"support.class",
				"entity.name.type",
				"entity.name.class",
			],
			settings: { foreground: "#8ae234", fontStyle: "bold italic" },
		},
		{
			scope: ["entity.name.function", "support.function", "entity.name.tag"],
			settings: { foreground: "#729fcf" },
		},
		{
			scope: ["constant", "string"],
			settings: { foreground: "#edd400" },
		},
		{
			scope: [
				"constant.character.escape",
				"constant.language",
				"constant.numeric.float",
			],
			settings: { foreground: "#f57900" },
		},
		{
			scope: ["meta.preprocessor", "keyword.control.directive"],
			settings: { foreground: "#ad7fa8" },
		},
		{
			scope: "comment",
			settings: { foreground: "#888a85" },
		},
	],
};
