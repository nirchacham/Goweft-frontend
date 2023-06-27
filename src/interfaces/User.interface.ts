export interface User {
    id:number;
    name:string;
    email:string;
    address: {
        street:string;
        suite:string;
        city:string;
        zipcode:string;
    }
}