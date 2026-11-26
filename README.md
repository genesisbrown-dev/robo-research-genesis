# RoboResearch 🤖

A robotics research workspace built with React, TypeScript, and DeepSpace.

## Overview

RoboResearch is a full-stack application designed to help robotics students and researchers organize experiments, document research, and use AI assistance to plan robotics projects.

The project is inspired by robotics platforms and technologies such as the Unitree Go2, ROS 2, and NVIDIA Isaac Sim.

## Features

- **Experiment Management:** Create and track robotics experiments.
- **Persistent Storage:** Save experiment details, hypotheses, descriptions, and statuses.
- **User Authentication:** Sign in to access your research workspace.
- **Research Documents:** Create and organize experiment notes.
- **AI Research Assistant:** Get help planning experiments and analyzing research ideas.
- **Experiment Ownership:** Use DeepSpace schema permissions and user-bound records.

## Technology Stack

- React
- TypeScript
- DeepSpace
- Vite
- Tailwind CSS

## Example Experiment

**Go2 LiDAR Obstacle Detection**

- Robot: Unitree Go2
- Simulator: NVIDIA Isaac Sim
- Status: Planning

Objective: Explore how LiDAR sensing can help a robot detect obstacles at different distances and positions.

## Architecture

The frontend uses React and TypeScript. DeepSpace provides application authentication, schema-backed data storage, AI Chat, and document functionality.

The custom `experiments` collection stores experiment information, while DeepSpace's ownership and permission settings help protect user data.

## Current Limitations

RoboResearch currently supports experiment organization, research documentation, and AI-assisted planning. It does not yet directly control physical robots, execute Isaac Sim simulations, or collect live ROS 2 telemetry.

## Live Application

https://robo-research-genesis.app.space

## Developer

Genesis Brown

Built as a DeepSpace application project.