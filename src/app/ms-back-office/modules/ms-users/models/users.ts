
export class User {
  id?: string;
  firstName: string;
  lastName?: string;
  middleName?: string;
  email: string;
  password?: string;
  roleId?: number; 
  verificationCode?: string; 
  isVerified?: number; 
  isDeleted?: number; 
  createdAt?: string; 
  updatedAt?: string;
}

export class UsersListResponse {
  data: User[];
  dataCount: number;
} 

export class UsersResponse {
  data: User;
} 