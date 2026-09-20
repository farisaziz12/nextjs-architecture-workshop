import { Transaction } from "@/types";

export const apiPayloadStructure = {
  id: "uuid",
  createdAt: "date_time",
  updatedAt: "date_time",
  executionDate: "date_time",
  cardNumber: "card_number",
  cardExpirationDate: "card_expiration",
  cardType: "card_type",
  amount: "counter",
  isDomestic: "boolean",
  payerFirstName: "first_name",
  payerLastName: "last_name",
  payerEmail: "email",
  payerPhone: "phone",
  payerCountry: "country",
  payerCountryCode: "country_code",
  payerState: "state",
  payerStreetAddress: "street_address",
  payerStreetName: "street_name",
  payerWebsite: "website",
  payerDateOfBirth: "date_time",
  payerProfileImage: "image",
  payerBioText: "long_text",
  beneficiaryFirstName: "first_name",
  beneficiaryLastName: "last_name",
  beneficiaryEmail: "email",
  beneficiaryPhone: "phone",
  beneficiaryCountry: "country",
  beneficiaryCountryCode: "country_code",
  beneficiaryState: "state",
  beneficiaryStreetAddress: "street_address",
  beneficiaryStreetName: "street_name",
  beneficiaryWebsite: "website",
  beneficiaryDateOfBirth: "date_time",
  beneficiaryProfileImage: "image",
  beneficiaryBioText: "long_text",
};

export const objectToQueryString = (obj: Record<string, string>) =>
  Object.entries(obj)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

export function transformToNestedTransactionStructure(flatPayload: any): Transaction {
  const nestedPayload: Transaction = {
    id: flatPayload.id,
    createdAt: flatPayload.createdAt,
    updatedAt: flatPayload.updatedAt,
    executionDate: flatPayload.executionDate,
    cardNumber: flatPayload.cardNumber,
    cardExpirationDate: flatPayload.cardExpirationDate,
    cardType: flatPayload.cardType,
    amount: flatPayload.amount,
    isDomestic: flatPayload.isDomestic,
    payer: {
      firstName: flatPayload.payerFirstName,
      lastName: flatPayload.payerLastName,
      email: flatPayload.payerEmail,
      phone: flatPayload.payerPhone,
      country: flatPayload.payerCountry,
      countryCode: flatPayload.payerCountryCode,
      state: flatPayload.payerState,
      streetAddress: flatPayload.payerStreetAddress,
      streetName: flatPayload.payerStreetName,
      website: flatPayload.payerWebsite,
      dateOfBirth: flatPayload.payerDateOfBirth,
      profileImage: flatPayload.payerProfileImage,
      bioText: flatPayload.payerBioText,
    },
    beneficiary: {
      firstName: flatPayload.beneficiaryFirstName,
      lastName: flatPayload.beneficiaryLastName,
      email: flatPayload.beneficiaryEmail,
      phone: flatPayload.beneficiaryPhone,
      country: flatPayload.beneficiaryCountry,
      countryCode: flatPayload.beneficiaryCountryCode,
      state: flatPayload.beneficiaryState,
      streetAddress: flatPayload.beneficiaryStreetAddress,
      streetName: flatPayload.beneficiaryStreetName,
      website: flatPayload.beneficiaryWebsite,
      dateOfBirth: flatPayload.beneficiaryDateOfBirth,
      profileImage: flatPayload.beneficiaryProfileImage,
      bioText: flatPayload.beneficiaryBioText,
    },
  };

  return nestedPayload;
}
