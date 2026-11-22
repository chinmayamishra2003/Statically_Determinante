#!/bin/sh
git pull --rebase origin main
git add -A
printf "Commit message: "; read m
git commit -m "${m:-update}"
git push origin main
