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

Shortly: For the shake of learning how complex systems work

The first question that could come to your mind is "¿why are you making this if AI could read the paper and make the system in one prompt?" That's correct but you don't get the fundamental learning of trying to understand complex systems.

The times are changing and of course I'm not gonna write everything by hand but we could use AI to learn, it can teach you everything you wan't, every question that comes to your mind it could resolve it with a good answer (probably not the best but you can keep investigating).

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
- [Raft algorithm animation](https://thesecretlivesofdata.com/raft/), an animated explanation of Raft
