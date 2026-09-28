# Architecture Diagram

## Azure Subscription Decommissioning and Data Retention Plan

The project architecture follows this flow:

**Legacy Azure Subscription → Inventory & Dependency Assessment → Data Classification & Retention Rules → Cost & Egress Check → Backup/Archive → Subscription Decommissioning → Audit & Compliance Evidence**

### Architecture Diagram Components

1. **Legacy Azure Subscription**
   - Starting point containing the existing Azure resources and subscription.

2. **Inventory & Dependency Assessment**
   - Discovers and analyzes resources and their dependencies.
   - **Azure Resource Graph** is used to discover and query Azure resources.
   - **Azure Policy** is used to enforce governance and compliance requirements.

3. **Data Classification & Retention Rules**
   - Identifies data that must be retained and applies appropriate retention requirements before decommissioning.

4. **Cost & Egress Check**
   - Evaluates resource costs and possible data egress costs before resources are removed.

5. **Backup/Archive**
   - Required data and audit evidence are backed up or archived.
   - **Azure Storage Account / Blob Storage** is used for data archiving.
   - **Azure Backup** is used for backup operations.

6. **Subscription Decommissioning**
   - After dependencies, data retention, cost, and backup requirements are checked, the legacy subscription can proceed through the decommissioning process.

7. **Audit & Compliance Evidence**
   - Maintains evidence required for auditing and compliance.
   - **Azure Monitor / Log Analytics** supports monitoring and log analysis.
   - **Microsoft Purview** supports data governance and compliance-related activities.

### Azure Services Used

| Architecture Area | Azure Service |
|---|---|
| Resource Discovery | Azure Resource Graph |
| Governance & Compliance | Azure Policy |
| Data Archive | Azure Storage Account / Blob Storage |
| Backup | Azure Backup |
| Monitoring & Logs | Azure Monitor / Log Analytics |
| Data Governance | Microsoft Purview |

### Architecture Explanation

The architecture begins with a **Legacy Azure Subscription**. The resources and dependencies are first identified through **Inventory & Dependency Assessment** using Azure Resource Graph and Azure Policy. Next, **Data Classification & Retention Rules** determine which information must be preserved. A **Cost & Egress Check** is then performed to understand the financial impact of the decommissioning process.

Required data and evidence are preserved through **Backup/Archive** using Azure Storage Account / Blob Storage and Azure Backup. After these checks are completed, the subscription moves to **Subscription Decommissioning**. Finally, **Audit & Compliance Evidence** is maintained using Azure Monitor / Log Analytics and Microsoft Purview.

This architecture provides a structured sequence for analyzing, preserving, and safely decommissioning a legacy Azure subscription.
