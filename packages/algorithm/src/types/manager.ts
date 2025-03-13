import { ValidHar } from "../har-to-hartype/index.js";
import { HarAny } from "./hartype.js";

export abstract class Manager<D, G> {
  abstract data: D;

  /** Create or update a representation */
  abstract upsert(data: HarAny | ValidHar): void;

  /** Generate an API contract for an optional list of host */
  abstract generate(host?: string[]): G;

  /** Get a list of names that identify APIs (in practice, hosts) */
  abstract getNames(): string[];

  /** Reset to initial state */
  abstract reset(): void;

  /** Serialise to a string, return true if successful */
  abstract serialise(): string | null;

  /** Deserialise into the original object, return true if successful */
  abstract deserialise(input: string): boolean;

  /** Delete a name from the internal representation (the name of a host) */
  abstract deleteName(name: string): boolean;
}
