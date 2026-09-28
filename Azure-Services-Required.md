# Azure Services Required to Implement the Project

The following Azure services are required for the Azure Subscription Decommissioning and Data Retention Plan.

## 1. Azure Resource Graph

**Purpose:** Resource discovery and inventory.

Azure Resource Graph is used to discover and query resources across the Azure environment during the inventory and dependency assessment stage.

## 2. Azure Policy

**Purpose:** Governance and compliance.

Azure Policy is used to enforce governance rules and compliance requirements before and during the decommissioning process.

## 3. Azure Storage Account / Blob Storage

**Purpose:** Data backup and archival.

Azure Storage Account and Blob Storage are used to preserve required data and audit evidence before subscription decommissioning.

## 4. Azure Backup

**Purpose:** Backup and recovery.

Azure Backup is used to create and maintain backups of required resources and data before decommissioning.

## 5. Azure Monitor / Log Analytics

**Purpose:** Monitoring and log analysis.

Azure Monitor and Log Analytics are used to maintain monitoring information and analyze logs that may be required as audit and compliance evidence.

## 6. Microsoft Purview

**Purpose:** Data governance and compliance.

Microsoft Purview supports data governance and compliance-related activities, including managing information that needs to be retained.

## Service Summary

| Azure Service | Main Purpose |
|---|---|
| Azure Resource Graph | Resource discovery and querying |
| Azure Policy | Governance and compliance |
| Azure Storage Account / Blob Storage | Data backup and archival |
| Azure Backup | Backup and recovery |
| Azure Monitor / Log Analytics | Monitoring and log analysis |
| Microsoft Purview | Data governance and compliance |

These services support the complete workflow from resource assessment and data retention to backup, subscription decommissioning, and audit evidence preservation.
