---
title: "What is Wazuh?"
cover:
  src: "./cover.png"
  alt: "The wazuh official logo"
description: "An introduction to Wazuh, the open-source security platform: what it does, how it's built and when to use it."
pubDate: 2026-10-23
tags: ["wazuh", "security", "siem"]
draft: true
---

Wazuh is an open-source security platform that collect logs from all your machine, detects threats and checks wheter your systems follos security rules.

This is known as a **SIEM**.

## How it works

Wazuh has three main parts:

1. **Agents** run on each machine you want to monitor.
2. The **server** analyzes what the agents send.
3. The **dashboard** shows alerts in the browser.

## Installing an agent

```bash
curl -so wazuh-agent.deb https://packages.wazuh.com/...
sudo dpkg -i wazuh-agent.deb
```

An agent's configuration lives in `/var/ossec/etc/ossec.conf`.

> **Note:** the agent and the server must run compatible versions.

## Further reading

- [Official documentation](https://documentation.wazuh.com)
