export interface iSAPIVoice {
    "Gender": string;
    "Name": string;
}
export default function parseVoicesSAPI(voices: Array<string>, stdout: Array<string>): Array<iSAPIVoice>;
