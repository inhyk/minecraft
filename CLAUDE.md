# CLAUDE.md

이 파일은 Claude Code (claude.ai/code)가 이 저장소의 코드를 작업할 때 참고하는 가이드입니다.

## 프로젝트 개요

바닐라 JavaScript와 Node.js로 만든 온라인 멀티플레이어 지원 2D 마인크래프트 클론입니다. 절차적 월드 생성, 블록 채굴/설치, 크래프팅, 몹, WebSocket을 통한 실시간 멀티플레이어를 지원합니다.

## 명령어

- **서버 시작**: `npm start` 또는 `node server.js`
- **게임 접속**: 서버 시작 후 브라우저에서 `http://localhost:3000` 열기

## 아키텍처

### 서버 (`server.js`)
- HTTP 서버가 정적 파일 제공
- WebSocket 서버(`ws` 라이브러리)가 멀티플레이어 처리
- 서버에서 게임 상태 관리: 월드 시드, 블록 변경, 플레이어, 몹 상태
- 호스트 플레이어(첫 번째 접속자)가 몹 시뮬레이션을 실행하고 다른 플레이어에게 동기화
- 메시지 타입: `join`, `move`, `block_set`, `mob_state`, `chat`

### 클라이언트 (`index.html` + `js/` 모듈)
모듈화된 클라이언트 구조:

| 파일 | 설명 |
|------|------|
| `js/config.js` | 게임 상수 (블록 크기, 월드 크기, 물리 값 등) |
| `js/state.js` | 전역 게임 상태 변수 |
| `js/blocks.js` | 블록 타입 정의 및 렌더링 (20종) |
| `js/utils.js` | 유틸리티 함수 (PRNG, 노이즈 등) |
| `js/world.js` | 절차적 월드 생성 (바이옴, 동굴, 광석, 나무) |
| `js/player.js` | 플레이어 생성, 물리, 렌더링 |
| `js/mining.js` | 블록 채굴 로직 |
| `js/particles.js` | 파티클 시스템 |
| `js/camera.js` | 카메라 따라가기 |
| `js/clouds.js` | 구름 생성 및 렌더링 |
| `js/mobs.js` | 몹 AI 및 전투 (좀비, 크리퍼, 스켈레톤) |
| `js/inventory.js` | 36칸 인벤토리, 2x2 크래프팅 |
| `js/multiplayer.js` | WebSocket 연결, 위치/블록/몹 동기화 |
| `js/render.js` | 월드 및 UI 렌더링 |
| `js/title.js` | 타이틀 화면 |
| `js/input.js` | 키보드/마우스 입력 처리 |
| `js/main.js` | 게임 루프 및 초기화 |

### 주요 상수 (`js/config.js`)
- `BLOCK_SIZE`: 32px
- `WORLD_WIDTH`: 256 블록
- `WORLD_HEIGHT`: 128 블록
- `SURFACE_Y`: 50 (지면 높이)
- `NET_SEND_RATE`: 50ms (네트워크 동기화 주기)
- `MOB_SYNC_RATE`: 100ms (몹 상태 동기화 주기)
- 서버 포트: 3000

### 게임 상태 (`js/state.js`)
- `STATE.TITLE` (0): 타이틀 화면
- `STATE.PLAYING` (1): 게임 플레이
- `STATE.CONNECT` (2): 멀티플레이어 연결 화면

### 블록 타입 (`js/blocks.js`)
20가지 블록: AIR, GRASS, DIRT, STONE, WOOD, LEAVES, SAND, WATER, COAL_ORE, IRON_ORE, GOLD_ORE, DIAMOND_ORE, BEDROCK, PLANKS, COBBLESTONE, BRICK, GLASS, SNOW, CRAFT_TABLE, COPPER_ORE

### 멀티플레이어 프로토콜
서버가 플레이어 ID와 색상을 할당합니다. 호스트(첫 번째 플레이어)가 몹 시뮬레이션을 실행하고 몹 상태를 브로드캐스트합니다. 블록 변경사항은 서버에 저장되어 새 플레이어 접속 시 전송됩니다.

## 배포 참고사항

- **Vercel**: 정적 파일만 호스팅 가능, WebSocket 서버 미지원
- **멀티플레이어 배포**: WebSocket 서버는 Railway, Render, Fly.io 등 별도 플랫폼에 배포 필요
