import { t as expandHomePrefix } from "./home-dir-BnP38vVl.js";
import { a as hasNodeErrorCode, c as isSymlinkOpenError, o as isNotFoundPathError, s as isPathInside } from "./boundary-path-Ci-Gk9P9.js";
import { t as sameFileIdentity } from "./file-identity-DeV9Olqn.js";
import { a as logWarn } from "./logger-Bps9nlrB.js";
import { n as assertNoPathAliasEscape } from "./path-alias-guards-DsfjsZ3X.js";
import fsSync, { constants } from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import os from "node:os";
import fs from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { pipeline } from "node:stream/promises";
import { once } from "node:events";
//#region src/infra/fs-pinned-write-helper.ts
const LOCAL_PINNED_WRITE_PYTHON = [
	"import errno",
	"import os",
	"import secrets",
	"import stat",
	"import sys",
	"",
	"root_path = sys.argv[1]",
	"relative_parent = sys.argv[2]",
	"basename = sys.argv[3]",
	"mkdir_enabled = sys.argv[4] == \"1\"",
	"file_mode = int(sys.argv[5], 8)",
	"",
	"DIR_FLAGS = os.O_RDONLY",
	"if hasattr(os, 'O_DIRECTORY'):",
	"    DIR_FLAGS |= os.O_DIRECTORY",
	"if hasattr(os, 'O_NOFOLLOW'):",
	"    DIR_FLAGS |= os.O_NOFOLLOW",
	"",
	"WRITE_FLAGS = os.O_WRONLY | os.O_CREAT | os.O_EXCL",
	"if hasattr(os, 'O_NOFOLLOW'):",
	"    WRITE_FLAGS |= os.O_NOFOLLOW",
	"",
	"def open_dir(path_value, dir_fd=None):",
	"    return os.open(path_value, DIR_FLAGS, dir_fd=dir_fd)",
	"",
	"def walk_parent(root_fd, rel_parent, mkdir_enabled):",
	"    current_fd = os.dup(root_fd)",
	"    try:",
	"        for segment in [part for part in rel_parent.split('/') if part and part != '.']:",
	"            if segment == '..':",
	"                raise OSError(errno.EPERM, 'path traversal is not allowed', segment)",
	"            try:",
	"                next_fd = open_dir(segment, dir_fd=current_fd)",
	"            except FileNotFoundError:",
	"                if not mkdir_enabled:",
	"                    raise",
	"                os.mkdir(segment, 0o777, dir_fd=current_fd)",
	"                next_fd = open_dir(segment, dir_fd=current_fd)",
	"            os.close(current_fd)",
	"            current_fd = next_fd",
	"        return current_fd",
	"    except Exception:",
	"        os.close(current_fd)",
	"        raise",
	"",
	"def create_temp_file(parent_fd, basename, mode):",
	"    prefix = '.' + basename + '.'",
	"    for _ in range(128):",
	"        candidate = prefix + secrets.token_hex(6) + '.tmp'",
	"        try:",
	"            fd = os.open(candidate, WRITE_FLAGS, mode, dir_fd=parent_fd)",
	"            return candidate, fd",
	"        except FileExistsError:",
	"            continue",
	"    raise RuntimeError('failed to allocate pinned temp file')",
	"",
	"root_fd = open_dir(root_path)",
	"parent_fd = None",
	"temp_fd = None",
	"temp_name = None",
	"try:",
	"    parent_fd = walk_parent(root_fd, relative_parent, mkdir_enabled)",
	"    temp_name, temp_fd = create_temp_file(parent_fd, basename, file_mode)",
	"    while True:",
	"        chunk = sys.stdin.buffer.read(65536)",
	"        if not chunk:",
	"            break",
	"        os.write(temp_fd, chunk)",
	"    os.fsync(temp_fd)",
	"    os.close(temp_fd)",
	"    temp_fd = None",
	"    os.replace(temp_name, basename, src_dir_fd=parent_fd, dst_dir_fd=parent_fd)",
	"    temp_name = None",
	"    os.fsync(parent_fd)",
	"    result_stat = os.stat(basename, dir_fd=parent_fd, follow_symlinks=False)",
	"    print(f'{result_stat.st_dev}|{result_stat.st_ino}')",
	"finally:",
	"    if temp_fd is not None:",
	"        os.close(temp_fd)",
	"    if temp_name is not None and parent_fd is not None:",
	"        try:",
	"            os.unlink(temp_name, dir_fd=parent_fd)",
	"        except FileNotFoundError:",
	"            pass",
	"    if parent_fd is not None:",
	"        os.close(parent_fd)",
	"    os.close(root_fd)"
].join("\n");
const PINNED_WRITE_PYTHON_CANDIDATES = [
	process.env.OPENCLAW_PINNED_WRITE_PYTHON,
	"/usr/bin/python3",
	"/opt/homebrew/bin/python3",
	"/usr/local/bin/python3"
].filter((value) => Boolean(value));
let cachedPinnedWritePython = "";
function canExecute(binPath) {
	try {
		fsSync.accessSync(binPath, fsSync.constants.X_OK);
		return true;
	} catch {
		return false;
	}
}
function resolvePinnedWritePython() {
	if (cachedPinnedWritePython) return cachedPinnedWritePython;
	for (const candidate of PINNED_WRITE_PYTHON_CANDIDATES) if (canExecute(candidate)) {
		cachedPinnedWritePython = candidate;
		return cachedPinnedWritePython;
	}
	cachedPinnedWritePython = "python3";
	return cachedPinnedWritePython;
}
function parsePinnedIdentity(stdout) {
	const line = stdout.trim().split(/\r?\n/).map((value) => value.trim()).filter(Boolean).at(-1);
	if (!line) throw new Error("Pinned write helper returned no identity");
	const [devRaw, inoRaw] = line.split("|");
	const dev = Number.parseInt(devRaw ?? "", 10);
	const ino = Number.parseInt(inoRaw ?? "", 10);
	if (!Number.isFinite(dev) || !Number.isFinite(ino)) throw new Error(`Pinned write helper returned invalid identity: ${line}`);
	return {
		dev,
		ino
	};
}
async function runPinnedWriteHelper(params) {
	const child = spawn(resolvePinnedWritePython(), [
		"-c",
		LOCAL_PINNED_WRITE_PYTHON,
		params.rootPath,
		params.relativeParentPath,
		params.basename,
		params.mkdir ? "1" : "0",
		(params.mode || 384).toString(8)
	], { stdio: [
		"pipe",
		"pipe",
		"pipe"
	] });
	let stdout = "";
	let stderr = "";
	child.stdout.setEncoding?.("utf8");
	child.stderr.setEncoding?.("utf8");
	child.stdout.on("data", (chunk) => {
		stdout += chunk;
	});
	child.stderr.on("data", (chunk) => {
		stderr += chunk;
	});
	const exitPromise = once(child, "close");
	try {
		if (!child.stdin) {
			const identity = await runPinnedWriteFallback(params);
			await exitPromise.catch(() => {});
			return identity;
		}
		if (params.input.kind === "buffer") {
			const input = params.input;
			await new Promise((resolve, reject) => {
				child.stdin.once("error", reject);
				if (typeof input.data === "string") {
					child.stdin.end(input.data, input.encoding ?? "utf8", () => resolve());
					return;
				}
				child.stdin.end(input.data, () => resolve());
			});
		} else await pipeline(params.input.stream, child.stdin);
		const [code, signal] = await exitPromise;
		if (code !== 0) throw new Error(stderr.trim() || `Pinned write helper failed with code ${code ?? "null"} (${signal ?? "?"})`);
		return parsePinnedIdentity(stdout);
	} catch (error) {
		child.kill("SIGKILL");
		await exitPromise.catch(() => {});
		throw error;
	}
}
async function runPinnedWriteFallback(params) {
	const parentPath = params.relativeParentPath ? path.join(params.rootPath, ...params.relativeParentPath.split("/")) : params.rootPath;
	if (params.mkdir) await fs.mkdir(parentPath, { recursive: true });
	const targetPath = path.join(parentPath, params.basename);
	const tempPath = path.join(parentPath, `.${params.basename}.fallback.tmp`);
	if (params.input.kind === "buffer") if (typeof params.input.data === "string") await fs.writeFile(tempPath, params.input.data, {
		encoding: params.input.encoding ?? "utf8",
		mode: params.mode
	});
	else await fs.writeFile(tempPath, params.input.data, { mode: params.mode });
	else {
		const handle = await fs.open(tempPath, "w", params.mode);
		try {
			await pipeline(params.input.stream, handle.createWriteStream());
		} finally {
			await handle.close().catch(() => {});
		}
	}
	await fs.rename(tempPath, targetPath);
	const stat = await fs.stat(targetPath);
	return {
		dev: stat.dev,
		ino: stat.ino
	};
}
//#endregion
//#region src/infra/fs-safe.ts
var SafeOpenError = class extends Error {
	constructor(code, message, options) {
		super(message, options);
		this.code = code;
		this.name = "SafeOpenError";
	}
};
const SUPPORTS_NOFOLLOW = process.platform !== "win32" && "O_NOFOLLOW" in constants;
const OPEN_READ_FLAGS = constants.O_RDONLY | (SUPPORTS_NOFOLLOW ? constants.O_NOFOLLOW : 0);
const OPEN_WRITE_EXISTING_FLAGS = constants.O_WRONLY | (SUPPORTS_NOFOLLOW ? constants.O_NOFOLLOW : 0);
const OPEN_WRITE_CREATE_FLAGS = constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | (SUPPORTS_NOFOLLOW ? constants.O_NOFOLLOW : 0);
const OPEN_APPEND_EXISTING_FLAGS = constants.O_RDWR | constants.O_APPEND | (SUPPORTS_NOFOLLOW ? constants.O_NOFOLLOW : 0);
const OPEN_APPEND_CREATE_FLAGS = constants.O_RDWR | constants.O_APPEND | constants.O_CREAT | constants.O_EXCL | (SUPPORTS_NOFOLLOW ? constants.O_NOFOLLOW : 0);
const ensureTrailingSep = (value) => value.endsWith(path.sep) ? value : value + path.sep;
async function expandRelativePathWithHome(relativePath) {
	let home = process.env.HOME || process.env.USERPROFILE || os.homedir();
	try {
		home = await fs.realpath(home);
	} catch {}
	return expandHomePrefix(relativePath, { home });
}
async function openVerifiedLocalFile(filePath, options) {
	try {
		if ((await fs.lstat(filePath)).isDirectory()) throw new SafeOpenError("not-file", "not a file");
	} catch (err) {
		if (err instanceof SafeOpenError) throw err;
	}
	let handle;
	try {
		handle = await fs.open(filePath, OPEN_READ_FLAGS);
	} catch (err) {
		if (isNotFoundPathError(err)) throw new SafeOpenError("not-found", "file not found");
		if (isSymlinkOpenError(err)) throw new SafeOpenError("symlink", "symlink open blocked", { cause: err });
		if (hasNodeErrorCode(err, "EISDIR")) throw new SafeOpenError("not-file", "not a file");
		throw err;
	}
	try {
		const [stat, lstat] = await Promise.all([handle.stat(), fs.lstat(filePath)]);
		if (lstat.isSymbolicLink()) throw new SafeOpenError("symlink", "symlink not allowed");
		if (!stat.isFile()) throw new SafeOpenError("not-file", "not a file");
		if (options?.rejectHardlinks && stat.nlink > 1) throw new SafeOpenError("invalid-path", "hardlinked path not allowed");
		if (!sameFileIdentity(stat, lstat)) throw new SafeOpenError("path-mismatch", "path changed during read");
		const realPath = await fs.realpath(filePath);
		const realStat = await fs.stat(realPath);
		if (options?.rejectHardlinks && realStat.nlink > 1) throw new SafeOpenError("invalid-path", "hardlinked path not allowed");
		if (!sameFileIdentity(stat, realStat)) throw new SafeOpenError("path-mismatch", "path mismatch");
		return {
			handle,
			realPath,
			stat
		};
	} catch (err) {
		await handle.close().catch(() => {});
		if (err instanceof SafeOpenError) throw err;
		if (isNotFoundPathError(err)) throw new SafeOpenError("not-found", "file not found");
		throw err;
	}
}
async function resolvePathWithinRoot(params) {
	let rootReal;
	try {
		rootReal = await fs.realpath(params.rootDir);
	} catch (err) {
		if (isNotFoundPathError(err)) throw new SafeOpenError("not-found", "root dir not found");
		throw err;
	}
	const rootWithSep = ensureTrailingSep(rootReal);
	const expanded = await expandRelativePathWithHome(params.relativePath);
	const resolved = path.resolve(rootWithSep, expanded);
	if (!isPathInside(rootWithSep, resolved)) throw new SafeOpenError("outside-workspace", "file is outside workspace root");
	return {
		rootReal,
		rootWithSep,
		resolved
	};
}
async function openFileWithinRoot(params) {
	const { rootWithSep, resolved } = await resolvePathWithinRoot(params);
	let opened;
	try {
		opened = await openVerifiedLocalFile(resolved);
	} catch (err) {
		if (err instanceof SafeOpenError) {
			if (err.code === "not-found") throw err;
			throw new SafeOpenError("invalid-path", "path is not a regular file under root", { cause: err });
		}
		throw err;
	}
	if (params.rejectHardlinks !== false && opened.stat.nlink > 1) {
		await opened.handle.close().catch(() => {});
		throw new SafeOpenError("invalid-path", "hardlinked path not allowed");
	}
	if (!isPathInside(rootWithSep, opened.realPath)) {
		await opened.handle.close().catch(() => {});
		throw new SafeOpenError("outside-workspace", "file is outside workspace root");
	}
	return opened;
}
async function readFileWithinRoot(params) {
	const opened = await openFileWithinRoot({
		rootDir: params.rootDir,
		relativePath: params.relativePath,
		rejectHardlinks: params.rejectHardlinks
	});
	try {
		return await readOpenedFileSafely({
			opened,
			maxBytes: params.maxBytes
		});
	} finally {
		await opened.handle.close().catch(() => {});
	}
}
async function readPathWithinRoot(params) {
	const rootDir = path.resolve(params.rootDir);
	const candidatePath = path.isAbsolute(params.filePath) ? path.resolve(params.filePath) : path.resolve(rootDir, params.filePath);
	return await readFileWithinRoot({
		rootDir,
		relativePath: path.relative(rootDir, candidatePath),
		rejectHardlinks: params.rejectHardlinks,
		maxBytes: params.maxBytes
	});
}
function createRootScopedReadFile(params) {
	const rootDir = path.resolve(params.rootDir);
	return async (filePath) => {
		return (await readPathWithinRoot({
			rootDir,
			filePath,
			rejectHardlinks: params.rejectHardlinks,
			maxBytes: params.maxBytes
		})).buffer;
	};
}
async function readLocalFileSafely(params) {
	const opened = await openVerifiedLocalFile(params.filePath);
	try {
		return await readOpenedFileSafely({
			opened,
			maxBytes: params.maxBytes
		});
	} finally {
		await opened.handle.close().catch(() => {});
	}
}
async function readOpenedFileSafely(params) {
	if (params.maxBytes !== void 0 && params.opened.stat.size > params.maxBytes) throw new SafeOpenError("too-large", `file exceeds limit of ${params.maxBytes} bytes (got ${params.opened.stat.size})`);
	return {
		buffer: await params.opened.handle.readFile(),
		realPath: params.opened.realPath,
		stat: params.opened.stat
	};
}
function emitWriteBoundaryWarning(reason) {
	logWarn(`security: fs-safe write boundary warning (${reason})`);
}
function buildAtomicWriteTempPath(targetPath) {
	const dir = path.dirname(targetPath);
	const base = path.basename(targetPath);
	return path.join(dir, `.${base}.${process.pid}.${randomUUID()}.tmp`);
}
async function writeTempFileForAtomicReplace(params) {
	const tempHandle = await fs.open(params.tempPath, OPEN_WRITE_CREATE_FLAGS, params.mode);
	try {
		if (typeof params.data === "string") await tempHandle.writeFile(params.data, params.encoding ?? "utf8");
		else await tempHandle.writeFile(params.data);
		return await tempHandle.stat();
	} finally {
		await tempHandle.close().catch(() => {});
	}
}
async function verifyAtomicWriteResult(params) {
	const rootWithSep = ensureTrailingSep(await fs.realpath(params.rootDir));
	const opened = await openVerifiedLocalFile(params.targetPath, { rejectHardlinks: true });
	try {
		if (!sameFileIdentity(opened.stat, params.expectedIdentity)) throw new SafeOpenError("path-mismatch", "path changed during write");
		if (!isPathInside(rootWithSep, opened.realPath)) throw new SafeOpenError("outside-workspace", "file is outside workspace root");
	} finally {
		await opened.handle.close().catch(() => {});
	}
}
async function resolveOpenedFileRealPathForHandle(handle, ioPath) {
	try {
		return await fs.realpath(ioPath);
	} catch (err) {
		if (!isNotFoundPathError(err)) throw err;
	}
	const fdCandidates = process.platform === "linux" ? [`/proc/self/fd/${handle.fd}`, `/dev/fd/${handle.fd}`] : process.platform === "win32" ? [] : [`/dev/fd/${handle.fd}`];
	for (const fdPath of fdCandidates) try {
		return await fs.realpath(fdPath);
	} catch {}
	throw new SafeOpenError("path-mismatch", "unable to resolve opened file path");
}
async function openWritableFileWithinRoot(params) {
	const { rootReal, rootWithSep, resolved } = await resolvePathWithinRoot(params);
	try {
		await assertNoPathAliasEscape({
			absolutePath: resolved,
			rootPath: rootReal,
			boundaryLabel: "root"
		});
	} catch (err) {
		throw new SafeOpenError("invalid-path", "path alias escape blocked", { cause: err });
	}
	if (params.mkdir !== false) await fs.mkdir(path.dirname(resolved), { recursive: true });
	let ioPath = resolved;
	try {
		const resolvedRealPath = await fs.realpath(resolved);
		if (!isPathInside(rootWithSep, resolvedRealPath)) throw new SafeOpenError("outside-workspace", "file is outside workspace root");
		ioPath = resolvedRealPath;
	} catch (err) {
		if (err instanceof SafeOpenError) throw err;
		if (!isNotFoundPathError(err)) throw err;
	}
	const fileMode = params.mode ?? 384;
	let handle;
	let createdForWrite = false;
	const existingFlags = params.append ? OPEN_APPEND_EXISTING_FLAGS : OPEN_WRITE_EXISTING_FLAGS;
	const createFlags = params.append ? OPEN_APPEND_CREATE_FLAGS : OPEN_WRITE_CREATE_FLAGS;
	try {
		try {
			handle = await fs.open(ioPath, existingFlags, fileMode);
		} catch (err) {
			if (!isNotFoundPathError(err)) throw err;
			handle = await fs.open(ioPath, createFlags, fileMode);
			createdForWrite = true;
		}
	} catch (err) {
		if (isNotFoundPathError(err)) throw new SafeOpenError("not-found", "file not found");
		if (isSymlinkOpenError(err)) throw new SafeOpenError("invalid-path", "symlink open blocked", { cause: err });
		throw err;
	}
	let openedRealPath = null;
	try {
		const stat = await handle.stat();
		if (!stat.isFile()) throw new SafeOpenError("invalid-path", "path is not a regular file under root");
		if (stat.nlink > 1) throw new SafeOpenError("invalid-path", "hardlinked path not allowed");
		try {
			const lstat = await fs.lstat(ioPath);
			if (lstat.isSymbolicLink() || !lstat.isFile()) throw new SafeOpenError("invalid-path", "path is not a regular file under root");
			if (!sameFileIdentity(stat, lstat)) throw new SafeOpenError("path-mismatch", "path changed during write");
		} catch (err) {
			if (!isNotFoundPathError(err)) throw err;
		}
		const realPath = await resolveOpenedFileRealPathForHandle(handle, ioPath);
		openedRealPath = realPath;
		const realStat = await fs.stat(realPath);
		if (!sameFileIdentity(stat, realStat)) throw new SafeOpenError("path-mismatch", "path mismatch");
		if (realStat.nlink > 1) throw new SafeOpenError("invalid-path", "hardlinked path not allowed");
		if (!isPathInside(rootWithSep, realPath)) throw new SafeOpenError("outside-workspace", "file is outside workspace root");
		if (params.append !== true && params.truncateExisting !== false && !createdForWrite) await handle.truncate(0);
		return {
			handle,
			createdForWrite,
			openedRealPath: realPath,
			openedStat: stat
		};
	} catch (err) {
		const cleanupCreatedPath = createdForWrite && err instanceof SafeOpenError;
		const cleanupPath = openedRealPath ?? ioPath;
		await handle.close().catch(() => {});
		if (cleanupCreatedPath) await fs.rm(cleanupPath, { force: true }).catch(() => {});
		throw err;
	}
}
async function appendFileWithinRoot(params) {
	const target = await openWritableFileWithinRoot({
		rootDir: params.rootDir,
		relativePath: params.relativePath,
		mkdir: params.mkdir,
		truncateExisting: false,
		append: true
	});
	try {
		let prefix = "";
		if (params.prependNewlineIfNeeded === true && !target.createdForWrite && target.openedStat.size > 0 && (typeof params.data === "string" && !params.data.startsWith("\n") || Buffer.isBuffer(params.data) && params.data.length > 0 && params.data[0] !== 10)) {
			const lastByte = Buffer.alloc(1);
			const { bytesRead } = await target.handle.read(lastByte, 0, 1, target.openedStat.size - 1);
			if (bytesRead === 1 && lastByte[0] !== 10) prefix = "\n";
		}
		if (typeof params.data === "string") {
			await target.handle.appendFile(`${prefix}${params.data}`, params.encoding ?? "utf8");
			return;
		}
		const payload = prefix.length > 0 ? Buffer.concat([Buffer.from(prefix, "utf8"), params.data]) : params.data;
		await target.handle.appendFile(payload);
	} finally {
		await target.handle.close().catch(() => {});
	}
}
async function writeFileWithinRoot(params) {
	if (process.platform === "win32") {
		await writeFileWithinRootLegacy(params);
		return;
	}
	const pinned = await resolvePinnedWriteTargetWithinRoot({
		rootDir: params.rootDir,
		relativePath: params.relativePath
	});
	const identity = await runPinnedWriteHelper({
		rootPath: pinned.rootReal,
		relativeParentPath: pinned.relativeParentPath,
		basename: pinned.basename,
		mkdir: params.mkdir !== false,
		mode: pinned.mode,
		input: {
			kind: "buffer",
			data: params.data,
			encoding: params.encoding
		}
	}).catch((error) => {
		throw normalizePinnedWriteError(error);
	});
	try {
		await verifyAtomicWriteResult({
			rootDir: params.rootDir,
			targetPath: pinned.targetPath,
			expectedIdentity: identity
		});
	} catch (err) {
		emitWriteBoundaryWarning(`post-write verification failed: ${String(err)}`);
		throw err;
	}
}
async function copyFileWithinRoot(params) {
	const source = await openVerifiedLocalFile(params.sourcePath, { rejectHardlinks: params.rejectSourceHardlinks });
	if (params.maxBytes !== void 0 && source.stat.size > params.maxBytes) {
		await source.handle.close().catch(() => {});
		throw new SafeOpenError("too-large", `file exceeds limit of ${params.maxBytes} bytes (got ${source.stat.size})`);
	}
	try {
		if (process.platform === "win32") {
			await copyFileWithinRootLegacy(params, source);
			return;
		}
		const pinned = await resolvePinnedWriteTargetWithinRoot({
			rootDir: params.rootDir,
			relativePath: params.relativePath
		});
		const sourceStream = source.handle.createReadStream();
		const identity = await runPinnedWriteHelper({
			rootPath: pinned.rootReal,
			relativeParentPath: pinned.relativeParentPath,
			basename: pinned.basename,
			mkdir: params.mkdir !== false,
			mode: pinned.mode,
			input: {
				kind: "stream",
				stream: sourceStream
			}
		}).catch((error) => {
			throw normalizePinnedWriteError(error);
		});
		try {
			await verifyAtomicWriteResult({
				rootDir: params.rootDir,
				targetPath: pinned.targetPath,
				expectedIdentity: identity
			});
		} catch (err) {
			emitWriteBoundaryWarning(`post-copy verification failed: ${String(err)}`);
			throw err;
		}
	} finally {
		await source.handle.close().catch(() => {});
	}
}
async function writeFileFromPathWithinRoot(params) {
	await copyFileWithinRoot({
		sourcePath: params.sourcePath,
		rootDir: params.rootDir,
		relativePath: params.relativePath,
		mkdir: params.mkdir,
		rejectSourceHardlinks: true
	});
}
async function resolvePinnedWriteTargetWithinRoot(params) {
	const { rootReal, rootWithSep, resolved } = await resolvePathWithinRoot(params);
	try {
		await assertNoPathAliasEscape({
			absolutePath: resolved,
			rootPath: rootReal,
			boundaryLabel: "root"
		});
	} catch (err) {
		throw new SafeOpenError("invalid-path", "path alias escape blocked", { cause: err });
	}
	const relativeResolved = path.relative(rootReal, resolved);
	if (relativeResolved.startsWith("..") || path.isAbsolute(relativeResolved)) throw new SafeOpenError("outside-workspace", "file is outside workspace root");
	const relativePosix = relativeResolved ? relativeResolved.split(path.sep).join(path.posix.sep) : "";
	const basename = path.posix.basename(relativePosix);
	if (!basename || basename === "." || basename === "/") throw new SafeOpenError("invalid-path", "invalid target path");
	let mode = 384;
	try {
		const opened = await openFileWithinRoot({
			rootDir: params.rootDir,
			relativePath: params.relativePath,
			rejectHardlinks: true
		});
		try {
			mode = opened.stat.mode & 511;
			if (!isPathInside(rootWithSep, opened.realPath)) throw new SafeOpenError("outside-workspace", "file is outside workspace root");
		} finally {
			await opened.handle.close().catch(() => {});
		}
	} catch (err) {
		if (!(err instanceof SafeOpenError) || err.code !== "not-found") throw err;
	}
	return {
		rootReal,
		targetPath: resolved,
		relativeParentPath: path.posix.dirname(relativePosix) === "." ? "" : path.posix.dirname(relativePosix),
		basename,
		mode: mode || 384
	};
}
function normalizePinnedWriteError(error) {
	if (error instanceof SafeOpenError) return error;
	return new SafeOpenError("invalid-path", "path is not a regular file under root", { cause: error instanceof Error ? error : void 0 });
}
async function writeFileWithinRootLegacy(params) {
	const target = await openWritableFileWithinRoot({
		rootDir: params.rootDir,
		relativePath: params.relativePath,
		mkdir: params.mkdir,
		truncateExisting: false
	});
	const destinationPath = target.openedRealPath;
	const targetMode = target.openedStat.mode & 511;
	await target.handle.close().catch(() => {});
	let tempPath = null;
	try {
		tempPath = buildAtomicWriteTempPath(destinationPath);
		const writtenStat = await writeTempFileForAtomicReplace({
			tempPath,
			data: params.data,
			encoding: params.encoding,
			mode: targetMode || 384
		});
		await fs.rename(tempPath, destinationPath);
		tempPath = null;
		try {
			await verifyAtomicWriteResult({
				rootDir: params.rootDir,
				targetPath: destinationPath,
				expectedIdentity: writtenStat
			});
		} catch (err) {
			emitWriteBoundaryWarning(`post-write verification failed: ${String(err)}`);
			throw err;
		}
	} finally {
		if (tempPath) await fs.rm(tempPath, { force: true }).catch(() => {});
	}
}
async function copyFileWithinRootLegacy(params, source) {
	let target = null;
	let sourceClosedByStream = false;
	let targetClosedByUs = false;
	let tempHandle = null;
	let tempPath = null;
	let tempClosedByStream = false;
	try {
		target = await openWritableFileWithinRoot({
			rootDir: params.rootDir,
			relativePath: params.relativePath,
			mkdir: params.mkdir,
			truncateExisting: false
		});
		const destinationPath = target.openedRealPath;
		const targetMode = target.openedStat.mode & 511;
		await target.handle.close().catch(() => {});
		targetClosedByUs = true;
		tempPath = buildAtomicWriteTempPath(destinationPath);
		tempHandle = await fs.open(tempPath, OPEN_WRITE_CREATE_FLAGS, targetMode || 384);
		const sourceStream = source.handle.createReadStream();
		const targetStream = tempHandle.createWriteStream();
		sourceStream.once("close", () => {
			sourceClosedByStream = true;
		});
		targetStream.once("close", () => {
			tempClosedByStream = true;
		});
		await import("node:stream/promises").then(({ pipeline }) => pipeline(sourceStream, targetStream));
		const writtenStat = await fs.stat(tempPath);
		if (!tempClosedByStream) {
			await tempHandle.close().catch(() => {});
			tempClosedByStream = true;
		}
		tempHandle = null;
		await fs.rename(tempPath, destinationPath);
		tempPath = null;
		try {
			await verifyAtomicWriteResult({
				rootDir: params.rootDir,
				targetPath: destinationPath,
				expectedIdentity: writtenStat
			});
		} catch (err) {
			emitWriteBoundaryWarning(`post-copy verification failed: ${String(err)}`);
			throw err;
		}
	} catch (err) {
		if (target?.createdForWrite) await fs.rm(target.openedRealPath, { force: true }).catch(() => {});
		throw err;
	} finally {
		if (tempPath) await fs.rm(tempPath, { force: true }).catch(() => {});
		if (!sourceClosedByStream) await source.handle.close().catch(() => {});
		if (tempHandle && !tempClosedByStream) await tempHandle.close().catch(() => {});
		if (target && !targetClosedByUs) await target.handle.close().catch(() => {});
	}
}
//#endregion
export { openFileWithinRoot as a, readLocalFileSafely as c, writeFileFromPathWithinRoot as d, writeFileWithinRoot as f, createRootScopedReadFile as i, readPathWithinRoot as l, appendFileWithinRoot as n, openWritableFileWithinRoot as o, copyFileWithinRoot as r, readFileWithinRoot as s, SafeOpenError as t, resolveOpenedFileRealPathForHandle as u };
