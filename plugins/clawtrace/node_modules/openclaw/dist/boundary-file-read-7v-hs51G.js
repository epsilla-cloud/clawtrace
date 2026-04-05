import { n as resolveBoundaryPath, r as resolveBoundaryPathSync } from "./boundary-path-Ci-Gk9P9.js";
import { t as sameFileIdentity$1 } from "./file-identity-DeV9Olqn.js";
import fsSync from "node:fs";
import path from "node:path";
//#region src/infra/safe-open-sync.ts
function isExpectedPathError(error) {
	const code = typeof error === "object" && error !== null && "code" in error ? String(error.code) : "";
	return code === "ENOENT" || code === "ENOTDIR" || code === "ELOOP";
}
function sameFileIdentity(left, right) {
	return sameFileIdentity$1(left, right);
}
function openVerifiedFileSync(params) {
	const ioFs = params.ioFs ?? fsSync;
	const allowedType = params.allowedType ?? "file";
	const openReadFlags = ioFs.constants.O_RDONLY | (typeof ioFs.constants.O_NOFOLLOW === "number" ? ioFs.constants.O_NOFOLLOW : 0);
	let fd = null;
	try {
		if (params.rejectPathSymlink) {
			if (ioFs.lstatSync(params.filePath).isSymbolicLink()) return {
				ok: false,
				reason: "validation"
			};
		}
		const realPath = params.resolvedPath ?? ioFs.realpathSync(params.filePath);
		const preOpenStat = ioFs.lstatSync(realPath);
		if (!isAllowedType(preOpenStat, allowedType)) return {
			ok: false,
			reason: "validation"
		};
		if (params.rejectHardlinks && preOpenStat.isFile() && preOpenStat.nlink > 1) return {
			ok: false,
			reason: "validation"
		};
		if (params.maxBytes !== void 0 && preOpenStat.isFile() && preOpenStat.size > params.maxBytes) return {
			ok: false,
			reason: "validation"
		};
		fd = ioFs.openSync(realPath, openReadFlags);
		const openedStat = ioFs.fstatSync(fd);
		if (!isAllowedType(openedStat, allowedType)) return {
			ok: false,
			reason: "validation"
		};
		if (params.rejectHardlinks && openedStat.isFile() && openedStat.nlink > 1) return {
			ok: false,
			reason: "validation"
		};
		if (params.maxBytes !== void 0 && openedStat.isFile() && openedStat.size > params.maxBytes) return {
			ok: false,
			reason: "validation"
		};
		if (!sameFileIdentity(preOpenStat, openedStat)) return {
			ok: false,
			reason: "validation"
		};
		const opened = {
			ok: true,
			path: realPath,
			fd,
			stat: openedStat
		};
		fd = null;
		return opened;
	} catch (error) {
		if (isExpectedPathError(error)) return {
			ok: false,
			reason: "path",
			error
		};
		return {
			ok: false,
			reason: "io",
			error
		};
	} finally {
		if (fd !== null) ioFs.closeSync(fd);
	}
}
function isAllowedType(stat, allowedType) {
	if (allowedType === "directory") return stat.isDirectory();
	return stat.isFile();
}
//#endregion
//#region src/infra/boundary-file-read.ts
function canUseBoundaryFileOpen(ioFs) {
	return typeof ioFs.openSync === "function" && typeof ioFs.closeSync === "function" && typeof ioFs.fstatSync === "function" && typeof ioFs.lstatSync === "function" && typeof ioFs.realpathSync === "function" && typeof ioFs.readFileSync === "function" && typeof ioFs.constants === "object" && ioFs.constants !== null;
}
function openBoundaryFileSync(params) {
	const ioFs = params.ioFs ?? fsSync;
	const resolved = resolveBoundaryFilePathGeneric({
		absolutePath: params.absolutePath,
		resolve: (absolutePath) => resolveBoundaryPathSync({
			absolutePath,
			rootPath: params.rootPath,
			rootCanonicalPath: params.rootRealPath,
			boundaryLabel: params.boundaryLabel,
			skipLexicalRootCheck: params.skipLexicalRootCheck
		})
	});
	if (resolved instanceof Promise) return toBoundaryValidationError(/* @__PURE__ */ new Error("Unexpected async boundary resolution"));
	return finalizeBoundaryFileOpen({
		resolved,
		maxBytes: params.maxBytes,
		rejectHardlinks: params.rejectHardlinks,
		allowedType: params.allowedType,
		ioFs
	});
}
function matchBoundaryFileOpenFailure(failure, handlers) {
	switch (failure.reason) {
		case "path": return handlers.path ? handlers.path(failure) : handlers.fallback(failure);
		case "validation": return handlers.validation ? handlers.validation(failure) : handlers.fallback(failure);
		case "io": return handlers.io ? handlers.io(failure) : handlers.fallback(failure);
	}
}
function openBoundaryFileResolved(params) {
	const opened = openVerifiedFileSync({
		filePath: params.absolutePath,
		resolvedPath: params.resolvedPath,
		rejectHardlinks: params.rejectHardlinks ?? true,
		maxBytes: params.maxBytes,
		allowedType: params.allowedType,
		ioFs: params.ioFs
	});
	if (!opened.ok) return opened;
	return {
		ok: true,
		path: opened.path,
		fd: opened.fd,
		stat: opened.stat,
		rootRealPath: params.rootRealPath
	};
}
function finalizeBoundaryFileOpen(params) {
	if ("ok" in params.resolved) return params.resolved;
	return openBoundaryFileResolved({
		absolutePath: params.resolved.absolutePath,
		resolvedPath: params.resolved.resolvedPath,
		rootRealPath: params.resolved.rootRealPath,
		maxBytes: params.maxBytes,
		rejectHardlinks: params.rejectHardlinks,
		allowedType: params.allowedType,
		ioFs: params.ioFs
	});
}
async function openBoundaryFile(params) {
	const ioFs = params.ioFs ?? fsSync;
	const maybeResolved = resolveBoundaryFilePathGeneric({
		absolutePath: params.absolutePath,
		resolve: (absolutePath) => resolveBoundaryPath({
			absolutePath,
			rootPath: params.rootPath,
			rootCanonicalPath: params.rootRealPath,
			boundaryLabel: params.boundaryLabel,
			policy: params.aliasPolicy,
			skipLexicalRootCheck: params.skipLexicalRootCheck
		})
	});
	return finalizeBoundaryFileOpen({
		resolved: maybeResolved instanceof Promise ? await maybeResolved : maybeResolved,
		maxBytes: params.maxBytes,
		rejectHardlinks: params.rejectHardlinks,
		allowedType: params.allowedType,
		ioFs
	});
}
function toBoundaryValidationError(error) {
	return {
		ok: false,
		reason: "validation",
		error
	};
}
function mapResolvedBoundaryPath(absolutePath, resolved) {
	return {
		absolutePath,
		resolvedPath: resolved.canonicalPath,
		rootRealPath: resolved.rootCanonicalPath
	};
}
function resolveBoundaryFilePathGeneric(params) {
	const absolutePath = path.resolve(params.absolutePath);
	try {
		const resolved = params.resolve(absolutePath);
		if (resolved instanceof Promise) return resolved.then((value) => mapResolvedBoundaryPath(absolutePath, value)).catch((error) => toBoundaryValidationError(error));
		return mapResolvedBoundaryPath(absolutePath, resolved);
	} catch (error) {
		return toBoundaryValidationError(error);
	}
}
//#endregion
export { openVerifiedFileSync as a, openBoundaryFileSync as i, matchBoundaryFileOpenFailure as n, openBoundaryFile as r, canUseBoundaryFileOpen as t };
