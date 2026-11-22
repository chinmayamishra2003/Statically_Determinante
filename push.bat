@echo off
REM Pull first: images and edits made on the website are commits too.
git pull --rebase origin main
git add -A
set /p m=Commit message: 
if "%m%"=="" set m=update
git commit -m "%m%"
git push origin main
pause
