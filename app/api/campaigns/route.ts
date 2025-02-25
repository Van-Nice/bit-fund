// src/pages/api/campaigns/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  AppDataSource,
  initializeDatabase,
  verifyDatabaseConnection,
} from "../../../utils/data-source"; // Import AppDataSource
import { CampaignService } from "../../../utils/services/CampaignService";

export async function POST(request: NextRequest) {
  try {
    await verifyDatabaseConnection();
    console.log("Initializing database connection...");
    if (!AppDataSource.isInitialized) {
      await initializeDatabase();
      if (!AppDataSource.isInitialized) {
        throw new Error("Failed to initialize database");
      }
    }

    console.log("Parsing request body...");
    const body = await request.json();
    console.log("Received campaign data:", body);

    const campaignService = new CampaignService();
    const campaignData = {
      tx_id: body.tx_id,
      project_name: body.project_name,
      project_description: body.project_description,
      funding_goal: Number(body.funding_goal),
      deadline: new Date(body.deadline),
      campaign_id: body.campaign_id ? Number(body.campaign_id) : undefined,
    };

    console.log("Processed campaign data:", campaignData);
    const newCampaign = await campaignService.createCampaign(campaignData);
    console.log("Campaign created:", newCampaign);

    return NextResponse.json(
      { message: "Campaign created successfully", campaign: newCampaign },
      { status: 201 }
    );
  } catch (error) {
    console.error("Detailed error:", error);
    // Log the full error object for debugging
    console.error("Full error object:", JSON.stringify(error, null, 2));
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to create campaign",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await verifyDatabaseConnection();
    const campaignService = new CampaignService();

    // Get the search parameter if any
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const txId = searchParams.get("txId");
    const activeOnly = searchParams.get("active");

    let campaigns;
    if (id) {
      campaigns = await campaignService.getCampaignById(id);
    } else if (txId) {
      campaigns = await campaignService.getCampaignByTxId(txId);
    } else if (activeOnly === "true") {
      campaigns = await campaignService.getActiveCampaigns();
    } else {
      campaigns = await campaignService.getAllCampaigns();
    }

    return NextResponse.json(campaigns);
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch campaigns",
      },
      { status: 500 }
    );
  }
}
