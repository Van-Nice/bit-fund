// src/services/CampaignService.ts
import { Repository } from "typeorm";
import { Campaign } from "../entities/Campaign";
import { AppDataSource } from "../data-source";
import { MoreThan } from "typeorm";

export class CampaignService {
  private campaignRepository: Repository<Campaign>;

  constructor() {
    if (!AppDataSource.isInitialized) {
      throw new Error("Database not initialized");
    }
    this.campaignRepository = AppDataSource.getRepository(Campaign);
  }

  async createCampaign(campaignData: Partial<Campaign>): Promise<Campaign> {
    const campaign = this.campaignRepository.create({
      ...campaignData,
      created_at: new Date(), // Will be overridden by CreateDateColumn
    });
    return await this.campaignRepository.save(campaign);
  }

  // Fetch all campaigns
  async getAllCampaigns(): Promise<Campaign[]> {
    return await this.campaignRepository.find({
      order: {
        created_at: "DESC",
      },
    });
  }

  // Fetch a single campaign by ID
  async getCampaignById(id: string): Promise<Campaign | null> {
    return await this.campaignRepository.findOneBy({ id });
  }

  // Fetch a single campaign by transaction ID
  async getCampaignByTxId(txId: string): Promise<Campaign | null> {
    return await this.campaignRepository.findOneBy({ tx_id: txId });
  }

  // Fetch active campaigns (deadline in the future)
  async getActiveCampaigns(): Promise<Campaign[]> {
    return await this.campaignRepository.find({
      where: {
        deadline: MoreThan(new Date()),
      },
      order: {
        deadline: "ASC",
      },
    });
  }
}
