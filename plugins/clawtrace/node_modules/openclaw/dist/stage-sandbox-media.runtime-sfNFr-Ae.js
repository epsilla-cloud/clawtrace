import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-Day5KPIY.js";
import { t as CONFIG_DIR } from "./utils-BfvDpbwh.js";
import { j_ as ensureSandboxWorkspaceForSession, nF as MEDIA_MAX_BYTES, sF as getMediaDir } from "./auth-profiles-B5ypC5S-.js";
import { r as logVerbose } from "./globals-0H99T-Tx.js";
import { d as isInboundPathAllowed, g as resolveIMessageRemoteAttachmentRoots } from "./zod-schema.providers-core-BV8OcGxh.js";
import { i as normalizeScpRemotePath, r as normalizeScpRemoteHost } from "./scp-host-C8II1mmC.js";
import { r as copyFileWithinRoot, t as SafeOpenError } from "./fs-safe-D9sbDNFI.js";
import { n as assertSandboxPath } from "./discord-core-B4Argznh.js";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { spawn } from "node:child_process";
import fs from "node:fs/promises";
//#region src/auto-reply/reply/stage-sandbox-media.ts
const STAGED_MEDIA_MAX_BYTES = MEDIA_MAX_BYTES;
async function stageSandboxMedia(params) {
	const { ctx, sessionCtx, cfg, sessionKey, workspaceDir } = params;
	const hasPathsArray = Array.isArray(ctx.MediaPaths) && ctx.MediaPaths.length > 0;
	const rawPaths = resolveRawPaths(ctx);
	if (rawPaths.length === 0 || !sessionKey) return;
	const sandbox = await ensureSandboxWorkspaceForSession({
		config: cfg,
		sessionKey,
		workspaceDir
	});
	const remoteMediaCacheDir = ctx.MediaRemoteHost ? path.join(CONFIG_DIR, "media", "remote-cache", sessionKey) : null;
	const effectiveWorkspaceDir = sandbox?.workspaceDir ?? remoteMediaCacheDir;
	if (!effectiveWorkspaceDir) return;
	await fs.mkdir(effectiveWorkspaceDir, { recursive: true });
	const remoteAttachmentRoots = resolveIMessageRemoteAttachmentRoots({
		cfg,
		accountId: ctx.AccountId
	});
	const usedNames = /* @__PURE__ */ new Set();
	const staged = /* @__PURE__ */ new Map();
	for (const raw of rawPaths) {
		const source = resolveAbsolutePath(raw);
		if (!source || staged.has(source)) continue;
		if (!await isAllowedSourcePath({
			source,
			mediaRemoteHost: ctx.MediaRemoteHost,
			remoteAttachmentRoots
		})) continue;
		const fileName = allocateStagedFileName(source, usedNames);
		if (!fileName) continue;
		const relativeDest = sandbox ? path.join("media", "inbound", fileName) : fileName;
		const dest = path.join(effectiveWorkspaceDir, relativeDest);
		try {
			if (ctx.MediaRemoteHost) await stageRemoteFileIntoRoot({
				remoteHost: ctx.MediaRemoteHost,
				remotePath: source,
				rootDir: effectiveWorkspaceDir,
				relativeDestPath: relativeDest,
				maxBytes: STAGED_MEDIA_MAX_BYTES
			});
			else await stageLocalFileIntoRoot({
				sourcePath: source,
				rootDir: effectiveWorkspaceDir,
				relativeDestPath: relativeDest,
				maxBytes: STAGED_MEDIA_MAX_BYTES
			});
		} catch (err) {
			if (err instanceof SafeOpenError && err.code === "too-large") logVerbose(`Blocking inbound media staging above ${STAGED_MEDIA_MAX_BYTES} bytes: ${source}`);
			else logVerbose(`Failed to stage inbound media path ${source}: ${String(err)}`);
			continue;
		}
		const stagedPath = sandbox ? path.posix.join("media", "inbound", fileName) : dest;
		staged.set(source, stagedPath);
	}
	rewriteStagedMediaPaths({
		ctx,
		sessionCtx,
		rawPaths,
		staged,
		hasPathsArray
	});
}
async function stageLocalFileIntoRoot(params) {
	await copyFileWithinRoot({
		sourcePath: params.sourcePath,
		rootDir: params.rootDir,
		relativePath: params.relativeDestPath,
		maxBytes: params.maxBytes
	});
}
async function stageRemoteFileIntoRoot(params) {
	const tmpRoot = resolvePreferredOpenClawTmpDir();
	await fs.mkdir(tmpRoot, { recursive: true });
	const tmpDir = await fs.mkdtemp(path.join(tmpRoot, "stage-sandbox-media-"));
	const tmpPath = path.join(tmpDir, "download");
	try {
		await scpFile(params.remoteHost, params.remotePath, tmpPath);
		await stageLocalFileIntoRoot({
			sourcePath: tmpPath,
			rootDir: params.rootDir,
			relativeDestPath: params.relativeDestPath,
			maxBytes: params.maxBytes
		});
	} finally {
		await fs.rm(tmpDir, {
			recursive: true,
			force: true
		}).catch(() => {});
	}
}
function resolveRawPaths(ctx) {
	const pathsFromArray = Array.isArray(ctx.MediaPaths) ? ctx.MediaPaths : void 0;
	return pathsFromArray && pathsFromArray.length > 0 ? pathsFromArray : ctx.MediaPath?.trim() ? [ctx.MediaPath.trim()] : [];
}
function resolveAbsolutePath(value) {
	let resolved = value.trim();
	if (!resolved) return null;
	if (resolved.startsWith("file://")) try {
		resolved = fileURLToPath(resolved);
	} catch {
		return null;
	}
	if (!path.isAbsolute(resolved)) return null;
	return resolved;
}
async function isAllowedSourcePath(params) {
	if (params.mediaRemoteHost) {
		if (!isInboundPathAllowed({
			filePath: params.source,
			roots: params.remoteAttachmentRoots
		})) {
			logVerbose(`Blocking remote media staging from disallowed attachment path: ${params.source}`);
			return false;
		}
		return true;
	}
	const mediaDir = getMediaDir();
	if (!isInboundPathAllowed({
		filePath: params.source,
		roots: [mediaDir]
	})) {
		logVerbose(`Blocking attempt to stage media from outside media directory: ${params.source}`);
		return false;
	}
	try {
		await assertSandboxPath({
			filePath: params.source,
			cwd: mediaDir,
			root: mediaDir
		});
		return true;
	} catch {
		logVerbose(`Blocking attempt to stage media from outside media directory: ${params.source}`);
		return false;
	}
}
function allocateStagedFileName(source, usedNames) {
	const baseName = path.basename(source);
	if (!baseName) return null;
	const parsed = path.parse(baseName);
	let fileName = baseName;
	let suffix = 1;
	while (usedNames.has(fileName)) {
		fileName = `${parsed.name}-${suffix}${parsed.ext}`;
		suffix += 1;
	}
	usedNames.add(fileName);
	return fileName;
}
function rewriteStagedMediaPaths(params) {
	const rewriteIfStaged = (value) => {
		const raw = value?.trim();
		if (!raw) return value;
		const abs = resolveAbsolutePath(raw);
		if (!abs) return value;
		return params.staged.get(abs) ?? value;
	};
	const nextMediaPaths = params.hasPathsArray ? params.rawPaths.map((p) => rewriteIfStaged(p) ?? p) : void 0;
	if (nextMediaPaths) {
		params.ctx.MediaPaths = nextMediaPaths;
		params.sessionCtx.MediaPaths = nextMediaPaths;
		params.ctx.MediaPath = nextMediaPaths[0];
		params.sessionCtx.MediaPath = nextMediaPaths[0];
	} else {
		const rewritten = rewriteIfStaged(params.ctx.MediaPath);
		if (rewritten && rewritten !== params.ctx.MediaPath) {
			params.ctx.MediaPath = rewritten;
			params.sessionCtx.MediaPath = rewritten;
		}
	}
	if (Array.isArray(params.ctx.MediaUrls) && params.ctx.MediaUrls.length > 0) {
		const nextUrls = params.ctx.MediaUrls.map((u) => rewriteIfStaged(u) ?? u);
		params.ctx.MediaUrls = nextUrls;
		params.sessionCtx.MediaUrls = nextUrls;
	}
	const rewrittenUrl = rewriteIfStaged(params.ctx.MediaUrl);
	if (rewrittenUrl && rewrittenUrl !== params.ctx.MediaUrl) {
		params.ctx.MediaUrl = rewrittenUrl;
		params.sessionCtx.MediaUrl = rewrittenUrl;
	}
}
async function scpFile(remoteHost, remotePath, localPath) {
	const safeRemoteHost = normalizeScpRemoteHost(remoteHost);
	if (!safeRemoteHost) throw new Error("invalid remote host for SCP");
	const safeRemotePath = normalizeScpRemotePath(remotePath);
	if (!safeRemotePath) throw new Error("invalid remote path for SCP");
	return new Promise((resolve, reject) => {
		const child = spawn("/usr/bin/scp", [
			"-o",
			"BatchMode=yes",
			"-o",
			"StrictHostKeyChecking=yes",
			"--",
			`${safeRemoteHost}:${safeRemotePath}`,
			localPath
		], { stdio: [
			"ignore",
			"ignore",
			"pipe"
		] });
		let stderr = "";
		child.stderr?.setEncoding("utf8");
		child.stderr?.on("data", (chunk) => {
			stderr += chunk;
		});
		child.once("error", reject);
		child.once("exit", (code) => {
			if (code === 0) resolve();
			else reject(/* @__PURE__ */ new Error(`scp failed (${code}): ${stderr.trim()}`));
		});
	});
}
//#endregion
export { stageSandboxMedia };
