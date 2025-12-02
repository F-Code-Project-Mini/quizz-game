export interface IClub {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}
export interface IRequestGetListClub {
    success: boolean;
    result: IClub[];
}
