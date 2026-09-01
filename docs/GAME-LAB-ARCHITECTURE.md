# Game Lab Architecture

Game Lab is a standalone interactive project in the portfolio ecosystem.

## Core model

`LabRuntime` provides the shared shell, routing, lifecycle management and telemetry bridge. Each game is an isolated engine module registered through a common engine contract.

```text
Game Lab Shell
      |
      v
 LabRuntime
      |
  +---+-----------------------------+
  |         |          |             |
 Chess    Connect4   SQL Dungeon   ...
  |         |          |             |
  +---------+----------+-------------+
                |
           Telemetry
                |
            Inspector
```

## Engine lifecycle

Each engine follows the same lifecycle:

- constructor(mountPoint, telemetryCallback)
- `init()`
- render/update inside its own module
- `destroy()` on unmount
- telemetry emitted through the runtime callback

## Design rules

1. The shell does not contain game-specific logic.
2. A game owns its own state and algorithm.
3. The runtime owns registration, mounting, unmounting and inspector updates.
4. Shared visual language lives in `css/lab-theme.css`.
5. Adding a game should not require rewriting the shell.

## Featured engine

Cyber Chess is the featured engine. It demonstrates Minimax, Alpha-Beta pruning, Piece-Square Tables and runtime telemetry. It is an interactive demonstrator rather than a claim of full tournament-grade chess rules.

## Expansion path

The same runtime pattern is intended to support the other Lab projects: Security Lab, Data Lab, DevOps Lab and Systems Lab. New domains can reuse the shell/inspector pattern while retaining isolated domain engines.
