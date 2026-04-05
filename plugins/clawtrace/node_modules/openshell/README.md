# OpenShell

OpenShell은 Telegram 메시지를 로컬 CLI(`codex`, `claude`)에 연결하는 브리지 봇입니다.

- `codex` provider: 로컬 `codex exec --json` 사용
- `claude` provider: 로컬 `claude -p --output-format stream-json` 사용

CLI 스트림 이벤트를 받아 같은 메시지를 계속 `edit`하므로 답변이 실시간으로 갱신됩니다.

## 1. 설치

```bash
npm install
```

## 2. 최소 설정

`.env.example`를 복사해 `.env`를 만들고, 아래 1개만 채우면 실행됩니다.

```bash
cp .env.example .env
```

```dotenv
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
```

처음 실행 후 Telegram에서 봇과 대화를 열고 `/init`을 1번 실행해 소유자(1인)를 등록해야 합니다.

필수 조건:

- 로컬 CLI 최소 1개 설치: `codex` 또는 `claude`
- 해당 CLI 로그인 완료 (`codex login`, `claude setup-token` 등)

## 3. 실행

개발 모드:

```bash
npm run dev
```

빌드 후 실행:

```bash
npm run build
npm run start
```

## 4. Telegram 사용법

- 일반 메시지: 그대로 질문
- `/init` (최초 1회, 소유자 등록)
- `/model codex` 또는 `/model claude` (provider 전환)
- `/model [codex|claude] <model|default> [effort|default]` (모델 변경)
- `/models` (매번 새로 조회)
- `/reset`
- `/uid`
- `/help`

모델/effort 예시:

- `/model codex` (Codex로 전환)
- `/model codex gpt-5.3-codex xhigh` (Codex 모델 + effort 설정)
- `/model codex gpt-5.3-codex default` (Codex 모델 설정 + effort override 해제)
- `/model codex default` (Codex 모델/effort override 모두 해제)
- `/model claude` (Claude로 전환)
- `/model claude sonnet` (Claude 모델 설정)

Codex effort 지원값:

- `none`, `minimal`, `low`, `medium`, `high`, `xhigh`

참고:

- provider를 생략하면 현재 provider 기준으로 처리됩니다.
- Claude CLI는 effort 단계 선택을 지원하지 않습니다. (`xhigh` 같은 인자는 무시)
- `/models`는 실행 시마다 로컬 파일/바이너리에서 목록을 다시 읽습니다. (Codex는 `~/.codex/models_cache.json`)
- 계정 권한/플랜에 따라 일부 모델은 실제 실행 시 거부될 수 있습니다.

## 참고

- `/init`은 현재 사용자를 소유자(1인)로 등록하고 `.openshell/owner.json`에 저장합니다. (`SESSION_STORE_PATH`와 같은 폴더)
- OpenShell은 Codex/Claude CLI를 권한 확인 없이 실행하도록 구성되어 있어 위험합니다. 신뢰 가능한 환경에서만 사용하세요.
- `codex`는 `~/.codex/models_cache.json`에서 모델 목록을 읽습니다.
- `claude`는 로컬 CLI 바이너리에서 모델 식별자를 추출해 목록을 만듭니다.
- 모델/effort override와 대화 히스토리는 채팅 단위로 저장되며, 재시작 후 자동 복구됩니다.
- 세션 저장 파일 위치는 `SESSION_STORE_PATH`로 변경할 수 있습니다.
- 답글(reply)로 질문하면 원본 메시지 텍스트를 함께 참고합니다.
- 긴 응답은 Telegram 길이 제한(4096)으로 잘려 표시될 수 있습니다.
- 동일 채팅에서 여러 질문을 연속 전송하면 내부적으로 순차 처리(큐)되어 응답 꼬임을 줄입니다.
