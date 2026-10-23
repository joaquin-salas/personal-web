---
title: "A fault-tolerant key-value store built on Raft in Go"
description: "A replicated key-value store built on my own implementation of the Raft consensus algorithm in Go, tested against crashes, network partitions and lost messages."
pubDate: 2026-10-23
stack: ["Go"]
featured: true
draft: true
---

TODO: one or two sentences on what this is and why it's interesting.

## Why I built it

TODO

## What it does

TODO: what a client can do (get, put, delete) and what guarantees it gets.

## Architecture

### Raft

- **Leader election**: TODO
- **Log replication**: TODO
- **Safety**: TODO
- **Persistence and crash recovery**: TODO

### Key-value store

TODO: how client requests become log entries and how the state machine applies them.

## Testing failures

TODO: how failures are injected and how correctness is checked.

- **Crashed and restarted nodes**: TODO
- **Network partitions**: TODO
- **Lost, delayed and reordered messages**: TODO
- **Linearizability checking**: TODO

## What broke and how I fixed it

TODO

## What I learned

TODO

## Further reading

- [In Search of an Understandable Consensus Algorithm](https://raft.github.io/raft.pdf), the Raft paper
- [The Raft website](https://raft.github.io/), with a visualization of the algorithm
