export interface iSAPIVoice {
    "Gender": string;
    "Age": string;
    "Name": string;
    "Language": string;
    "Vendor": string;
    "Version": string;
}
export default function parseVoicesSAPI(voices: Array<string>): Array<iSAPIVoice>;
