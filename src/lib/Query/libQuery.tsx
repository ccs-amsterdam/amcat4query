import { AmcatQueryTerms } from "../interfaces";

function format_queries_object(queries: {[label: string]: string}) {
   return Object.keys(queries).map((l) => `${l}: ${queries[l]}`);
}

export function queryToString(q?: AmcatQueryTerms, joinby = "\n"): string {
    if (!q) return "";
    const queries = Array.isArray(q)?q:format_queries_object(q);
    return queries.join(joinby);
}

const trim = (s: string) => s.trim();

function queryEntryfromString(q: string): string[] {
    if (q.match(/[:#]/)) return q.split(/[:#]/).map(trim)
    else return [q.trim(),q.trim()];
}

function queryObjectFromStrings(queries: string[]): {[label: string]: string} {
    return Object.fromEntries(queries.map(queryEntryfromString));
}

export function queryFromString(q: string): AmcatQueryTerms {
    if (!q?.trim()) return undefined;
    const queries = q.split(/[\n;]/);
    return q.match(/[:#]/)?queryObjectFromStrings(queries):queries.map(trim);
}

