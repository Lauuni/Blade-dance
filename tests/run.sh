#!/bin/sh
# 저장소 맨 위 폴더에서 실행: sh tests/run.sh
# 필요: node, playwright (+ chromium). 스크린샷은 /tmp 에 저장됨.
for f in load mobile finite chains idle_ground move_wind yeon_all_acts picker_camera preview_fixed impact_modes picker_cursor; do
  echo "== $f"; node tests/$f.js 2>&1 | tail -4
done
