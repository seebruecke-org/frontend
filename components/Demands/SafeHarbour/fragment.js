import FRAGMENT_LINK from '@/components/StrapiLink/fragment';

export default `
  ... on ComponentDemandsDemands {
    public_solidarity_declaration_decided
    supports_searescue_actively_decided
    admission_in_addition_quota_decided
    admission_program_decided
    communal_reception_decided
    national_international_networking_decided
    alliance_safe_harbours_decided
    transparency_decided

    public_solidarity_declaration_fullfilled
    supports_searescue_actively_fullfilled
    admission_in_addition_quota_fullfilled
    admission_program_fullfilled
    communal_reception_fullfilled
    national_international_networking_fullfilled
    alliance_safe_harbours_fullfilled
    transparency_fullfilled

    last_updated
    cta {
      ${FRAGMENT_LINK}
    }
  }
`;
