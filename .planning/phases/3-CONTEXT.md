# Phase 3 Context - Deal Pipeline & Kanban Board

## Key Decisions

### 1. Pipeline & Deal Data Architecture
- **Multiple Pipelines**: Allow tenant organizations to create and manage multiple pipelines (e.g. *Inbound Sales*, *Outbound Enterprise*, *Account Renewal*).
- **Customizable Stages**: Organization Admins can create, reorder, rename, or delete columns/stages for each pipeline.
- **Default Stages**: `Lead Identified`, `Meeting Scheduled`, `Proposal Sent`, `Negotiation`, `Closed Won`, `Closed Lost`.
- **Deal Metrics**:
  - Deal Value (amount in currency).
  - Win Probability % (0-100%).
  - Weighted Expected Value calculation (`Deal Value * Win Probability %`).
  - Expected Close Date.
  - Linked Contact and/or Company.

### 2. UI & User Experience
- **Interactive Kanban Board**: Drag-and-drop cards between pipeline stage columns with real-time UI state updates.
- **Deal Summary Metrics Widgets**: Real-time headers showing Total Pipeline Value, Expected MRR, Win Rate %, and total open deals.
- **Filtering**: Quick filters by Assignee, Pipeline, Stage, and Close Date range.
