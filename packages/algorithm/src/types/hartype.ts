import { HarEntry } from "./index.js";

// Entries that appear to be API requests
export interface HarRestJson extends HarEntry {}
export interface HarRestXml extends HarEntry {}
export interface HarGraphQL extends HarEntry {}
export interface HarGrpcWeb extends HarEntry {}

export type HarAny = HarRestJson | HarRestXml | HarGraphQL | HarGrpcWeb
export type HarRestful = HarRestJson | HarRestXml
