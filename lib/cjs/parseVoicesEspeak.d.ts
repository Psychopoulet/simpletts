export interface iESpeakVoice {
    "Language": string;
    "Age/Gender": string;
    "VoiceName": string;
    "File": string;
    "Others": Array<string>;
}
export default function parseVoicesEspeak(voices: Array<string>): Array<iESpeakVoice>;
