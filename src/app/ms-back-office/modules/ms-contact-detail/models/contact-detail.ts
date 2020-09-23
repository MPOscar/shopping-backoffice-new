import { Face, State, Status } from '../../../../ui/modules/images-card/models/face';

export class Configuration {
    id?: string;
    value?: string;
}

export class ContactDetail {
    socialInstagram: string;
    socialFacebook: string;
    socialTwitter: string;
    workingHours?: string;
    timePeriodEnd?: string;
    timePeriodStart?: string;    
}