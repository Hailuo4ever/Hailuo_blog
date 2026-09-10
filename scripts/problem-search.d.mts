import type { PagefindServiceConfig } from "pagefind";
export interface ProblemIdentity {
	platform: string;
	problemId: string;
	aliases: string;
}
export interface ProblemRecord extends Partial<ProblemIdentity> {
	sourceTitle: string;
	url: string;
	date: string;
	category: string;
	tags: string[];
	code: string;
	title: string;
	body: string;
	keywords: string;
}
export const articleGlob: string;
export const indexOptions: PagefindServiceConfig;
export function identifyProblem(raw: string): ProblemIdentity | null;
export function extractProblems(html: string): {
	records: ProblemRecord[];
	diagnostics: string[];
};
export function problemHTML(record: ProblemRecord): string;
