export interface IUSer {
  name: string;
  phoneNumber: string;
  healthInfo: {
    age: number;
    weight: number;
    height: number;
    dietaryRestrictions: Array<string>;
  };
  code: string;
  isActivated: boolean;
  healthCategory: string;
  id: string;
  // goals: Array<string>;
}
