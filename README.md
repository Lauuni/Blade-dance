# 검무 (Blade Dance)

HTML5 액션 콤보 프로토타입 — 허수아비 수련장.

- ▶ **바로 플레이: https://lauuni.github.io/Blade-dance/** (PC 기준)
- 🧪 **지금 main은 v0.5.3 + 프로토타입 P7 (레이드 5차 · 로그라이크 모드)** (실험, 정식 버전 아님. 아래 "프로토타입 기록" 표 참고). 시작 화면에서 "연습 모드"를 고르면 기존 게임 그대로. 순수한 v0.5.3은 [여기](https://lauuni.github.io/Blade-dance/versions/v0.5.3.html)
- 🧪 **체험판 (적과 싸우기, 버릴 수도 있는 실험): https://lauuni.github.io/Blade-dance/lab.html** — 본 게임과 별도 파일
- 또는 `index.html`을 브라우저로 열기
- 목표: 어떤 기술 조합으로 가장 긴 콤보를 넣을 수 있는지 연구하는 수련장

## 설계 문서
작업 규칙·현재 상태·결정·다음 순서: [검무 설계 문서](https://claude.ai/artifact/1yJgErXyuRuoisJYvb2SBL) (Claude 계정에서만 열림)

## 버전
자세한 내용은 [CHANGELOG.md](CHANGELOG.md)

**옛 버전 실행:** 아래 표의 ▶ 링크를 누르면 브라우저에서 바로 실행돼요

- 0.5.3 — 평타 눈부심 제거, 임팩트 프레임 설정(켬·약하게·끔), 선택 창 커서 수정, tests/ 폴더
- 0.5.2 — 캐릭터 창 미리보기 고정, 확정 후 빠르게 닫힘
- 0.5.1 — 카메라 기본·넓게·확대(B/V), 캐릭터 단축키(,), 캐릭터·맵 키보드 선택, 캐릭터 카드 정렬
- 0.5.0 — 새 캐릭터 연화(포니테일·하카마·전용 서기/걷기/질주/대쉬/점프), 메뉴 → 캐릭터 선택, 콤보 보정 0.1 단위
- 0.4.9 — 찢어진 천 끝단 다시(넓은 조각), 머플러 기본값, 등불 바람 비례
- 0.4.8 — 찢어진 천 머플러(뻣뻣함·바닥 충돌), 종 기본값 확정, 메뉴 순서·M 맵·N 소리, 대쉬 기울기, 등불 무작위
- 0.4.7 — 새 종소리·거리감·위치감, 즉시 마우스 끌기, Q로 메뉴, 설정을 메뉴 안으로, 피 털기·지루해하기 다듬기
- 0.4.6 — 기술 칸 자유 배치(자리 바꾸기·비우기), 대기 동작 4종(지루해하기·칼끝 짚고 쉬기), 허리띠, 처마 종 기울기 판정, 제동 통일, Q 창 닫기
- 0.4.5 — PC 기준 UI 전면 개편(탭 패널·숫자 입력·드래그 장착·툴팁·UI 크기·전체화면), 소리 채널 5개, 질주 제동, 머플러 앞자락, 피 털기·칼 들기·숨 고르기 다듬기
- 0.4.4 — 메뉴·설정 개편(설정 슬롯), 바람 물리(스프링), 머플러, 양손 달리기·대쉬·환영연참, 발소리·흙먼지, 연출 다듬기, 멈춤 버그 수정
- 0.4.3 — 양손 검술, 넓게 보기(B), 인게임 설정, 공중 관성 3종·혼합, 질주베기 새 마무리, 바운드 3단계, 연출 완성본(납도·피 털기·바람 등)
- 0.4.2 — 바운드 타격 정리, 공중 관성 4종, 질주베기 마무리 A/B/C, 연출 시안 22종, 칼·림 라이트 수정
- 0.4.1 — 무한 들판 버그 수정, 질주베기 즉시 발동, 스킬 선입력, 분신 다듬기, 테스트 기본값 반영
- 0.4.0 — 키 변경, 선입력, 콤보 노트·연습 가이드, 무한 들판 맵, 테스트 설정 강화, 비검회선·영월분신·빙화결, 캐릭터 외형·모션 다듬기
- 0.3.0 — 적 상태(경직/공중/바운드/다운/기상), 콤보 보정(평타↔스킬 전환 회복), 테스트 설정창, 콤보 루트 기록, 대쉬 쿨타임, 회천륜·화월무
- 0.2.0 — 달리기·질주베기, 기술 10종, 이동/점프 모션 개선
- 0.1.0 — 첫 프로토타입 (기술 5종, 3칸 슬롯, PC/모바일)

## 버전별 플레이 · 코드

| 버전 | 커밋 | 바로가기 |
|---|---|---|
| 0.5.3 | `5e35a55` | [▶ 플레이](https://lauuni.github.io/Blade-dance/versions/v0.5.3.html) · [그 시점 파일들](https://github.com/Lauuni/Blade-dance/tree/5e35a55) · [바뀐 내용](https://github.com/Lauuni/Blade-dance/commit/5e35a55) |
| 0.5.2 | `36e888c` | [▶ 플레이](https://lauuni.github.io/Blade-dance/versions/v0.5.2.html) · [그 시점 파일들](https://github.com/Lauuni/Blade-dance/tree/36e888c) · [바뀐 내용](https://github.com/Lauuni/Blade-dance/commit/36e888c) |
| 0.5.1 | `b8a9209` | [▶ 플레이](https://lauuni.github.io/Blade-dance/versions/v0.5.1.html) · [그 시점 파일들](https://github.com/Lauuni/Blade-dance/tree/b8a9209) · [바뀐 내용](https://github.com/Lauuni/Blade-dance/commit/b8a9209) |
| 0.5.0 | `5bbb92d` | [▶ 플레이](https://lauuni.github.io/Blade-dance/versions/v0.5.0.html) · [그 시점 파일들](https://github.com/Lauuni/Blade-dance/tree/5bbb92d) · [바뀐 내용](https://github.com/Lauuni/Blade-dance/commit/5bbb92d) |
| 0.4.9 | `6e3731d` | [▶ 플레이](https://lauuni.github.io/Blade-dance/versions/v0.4.9.html) · [그 시점 파일들](https://github.com/Lauuni/Blade-dance/tree/6e3731d) · [바뀐 내용](https://github.com/Lauuni/Blade-dance/commit/6e3731d) |
| 0.4.8 | `11e94b4` | [▶ 플레이](https://lauuni.github.io/Blade-dance/versions/v0.4.8.html) · [그 시점 파일들](https://github.com/Lauuni/Blade-dance/tree/11e94b4) · [바뀐 내용](https://github.com/Lauuni/Blade-dance/commit/11e94b4) |
| 0.4.7 | `8154a45` | [▶ 플레이](https://lauuni.github.io/Blade-dance/versions/v0.4.7.html) · [그 시점 파일들](https://github.com/Lauuni/Blade-dance/tree/8154a45) · [바뀐 내용](https://github.com/Lauuni/Blade-dance/commit/8154a45) |
| 0.4.6 | `b1e7838` | [▶ 플레이](https://lauuni.github.io/Blade-dance/versions/v0.4.6.html) · [그 시점 파일들](https://github.com/Lauuni/Blade-dance/tree/b1e7838) · [바뀐 내용](https://github.com/Lauuni/Blade-dance/commit/b1e7838) |
| 0.4.5 | `912bf71` | [▶ 플레이](https://lauuni.github.io/Blade-dance/versions/v0.4.5.html) · [그 시점 파일들](https://github.com/Lauuni/Blade-dance/tree/912bf71) · [바뀐 내용](https://github.com/Lauuni/Blade-dance/commit/912bf71) |
| 0.4.4 | `d39f082` | [▶ 플레이](https://lauuni.github.io/Blade-dance/versions/v0.4.4.html) · [그 시점 파일들](https://github.com/Lauuni/Blade-dance/tree/d39f082) · [바뀐 내용](https://github.com/Lauuni/Blade-dance/commit/d39f082) |
| 0.4.3 | `a103b5d` | [▶ 플레이](https://lauuni.github.io/Blade-dance/versions/v0.4.3.html) · [그 시점 파일들](https://github.com/Lauuni/Blade-dance/tree/a103b5d) · [바뀐 내용](https://github.com/Lauuni/Blade-dance/commit/a103b5d) |
| 0.4.2 | `b8450a1` | [▶ 플레이](https://lauuni.github.io/Blade-dance/versions/v0.4.2.html) · [그 시점 파일들](https://github.com/Lauuni/Blade-dance/tree/b8450a1) · [바뀐 내용](https://github.com/Lauuni/Blade-dance/commit/b8450a1) |
| 0.4.1 | `8ae137d` | [▶ 플레이](https://lauuni.github.io/Blade-dance/versions/v0.4.1.html) · [그 시점 파일들](https://github.com/Lauuni/Blade-dance/tree/8ae137d) · [바뀐 내용](https://github.com/Lauuni/Blade-dance/commit/8ae137d) |
| 0.4.0 | `47bcf9e` | [▶ 플레이](https://lauuni.github.io/Blade-dance/versions/v0.4.0.html) · [그 시점 파일들](https://github.com/Lauuni/Blade-dance/tree/47bcf9e) · [바뀐 내용](https://github.com/Lauuni/Blade-dance/commit/47bcf9e) |
| 0.3.0 | `e8df7ff` | [▶ 플레이](https://lauuni.github.io/Blade-dance/versions/v0.3.0.html) · [그 시점 파일들](https://github.com/Lauuni/Blade-dance/tree/e8df7ff) · [바뀐 내용](https://github.com/Lauuni/Blade-dance/commit/e8df7ff) |
| 0.2.0 | `48cc041` | [▶ 플레이](https://lauuni.github.io/Blade-dance/versions/v0.2.0.html) · [그 시점 파일들](https://github.com/Lauuni/Blade-dance/tree/48cc041) · [바뀐 내용](https://github.com/Lauuni/Blade-dance/commit/48cc041) |
| 0.1.0 | `3aa7fbf` | [▶ 플레이](https://lauuni.github.io/Blade-dance/versions/v0.1.0.html) · [그 시점 파일들](https://github.com/Lauuni/Blade-dance/tree/3aa7fbf) · [바뀐 내용](https://github.com/Lauuni/Blade-dance/commit/3aa7fbf) |

### 프로토타입 기록 (정식 버전 아님)

방향을 정하기 위한 실험들이에요. 정식 버전과 따로 모아둬요.

| 번호 | 커밋 | 내용 | 바로가기 |
|---|---|---|---|
| P7 | `84c1d9e` | 레이드 5차 (연기 전조, 짧은 카운터 창, 대검기 가드, 레이드 설정 탭) | [▶ 플레이](https://lauuni.github.io/Blade-dance/versions/p7.html) · [그 시점 파일들](https://github.com/Lauuni/Blade-dance/tree/84c1d9e) · [바뀐 내용](https://github.com/Lauuni/Blade-dance/commit/84c1d9e) |
| P6 | `4f41075` | 레이드 4차 + 게임 필 (패턴 비율 설정, 벽력일섬 전조, 보정 넘침, 카메라·소리) | [▶ 플레이](https://lauuni.github.io/Blade-dance/versions/p6.html) · [그 시점 파일들](https://github.com/Lauuni/Blade-dance/tree/4f41075) · [바뀐 내용](https://github.com/Lauuni/Blade-dance/commit/4f41075) |
| P5 | `d315539` | 레이드 모드 3차 (벽력일섬 회피, 속박 삼연격 가드, 머리 위 체력·기력) | [▶ 플레이](https://lauuni.github.io/Blade-dance/versions/p5.html) · [그 시점 파일들](https://github.com/Lauuni/Blade-dance/tree/d315539) · [바뀐 내용](https://github.com/Lauuni/Blade-dance/commit/d315539) |
| P4 | `e01de00` | 레이드 모드 2차 (튕김, 빈틈, 기력, 저스트 회피 반격, 가드 고리) | [▶ 플레이](https://lauuni.github.io/Blade-dance/versions/p4.html) · [그 시점 파일들](https://github.com/Lauuni/Blade-dance/tree/e01de00) · [바뀐 내용](https://github.com/Lauuni/Blade-dance/commit/e01de00) |
| P3 | `6ded6e4` | 레이드 모드 1차 (보스 흑월, 패턴 8개, 그로기 4종) | [▶ 플레이](https://lauuni.github.io/Blade-dance/versions/p3.html) · [그 시점 파일들](https://github.com/Lauuni/Blade-dance/tree/6ded6e4) · [바뀐 내용](https://github.com/Lauuni/Blade-dance/commit/6ded6e4) |
| P2 | `a3fc145` | 프로토타입 모드 (로그라이크: 층 오르기, 점수, 유물) | [▶ 플레이](https://lauuni.github.io/Blade-dance/versions/p2.html) · [그 시점 파일들](https://github.com/Lauuni/Blade-dance/tree/a3fc145) · [바뀐 내용](https://github.com/Lauuni/Blade-dance/commit/a3fc145) |
| P1 | `95d6524` | 적 체험판 (lab.html: 반격하는 적, 플레이어 체력) | [▶ 플레이](https://lauuni.github.io/Blade-dance/versions/p1.html) · [그 시점 파일들](https://github.com/Lauuni/Blade-dance/tree/95d6524) · [바뀐 내용](https://github.com/Lauuni/Blade-dance/commit/95d6524) |
