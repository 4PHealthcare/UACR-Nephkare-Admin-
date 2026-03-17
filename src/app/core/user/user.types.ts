export interface User
{

    user_id: number;
    first_name?: string;
    last_name?: string;
    name?: string;
    mobile_no?: string;
    email_address?: string;
    role_id?: number;
    created_by?: string;
    created_on?: string;
    membership_id?: string;
    membership_type?: string;
    last_activitydate?: string;
    current_statusid?: string;
    user_status?: boolean;
    avatar?: string;
    status?: string;
    email?:string;
    role_name?:string;
    user_restrictions?:any[]

}
