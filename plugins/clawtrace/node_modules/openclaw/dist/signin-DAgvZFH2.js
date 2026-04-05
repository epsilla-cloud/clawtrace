import { n as __esmMin } from "./chunk-iyeSoAlh.js";
import { t as require_dist_cjs } from "./dist-cjs-CBMN2jq5.js";
import { n as init_client, o as emitWarningIfUnsupportedVersion$1 } from "./client-CPTwVbki.js";
import { A as NoAuthSigner, C as AwsRestJsonProtocol, E as resolveAwsSdkSigV4Config, F as AwsSdkSigV4Signer, M as getHttpSigningPlugin, N as getHttpAuthSchemeEndpointRuleSetPlugin, P as NODE_AUTH_SCHEME_PREFERENCE_OPTIONS, T as init_httpAuthSchemes, _ as require_dist_cjs$11, a as require_dist_cjs$3, b as init_protocols, c as require_dist_cjs$15, d as require_dist_cjs$9, f as require_dist_cjs$1, g as require_dist_cjs$12, h as require_dist_cjs$13, i as require_dist_cjs$5, j as DefaultIdentityProviderConfig, k as init_dist_es, l as require_dist_cjs$4, n as require_dist_cjs$8, o as require_dist_cjs$6, p as require_dist_cjs$2, r as require_dist_cjs$7, s as require_dist_cjs$16, t as require_dist_cjs$10, u as require_dist_cjs$14 } from "./dist-cjs-DkmXrpZD.js";
import { E as getSchemaSerdePlugin, L as require_dist_cjs$19, P as require_dist_cjs$20, R as require_dist_cjs$17, S as init_schema, t as require_dist_cjs$18, w as TypeRegistry } from "./dist-cjs-N4NAf6PT.js";
import { t as require_dist_cjs$21 } from "./dist-cjs-CUIiZzMm.js";
import { t as require_dist_cjs$22 } from "./dist-cjs-DUdQ9aik.js";
import { t as require_dist_cjs$23 } from "./dist-cjs-BAEt6POO.js";
import { t as version } from "./package-CJ2M7nA9.js";
//#region node_modules/@aws-sdk/nested-clients/dist-es/submodules/signin/auth/httpAuthSchemeProvider.js
function createAwsAuthSigv4HttpAuthOption(authParameters) {
	return {
		schemeId: "aws.auth#sigv4",
		signingProperties: {
			name: "signin",
			region: authParameters.region
		},
		propertiesExtractor: (config, context) => ({ signingProperties: {
			config,
			context
		} })
	};
}
function createSmithyApiNoAuthHttpAuthOption(authParameters) {
	return { schemeId: "smithy.api#noAuth" };
}
var import_dist_cjs$32, defaultSigninHttpAuthSchemeParametersProvider, defaultSigninHttpAuthSchemeProvider, resolveHttpAuthSchemeConfig;
var init_httpAuthSchemeProvider = __esmMin((() => {
	init_httpAuthSchemes();
	import_dist_cjs$32 = require_dist_cjs$17();
	defaultSigninHttpAuthSchemeParametersProvider = async (config, context, input) => {
		return {
			operation: (0, import_dist_cjs$32.getSmithyContext)(context).operation,
			region: await (0, import_dist_cjs$32.normalizeProvider)(config.region)() || (() => {
				throw new Error("expected `region` to be configured for `aws.auth#sigv4`");
			})()
		};
	};
	defaultSigninHttpAuthSchemeProvider = (authParameters) => {
		const options = [];
		switch (authParameters.operation) {
			case "CreateOAuth2Token":
				options.push(createSmithyApiNoAuthHttpAuthOption(authParameters));
				break;
			default: options.push(createAwsAuthSigv4HttpAuthOption(authParameters));
		}
		return options;
	};
	resolveHttpAuthSchemeConfig = (config) => {
		const config_0 = resolveAwsSdkSigV4Config(config);
		return Object.assign(config_0, { authSchemePreference: (0, import_dist_cjs$32.normalizeProvider)(config.authSchemePreference ?? []) });
	};
}));
//#endregion
//#region node_modules/@aws-sdk/nested-clients/dist-es/submodules/signin/endpoint/EndpointParameters.js
var resolveClientEndpointParameters, commonParams;
var init_EndpointParameters = __esmMin((() => {
	resolveClientEndpointParameters = (options) => {
		return Object.assign(options, {
			useDualstackEndpoint: options.useDualstackEndpoint ?? false,
			useFipsEndpoint: options.useFipsEndpoint ?? false,
			defaultSigningName: "signin"
		});
	};
	commonParams = {
		UseFIPS: {
			type: "builtInParams",
			name: "useFipsEndpoint"
		},
		Endpoint: {
			type: "builtInParams",
			name: "endpoint"
		},
		Region: {
			type: "builtInParams",
			name: "region"
		},
		UseDualStack: {
			type: "builtInParams",
			name: "useDualstackEndpoint"
		}
	};
}));
//#endregion
//#region node_modules/@aws-sdk/nested-clients/dist-es/submodules/signin/endpoint/ruleset.js
var u, v, w, x, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, _data, ruleSet;
var init_ruleset = __esmMin((() => {
	u = "required", v = "fn", w = "argv", x = "ref";
	a = true, b = "isSet", c = "booleanEquals", d = "error", e = "endpoint", f = "tree", g = "PartitionResult", h = "stringEquals", i = {
		[u]: true,
		default: false,
		type: "boolean"
	}, j = {
		[u]: false,
		type: "string"
	}, k = { [x]: "Endpoint" }, l = {
		[v]: c,
		[w]: [{ [x]: "UseFIPS" }, true]
	}, m = {
		[v]: c,
		[w]: [{ [x]: "UseDualStack" }, true]
	}, n = {}, o = {
		[v]: "getAttr",
		[w]: [{ [x]: g }, "name"]
	}, p = {
		[v]: c,
		[w]: [{ [x]: "UseFIPS" }, false]
	}, q = {
		[v]: c,
		[w]: [{ [x]: "UseDualStack" }, false]
	}, r = {
		[v]: "getAttr",
		[w]: [{ [x]: g }, "supportsFIPS"]
	}, s = {
		[v]: c,
		[w]: [true, {
			[v]: "getAttr",
			[w]: [{ [x]: g }, "supportsDualStack"]
		}]
	}, t = [{ [x]: "Region" }];
	_data = {
		version: "1.0",
		parameters: {
			UseDualStack: i,
			UseFIPS: i,
			Endpoint: j,
			Region: j
		},
		rules: [{
			conditions: [{
				[v]: b,
				[w]: [k]
			}],
			rules: [{
				conditions: [l],
				error: "Invalid Configuration: FIPS and custom endpoint are not supported",
				type: d
			}, {
				rules: [{
					conditions: [m],
					error: "Invalid Configuration: Dualstack and custom endpoint are not supported",
					type: d
				}, {
					endpoint: {
						url: k,
						properties: n,
						headers: n
					},
					type: e
				}],
				type: f
			}],
			type: f
		}, {
			rules: [{
				conditions: [{
					[v]: b,
					[w]: t
				}],
				rules: [{
					conditions: [{
						[v]: "aws.partition",
						[w]: t,
						assign: g
					}],
					rules: [
						{
							conditions: [
								{
									[v]: h,
									[w]: [o, "aws"]
								},
								p,
								q
							],
							endpoint: {
								url: "https://{Region}.signin.aws.amazon.com",
								properties: n,
								headers: n
							},
							type: e
						},
						{
							conditions: [
								{
									[v]: h,
									[w]: [o, "aws-cn"]
								},
								p,
								q
							],
							endpoint: {
								url: "https://{Region}.signin.amazonaws.cn",
								properties: n,
								headers: n
							},
							type: e
						},
						{
							conditions: [
								{
									[v]: h,
									[w]: [o, "aws-us-gov"]
								},
								p,
								q
							],
							endpoint: {
								url: "https://{Region}.signin.amazonaws-us-gov.com",
								properties: n,
								headers: n
							},
							type: e
						},
						{
							conditions: [l, m],
							rules: [{
								conditions: [{
									[v]: c,
									[w]: [a, r]
								}, s],
								rules: [{
									endpoint: {
										url: "https://signin-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
										properties: n,
										headers: n
									},
									type: e
								}],
								type: f
							}, {
								error: "FIPS and DualStack are enabled, but this partition does not support one or both",
								type: d
							}],
							type: f
						},
						{
							conditions: [l, q],
							rules: [{
								conditions: [{
									[v]: c,
									[w]: [r, a]
								}],
								rules: [{
									endpoint: {
										url: "https://signin-fips.{Region}.{PartitionResult#dnsSuffix}",
										properties: n,
										headers: n
									},
									type: e
								}],
								type: f
							}, {
								error: "FIPS is enabled but this partition does not support FIPS",
								type: d
							}],
							type: f
						},
						{
							conditions: [p, m],
							rules: [{
								conditions: [s],
								rules: [{
									endpoint: {
										url: "https://signin.{Region}.{PartitionResult#dualStackDnsSuffix}",
										properties: n,
										headers: n
									},
									type: e
								}],
								type: f
							}, {
								error: "DualStack is enabled but this partition does not support DualStack",
								type: d
							}],
							type: f
						},
						{
							endpoint: {
								url: "https://signin.{Region}.{PartitionResult#dnsSuffix}",
								properties: n,
								headers: n
							},
							type: e
						}
					],
					type: f
				}],
				type: f
			}, {
				error: "Invalid Configuration: Missing Region",
				type: d
			}],
			type: f
		}]
	};
	ruleSet = _data;
}));
//#endregion
//#region node_modules/@aws-sdk/nested-clients/dist-es/submodules/signin/endpoint/endpointResolver.js
var import_dist_cjs$30, import_dist_cjs$31, cache, defaultEndpointResolver;
var init_endpointResolver = __esmMin((() => {
	import_dist_cjs$30 = require_dist_cjs$1();
	import_dist_cjs$31 = require_dist_cjs$2();
	init_ruleset();
	cache = new import_dist_cjs$31.EndpointCache({
		size: 50,
		params: [
			"Endpoint",
			"Region",
			"UseDualStack",
			"UseFIPS"
		]
	});
	defaultEndpointResolver = (endpointParams, context = {}) => {
		return cache.get(endpointParams, () => (0, import_dist_cjs$31.resolveEndpoint)(ruleSet, {
			endpointParams,
			logger: context.logger
		}));
	};
	import_dist_cjs$31.customEndpointFunctions.aws = import_dist_cjs$30.awsEndpointFunctions;
}));
//#endregion
//#region node_modules/@aws-sdk/nested-clients/dist-es/submodules/signin/models/SigninServiceException.js
var import_dist_cjs$29, SigninServiceException;
var init_SigninServiceException = __esmMin((() => {
	import_dist_cjs$29 = require_dist_cjs$18();
	SigninServiceException = class SigninServiceException extends import_dist_cjs$29.ServiceException {
		constructor(options) {
			super(options);
			Object.setPrototypeOf(this, SigninServiceException.prototype);
		}
	};
}));
//#endregion
//#region node_modules/@aws-sdk/nested-clients/dist-es/submodules/signin/models/errors.js
var AccessDeniedException, InternalServerException, TooManyRequestsError, ValidationException;
var init_errors = __esmMin((() => {
	init_SigninServiceException();
	AccessDeniedException = class AccessDeniedException extends SigninServiceException {
		name = "AccessDeniedException";
		$fault = "client";
		error;
		constructor(opts) {
			super({
				name: "AccessDeniedException",
				$fault: "client",
				...opts
			});
			Object.setPrototypeOf(this, AccessDeniedException.prototype);
			this.error = opts.error;
		}
	};
	InternalServerException = class InternalServerException extends SigninServiceException {
		name = "InternalServerException";
		$fault = "server";
		error;
		constructor(opts) {
			super({
				name: "InternalServerException",
				$fault: "server",
				...opts
			});
			Object.setPrototypeOf(this, InternalServerException.prototype);
			this.error = opts.error;
		}
	};
	TooManyRequestsError = class TooManyRequestsError extends SigninServiceException {
		name = "TooManyRequestsError";
		$fault = "client";
		error;
		constructor(opts) {
			super({
				name: "TooManyRequestsError",
				$fault: "client",
				...opts
			});
			Object.setPrototypeOf(this, TooManyRequestsError.prototype);
			this.error = opts.error;
		}
	};
	ValidationException = class ValidationException extends SigninServiceException {
		name = "ValidationException";
		$fault = "client";
		error;
		constructor(opts) {
			super({
				name: "ValidationException",
				$fault: "client",
				...opts
			});
			Object.setPrototypeOf(this, ValidationException.prototype);
			this.error = opts.error;
		}
	};
}));
//#endregion
//#region node_modules/@aws-sdk/nested-clients/dist-es/submodules/signin/schemas/schemas_0.js
var _ADE, _AT, _COAT, _COATR, _COATRB, _COATRBr, _COATRr, _ISE, _RT, _TMRE, _VE, _aKI, _aT, _c, _cI, _cV, _co, _e, _eI, _gT, _h, _hE, _iT, _jN, _m, _rT, _rU, _s, _sAK, _sT, _se, _tI, _tO, _tT, n0, _s_registry, SigninServiceException$, n0_registry, AccessDeniedException$, InternalServerException$, TooManyRequestsError$, ValidationException$, errorTypeRegistries, RefreshToken, AccessToken$, CreateOAuth2TokenRequest$, CreateOAuth2TokenRequestBody$, CreateOAuth2TokenResponse$, CreateOAuth2TokenResponseBody$, CreateOAuth2Token$;
var init_schemas_0 = __esmMin((() => {
	init_schema();
	init_errors();
	init_SigninServiceException();
	_ADE = "AccessDeniedException";
	_AT = "AccessToken";
	_COAT = "CreateOAuth2Token";
	_COATR = "CreateOAuth2TokenRequest";
	_COATRB = "CreateOAuth2TokenRequestBody";
	_COATRBr = "CreateOAuth2TokenResponseBody";
	_COATRr = "CreateOAuth2TokenResponse";
	_ISE = "InternalServerException";
	_RT = "RefreshToken";
	_TMRE = "TooManyRequestsError";
	_VE = "ValidationException";
	_aKI = "accessKeyId";
	_aT = "accessToken";
	_c = "client";
	_cI = "clientId";
	_cV = "codeVerifier";
	_co = "code";
	_e = "error";
	_eI = "expiresIn";
	_gT = "grantType";
	_h = "http";
	_hE = "httpError";
	_iT = "idToken";
	_jN = "jsonName";
	_m = "message";
	_rT = "refreshToken";
	_rU = "redirectUri";
	_s = "smithy.ts.sdk.synthetic.com.amazonaws.signin";
	_sAK = "secretAccessKey";
	_sT = "sessionToken";
	_se = "server";
	_tI = "tokenInput";
	_tO = "tokenOutput";
	_tT = "tokenType";
	n0 = "com.amazonaws.signin";
	_s_registry = TypeRegistry.for(_s);
	SigninServiceException$ = [
		-3,
		_s,
		"SigninServiceException",
		0,
		[],
		[]
	];
	_s_registry.registerError(SigninServiceException$, SigninServiceException);
	n0_registry = TypeRegistry.for(n0);
	AccessDeniedException$ = [
		-3,
		n0,
		_ADE,
		{ [_e]: _c },
		[_e, _m],
		[0, 0],
		2
	];
	n0_registry.registerError(AccessDeniedException$, AccessDeniedException);
	InternalServerException$ = [
		-3,
		n0,
		_ISE,
		{
			[_e]: _se,
			[_hE]: 500
		},
		[_e, _m],
		[0, 0],
		2
	];
	n0_registry.registerError(InternalServerException$, InternalServerException);
	TooManyRequestsError$ = [
		-3,
		n0,
		_TMRE,
		{
			[_e]: _c,
			[_hE]: 429
		},
		[_e, _m],
		[0, 0],
		2
	];
	n0_registry.registerError(TooManyRequestsError$, TooManyRequestsError);
	ValidationException$ = [
		-3,
		n0,
		_VE,
		{
			[_e]: _c,
			[_hE]: 400
		},
		[_e, _m],
		[0, 0],
		2
	];
	n0_registry.registerError(ValidationException$, ValidationException);
	errorTypeRegistries = [_s_registry, n0_registry];
	RefreshToken = [
		0,
		n0,
		_RT,
		8,
		0
	];
	AccessToken$ = [
		3,
		n0,
		_AT,
		8,
		[
			_aKI,
			_sAK,
			_sT
		],
		[
			[0, { [_jN]: _aKI }],
			[0, { [_jN]: _sAK }],
			[0, { [_jN]: _sT }]
		],
		3
	];
	CreateOAuth2TokenRequest$ = [
		3,
		n0,
		_COATR,
		0,
		[_tI],
		[[() => CreateOAuth2TokenRequestBody$, 16]],
		1
	];
	CreateOAuth2TokenRequestBody$ = [
		3,
		n0,
		_COATRB,
		0,
		[
			_cI,
			_gT,
			_co,
			_rU,
			_cV,
			_rT
		],
		[
			[0, { [_jN]: _cI }],
			[0, { [_jN]: _gT }],
			0,
			[0, { [_jN]: _rU }],
			[0, { [_jN]: _cV }],
			[() => RefreshToken, { [_jN]: _rT }]
		],
		2
	];
	CreateOAuth2TokenResponse$ = [
		3,
		n0,
		_COATRr,
		0,
		[_tO],
		[[() => CreateOAuth2TokenResponseBody$, 16]],
		1
	];
	CreateOAuth2TokenResponseBody$ = [
		3,
		n0,
		_COATRBr,
		0,
		[
			_aT,
			_tT,
			_eI,
			_rT,
			_iT
		],
		[
			[() => AccessToken$, { [_jN]: _aT }],
			[0, { [_jN]: _tT }],
			[1, { [_jN]: _eI }],
			[() => RefreshToken, { [_jN]: _rT }],
			[0, { [_jN]: _iT }]
		],
		4
	];
	CreateOAuth2Token$ = [
		9,
		n0,
		_COAT,
		{ [_h]: [
			"POST",
			"/v1/token",
			200
		] },
		() => CreateOAuth2TokenRequest$,
		() => CreateOAuth2TokenResponse$
	];
}));
//#endregion
//#region node_modules/@aws-sdk/nested-clients/dist-es/submodules/signin/runtimeConfig.shared.js
var import_dist_cjs$25, import_dist_cjs$26, import_dist_cjs$27, import_dist_cjs$28, getRuntimeConfig$1;
var init_runtimeConfig_shared = __esmMin((() => {
	init_httpAuthSchemes();
	init_protocols();
	init_dist_es();
	import_dist_cjs$25 = require_dist_cjs$18();
	import_dist_cjs$26 = require_dist_cjs$22();
	import_dist_cjs$27 = require_dist_cjs$19();
	import_dist_cjs$28 = require_dist_cjs$21();
	init_httpAuthSchemeProvider();
	init_endpointResolver();
	init_schemas_0();
	getRuntimeConfig$1 = (config) => {
		return {
			apiVersion: "2023-01-01",
			base64Decoder: config?.base64Decoder ?? import_dist_cjs$27.fromBase64,
			base64Encoder: config?.base64Encoder ?? import_dist_cjs$27.toBase64,
			disableHostPrefix: config?.disableHostPrefix ?? false,
			endpointProvider: config?.endpointProvider ?? defaultEndpointResolver,
			extensions: config?.extensions ?? [],
			httpAuthSchemeProvider: config?.httpAuthSchemeProvider ?? defaultSigninHttpAuthSchemeProvider,
			httpAuthSchemes: config?.httpAuthSchemes ?? [{
				schemeId: "aws.auth#sigv4",
				identityProvider: (ipc) => ipc.getIdentityProvider("aws.auth#sigv4"),
				signer: new AwsSdkSigV4Signer()
			}, {
				schemeId: "smithy.api#noAuth",
				identityProvider: (ipc) => ipc.getIdentityProvider("smithy.api#noAuth") || (async () => ({})),
				signer: new NoAuthSigner()
			}],
			logger: config?.logger ?? new import_dist_cjs$25.NoOpLogger(),
			protocol: config?.protocol ?? AwsRestJsonProtocol,
			protocolSettings: config?.protocolSettings ?? {
				defaultNamespace: "com.amazonaws.signin",
				errorTypeRegistries,
				version: "2023-01-01",
				serviceTarget: "Signin"
			},
			serviceId: config?.serviceId ?? "Signin",
			urlParser: config?.urlParser ?? import_dist_cjs$26.parseUrl,
			utf8Decoder: config?.utf8Decoder ?? import_dist_cjs$28.fromUtf8,
			utf8Encoder: config?.utf8Encoder ?? import_dist_cjs$28.toUtf8
		};
	};
}));
//#endregion
//#region node_modules/@aws-sdk/nested-clients/dist-es/submodules/signin/runtimeConfig.js
var import_dist_cjs$15, import_dist_cjs$16, import_dist_cjs$17, import_dist_cjs$18, import_dist_cjs$19, import_dist_cjs$20, import_dist_cjs$21, import_dist_cjs$22, import_dist_cjs$23, import_dist_cjs$24, getRuntimeConfig;
var init_runtimeConfig = __esmMin((() => {
	init_client();
	init_httpAuthSchemes();
	import_dist_cjs$15 = require_dist_cjs$3();
	import_dist_cjs$16 = require_dist_cjs$4();
	import_dist_cjs$17 = require_dist_cjs$5();
	import_dist_cjs$18 = require_dist_cjs$6();
	import_dist_cjs$19 = require_dist_cjs$23();
	import_dist_cjs$20 = require_dist_cjs$20();
	import_dist_cjs$21 = require_dist_cjs$18();
	import_dist_cjs$22 = require_dist_cjs$7();
	import_dist_cjs$23 = require_dist_cjs$8();
	import_dist_cjs$24 = require_dist_cjs$9();
	init_runtimeConfig_shared();
	getRuntimeConfig = (config) => {
		(0, import_dist_cjs$21.emitWarningIfUnsupportedVersion)(process.version);
		const defaultsMode = (0, import_dist_cjs$23.resolveDefaultsModeConfig)(config);
		const defaultConfigProvider = () => defaultsMode().then(import_dist_cjs$21.loadConfigsForDefaultMode);
		const clientSharedValues = getRuntimeConfig$1(config);
		emitWarningIfUnsupportedVersion$1(process.version);
		const loaderConfig = {
			profile: config?.profile,
			logger: clientSharedValues.logger
		};
		return {
			...clientSharedValues,
			...config,
			runtime: "node",
			defaultsMode,
			authSchemePreference: config?.authSchemePreference ?? (0, import_dist_cjs$19.loadConfig)(NODE_AUTH_SCHEME_PREFERENCE_OPTIONS, loaderConfig),
			bodyLengthChecker: config?.bodyLengthChecker ?? import_dist_cjs$22.calculateBodyLength,
			defaultUserAgentProvider: config?.defaultUserAgentProvider ?? (0, import_dist_cjs$15.createDefaultUserAgentProvider)({
				serviceId: clientSharedValues.serviceId,
				clientVersion: version
			}),
			maxAttempts: config?.maxAttempts ?? (0, import_dist_cjs$19.loadConfig)(import_dist_cjs$18.NODE_MAX_ATTEMPT_CONFIG_OPTIONS, config),
			region: config?.region ?? (0, import_dist_cjs$19.loadConfig)(import_dist_cjs$16.NODE_REGION_CONFIG_OPTIONS, {
				...import_dist_cjs$16.NODE_REGION_CONFIG_FILE_OPTIONS,
				...loaderConfig
			}),
			requestHandler: import_dist_cjs$20.NodeHttpHandler.create(config?.requestHandler ?? defaultConfigProvider),
			retryMode: config?.retryMode ?? (0, import_dist_cjs$19.loadConfig)({
				...import_dist_cjs$18.NODE_RETRY_MODE_CONFIG_OPTIONS,
				default: async () => (await defaultConfigProvider()).retryMode || import_dist_cjs$24.DEFAULT_RETRY_MODE
			}, config),
			sha256: config?.sha256 ?? import_dist_cjs$17.Hash.bind(null, "sha256"),
			streamCollector: config?.streamCollector ?? import_dist_cjs$20.streamCollector,
			useDualstackEndpoint: config?.useDualstackEndpoint ?? (0, import_dist_cjs$19.loadConfig)(import_dist_cjs$16.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS, loaderConfig),
			useFipsEndpoint: config?.useFipsEndpoint ?? (0, import_dist_cjs$19.loadConfig)(import_dist_cjs$16.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS, loaderConfig),
			userAgentAppId: config?.userAgentAppId ?? (0, import_dist_cjs$19.loadConfig)(import_dist_cjs$15.NODE_APP_ID_CONFIG_OPTIONS, loaderConfig)
		};
	};
}));
//#endregion
//#region node_modules/@aws-sdk/nested-clients/dist-es/submodules/signin/auth/httpAuthExtensionConfiguration.js
var getHttpAuthExtensionConfiguration, resolveHttpAuthRuntimeConfig;
var init_httpAuthExtensionConfiguration = __esmMin((() => {
	getHttpAuthExtensionConfiguration = (runtimeConfig) => {
		const _httpAuthSchemes = runtimeConfig.httpAuthSchemes;
		let _httpAuthSchemeProvider = runtimeConfig.httpAuthSchemeProvider;
		let _credentials = runtimeConfig.credentials;
		return {
			setHttpAuthScheme(httpAuthScheme) {
				const index = _httpAuthSchemes.findIndex((scheme) => scheme.schemeId === httpAuthScheme.schemeId);
				if (index === -1) _httpAuthSchemes.push(httpAuthScheme);
				else _httpAuthSchemes.splice(index, 1, httpAuthScheme);
			},
			httpAuthSchemes() {
				return _httpAuthSchemes;
			},
			setHttpAuthSchemeProvider(httpAuthSchemeProvider) {
				_httpAuthSchemeProvider = httpAuthSchemeProvider;
			},
			httpAuthSchemeProvider() {
				return _httpAuthSchemeProvider;
			},
			setCredentials(credentials) {
				_credentials = credentials;
			},
			credentials() {
				return _credentials;
			}
		};
	};
	resolveHttpAuthRuntimeConfig = (config) => {
		return {
			httpAuthSchemes: config.httpAuthSchemes(),
			httpAuthSchemeProvider: config.httpAuthSchemeProvider(),
			credentials: config.credentials()
		};
	};
}));
//#endregion
//#region node_modules/@aws-sdk/nested-clients/dist-es/submodules/signin/runtimeExtensions.js
var import_dist_cjs$12, import_dist_cjs$13, import_dist_cjs$14, resolveRuntimeExtensions;
var init_runtimeExtensions = __esmMin((() => {
	import_dist_cjs$12 = require_dist_cjs$10();
	import_dist_cjs$13 = require_dist_cjs();
	import_dist_cjs$14 = require_dist_cjs$18();
	init_httpAuthExtensionConfiguration();
	resolveRuntimeExtensions = (runtimeConfig, extensions) => {
		const extensionConfiguration = Object.assign((0, import_dist_cjs$12.getAwsRegionExtensionConfiguration)(runtimeConfig), (0, import_dist_cjs$14.getDefaultExtensionConfiguration)(runtimeConfig), (0, import_dist_cjs$13.getHttpHandlerExtensionConfiguration)(runtimeConfig), getHttpAuthExtensionConfiguration(runtimeConfig));
		extensions.forEach((extension) => extension.configure(extensionConfiguration));
		return Object.assign(runtimeConfig, (0, import_dist_cjs$12.resolveAwsRegionExtensionConfiguration)(extensionConfiguration), (0, import_dist_cjs$14.resolveDefaultRuntimeConfig)(extensionConfiguration), (0, import_dist_cjs$13.resolveHttpHandlerRuntimeConfig)(extensionConfiguration), resolveHttpAuthRuntimeConfig(extensionConfiguration));
	};
}));
//#endregion
//#region node_modules/@aws-sdk/nested-clients/dist-es/submodules/signin/SigninClient.js
var import_dist_cjs$3, import_dist_cjs$4, import_dist_cjs$5, import_dist_cjs$6, import_dist_cjs$7, import_dist_cjs$8, import_dist_cjs$9, import_dist_cjs$10, import_dist_cjs$11, SigninClient;
var init_SigninClient = __esmMin((() => {
	import_dist_cjs$3 = require_dist_cjs$11();
	import_dist_cjs$4 = require_dist_cjs$12();
	import_dist_cjs$5 = require_dist_cjs$13();
	import_dist_cjs$6 = require_dist_cjs$14();
	import_dist_cjs$7 = require_dist_cjs$4();
	init_dist_es();
	init_schema();
	import_dist_cjs$8 = require_dist_cjs$15();
	import_dist_cjs$9 = require_dist_cjs$16();
	import_dist_cjs$10 = require_dist_cjs$6();
	import_dist_cjs$11 = require_dist_cjs$18();
	init_httpAuthSchemeProvider();
	init_EndpointParameters();
	init_runtimeConfig();
	init_runtimeExtensions();
	SigninClient = class extends import_dist_cjs$11.Client {
		config;
		constructor(...[configuration]) {
			const _config_0 = getRuntimeConfig(configuration || {});
			super(_config_0);
			this.initConfig = _config_0;
			this.config = resolveRuntimeExtensions(resolveHttpAuthSchemeConfig((0, import_dist_cjs$9.resolveEndpointConfig)((0, import_dist_cjs$3.resolveHostHeaderConfig)((0, import_dist_cjs$7.resolveRegionConfig)((0, import_dist_cjs$10.resolveRetryConfig)((0, import_dist_cjs$6.resolveUserAgentConfig)(resolveClientEndpointParameters(_config_0))))))), configuration?.extensions || []);
			this.middlewareStack.use(getSchemaSerdePlugin(this.config));
			this.middlewareStack.use((0, import_dist_cjs$6.getUserAgentPlugin)(this.config));
			this.middlewareStack.use((0, import_dist_cjs$10.getRetryPlugin)(this.config));
			this.middlewareStack.use((0, import_dist_cjs$8.getContentLengthPlugin)(this.config));
			this.middlewareStack.use((0, import_dist_cjs$3.getHostHeaderPlugin)(this.config));
			this.middlewareStack.use((0, import_dist_cjs$4.getLoggerPlugin)(this.config));
			this.middlewareStack.use((0, import_dist_cjs$5.getRecursionDetectionPlugin)(this.config));
			this.middlewareStack.use(getHttpAuthSchemeEndpointRuleSetPlugin(this.config, {
				httpAuthSchemeParametersProvider: defaultSigninHttpAuthSchemeParametersProvider,
				identityProviderConfigProvider: async (config) => new DefaultIdentityProviderConfig({ "aws.auth#sigv4": config.credentials })
			}));
			this.middlewareStack.use(getHttpSigningPlugin(this.config));
		}
		destroy() {
			super.destroy();
		}
	};
}));
//#endregion
//#region node_modules/@aws-sdk/nested-clients/dist-es/submodules/signin/commands/CreateOAuth2TokenCommand.js
var import_dist_cjs$1, import_dist_cjs$2, CreateOAuth2TokenCommand;
var init_CreateOAuth2TokenCommand = __esmMin((() => {
	import_dist_cjs$1 = require_dist_cjs$16();
	import_dist_cjs$2 = require_dist_cjs$18();
	init_EndpointParameters();
	init_schemas_0();
	CreateOAuth2TokenCommand = class extends import_dist_cjs$2.Command.classBuilder().ep(commonParams).m(function(Command, cs, config, o) {
		return [(0, import_dist_cjs$1.getEndpointPlugin)(config, Command.getEndpointParameterInstructions())];
	}).s("Signin", "CreateOAuth2Token", {}).n("SigninClient", "CreateOAuth2TokenCommand").sc(CreateOAuth2Token$).build() {};
}));
//#endregion
//#region node_modules/@aws-sdk/nested-clients/dist-es/submodules/signin/Signin.js
var import_dist_cjs, commands, Signin;
var init_Signin = __esmMin((() => {
	import_dist_cjs = require_dist_cjs$18();
	init_CreateOAuth2TokenCommand();
	init_SigninClient();
	commands = { CreateOAuth2TokenCommand };
	Signin = class extends SigninClient {};
	(0, import_dist_cjs.createAggregatedClient)(commands, Signin);
}));
//#endregion
//#region node_modules/@aws-sdk/nested-clients/dist-es/submodules/signin/commands/index.js
var init_commands = __esmMin((() => {
	init_CreateOAuth2TokenCommand();
}));
//#endregion
//#region node_modules/@aws-sdk/nested-clients/dist-es/submodules/signin/models/enums.js
var init_enums = __esmMin((() => {}));
//#endregion
//#region node_modules/@aws-sdk/nested-clients/dist-es/submodules/signin/models/models_0.js
var init_models_0 = __esmMin((() => {}));
//#endregion
__esmMin((() => {
	init_SigninClient();
	init_Signin();
	init_commands();
	init_schemas_0();
	init_enums();
	init_errors();
	init_models_0();
}))();
export { CreateOAuth2TokenCommand, SigninClient };
