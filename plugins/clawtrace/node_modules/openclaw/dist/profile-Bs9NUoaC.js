function normalizeOptionalText(value) {
	if (typeof value !== "string") return null;
	const trimmed = value.trim();
	return trimmed.length > 0 ? trimmed : null;
}
function isMatrixMxcUri(value) {
	return value.trim().toLowerCase().startsWith("mxc://");
}
function isMatrixHttpAvatarUri(value) {
	const normalized = value.trim().toLowerCase();
	return normalized.startsWith("https://") || normalized.startsWith("http://");
}
async function uploadAvatarMedia(params) {
	const media = await params.loadAvatar(params.avatarSource, params.avatarMaxBytes);
	return await params.client.uploadContent(media.buffer, media.contentType, media.fileName || "avatar");
}
async function resolveAvatarUrl(params) {
	const avatarPath = normalizeOptionalText(params.avatarPath);
	if (avatarPath) {
		if (!params.loadAvatarFromPath) throw new Error("Matrix avatar path upload requires a media loader.");
		return {
			resolvedAvatarUrl: await uploadAvatarMedia({
				client: params.client,
				avatarSource: avatarPath,
				avatarMaxBytes: params.avatarMaxBytes,
				loadAvatar: params.loadAvatarFromPath
			}),
			uploadedAvatarSource: "path",
			convertedAvatarFromHttp: false
		};
	}
	const avatarUrl = normalizeOptionalText(params.avatarUrl);
	if (!avatarUrl) return {
		resolvedAvatarUrl: null,
		uploadedAvatarSource: null,
		convertedAvatarFromHttp: false
	};
	if (isMatrixMxcUri(avatarUrl)) return {
		resolvedAvatarUrl: avatarUrl,
		uploadedAvatarSource: null,
		convertedAvatarFromHttp: false
	};
	if (!isMatrixHttpAvatarUri(avatarUrl)) throw new Error("Matrix avatar URL must be an mxc:// URI or an http(s) URL.");
	if (!params.loadAvatarFromUrl) throw new Error("Matrix avatar URL conversion requires a media loader.");
	return {
		resolvedAvatarUrl: await uploadAvatarMedia({
			client: params.client,
			avatarSource: avatarUrl,
			avatarMaxBytes: params.avatarMaxBytes,
			loadAvatar: params.loadAvatarFromUrl
		}),
		uploadedAvatarSource: "http",
		convertedAvatarFromHttp: true
	};
}
async function syncMatrixOwnProfile(params) {
	const desiredDisplayName = normalizeOptionalText(params.displayName);
	const avatar = await resolveAvatarUrl({
		client: params.client,
		avatarUrl: params.avatarUrl ?? null,
		avatarPath: params.avatarPath ?? null,
		avatarMaxBytes: params.avatarMaxBytes ?? 10485760,
		loadAvatarFromUrl: params.loadAvatarFromUrl,
		loadAvatarFromPath: params.loadAvatarFromPath
	});
	const desiredAvatarUrl = avatar.resolvedAvatarUrl;
	if (!desiredDisplayName && !desiredAvatarUrl) return {
		skipped: true,
		displayNameUpdated: false,
		avatarUpdated: false,
		resolvedAvatarUrl: null,
		uploadedAvatarSource: avatar.uploadedAvatarSource,
		convertedAvatarFromHttp: avatar.convertedAvatarFromHttp
	};
	let currentDisplayName;
	let currentAvatarUrl;
	try {
		const currentProfile = await params.client.getUserProfile(params.userId);
		currentDisplayName = normalizeOptionalText(currentProfile.displayname) ?? void 0;
		currentAvatarUrl = normalizeOptionalText(currentProfile.avatar_url) ?? void 0;
	} catch {}
	let displayNameUpdated = false;
	let avatarUpdated = false;
	if (desiredDisplayName && currentDisplayName !== desiredDisplayName) {
		await params.client.setDisplayName(desiredDisplayName);
		displayNameUpdated = true;
	}
	if (desiredAvatarUrl && currentAvatarUrl !== desiredAvatarUrl) {
		await params.client.setAvatarUrl(desiredAvatarUrl);
		avatarUpdated = true;
	}
	return {
		skipped: false,
		displayNameUpdated,
		avatarUpdated,
		resolvedAvatarUrl: desiredAvatarUrl,
		uploadedAvatarSource: avatar.uploadedAvatarSource,
		convertedAvatarFromHttp: avatar.convertedAvatarFromHttp
	};
}
//#endregion
export { syncMatrixOwnProfile as t };
