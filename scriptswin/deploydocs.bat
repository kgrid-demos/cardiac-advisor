#!/usr/bin/env sh

cd docs
cd docs/.vuepress/dist

git init
git add -A
git commit -m "Deployment to GitHub Pages"

git push -f https://github.com/kgrid-demos/cardiac-advisor.git master:gh-pages
