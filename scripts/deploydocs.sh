#!/usr/bin/env sh

# abort on errors
set -e
git config --global user.email "kgrid-developers@umich.edu"
git config --global user.name "circleci"

# build
npm run docs:build
# copy web demo to github pages dist
cd docs
cp -r fhir-app .vuepress/dist
# mkdir -p docs/.vuepress/dist/.circleci
# cp -a .circleci/. docs/.vuepress/dist/.circleci/.

# navigate into the build output directory
cd .vuepress/dist

git init
git add -A
git commit -m "Automated deployment to GitHub Pages"

# if you are deploying to https://<USERNAME>.github.io/<REPO>
git push -f https://${GITHUB_TOKEN}@github.com/kgrid-demos/cardiac-advisor.git master:gh-pages
