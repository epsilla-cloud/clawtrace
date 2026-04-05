import { s as __toESM } from "./chunk-iyeSoAlh.js";
import { r as fromBuffer } from "./lib-fSmD8bOm.js";
import { t as require_src } from "./src-DjQPu5JV.js";
import { C as UINT32_LE, D as Uint8ArrayType, _ as StringType, i as InternalParserError, r as FieldDecodingError, s as makeUnexpectedFileContentError, t as BasicParser, y as UINT16_LE } from "./BasicParser-BXS2yOsU.js";
import { i as findZero, t as a2hex } from "./Util-CBn3Cuzs.js";
//#region node_modules/music-metadata/node_modules/@borewit/text-codec/lib/index.js
const WINDOWS_1252_EXTRA = {
	128: "€",
	130: "‚",
	131: "ƒ",
	132: "„",
	133: "…",
	134: "†",
	135: "‡",
	136: "ˆ",
	137: "‰",
	138: "Š",
	139: "‹",
	140: "Œ",
	142: "Ž",
	145: "‘",
	146: "’",
	147: "“",
	148: "”",
	149: "•",
	150: "–",
	151: "—",
	152: "˜",
	153: "™",
	154: "š",
	155: "›",
	156: "œ",
	158: "ž",
	159: "Ÿ"
};
const WINDOWS_1252_REVERSE = {};
for (const [code, char] of Object.entries(WINDOWS_1252_EXTRA)) WINDOWS_1252_REVERSE[char] = Number.parseInt(code, 10);
let _utf8Decoder;
let _utf8Encoder;
function utf8Decoder() {
	if (typeof globalThis.TextDecoder === "undefined") return void 0;
	return _utf8Decoder !== null && _utf8Decoder !== void 0 ? _utf8Decoder : _utf8Decoder = new globalThis.TextDecoder("utf-8");
}
function utf8Encoder() {
	if (typeof globalThis.TextEncoder === "undefined") return void 0;
	return _utf8Encoder !== null && _utf8Encoder !== void 0 ? _utf8Encoder : _utf8Encoder = new globalThis.TextEncoder();
}
const CHUNK = 32 * 1024;
const REPLACEMENT = 65533;
/**
* Decode text from binary data
*/
function textDecode(bytes, encoding = "utf-8") {
	switch (encoding.toLowerCase()) {
		case "utf-8":
		case "utf8": {
			const dec = utf8Decoder();
			return dec ? dec.decode(bytes) : decodeUTF8(bytes);
		}
		case "utf-16le": return decodeUTF16LE(bytes);
		case "us-ascii":
		case "ascii": return decodeASCII(bytes);
		case "latin1":
		case "iso-8859-1": return decodeLatin1(bytes);
		case "windows-1252": return decodeWindows1252(bytes);
		default: throw new RangeError(`Encoding '${encoding}' not supported`);
	}
}
function textEncode(input = "", encoding = "utf-8") {
	switch (encoding.toLowerCase()) {
		case "utf-8":
		case "utf8": {
			const enc = utf8Encoder();
			return enc ? enc.encode(input) : encodeUTF8(input);
		}
		case "utf-16le": return encodeUTF16LE(input);
		case "us-ascii":
		case "ascii": return encodeASCII(input);
		case "latin1":
		case "iso-8859-1": return encodeLatin1(input);
		case "windows-1252": return encodeWindows1252(input);
		default: throw new RangeError(`Encoding '${encoding}' not supported`);
	}
}
function flushChunk(parts, chunk) {
	if (chunk.length === 0) return;
	parts.push(String.fromCharCode.apply(null, chunk));
	chunk.length = 0;
}
function pushCodeUnit(parts, chunk, codeUnit) {
	chunk.push(codeUnit);
	if (chunk.length >= CHUNK) flushChunk(parts, chunk);
}
function pushCodePoint(parts, chunk, cp) {
	if (cp <= 65535) {
		pushCodeUnit(parts, chunk, cp);
		return;
	}
	cp -= 65536;
	pushCodeUnit(parts, chunk, 55296 + (cp >> 10));
	pushCodeUnit(parts, chunk, 56320 + (cp & 1023));
}
function decodeUTF8(bytes) {
	const parts = [];
	const chunk = [];
	let i = 0;
	if (bytes.length >= 3 && bytes[0] === 239 && bytes[1] === 187 && bytes[2] === 191) i = 3;
	while (i < bytes.length) {
		const b1 = bytes[i];
		if (b1 <= 127) {
			pushCodeUnit(parts, chunk, b1);
			i++;
			continue;
		}
		if (b1 < 194 || b1 > 244) {
			pushCodeUnit(parts, chunk, REPLACEMENT);
			i++;
			continue;
		}
		if (b1 <= 223) {
			if (i + 1 >= bytes.length) {
				pushCodeUnit(parts, chunk, REPLACEMENT);
				i++;
				continue;
			}
			const b2 = bytes[i + 1];
			if ((b2 & 192) !== 128) {
				pushCodeUnit(parts, chunk, REPLACEMENT);
				i++;
				continue;
			}
			pushCodeUnit(parts, chunk, (b1 & 31) << 6 | b2 & 63);
			i += 2;
			continue;
		}
		if (b1 <= 239) {
			if (i + 2 >= bytes.length) {
				pushCodeUnit(parts, chunk, REPLACEMENT);
				i++;
				continue;
			}
			const b2 = bytes[i + 1];
			const b3 = bytes[i + 2];
			if (!((b2 & 192) === 128 && (b3 & 192) === 128 && !(b1 === 224 && b2 < 160) && !(b1 === 237 && b2 >= 160))) {
				pushCodeUnit(parts, chunk, REPLACEMENT);
				i++;
				continue;
			}
			pushCodeUnit(parts, chunk, (b1 & 15) << 12 | (b2 & 63) << 6 | b3 & 63);
			i += 3;
			continue;
		}
		if (i + 3 >= bytes.length) {
			pushCodeUnit(parts, chunk, REPLACEMENT);
			i++;
			continue;
		}
		const b2 = bytes[i + 1];
		const b3 = bytes[i + 2];
		const b4 = bytes[i + 3];
		if (!((b2 & 192) === 128 && (b3 & 192) === 128 && (b4 & 192) === 128 && !(b1 === 240 && b2 < 144) && !(b1 === 244 && b2 > 143))) {
			pushCodeUnit(parts, chunk, REPLACEMENT);
			i++;
			continue;
		}
		pushCodePoint(parts, chunk, (b1 & 7) << 18 | (b2 & 63) << 12 | (b3 & 63) << 6 | b4 & 63);
		i += 4;
	}
	flushChunk(parts, chunk);
	return parts.join("");
}
function decodeUTF16LE(bytes) {
	const parts = [];
	const chunk = [];
	const len = bytes.length;
	let i = 0;
	while (i + 1 < len) {
		const u1 = bytes[i] | bytes[i + 1] << 8;
		i += 2;
		if (u1 >= 55296 && u1 <= 56319) {
			if (i + 1 < len) {
				const u2 = bytes[i] | bytes[i + 1] << 8;
				if (u2 >= 56320 && u2 <= 57343) {
					pushCodeUnit(parts, chunk, u1);
					pushCodeUnit(parts, chunk, u2);
					i += 2;
				} else pushCodeUnit(parts, chunk, REPLACEMENT);
			} else pushCodeUnit(parts, chunk, REPLACEMENT);
			continue;
		}
		if (u1 >= 56320 && u1 <= 57343) {
			pushCodeUnit(parts, chunk, REPLACEMENT);
			continue;
		}
		pushCodeUnit(parts, chunk, u1);
	}
	if (i < len) pushCodeUnit(parts, chunk, REPLACEMENT);
	flushChunk(parts, chunk);
	return parts.join("");
}
function decodeASCII(bytes) {
	const parts = [];
	for (let i = 0; i < bytes.length; i += CHUNK) {
		const end = Math.min(bytes.length, i + CHUNK);
		const codes = new Array(end - i);
		for (let j = i, k = 0; j < end; j++, k++) codes[k] = bytes[j] & 127;
		parts.push(String.fromCharCode.apply(null, codes));
	}
	return parts.join("");
}
function decodeLatin1(bytes) {
	const parts = [];
	for (let i = 0; i < bytes.length; i += CHUNK) {
		const end = Math.min(bytes.length, i + CHUNK);
		const codes = new Array(end - i);
		for (let j = i, k = 0; j < end; j++, k++) codes[k] = bytes[j];
		parts.push(String.fromCharCode.apply(null, codes));
	}
	return parts.join("");
}
function decodeWindows1252(bytes) {
	const parts = [];
	let out = "";
	for (let i = 0; i < bytes.length; i++) {
		const b = bytes[i];
		const extra = b >= 128 && b <= 159 ? WINDOWS_1252_EXTRA[b] : void 0;
		out += extra !== null && extra !== void 0 ? extra : String.fromCharCode(b);
		if (out.length >= CHUNK) {
			parts.push(out);
			out = "";
		}
	}
	if (out) parts.push(out);
	return parts.join("");
}
function encodeUTF8(str) {
	const out = [];
	for (let i = 0; i < str.length; i++) {
		let cp = str.charCodeAt(i);
		if (cp >= 55296 && cp <= 56319) if (i + 1 < str.length) {
			const lo = str.charCodeAt(i + 1);
			if (lo >= 56320 && lo <= 57343) {
				cp = 65536 + (cp - 55296 << 10) + (lo - 56320);
				i++;
			} else cp = REPLACEMENT;
		} else cp = REPLACEMENT;
		else if (cp >= 56320 && cp <= 57343) cp = REPLACEMENT;
		if (cp < 128) out.push(cp);
		else if (cp < 2048) out.push(192 | cp >> 6, 128 | cp & 63);
		else if (cp < 65536) out.push(224 | cp >> 12, 128 | cp >> 6 & 63, 128 | cp & 63);
		else out.push(240 | cp >> 18, 128 | cp >> 12 & 63, 128 | cp >> 6 & 63, 128 | cp & 63);
	}
	return new Uint8Array(out);
}
function encodeUTF16LE(str) {
	const units = [];
	for (let i = 0; i < str.length; i++) {
		const u = str.charCodeAt(i);
		if (u >= 55296 && u <= 56319) {
			if (i + 1 < str.length) {
				const lo = str.charCodeAt(i + 1);
				if (lo >= 56320 && lo <= 57343) {
					units.push(u, lo);
					i++;
				} else units.push(REPLACEMENT);
			} else units.push(REPLACEMENT);
			continue;
		}
		if (u >= 56320 && u <= 57343) {
			units.push(REPLACEMENT);
			continue;
		}
		units.push(u);
	}
	const out = new Uint8Array(units.length * 2);
	for (let i = 0; i < units.length; i++) {
		const code = units[i];
		const o = i * 2;
		out[o] = code & 255;
		out[o + 1] = code >>> 8;
	}
	return out;
}
function encodeASCII(str) {
	const out = new Uint8Array(str.length);
	for (let i = 0; i < str.length; i++) out[i] = str.charCodeAt(i) & 127;
	return out;
}
function encodeLatin1(str) {
	const out = new Uint8Array(str.length);
	for (let i = 0; i < str.length; i++) out[i] = str.charCodeAt(i) & 255;
	return out;
}
function encodeWindows1252(str) {
	const out = new Uint8Array(str.length);
	for (let i = 0; i < str.length; i++) {
		const ch = str[i];
		const code = ch.charCodeAt(0);
		if (WINDOWS_1252_REVERSE[ch] !== void 0) {
			out[i] = WINDOWS_1252_REVERSE[ch];
			continue;
		}
		if (code >= 0 && code <= 127 || code >= 160 && code <= 255) {
			out[i] = code;
			continue;
		}
		out[i] = 63;
	}
	return out;
}
//#endregion
//#region node_modules/music-metadata/lib/common/FourCC.js
const validFourCC = /^[\x21-\x7e©][\x20-\x7e\x00()]{3}/;
/**
* Token for read FourCC
* Ref: https://en.wikipedia.org/wiki/FourCC
*/
const FourCcToken = {
	len: 4,
	get: (buf, off) => {
		const id = textDecode(buf.subarray(off, off + FourCcToken.len), "latin1");
		if (!id.match(validFourCC)) throw new FieldDecodingError(`FourCC contains invalid characters: ${a2hex(id)} "${id}"`);
		return id;
	},
	put: (buffer, offset, id) => {
		const str = textEncode(id, "latin1");
		if (str.length !== 4) throw new InternalParserError("Invalid length");
		buffer.set(str, offset);
		return offset + 4;
	}
};
//#endregion
//#region node_modules/music-metadata/lib/apev2/APEv2Token.js
const DataType = {
	text_utf8: 0,
	binary: 1,
	external_info: 2,
	reserved: 3
};
/**
* APE_DESCRIPTOR: defines the sizes (and offsets) of all the pieces, as well as the MD5 checksum
*/
const DescriptorParser = {
	len: 52,
	get: (buf, off) => {
		return {
			ID: FourCcToken.get(buf, off),
			version: UINT32_LE.get(buf, off + 4) / 1e3,
			descriptorBytes: UINT32_LE.get(buf, off + 8),
			headerBytes: UINT32_LE.get(buf, off + 12),
			seekTableBytes: UINT32_LE.get(buf, off + 16),
			headerDataBytes: UINT32_LE.get(buf, off + 20),
			apeFrameDataBytes: UINT32_LE.get(buf, off + 24),
			apeFrameDataBytesHigh: UINT32_LE.get(buf, off + 28),
			terminatingDataBytes: UINT32_LE.get(buf, off + 32),
			fileMD5: new Uint8ArrayType(16).get(buf, off + 36)
		};
	}
};
/**
* APE_HEADER: describes all of the necessary information about the APE file
*/
const Header = {
	len: 24,
	get: (buf, off) => {
		return {
			compressionLevel: UINT16_LE.get(buf, off),
			formatFlags: UINT16_LE.get(buf, off + 2),
			blocksPerFrame: UINT32_LE.get(buf, off + 4),
			finalFrameBlocks: UINT32_LE.get(buf, off + 8),
			totalFrames: UINT32_LE.get(buf, off + 12),
			bitsPerSample: UINT16_LE.get(buf, off + 16),
			channel: UINT16_LE.get(buf, off + 18),
			sampleRate: UINT32_LE.get(buf, off + 20)
		};
	}
};
/**
* APE Tag Header/Footer Version 2.0
* TAG: describes all the properties of the file [optional]
*/
const TagFooter = {
	len: 32,
	get: (buf, off) => {
		return {
			ID: new StringType(8, "ascii").get(buf, off),
			version: UINT32_LE.get(buf, off + 8),
			size: UINT32_LE.get(buf, off + 12),
			fields: UINT32_LE.get(buf, off + 16),
			flags: parseTagFlags(UINT32_LE.get(buf, off + 20))
		};
	}
};
/**
* APE Tag v2.0 Item Header
*/
const TagItemHeader = {
	len: 8,
	get: (buf, off) => {
		return {
			size: UINT32_LE.get(buf, off),
			flags: parseTagFlags(UINT32_LE.get(buf, off + 4))
		};
	}
};
function parseTagFlags(flags) {
	return {
		containsHeader: isBitSet(flags, 31),
		containsFooter: isBitSet(flags, 30),
		isHeader: isBitSet(flags, 29),
		readOnly: isBitSet(flags, 0),
		dataType: (flags & 6) >> 1
	};
}
/**
* @param num {number}
* @param bit 0 is least significant bit (LSB)
* @return {boolean} true if bit is 1; otherwise false
*/
function isBitSet(num, bit) {
	return (num & 1 << bit) !== 0;
}
const debug = (0, (/* @__PURE__ */ __toESM(require_src(), 1)).default)("music-metadata:parser:APEv2");
const tagFormat = "APEv2";
const preamble = "APETAGEX";
var ApeContentError = class extends makeUnexpectedFileContentError("APEv2") {};
function tryParseApeHeader(metadata, tokenizer, options) {
	return new APEv2Parser(metadata, tokenizer, options).tryParseApeHeader();
}
var APEv2Parser = class APEv2Parser extends BasicParser {
	constructor() {
		super(...arguments);
		this.ape = {};
	}
	/**
	* Calculate the media file duration
	* @param ah ApeHeader
	* @return {number} duration in seconds
	*/
	static calculateDuration(ah) {
		let duration = ah.totalFrames > 1 ? ah.blocksPerFrame * (ah.totalFrames - 1) : 0;
		duration += ah.finalFrameBlocks;
		return duration / ah.sampleRate;
	}
	/**
	* Calculates the APEv1 / APEv2 first field offset
	* @param tokenizer
	* @param offset
	*/
	static async findApeFooterOffset(tokenizer, offset) {
		const apeBuf = new Uint8Array(TagFooter.len);
		const position = tokenizer.position;
		if (offset <= TagFooter.len) {
			debug(`Offset is too small to read APE footer: offset=${offset}`);
			return;
		}
		if (offset > TagFooter.len) {
			await tokenizer.readBuffer(apeBuf, { position: offset - TagFooter.len });
			tokenizer.setPosition(position);
			const tagFooter = TagFooter.get(apeBuf, 0);
			if (tagFooter.ID === "APETAGEX") {
				if (tagFooter.flags.isHeader) debug(`APE Header found at offset=${offset - TagFooter.len}`);
				else {
					debug(`APE Footer found at offset=${offset - TagFooter.len}`);
					offset -= tagFooter.size;
				}
				return {
					footer: tagFooter,
					offset
				};
			}
		}
	}
	static parseTagFooter(metadata, buffer, options) {
		const footer = TagFooter.get(buffer, buffer.length - TagFooter.len);
		if (footer.ID !== preamble) throw new ApeContentError("Unexpected APEv2 Footer ID preamble value");
		fromBuffer(buffer);
		return new APEv2Parser(metadata, fromBuffer(buffer), options).parseTags(footer);
	}
	/**
	* Parse APEv1 / APEv2 header if header signature found
	*/
	async tryParseApeHeader() {
		if (this.tokenizer.fileInfo.size && this.tokenizer.fileInfo.size - this.tokenizer.position < TagFooter.len) {
			debug("No APEv2 header found, end-of-file reached");
			return;
		}
		const footer = await this.tokenizer.peekToken(TagFooter);
		if (footer.ID === preamble) {
			await this.tokenizer.ignore(TagFooter.len);
			return this.parseTags(footer);
		}
		debug(`APEv2 header not found at offset=${this.tokenizer.position}`);
		if (this.tokenizer.fileInfo.size) {
			const remaining = this.tokenizer.fileInfo.size - this.tokenizer.position;
			const buffer = new Uint8Array(remaining);
			await this.tokenizer.readBuffer(buffer);
			return APEv2Parser.parseTagFooter(this.metadata, buffer, this.options);
		}
	}
	async parse() {
		const descriptor = await this.tokenizer.readToken(DescriptorParser);
		if (descriptor.ID !== "MAC ") throw new ApeContentError("Unexpected descriptor ID");
		this.ape.descriptor = descriptor;
		const lenExp = descriptor.descriptorBytes - DescriptorParser.len;
		const header = await (lenExp > 0 ? this.parseDescriptorExpansion(lenExp) : this.parseHeader());
		this.metadata.setAudioOnly();
		await this.tokenizer.ignore(header.forwardBytes);
		return this.tryParseApeHeader();
	}
	async parseTags(footer) {
		const keyBuffer = new Uint8Array(256);
		let bytesRemaining = footer.size - TagFooter.len;
		debug(`Parse APE tags at offset=${this.tokenizer.position}, size=${bytesRemaining}`);
		for (let i = 0; i < footer.fields; i++) {
			if (bytesRemaining < TagItemHeader.len) {
				this.metadata.addWarning(`APEv2 Tag-header: ${footer.fields - i} items remaining, but no more tag data to read.`);
				break;
			}
			const tagItemHeader = await this.tokenizer.readToken(TagItemHeader);
			bytesRemaining -= TagItemHeader.len + tagItemHeader.size;
			await this.tokenizer.peekBuffer(keyBuffer, { length: Math.min(keyBuffer.length, bytesRemaining) });
			let zero = findZero(keyBuffer);
			const key = await this.tokenizer.readToken(new StringType(zero, "ascii"));
			await this.tokenizer.ignore(1);
			bytesRemaining -= key.length + 1;
			switch (tagItemHeader.flags.dataType) {
				case DataType.text_utf8: {
					const values = (await this.tokenizer.readToken(new StringType(tagItemHeader.size, "utf8"))).split(/\x00/g);
					await Promise.all(values.map((val) => this.metadata.addTag(tagFormat, key, val)));
					break;
				}
				case DataType.binary:
					if (this.options.skipCovers) await this.tokenizer.ignore(tagItemHeader.size);
					else {
						const picData = new Uint8Array(tagItemHeader.size);
						await this.tokenizer.readBuffer(picData);
						zero = findZero(picData);
						const description = textDecode(picData.subarray(0, zero), "utf-8");
						const data = picData.subarray(zero + 1);
						await this.metadata.addTag(tagFormat, key, {
							description,
							data
						});
					}
					break;
				case DataType.external_info:
					debug(`Ignore external info ${key}`);
					await this.tokenizer.ignore(tagItemHeader.size);
					break;
				case DataType.reserved:
					debug(`Ignore external info ${key}`);
					this.metadata.addWarning(`APEv2 header declares a reserved datatype for "${key}"`);
					await this.tokenizer.ignore(tagItemHeader.size);
					break;
			}
		}
	}
	async parseDescriptorExpansion(lenExp) {
		await this.tokenizer.ignore(lenExp);
		return this.parseHeader();
	}
	async parseHeader() {
		const header = await this.tokenizer.readToken(Header);
		this.metadata.setFormat("lossless", true);
		this.metadata.setFormat("container", "Monkey's Audio");
		this.metadata.setFormat("bitsPerSample", header.bitsPerSample);
		this.metadata.setFormat("sampleRate", header.sampleRate);
		this.metadata.setFormat("numberOfChannels", header.channel);
		this.metadata.setFormat("duration", APEv2Parser.calculateDuration(header));
		if (!this.ape.descriptor) throw new ApeContentError("Missing APE descriptor");
		return { forwardBytes: this.ape.descriptor.seekTableBytes + this.ape.descriptor.headerDataBytes + this.ape.descriptor.apeFrameDataBytes + this.ape.descriptor.terminatingDataBytes };
	}
};
//#endregion
export { textDecode as a, FourCcToken as i, ApeContentError as n, tryParseApeHeader as r, APEv2Parser as t };
