# Architecture

## Overview

SyncState provides a unified abstraction for state that lives locally but persists globally. It utilizes a hybrid approach combining an immutable state container with an operation-log based synchronization protocol. Instead of syncing entire objects, SyncState tracks fine-grained mutations and propagates them through a pluggable transport layer. The user experience is instantaneous because all writes happen against a local-first store; the background engine handles the complexity of diffing, batching, and replaying operations once a connection is established. It introduces a 'Versioned Projection' mental model where the UI reflects the local optimistic state, while the engine maintains a 'Proven' state from the server, reconciliating the two through a non-blocking background process that ensures eventual consistency without UI blocking.

## System design

SyncState is built on a modular architecture consisting of the 'State Core', the 'Log Engine', and the 'Transport Layer'. The State Core utilizes a Directed Acyclic Graph (DAG) to track operation history, ensuring that every state change is uniquely identified and parented. When a local change occurs, the Log Engine serializes the operation and stores it in an IndexedDB-backed persistence layer. Simultaneously, the Transport Layer attempts to broadcast this operation to peers or a central coordinator. The system uses a Hybrid Logical Clock (HLC) to provide causal ordering of events without requiring perfectly synchronized system clocks across clients. A key trade-off is the 'Consistency-Latency' balance; SyncState prioritizes availability and partition tolerance (AP), meaning it guarantees eventual consistency while providing immediate local feedback through optimistic executions that are later validated against the server-side authority.

## Tech stack

- TypeScript
- Zustand (State Management)
- IndexedDB (Local Persistence)
- Zod (Schema Validation)
- Vitest (Testing)
- Turborepo (Monorepo Management)
- Socket.io (Default Transport)

## Design principles

- **Small core, composable surface** — keep the default install lean; ship extensions as opt-in packages.
- **Type-safety end-to-end** — TypeScript on both sides, generated types where possible.
- **Built in public** — every architectural decision lands as a tracked issue or ADR before it ships.
- **Friendly to first-time contributors** — surface area for new contributors is treated as a first-class feature.

## Trade-offs and open questions

We track in-flight design decisions as GitHub issues labelled `proposal`. If you see something here that does not match the code, open an issue — the code is the source of truth, and docs lag are bugs.
