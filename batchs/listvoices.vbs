
list = "Gender;Age;Name;Language;Vendor"
For Each strVoice in getVoices()
    list = list & vbLf
    list = list & strVoice.GetAttribute("Gender") & ";" & strVoice.GetAttribute("Age") & ";" & strVoice.GetAttribute("Name") & ";" & strVoice.GetAttribute("Language") & ";" & strVoice.GetAttribute("Vendor")
Next

WScript.StdOut.WriteLine(list)

WScript.Quit (0)

Function getVoices()

    Dim hSpeaker

    Set hSpeaker = CreateObject("SAPI.SpVoice")
    Set getVoices = hSpeaker.GetVoices
    
    Set hSpeaker = Nothing
    hSpeaker = Null

End Function
