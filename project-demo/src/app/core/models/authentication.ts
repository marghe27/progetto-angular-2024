
export interface Authentication {  
        id?:number;  
        email: string; 
        name?:string;
        password?: string;
        token:string;
        loginDate?: Date;
        expirationDate: Date;
}

