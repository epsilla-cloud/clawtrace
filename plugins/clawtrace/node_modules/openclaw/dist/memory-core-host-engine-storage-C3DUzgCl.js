import { t as installProcessWarningFilter } from "./warning-filter-8uCsDS6w.js";
import "./internal-Bnt1j4hp.js";
import "./backend-config-Bw8hjn_C.js";
import { createRequire } from "node:module";
//#region packages/memory-host-sdk/src/host/memory-schema.ts
function ensureMemoryIndexSchema(params) {
	params.db.exec(`
    CREATE TABLE IF NOT EXISTS meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);
	params.db.exec(`
    CREATE TABLE IF NOT EXISTS files (
      path TEXT PRIMARY KEY,
      source TEXT NOT NULL DEFAULT 'memory',
      hash TEXT NOT NULL,
      mtime INTEGER NOT NULL,
      size INTEGER NOT NULL
    );
  `);
	params.db.exec(`
    CREATE TABLE IF NOT EXISTS chunks (
      id TEXT PRIMARY KEY,
      path TEXT NOT NULL,
      source TEXT NOT NULL DEFAULT 'memory',
      start_line INTEGER NOT NULL,
      end_line INTEGER NOT NULL,
      hash TEXT NOT NULL,
      model TEXT NOT NULL,
      text TEXT NOT NULL,
      embedding TEXT NOT NULL,
      updated_at INTEGER NOT NULL
    );
  `);
	if (params.cacheEnabled) {
		params.db.exec(`
      CREATE TABLE IF NOT EXISTS ${params.embeddingCacheTable} (
        provider TEXT NOT NULL,
        model TEXT NOT NULL,
        provider_key TEXT NOT NULL,
        hash TEXT NOT NULL,
        embedding TEXT NOT NULL,
        dims INTEGER,
        updated_at INTEGER NOT NULL,
        PRIMARY KEY (provider, model, provider_key, hash)
      );
    `);
		params.db.exec(`CREATE INDEX IF NOT EXISTS idx_embedding_cache_updated_at ON ${params.embeddingCacheTable}(updated_at);`);
	}
	let ftsAvailable = false;
	let ftsError;
	if (params.ftsEnabled) try {
		params.db.exec(`CREATE VIRTUAL TABLE IF NOT EXISTS ${params.ftsTable} USING fts5(\n  text,\n  id UNINDEXED,\n  path UNINDEXED,\n  source UNINDEXED,\n  model UNINDEXED,\n  start_line UNINDEXED,\n  end_line UNINDEXED\n);`);
		ftsAvailable = true;
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		ftsAvailable = false;
		ftsError = message;
	}
	ensureColumn(params.db, "files", "source", "TEXT NOT NULL DEFAULT 'memory'");
	ensureColumn(params.db, "chunks", "source", "TEXT NOT NULL DEFAULT 'memory'");
	params.db.exec(`CREATE INDEX IF NOT EXISTS idx_chunks_path ON chunks(path);`);
	params.db.exec(`CREATE INDEX IF NOT EXISTS idx_chunks_source ON chunks(source);`);
	return {
		ftsAvailable,
		...ftsError ? { ftsError } : {}
	};
}
function ensureColumn(db, table, column, definition) {
	if (db.prepare(`PRAGMA table_info(${table})`).all().some((row) => row.name === column)) return;
	db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
}
//#endregion
//#region packages/memory-host-sdk/src/host/sqlite-vec.ts
async function loadSqliteVecExtension(params) {
	try {
		const sqliteVec = await import("sqlite-vec");
		const resolvedPath = params.extensionPath?.trim() ? params.extensionPath.trim() : void 0;
		const extensionPath = resolvedPath ?? sqliteVec.getLoadablePath();
		params.db.enableLoadExtension(true);
		if (resolvedPath) params.db.loadExtension(extensionPath);
		else sqliteVec.load(params.db);
		return {
			ok: true,
			extensionPath
		};
	} catch (err) {
		return {
			ok: false,
			error: err instanceof Error ? err.message : String(err)
		};
	}
}
//#endregion
//#region packages/memory-host-sdk/src/host/sqlite.ts
const require = createRequire(import.meta.url);
function requireNodeSqlite() {
	installProcessWarningFilter();
	try {
		return require("node:sqlite");
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		throw new Error(`SQLite support is unavailable in this Node runtime (missing node:sqlite). ${message}`, { cause: err });
	}
}
//#endregion
export { loadSqliteVecExtension as n, ensureMemoryIndexSchema as r, requireNodeSqlite as t };
