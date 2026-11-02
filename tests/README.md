# 테스트

저장소 맨 위 폴더에서 `sh tests/run.sh` 로 전부 실행해요. 하나만: `node tests/load.js`.
필요한 것: node + playwright(chromium). 게임 안의 테스트 장치 `window.__bd` 를 써요 (hold/adv 로 시간을 멈추고 직접 넘김).

| 파일 | 확인하는 것 | 정상 결과 |
|---|---|---|
| load.js | 페이지 로드 오류 | 아무것도 안 찍힘 |
| mobile.js | 휴대폰 화면에서 안 깨지는지 | `ERR` 뒤가 비어 있음 |
| finite.js | 모든 동작에서 관절 좌표가 정상 숫자인지 | `all finite` |
| chains.js | 점프→대쉬→공격 등 연계 | 연계 이름이 이어져 찍힘 |
| idle_ground.js | 대기 10초 동안 칼끝·발이 땅 아래로 안 내려감 | `0.00` |
| move_wind.js | 걷기→공격, 슈퍼아머 후 질주 해제, 바람 끄기 | 오류 없음 |
| yeon_all_acts.js | 연화로 모든 동작·두 맵·대쉬 중 캐릭터 바꾸기 | `acts issues none`, `0.00` |
| picker_camera.js | `,`·M 창 키보드 선택, B/V 카메라 순환 | `넓게 확대 기본 확대 넓게` |
| preview_fixed.js | 캐릭터 카드 미리보기가 항상 같은지, 0.12초 닫힘 | 전부 `true` |
| impact_modes.js | 임팩트 프레임 켬/약하게/끔 (스크린샷 /tmp/im_*.png) | 오류 없음 |
| picker_cursor.js | 창이 사용 중인 것에서 시작, 가만있는 마우스 무시 | 열 때 `kf` = `sel` |
