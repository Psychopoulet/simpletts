export interface iESpeakVoice {
    "Pty": string;
    "Language": string;
    "Age/Gender": "M" | "F" | "-";
    "VoiceName": string;
    "File": string;
    "Other Languages": Array<string>;
}
export default function parseVoicesEspeak(voices: Array<string>): Array<iESpeakVoice>;
