import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Entry {
    id: string;
    url: string;
    featured: boolean;
    icon: string;
    name: string;
    description: string;
    category: Category;
}
export interface UserProfile {
    name: string;
}
export enum Category {
    audio = "audio",
    video = "video",
    productivity = "productivity",
    text = "text",
    image = "image"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addCategory(name: string): Promise<void>;
    addEntry(name: string, description: string, category: Category, icon: string, url: string, featured: boolean): Promise<string>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllEntries(): Promise<Array<Entry>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCategories(): Promise<Array<string>>;
    getEntriesByCategory(category: Category): Promise<Array<Entry>>;
    getEntry(id: string): Promise<Entry>;
    getFeaturedEntries(): Promise<Array<Entry>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    /**
     * / Checks if the caller is an admin (public).
     */
    isAdmin(): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    removeCategory(name: string): Promise<void>;
    removeEntry(id: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateEntry(id: string, name: string, description: string, category: Category, icon: string, url: string, featured: boolean): Promise<void>;
}
