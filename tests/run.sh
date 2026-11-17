#!/bin/sh
# 저장소 맨 위 폴더에서 실행: sh tests/run.sh
# 필요: node, playwright (+ chromium). 스크린샷은 /tmp 에 저장됨.
for f in load mobile finite chains idle_ground move_wind yeon_all_acts picker_camera preview_fixed impact_modes picker_cursor; do
  echo "== $f"; node tests/$f.js 2>&1 | tail -4
done
echo "== run_mode"; node tests/run_mode.js 2>&1 | tail -1
echo "== raid_mode"; node tests/raid_mode.js 2>&1 | tail -1
# 체험판 (lab.html)
echo "== lab_enemy"; node tests/lab_enemy.js 2>&1 | tail -1
