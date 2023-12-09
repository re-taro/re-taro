import { fetchWakatimeStats, repeat, replaceString } from "./utils.ts";
import config from "./config.ts";
import type { WakatimeStats } from "./types.ts";

export default class Generate {
	wakatimeStats!: WakatimeStats["data"];
	placeholders!: Map<string, () => string>;

	async init() {
		this.wakatimeStats = await fetchWakatimeStats();

		this.placeholders = new Map([
			["languages_graph", this.parseLanguagesGraph],
			["music_activity", this.parseMusicActivity],
			["updated_at", this.updatedMessage],
		]);
	}

	fillTemplate(template: string) {
		try {
			for (const [key, fn] of this.placeholders) {
				template = replaceString(template, key, fn.bind(this)());
			}

			template = replaceString(template, "title", config.content.title);
			template = replaceString(
				template,
				"description",
				config.content.description,
			);

			return template;
		} catch (e) {
			console.error("[Generate] Error filling template:", e);
			return undefined;
		}
	}

	private parseMusicActivity() {
		return `
<a href="https://github.com/kiosion/toru">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="${config.endpoints.music}&theme=nord">
    <source media="(prefers-color-scheme: light)" srcset="${config.endpoints.music}&theme=light">
    <img alt="Last.fm Activity" src="${config.endpoints.music}" height="115" />
  </picture>
</a>`;
	}

	private parseLanguagesGraph() {
		const languages = this.wakatimeStats?.languages.filter((lang) => {
			return !config.languagesIgnore.includes(lang.name.toLowerCase());
		});

		if (!languages?.length) {
			console.error(
				"[Generate] No languages found for Wakatime languages graph",
			);
			return "";
		}

		const sortedLanguages = languages.sort((a, b) => {
			const aTime = a.total_seconds;
			const bTime = b.total_seconds;

			return aTime > bTime ? -1 : aTime < bTime ? 1 : 0;
		})?.slice(0, config.limits.languagesGraph);

		const lines = [] as string[];

		// Need to calculate the total time among all languages to calculate the percentages
		const totalGraphSeconds = sortedLanguages.reduce(
			(acc, lang) => acc + lang.total_seconds,
			0,
		);

		sortedLanguages.forEach((lang) => {
			const {
				name,
				total_seconds: totalSeconds,
				hours,
				minutes,
			} = lang;

			const percent = Math.round((totalSeconds / totalGraphSeconds) * 100);
			const scale = 24;
			const langName = name.length > 20 ? `${name.slice(0, 20)}...` : name;
			// Bar should account for scale
			const bar = `[${repeat("=", Math.round((percent / 100) * scale))}${
				repeat(" ", scale - Math.round((percent / 100) * scale))
			}]`;

			console.log("[Generate] Language graph item:", langName, percent);

			lines.push(
				`${langName}${
					repeat(" ", 20 - langName.length)
				}${bar} ${percent}% (${hours}h ${minutes}m)`,
			);
		});

		return lines.join("\n");
	}

	private updatedMessage() {
		const localeString = new Date().toLocaleString("en-CA", {
			dateStyle: "short",
			timeStyle: "short",
			hour12: false,
			timeZone: "America/Halifax",
		});

		return `_Updated ${localeString}_`;
	}
}
