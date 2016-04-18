' inspired by http://jampal.sourceforge.net/ptts.html

' vars

text = Null

needRate = False
rate = 0

needVolume = False
volume = 100

needSamples = False
samples = 44100

needVoice = False
pVoice = Null

needChannels = False
channels = 2

' args

For Each arg in WScript.Arguments

    If "-r" = arg Then
        needRate = True
    ElseIf needRate Then
        rate=CInt(arg)
        needRate = False

    ElseIf "-v" = arg Then
        needVolume = True
    ElseIf needVolume Then
        volume=CInt(arg)
        needVolume = False

    ElseIf "-s" = arg Then
        needSamples = True
    ElseIf needSamples Then
        samples=CLng(arg)
        needSamples = False

    ElseIf "-c" = arg Then
        needChannels = True
    ElseIf needChannels Then
        channels=CInt(arg)
        needChannels = False

    ElseIf needVoice Then
        pVoice=arg
        needVoice = False
    ElseIf "-voice" = arg Then
        needVoice = True

    Else
        text = Trim(arg)
    End If

Next

' run

If "" = text Then
    WScript.StdErr.WriteLine("Missing text")
    WScript.Quit (1)
Else

    ' create speaker

    hSpeaker = Null
    Set hSpeaker = CreateObject("SAPI.SpVoice")

    ' set params

    If -10 > rate Or 10 < rate Then
        WScript.StdErr.WriteLine("Set rate " & rate & " failed. Must be between -10 and 10.")
        WScript.Quit (1)
    Else
        hSpeaker.Rate = rate
    End If

    If 0 > volume Or 100 < volume Then
        WScript.StdErr.WriteLine("Set volume " & volume & " failed. Must be between 0 and 100.")
        WScript.Quit (1)
    Else
        hSpeaker.Volume = volume
    End If

    If Not IsNull(pVoice) Then

        Set list = hSpeaker.GetVoices("Name=" & pVoice)

        If list.Count <> 1 Then
            WScript.StdErr.WriteLine("Set voice " & pVoice & " failed. Unknown voice.")
            WScript.Quit (1)
        Else
            Set hSpeaker.Voice = list.Item(0)
        End If

    End If

    ' play

    On Error Resume Next
    hSpeaker.Speak text, 3
    Do
        Sleep 100
    Loop Until hSpeaker.WaitUntilDone(10)

    ' close speaker
    
    Set hSpeaker = Nothing
    hSpeaker = Null

    WScript.Quit (0)
    
End If
