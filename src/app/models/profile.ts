import firebase from 'firebase/app';
export class Profile {
    displayName?:string;
    avatar?: firebase.firestore.DocumentReference;

    docID?: string;
    email?: string;
    epayinfo?: string;
    gender?:string;
    homeaddress?: string;
    insuranceinfo?:string;
    location?:string;
    mobile?:Array<string>;
    providername?:string;
    ready?:boolean;
    role?:number[];
    underdisease?:boolean;
    username?:string;
    birthday?: firebase.firestore.Timestamp;
}
