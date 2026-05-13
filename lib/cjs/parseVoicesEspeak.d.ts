export interface iESpeakVoice {
    "Pty": string;
    "Language": string;
    "Age/Gender": "M" | "F" | "-";
    "VoiceName": string;
    "File": string;
    "Other Languages": string[];
}
export default function parseVoicesEspeak(voices: string[]): iESpeakVoice[];
