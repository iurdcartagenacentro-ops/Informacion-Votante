
export interface Voter {
  id: string;
  name: string;
  cedula: string;
  phone: string;
  votingLocation: string;
  dataAuthorization: boolean;
  signature?: string; // Base64 image string
}

export interface AppState {
  date: string;
  voters: Voter[];
}
