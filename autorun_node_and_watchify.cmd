@echo off
start cmd.exe /k node bin/www
start cmd.exe /k watchify public/javascripts/new/main.js -v -o public/javascripts/new/bundle.js