require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { ClientSecretCredential } = require("@azure/identity");
const { ResourceManagementClient } = require("@azure/arm-resources");
const { ComputeManagementClient } = require("@azure/arm-compute");
const { StorageManagementClient } = require("@azure/arm-storage");

const app = express();

app.use(cors());
app.use(express.json());

const credential = new ClientSecretCredential(
  process.env.AZURE_TENANT_ID,
  process.env.AZURE_CLIENT_ID,
  process.env.AZURE_CLIENT_SECRET
);

const subscriptionId = process.env.AZURE_SUBSCRIPTION_ID;

const resourceClient = new ResourceManagementClient(
  credential,
  subscriptionId
);

const computeClient = new ComputeManagementClient(
  credential,
  subscriptionId
);

const storageClient = new StorageManagementClient(
  credential,
  subscriptionId
);

// USD to INR conversion baseline rate
const USD_TO_INR = 95.82;

app.get("/", (req, res) => {
  res.send("Azure Backend Running");
});

app.get("/api/resources", async (req, res) => {
  try {
    const resources = [];

    for await (const resource of resourceClient.resources.list()) {
      resources.push({
        name: resource.name,
        type: resource.type,
        location: resource.location,
      });
    }

    res.json(resources);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

app.get("/api/dashboard", async (req, res) => {
  try {
    let totalResources = 0;
    let vmCount = 0;
    let storageCount = 0;
    let networkCount = 0;

    for await (const resource of resourceClient.resources.list()) {
      totalResources++;

      if (
        resource.type?.includes(
          "Microsoft.Compute/virtualMachines"
        )
      ) {
        vmCount++;
      }

      if (
        resource.type?.includes(
          "Microsoft.Storage/storageAccounts"
        )
      ) {
        storageCount++;
      }

      if (
        resource.type?.includes("Microsoft.Network")
      ) {
        networkCount++;
      }
    }

    res.json({
      totalResources,
      vmCount,
      storageCount,
      networkCount,
      lastSync: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

app.get("/api/vms", async (req, res) => {
  try {
    const vms = [];

    for await (const vm of computeClient.virtualMachines.listAll()) {
      vms.push({
        name: vm.name,
        location: vm.location,
        vmSize: vm.hardwareProfile?.vmSize,
        osType: vm.storageProfile?.osDisk?.osType,
      });
    }

    res.json(vms);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

app.get("/api/storage", async (req, res) => {
  try {
    const accounts = [];

    for await (const account of storageClient.storageAccounts.list()) {
      accounts.push({
        name: account.name,
        location: account.location,
      });
    }

    res.json(accounts);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

app.get("/api/costs", async (req, res) => {
  try {
    let vmCount = 0;
    let storageCount = 0;
    let networkCount = 0;

    for await (const resource of resourceClient.resources.list()) {
      if (
        resource.type?.includes(
          "Microsoft.Compute/virtualMachines"
        )
      ) {
        vmCount++;
      }

      if (
        resource.type?.includes(
          "Microsoft.Storage/storageAccounts"
        )
      ) {
        storageCount++;
      }

      if (
        resource.type?.includes("Microsoft.Network")
      ) {
        networkCount++;
      }
    }

    // Costs formatted in Indian Rupees (₹)
    res.json([
      {
        name: "Virtual Machines",
        value: Number((vmCount * 120 * USD_TO_INR).toFixed(2)),
      },
      {
        name: "Storage",
        value: Number((storageCount * 30 * USD_TO_INR).toFixed(2)),
      },
      {
        name: "Network",
        value: Number((networkCount * 15 * USD_TO_INR).toFixed(2)),
      },
    ]);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

app.get("/api/decommission-resources", async (req, res) => {
  try {
    const decommissionList = [];

    // Fetch actual resources from your Azure subscription
    for await (const resource of resourceClient.resources.list()) {
      
      // Extract Resource Group from the resource ID string
      // Format: /subscriptions/{subId}/resourceGroups/{rgName}/providers/...
      const idParts = resource.id.split("/");
      const resourceGroup = idParts[4] || "Unknown";

      // Default values for the report
      let status = "Active";
      let reason = "In Use";
      let estCostUSD = 0;

      // Basic heuristic tagging based on resource type
      if (resource.type === "Microsoft.Compute/virtualMachines") {
        status = "Audit Required";
        reason = "Verify VM CPU utilization";
        estCostUSD = 142.50; 
      } else if (resource.type === "Microsoft.Network/publicIPAddresses") {
        status = "Candidate for Decommission";
        reason = "Verify if IP is orphaned/unattached";
        estCostUSD = 4.80;
      } else if (resource.type === "Microsoft.Compute/disks") {
        status = "Audit Required";
        reason = "Verify if disk is attached to a VM";
        estCostUSD = 15.00;
      } else if (resource.type === "Microsoft.Storage/storageAccounts") {
        status = "Audit Required";
        reason = "Verify read/write activity";
        estCostUSD = 25.00;
      }

      // Calculate cost accurately in Indian Rupees (₹)
      const estCostINR = Number((estCostUSD * USD_TO_INR).toFixed(2));

      // Add to the report list
      decommissionList.push({
        id: resource.id,
        name: resource.name,
        type: resource.type,
        resourceGroup: resourceGroup,
        cost: estCostINR, // Returns figures in Rupees
        status: status,
        reason: reason,
      });
    }

    res.json(decommissionList);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

app.post("/api/delete-resource", async (req, res) => {
  try {
    const { resourceId } = req.body;

    if (!resourceId) {
      return res.status(400).json({
        error: "resourceId is required",
      });
    }

    await resourceClient.resources.beginDeleteByIdAndWait(
      resourceId,
      "2021-04-01"
    );

    res.json({
      success: true,
      message: "Resource deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
});


app.listen(process.env.PORT || 5001, () => {
  console.log("=================================");
  console.log("Azure Backend Running");
  console.log("Port:", process.env.PORT || 5001);
  console.log("=================================");
});

app.post("/api/schedule-decommission", (req, res) => {
  const { resourceId, action } = req.body;
  
  console.log(`Resource ${resourceId} received action: ${action}`);

  // Perform your logic here (e.g., update DB status to 'SCHEDULED_FOR_DELETION')
  
  return res.status(200).json({ 
    message: "Resource locked and offboarding process initiated." 
  });
});

console.log("TENANT =", process.env.AZURE_TENANT_ID);
console.log("CLIENT =", process.env.AZURE_CLIENT_ID);