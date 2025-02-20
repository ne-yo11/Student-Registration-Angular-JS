export class Masterlist { 
    studentCode?: string;
    firstName?: string;
    lastName?: string;
    middleName?: string;
    birthdate?: string | Date; 
    age?: number;
    gender?: string;
    address?: string;
    contact?: string;
    guardianName?: string;
    guardianAddress?: string;
    guardianContact?: string;
    hobby?: string;
    documents?: { fileName: string; fileType: string; data: string }[];
    courseCode?: string;
    courseName?: string;
    courseStatus?: string;
}
