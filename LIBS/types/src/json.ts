// Json to not conflict with JSON
export type JsonPrimitive = boolean | number | string | null;

export type JsonArray = Json[];

export type JsonObject = { [k in string]: Json };

export type Json = JsonPrimitive | JsonArray | JsonObject;
