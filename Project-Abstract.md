# Project Abstract

The **Azure Subscription Decommissioning & Data Retention Plan** is a cloud operations project designed to help organizations safely decommission unused or legacy Azure subscriptions and resources. When Azure environments are no longer required, directly deleting resources can result in hidden dependencies, unexpected data transfer costs, loss of important audit evidence, and compliance risks. This project provides a structured approach to identify resources, analyze their dependencies, evaluate costs, and manage the decommissioning process.

The project implements a unified **Azure Resource Decommission Dashboard** that connects with an Azure subscription to provide real-time resource inventory, dependency mapping, cost analysis, decommissioning workflows, and audit report generation. The dashboard helps users identify active resources, resources that may be candidates for decommissioning, and resources requiring further audit. It also provides cost information and potential savings to support informed decommissioning decisions.

The application is developed using **React.js, Tailwind CSS, Recharts, Node.js, Express, Azure SDK for JavaScript, and REST APIs**, with Microsoft Azure Resource Manager and Azure Cost Management used for cloud resource and cost information. The system also supports PDF export and live data synchronization for audit documentation.
