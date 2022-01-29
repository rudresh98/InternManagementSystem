import { Role } from './role.model';

export class User {
    UserID!: string;
    FirstName!: string;
    LastName!: string;
    Mentor!: string;
    EmailAddress!: string;
    OrganizantionEmailAddress!: string;
    Role!: Role;
    LoginMethod!: string;
    Token?: string;
}