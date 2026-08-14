---
title: Interactive documentation
lead: How to get started
description: Create documentation that interacts with your reader
layout: holy
---



<Image src="card_puncher_data_processing.jpg" alt="Card Puncher" width="300" height="200" fit="contain"/>


**Install**

```bash
# app only (without package.json)
npm install -g @combostrap/interact
# in a project
npm init -y
npm install @combostrap/interact
```

**Create a [page](reference/page.md)**

```bash
mkdir -p src/pages
echo -e "# Hallo\nWorld" > src/pages/index.md
```

**Start the server**

```bash
# app only (without package.json)
interact start
# in a project
npx interact start
```
