import axios from 'axios';
import { ERROR_MESSAGE } from './handler/error';

const azurePriceInstance = axios.create({
  baseURL: 'https://prices.azure.com/api/retail/prices',
  method: 'get',
  headers: { 'Content-Type': 'application/json' },
});

interface AzurePricesItemResponse {
  currencyCode: string;
  tierMinimumUnits: number;
  retailPrice: number;
  unitPrice: number;
  armRegionName: string;
  location: string;
  effectiveStartDate: string;
  meterId: string;
  meterName: string;
  productId: string;
  skuId: string;
  availabilityId: null,
  productName: string;
  skuName: string;
  serviceName: string;
  serviceId: string;
  serviceFamily: string;
  unitOfMeasure: string;
  type: string;
  isPrimaryMeterRegion: boolean;
  armSkuName: string;
}

interface AzurePricesResponse {
  BillingCurrency: string;
  CustomerEntityId: string;
  CustomerEntityType: string;
  Items: [AzurePricesItemResponse];
  NextPageLink: number;
  Count: number;
}

interface AzurePricesRequestOptions {
  meterId?: string;
  skuName?: string;
  location?: string;
  currencyCode?: string;
}

export const getAzureItemResponse = (data: AzurePricesResponse) => (data.Items);

export const unitStringToNumber = (str: string): number => {
  const multipliers = { k: 1000, m: 1000000 };
  return parseFloat(str) * multipliers[str.charAt(str.length - 1).toLowerCase()];
};

export const getAzurePrices = async ({
  meterId = 'e432b4c4-a871-5d8a-a8e3-5c76b48bfc4e',
  skuName = 'Az-GPT-3.5-turbo',
  location = 'US East',
  currencyCode = 'USD',
}: AzurePricesRequestOptions): Promise<AzurePricesResponse> => {
  try {
    const { data } = await azurePriceInstance<AzurePricesResponse>(
      {
        params: {
          $filter: `Location eq '${location}' and meterId eq '${meterId}'`,
          currencyCode,
        },
      },
    );
    return data;
  } catch (error: any) {
    ERROR_MESSAGE.ERROR_HANDLER(error.message);
  }
};
