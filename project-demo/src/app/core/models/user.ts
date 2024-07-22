export interface User {    
    id: number;
    name: string;
    surname: string;
    email: string; 
    password?: string;
    gender?: string;
    birthdate?: Date;
    location?: string;
    imageUrl?:string;
}