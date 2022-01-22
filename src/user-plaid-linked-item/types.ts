export interface PlaidMetadata {
  institution: {
    name: string;
    institution_id: string;
  };
  accounts: {
    id: string;
    name: string;
    mask: string;
    type: string;
    subtype: string;
    verification_status: string;
  }[];
  link_session_id: string;
}
