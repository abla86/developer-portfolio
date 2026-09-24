# AB Home Assistant Dashboard System

This directory is the **Home Assistant implementation layer**, separate from the portfolio UI.

The three reference designs supplied for this project are implemented as the first three dashboard views:

1. **NEXUS — Mission Control** — whole-home overview and fast control.
2. **RESIDENCE — Room & Climate** — rooms, climate, sensors and scenes.
3. **EVOHAUS — Security & Media** — cameras, security, media, Wi-Fi and climate.

Additional operational views are included:

4. **ENERGY — Intelligence**
5. **DEVICES — Health & Network**
6. **SECURITY — Surveillance**

The layouts intentionally follow the supplied visual references: dark surfaces, rounded panels, strong information hierarchy, room/device tiles, climate gauges, camera areas, telemetry and compact status controls.

## Installation

Copy the dashboard YAML files into the Home Assistant configuration and register them as YAML dashboards, or merge the views into an existing dashboard.

Recommended directory:

```text
config/
├── dashboards/
│   ├── 01-nexus-mission-control.yaml
│   ├── 02-residence-room-climate.yaml
│   ├── 03-evohaus-security-media.yaml
│   ├── 04-energy-intelligence.yaml
│   ├── 05-devices-health-network.yaml
│   └── 06-security-surveillance.yaml
└── ...
```

These files deliberately do **not** contain private IP addresses, tokens, passwords or device credentials.

## Entity mapping

The dashboard structure is real Home Assistant YAML, but entity IDs vary between installations. Before loading the dashboards, replace the clearly marked example entities with the actual entities from the instance.

Known device families already considered by the design include:

- Aqara motion/door sensors
- Philips Hue lighting and dimmers
- Ledvance lighting
- Daikin climate / Onecta
- Dreame L20 Ultra
- Sonos
- Eufy cameras
- Nimly Touch Pro
- Zigbee2MQTT
- Shelly
- energy, temperature, humidity and battery sensors

## Optional visual layer

For the closest visual match to the reference images, use:

- Mushroom cards
- card-mod
- layout-card
- apexcharts-card
- mini-graph-card

The dashboards remain usable with native Home Assistant cards; the optional layer is for presentation rather than security or correctness.

## Design rule

Home Assistant remains the authoritative home-control system. The developer portfolio may document or preview the work, but it is not the control surface.
