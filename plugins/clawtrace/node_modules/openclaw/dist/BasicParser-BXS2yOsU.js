import { r as __exportAll, s as __toESM, t as __commonJSMin } from "./chunk-iyeSoAlh.js";
//#region node_modules/ieee754/index.js
var require_ieee754 = /* @__PURE__ */ __commonJSMin(((exports) => {
	/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
	exports.read = function(buffer, offset, isLE, mLen, nBytes) {
		var e, m;
		var eLen = nBytes * 8 - mLen - 1;
		var eMax = (1 << eLen) - 1;
		var eBias = eMax >> 1;
		var nBits = -7;
		var i = isLE ? nBytes - 1 : 0;
		var d = isLE ? -1 : 1;
		var s = buffer[offset + i];
		i += d;
		e = s & (1 << -nBits) - 1;
		s >>= -nBits;
		nBits += eLen;
		for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8);
		m = e & (1 << -nBits) - 1;
		e >>= -nBits;
		nBits += mLen;
		for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8);
		if (e === 0) e = 1 - eBias;
		else if (e === eMax) return m ? NaN : (s ? -1 : 1) * Infinity;
		else {
			m = m + Math.pow(2, mLen);
			e = e - eBias;
		}
		return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
	};
	exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
		var e, m, c;
		var eLen = nBytes * 8 - mLen - 1;
		var eMax = (1 << eLen) - 1;
		var eBias = eMax >> 1;
		var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
		var i = isLE ? 0 : nBytes - 1;
		var d = isLE ? 1 : -1;
		var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
		value = Math.abs(value);
		if (isNaN(value) || value === Infinity) {
			m = isNaN(value) ? 1 : 0;
			e = eMax;
		} else {
			e = Math.floor(Math.log(value) / Math.LN2);
			if (value * (c = Math.pow(2, -e)) < 1) {
				e--;
				c *= 2;
			}
			if (e + eBias >= 1) value += rt / c;
			else value += rt * Math.pow(2, 1 - eBias);
			if (value * c >= 2) {
				e++;
				c /= 2;
			}
			if (e + eBias >= eMax) {
				m = 0;
				e = eMax;
			} else if (e + eBias >= 1) {
				m = (value * c - 1) * Math.pow(2, mLen);
				e = e + eBias;
			} else {
				m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
				e = 0;
			}
		}
		for (; mLen >= 8; buffer[offset + i] = m & 255, i += d, m /= 256, mLen -= 8);
		e = e << mLen | m;
		eLen += mLen;
		for (; eLen > 0; buffer[offset + i] = e & 255, i += d, e /= 256, eLen -= 8);
		buffer[offset + i - d] |= s * 128;
	};
}));
//#endregion
//#region node_modules/@borewit/text-codec/lib/index.js
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
function utf8Decoder() {
	if (typeof globalThis.TextDecoder === "undefined") return void 0;
	return _utf8Decoder !== null && _utf8Decoder !== void 0 ? _utf8Decoder : _utf8Decoder = new globalThis.TextDecoder("utf-8");
}
const CHUNK = 32 * 1024;
/**
* Decode text from binary data
* @param bytes Binary data
* @param encoding Encoding
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
function decodeUTF8(bytes) {
	const parts = [];
	let out = "";
	let i = 0;
	while (i < bytes.length) {
		const b1 = bytes[i++];
		if (b1 < 128) out += String.fromCharCode(b1);
		else if (b1 < 224) {
			const b2 = bytes[i++] & 63;
			out += String.fromCharCode((b1 & 31) << 6 | b2);
		} else if (b1 < 240) {
			const b2 = bytes[i++] & 63;
			const b3 = bytes[i++] & 63;
			out += String.fromCharCode((b1 & 15) << 12 | b2 << 6 | b3);
		} else {
			const b2 = bytes[i++] & 63;
			const b3 = bytes[i++] & 63;
			const b4 = bytes[i++] & 63;
			let cp = (b1 & 7) << 18 | b2 << 12 | b3 << 6 | b4;
			cp -= 65536;
			out += String.fromCharCode(55296 + (cp >> 10 & 1023), 56320 + (cp & 1023));
		}
		if (out.length >= CHUNK) {
			parts.push(out);
			out = "";
		}
	}
	if (out) parts.push(out);
	return parts.join("");
}
function decodeUTF16LE(bytes) {
	const len = bytes.length & -2;
	if (len === 0) return "";
	const parts = [];
	const maxUnits = CHUNK;
	for (let i = 0; i < len;) {
		const unitsThis = Math.min(maxUnits, len - i >> 1);
		const units = new Array(unitsThis);
		for (let j = 0; j < unitsThis; j++, i += 2) units[j] = bytes[i] | bytes[i + 1] << 8;
		parts.push(String.fromCharCode.apply(null, units));
	}
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
//#endregion
//#region node_modules/token-types/lib/index.js
var lib_exports = /* @__PURE__ */ __exportAll({
	AnsiStringType: () => AnsiStringType,
	Float16_BE: () => Float16_BE,
	Float16_LE: () => Float16_LE,
	Float32_BE: () => Float32_BE,
	Float32_LE: () => Float32_LE,
	Float64_BE: () => Float64_BE,
	Float64_LE: () => Float64_LE,
	Float80_BE: () => Float80_BE,
	Float80_LE: () => Float80_LE,
	INT16_BE: () => INT16_BE,
	INT16_LE: () => INT16_LE,
	INT24_BE: () => INT24_BE,
	INT24_LE: () => INT24_LE,
	INT32_BE: () => INT32_BE,
	INT32_LE: () => INT32_LE,
	INT64_BE: () => INT64_BE,
	INT64_LE: () => INT64_LE,
	INT8: () => INT8,
	IgnoreType: () => IgnoreType,
	StringType: () => StringType,
	UINT16_BE: () => UINT16_BE,
	UINT16_LE: () => UINT16_LE,
	UINT24_BE: () => UINT24_BE,
	UINT24_LE: () => UINT24_LE,
	UINT32_BE: () => UINT32_BE,
	UINT32_LE: () => UINT32_LE,
	UINT64_BE: () => UINT64_BE,
	UINT64_LE: () => UINT64_LE,
	UINT8: () => UINT8,
	Uint8ArrayType: () => Uint8ArrayType
});
var import_ieee754 = /* @__PURE__ */ __toESM(require_ieee754(), 1);
function dv(array) {
	return new DataView(array.buffer, array.byteOffset);
}
const UINT8 = {
	len: 1,
	get(array, offset) {
		return dv(array).getUint8(offset);
	},
	put(array, offset, value) {
		dv(array).setUint8(offset, value);
		return offset + 1;
	}
};
/**
* 16-bit unsigned integer, Little Endian byte order
*/
const UINT16_LE = {
	len: 2,
	get(array, offset) {
		return dv(array).getUint16(offset, true);
	},
	put(array, offset, value) {
		dv(array).setUint16(offset, value, true);
		return offset + 2;
	}
};
/**
* 16-bit unsigned integer, Big Endian byte order
*/
const UINT16_BE = {
	len: 2,
	get(array, offset) {
		return dv(array).getUint16(offset);
	},
	put(array, offset, value) {
		dv(array).setUint16(offset, value);
		return offset + 2;
	}
};
/**
* 24-bit unsigned integer, Little Endian byte order
*/
const UINT24_LE = {
	len: 3,
	get(array, offset) {
		const dataView = dv(array);
		return dataView.getUint8(offset) + (dataView.getUint16(offset + 1, true) << 8);
	},
	put(array, offset, value) {
		const dataView = dv(array);
		dataView.setUint8(offset, value & 255);
		dataView.setUint16(offset + 1, value >> 8, true);
		return offset + 3;
	}
};
/**
* 24-bit unsigned integer, Big Endian byte order
*/
const UINT24_BE = {
	len: 3,
	get(array, offset) {
		const dataView = dv(array);
		return (dataView.getUint16(offset) << 8) + dataView.getUint8(offset + 2);
	},
	put(array, offset, value) {
		const dataView = dv(array);
		dataView.setUint16(offset, value >> 8);
		dataView.setUint8(offset + 2, value & 255);
		return offset + 3;
	}
};
/**
* 32-bit unsigned integer, Little Endian byte order
*/
const UINT32_LE = {
	len: 4,
	get(array, offset) {
		return dv(array).getUint32(offset, true);
	},
	put(array, offset, value) {
		dv(array).setUint32(offset, value, true);
		return offset + 4;
	}
};
/**
* 32-bit unsigned integer, Big Endian byte order
*/
const UINT32_BE = {
	len: 4,
	get(array, offset) {
		return dv(array).getUint32(offset);
	},
	put(array, offset, value) {
		dv(array).setUint32(offset, value);
		return offset + 4;
	}
};
/**
* 8-bit signed integer
*/
const INT8 = {
	len: 1,
	get(array, offset) {
		return dv(array).getInt8(offset);
	},
	put(array, offset, value) {
		dv(array).setInt8(offset, value);
		return offset + 1;
	}
};
/**
* 16-bit signed integer, Big Endian byte order
*/
const INT16_BE = {
	len: 2,
	get(array, offset) {
		return dv(array).getInt16(offset);
	},
	put(array, offset, value) {
		dv(array).setInt16(offset, value);
		return offset + 2;
	}
};
/**
* 16-bit signed integer, Little Endian byte order
*/
const INT16_LE = {
	len: 2,
	get(array, offset) {
		return dv(array).getInt16(offset, true);
	},
	put(array, offset, value) {
		dv(array).setInt16(offset, value, true);
		return offset + 2;
	}
};
/**
* 24-bit signed integer, Little Endian byte order
*/
const INT24_LE = {
	len: 3,
	get(array, offset) {
		const unsigned = UINT24_LE.get(array, offset);
		return unsigned > 8388607 ? unsigned - 16777216 : unsigned;
	},
	put(array, offset, value) {
		const dataView = dv(array);
		dataView.setUint8(offset, value & 255);
		dataView.setUint16(offset + 1, value >> 8, true);
		return offset + 3;
	}
};
/**
* 24-bit signed integer, Big Endian byte order
*/
const INT24_BE = {
	len: 3,
	get(array, offset) {
		const unsigned = UINT24_BE.get(array, offset);
		return unsigned > 8388607 ? unsigned - 16777216 : unsigned;
	},
	put(array, offset, value) {
		const dataView = dv(array);
		dataView.setUint16(offset, value >> 8);
		dataView.setUint8(offset + 2, value & 255);
		return offset + 3;
	}
};
/**
* 32-bit signed integer, Big Endian byte order
*/
const INT32_BE = {
	len: 4,
	get(array, offset) {
		return dv(array).getInt32(offset);
	},
	put(array, offset, value) {
		dv(array).setInt32(offset, value);
		return offset + 4;
	}
};
/**
* 32-bit signed integer, Big Endian byte order
*/
const INT32_LE = {
	len: 4,
	get(array, offset) {
		return dv(array).getInt32(offset, true);
	},
	put(array, offset, value) {
		dv(array).setInt32(offset, value, true);
		return offset + 4;
	}
};
/**
* 64-bit unsigned integer, Little Endian byte order
*/
const UINT64_LE = {
	len: 8,
	get(array, offset) {
		return dv(array).getBigUint64(offset, true);
	},
	put(array, offset, value) {
		dv(array).setBigUint64(offset, value, true);
		return offset + 8;
	}
};
/**
* 64-bit signed integer, Little Endian byte order
*/
const INT64_LE = {
	len: 8,
	get(array, offset) {
		return dv(array).getBigInt64(offset, true);
	},
	put(array, offset, value) {
		dv(array).setBigInt64(offset, value, true);
		return offset + 8;
	}
};
/**
* 64-bit unsigned integer, Big Endian byte order
*/
const UINT64_BE = {
	len: 8,
	get(array, offset) {
		return dv(array).getBigUint64(offset);
	},
	put(array, offset, value) {
		dv(array).setBigUint64(offset, value);
		return offset + 8;
	}
};
/**
* 64-bit signed integer, Big Endian byte order
*/
const INT64_BE = {
	len: 8,
	get(array, offset) {
		return dv(array).getBigInt64(offset);
	},
	put(array, offset, value) {
		dv(array).setBigInt64(offset, value);
		return offset + 8;
	}
};
/**
* IEEE 754 16-bit (half precision) float, big endian
*/
const Float16_BE = {
	len: 2,
	get(dataView, offset) {
		return import_ieee754.read(dataView, offset, false, 10, this.len);
	},
	put(dataView, offset, value) {
		import_ieee754.write(dataView, value, offset, false, 10, this.len);
		return offset + this.len;
	}
};
/**
* IEEE 754 16-bit (half precision) float, little endian
*/
const Float16_LE = {
	len: 2,
	get(array, offset) {
		return import_ieee754.read(array, offset, true, 10, this.len);
	},
	put(array, offset, value) {
		import_ieee754.write(array, value, offset, true, 10, this.len);
		return offset + this.len;
	}
};
/**
* IEEE 754 32-bit (single precision) float, big endian
*/
const Float32_BE = {
	len: 4,
	get(array, offset) {
		return dv(array).getFloat32(offset);
	},
	put(array, offset, value) {
		dv(array).setFloat32(offset, value);
		return offset + 4;
	}
};
/**
* IEEE 754 32-bit (single precision) float, little endian
*/
const Float32_LE = {
	len: 4,
	get(array, offset) {
		return dv(array).getFloat32(offset, true);
	},
	put(array, offset, value) {
		dv(array).setFloat32(offset, value, true);
		return offset + 4;
	}
};
/**
* IEEE 754 64-bit (double precision) float, big endian
*/
const Float64_BE = {
	len: 8,
	get(array, offset) {
		return dv(array).getFloat64(offset);
	},
	put(array, offset, value) {
		dv(array).setFloat64(offset, value);
		return offset + 8;
	}
};
/**
* IEEE 754 64-bit (double precision) float, little endian
*/
const Float64_LE = {
	len: 8,
	get(array, offset) {
		return dv(array).getFloat64(offset, true);
	},
	put(array, offset, value) {
		dv(array).setFloat64(offset, value, true);
		return offset + 8;
	}
};
/**
* IEEE 754 80-bit (extended precision) float, big endian
*/
const Float80_BE = {
	len: 10,
	get(array, offset) {
		return import_ieee754.read(array, offset, false, 63, this.len);
	},
	put(array, offset, value) {
		import_ieee754.write(array, value, offset, false, 63, this.len);
		return offset + this.len;
	}
};
/**
* IEEE 754 80-bit (extended precision) float, little endian
*/
const Float80_LE = {
	len: 10,
	get(array, offset) {
		return import_ieee754.read(array, offset, true, 63, this.len);
	},
	put(array, offset, value) {
		import_ieee754.write(array, value, offset, true, 63, this.len);
		return offset + this.len;
	}
};
/**
* Ignore a given number of bytes
*/
var IgnoreType = class {
	/**
	* @param len number of bytes to ignore
	*/
	constructor(len) {
		this.len = len;
	}
	get(_array, _off) {}
};
var Uint8ArrayType = class {
	constructor(len) {
		this.len = len;
	}
	get(array, offset) {
		return array.subarray(offset, offset + this.len);
	}
};
/**
* Consume a fixed number of bytes from the stream and return a string with a specified encoding.
* Supports all encodings supported by TextDecoder, plus 'windows-1252'.
*/
var StringType = class {
	constructor(len, encoding) {
		this.len = len;
		this.encoding = encoding;
	}
	get(data, offset = 0) {
		return textDecode(data.subarray(offset, offset + this.len), this.encoding);
	}
};
/**
* ANSI Latin 1 String using Windows-1252 (Code Page 1252)
* Windows-1252 is a superset of ISO 8859-1 / Latin-1.
*/
var AnsiStringType = class extends StringType {
	constructor(len) {
		super(len, "windows-1252");
	}
};
//#endregion
//#region node_modules/music-metadata/lib/ParseError.js
const makeParseError = (name) => {
	return class ParseError extends Error {
		constructor(message) {
			super(message);
			this.name = name;
		}
	};
};
var CouldNotDetermineFileTypeError = class extends makeParseError("CouldNotDetermineFileTypeError") {};
var UnsupportedFileTypeError = class extends makeParseError("UnsupportedFileTypeError") {};
var UnexpectedFileContentError = class extends makeParseError("UnexpectedFileContentError") {
	constructor(fileType, message) {
		super(message);
		this.fileType = fileType;
	}
	toString() {
		return `${this.name} (FileType: ${this.fileType}): ${this.message}`;
	}
};
var FieldDecodingError = class extends makeParseError("FieldDecodingError") {};
var InternalParserError = class extends makeParseError("InternalParserError") {};
const makeUnexpectedFileContentError = (fileType) => {
	return class extends UnexpectedFileContentError {
		constructor(message) {
			super(fileType, message);
		}
	};
};
//#endregion
//#region node_modules/music-metadata/lib/common/BasicParser.js
var BasicParser = class {
	/**
	* Initialize parser with output (metadata), input (tokenizer) & parsing options (options).
	* @param {INativeMetadataCollector} metadata Output
	* @param {ITokenizer} tokenizer Input
	* @param {IOptions} options Parsing options
	*/
	constructor(metadata, tokenizer, options) {
		this.metadata = metadata;
		this.tokenizer = tokenizer;
		this.options = options;
	}
};
//#endregion
export { UINT32_LE as C, Uint8ArrayType as D, UINT8 as E, lib_exports as O, UINT32_BE as S, UINT64_LE as T, StringType as _, UnsupportedFileTypeError as a, UINT24_BE as b, Float32_BE as c, INT24_BE as d, INT32_BE as f, INT8 as g, INT64_LE as h, InternalParserError as i, Float64_BE as l, INT64_BE as m, CouldNotDetermineFileTypeError as n, makeParseError as o, INT32_LE as p, FieldDecodingError as r, makeUnexpectedFileContentError as s, BasicParser as t, INT16_BE as u, UINT16_BE as v, UINT64_BE as w, UINT24_LE as x, UINT16_LE as y };
