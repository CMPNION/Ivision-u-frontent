export type UserRole = "abiturient" | "committee";

export type ApplicationStatus =
  | "pending"
  | "revoken"
  | "considering"
  | "denied"
  | "approved";

// DB Table: User
export interface User {
  id: string;
  first_name: string;
  last_name: string;
  birth_date: string;
  avatar: string; // URL to Static/AWS storage
  role: UserRole;
  email: string;
  // password_hash is omitted on frontend
  created_at: string;
}

// DB Table: Cluster (Contains the actual application materials)
export interface Cluster {
  id: string;
  interview_video_url: string; // URL to Static/AWS
  essay_document_url: string; // URL to Static/AWS
}

// DB Table: Application (Links User and Cluster, holds status & AI result)
export interface Application {
  id: string;
  abitur_id: string; // Foreign Key to User
  cluster_id: string; // Foreign Key to Cluster
  status: ApplicationStatus;
  tags: string[];
  ai_recommendation: any; // AI scoring/analysis object from previous prompt
  created_at: string;
}

// Composite type for the Committee Dashboard view
export interface ApplicationFullView {
  application: Application;
  user: User;
  cluster: Cluster;
}
