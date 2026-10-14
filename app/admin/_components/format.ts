// Shared by server pages and client components, so it must not live in a "use client" file.
const zone = "Asia/Kathmandu";
export const shortDate = (iso: string) => iso ? new Date(iso).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric", timeZone: zone }) : "";
export const dateTime = (iso: string) => new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", timeZone: zone });
export const initials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "?";
