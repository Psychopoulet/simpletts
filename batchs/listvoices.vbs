' inspired by http://jampal.sourceforge.net/ptts.html

' create speaker

hSpeaker = Null
Set hSpeaker = CreateObject("SAPI.SpVoice")

' get voices

list = "Gender;Age;Name;Language;Vendor"
For Each strVoice in hSpeaker.GetVoices
    list = list & vbLf
    list = list & strVoice.GetAttribute("Gender") & ";" & strVoice.GetAttribute("Age") & ";" & strVoice.GetAttribute("Name") & ";" & strVoice.GetAttribute("Language") & ";" & strVoice.GetAttribute("Vendor")
Next

' close speaker

Set hSpeaker = Nothing
hSpeaker = Null

WScript.StdOut.WriteLine(list)
WScript.Quit (0)
