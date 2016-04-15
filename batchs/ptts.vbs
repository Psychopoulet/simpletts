'    Copyright 2011 Peter Bennett
'
'    This file is part of Jampal.
'
'    Jampal is free software: you can redistribute it and/or modIfy
'    it under the terms of the GNU General Public License as published by
'    the Free Software Foundation, either version 3 of the License, or
'    (at your option) any later version.
'
'    Jampal is distributed in the hope that it will be useful,
'    but WITHOUT ANY WARRANTY without even the implied warranty of
'    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
'    GNU General Public License for more details.
'
'    You should have received a copy of the GNU General Public License
'    along with Jampal.  If not, see <http://www.gnu.org/licenses/>.
'

pText = Null
doWaveFile = False
doMultWaveFiles = False
pFileName = Null            ' Name of output wav file
pUnicodeFileName = Null     ' name of input text file
rate=-999
volume=-999
samples=44100
channels=2
pVoice=Null
pEncoding = Null
needText = False
needFileName = False
needRate = False
needVolume = False
needUnicodeFileName = False
needSamples = False
needChannels = False
needVoice = False
needEncoding = False
isCscript = True        ' Identifies if we are running CScript
needDebugging = False


Dim IsOK
IsOK = True

Dim argv
Set argv = WScript.Arguments

Call checkCScript
if (isCscript) Then
    printErr("ptts Version **UNSTABLE** (c) 2011 Peter G. Bennett")
End If

For Each arg in argv

    If needDebugging Then
        printErr("arg:" & arg)
    End If

    If needText Then
        pText=arg
        needText = False
    ElseIf needFileName Then
        pFileName=arg
        needFileName = False
    ElseIf needUnicodeFileName Then
        pUnicodeFileName=arg
        needUnicodeFileName = False
    ElseIf needRate Then
        rate=CInt(arg)
        needRate = False
    ElseIf needVolume Then
        volume=CInt(arg)
        needVolume = False
    ElseIf needSamples Then
        samples=CLng(arg)
        needSamples = False
    ElseIf needChannels Then
        channels=CInt(arg)
        needChannels = False
    ElseIf needVoice Then
        pVoice=arg
        needVoice = False
    ElseIf needEncoding Then
        pEncoding=arg
        needEncoding = False
        pEncoding = UCase(pEncoding)
        If pEncoding <> "ASCII" And pEncoding <> "UTF-16LE" Then
            IsOK=False
        End If

    ElseIf arg = "-t" Then
        needText = True

    ElseIf arg = "-w" Then
        If (doWaveFile Or doMultWaveFiles) Then
            IsOK=False
        End If
        doWaveFile = True
        needFileName = True
    ElseIf arg = "-m" Then
        If (doWaveFile Or doMultWaveFiles) Then
            IsOK=False
        End If
        doMultWaveFiles = True
        needFileName = True
    ElseIf arg = "-r" Then
        needRate = True
    ElseIf arg = "-v" Then
        needVolume = True
    ElseIf arg = "-s" Then
        needSamples = True
    ElseIf arg = "-c" Then
        needChannels = True
    ElseIf arg = "-u" Then
        needUnicodeFileName = True
    ElseIf arg = "-voice" Then
        needVoice = True
    ElseIf arg = "-e" Then
        needEncoding = True
    ElseIf arg = "-debug" Then
        needDebugging = True
        printErr("Debug selected")

    ElseIf Mid(arg,1,1) = "-" Then
        IsOK=False
    Else 
        IsOK=False
    End If

'    printErr("Arg:"&arg& " IsOK:"&IsOK&" doWaveFile:"& _
'    doWaveFile&" doMultWaveFiles:"&doMultWaveFiles& _
'    " needFileName:"&needFileName)
Next


' Release
set argv = Nothing


if needFileName Or needVolume Or needRate  _
     Or needUnicodeFileName Or needSamples Or needChannels Or needVoice Then
    IsOK=False
End If
if IsOK And Not IsNull(pFileName) Then
    If Len(pFileName) > 4 _
        And LCase(Mid(pFileName,Len(pFilename) -3)) = ".wav" Then
        pFileName = Mid(pFileName,1,Len(pFilename) -4)
    End If
End If
If IsOK Then
    IsOK = doit
End If
If Not IsOK then
    printErr( VbCrLf & _
    "Usage: cscript ptts.vbs [options]" & VbCrLf & _
    VbCrLf & _
    "Reads from standard input or text file and generates speech" & VbCrLf & _
    VbCrLf & _
    "Options:" & VbCrLf & _
    "-w filename  create wave file instead of outputting sound" & VbCrLf & _
    "-m filename  multiple wave files" & VbCrLf & _
    "             new wave file after each empty input line" & VbCrLf & _
    "             appends nnnnn.wav to the filename." & VbCrLf & _
    "-r rate      Speech rate -10 to +10, default is 0." & VbCrLf & _
    "-v volume    Volume as a percentage, default is 100." & VbCrLf & _
    "-s samples   Samples per sec for wav file, default is 44100." & VbCrLf & _
    "             options are 8000, 16000, 22050, 44100, 48000." & VbCrLf & _
    "-c channels  Channels (1 or 2) for wav file, default is 2." & VbCrLf & _
    "-u filename  Read text from file instead of stdin." & VbCrLf & _
    "-e encoding  File encoding. ASCII, UTF-16LE." & VbCrLf & _
    "             Default ANSI or as indicated by BOM in file." & VbCrLf & _
    "-voice xxxx  Voice to be used." & VbCrLf & _
    "-vl          List voices." & VbCrLf & _
    "XML can be included in the input text to control the speech." & VbCrLf & _
    "For details see the Microsoft speech API." & VbCrLf & _
    "" & VbCrLf & _
    "If using standard input you must run with CScript program.")
End If

if IsOK Then
    rc = 0
Else
    rc = 99
End If

WScript.Quit (rc)


Sub printOut (text)
    if isCscript Then
        WScript.StdOut.WriteLine(text)
    Else
        WScript.Echo text
    End If
End Sub


Sub printErr (text)
    if isCscript Then
        WScript.StdErr.WriteLine(text)
    Else
        WScript.Echo text
    End If
End Sub

Sub checkCScript()
    On Error Resume Next
    WScript.StdErr.Write(vbLf)
    If Err.Number <> 0 Then
        isCscript = False
    End If
    Err.Clear
End Sub


Function doit
    eof = False
    hSpeaker = Null
    IsOK=True
    doit = True

    if  Not doMultWaveFiles Then
        if IsNull(pFileName) Then
            Set hSpeaker = createSpeaker(Null)
        else
            Set hSpeaker = createSpeaker(pFileName & ".wav")
        End If
        if IsNull(hSpeaker) Then
            printErr("ERROR hSpeaker is Null")
            doit = False
            Exit Function
        else 
            if rate <> -999 Then
                IsOK=setRate(hSpeaker, rate)
            End If
            if IsOK And volume <> -999 Then
                IsOK=setVolume(hSpeaker, volume)
            End If
            if Not IsOK Then
                printErr("Set rate " & rate & _
                    " or volume " & volume & " failed." & IsOK)
                doit = False
                Exit Function
            End If
            if IsOK And Not IsNull(pVoice) Then
                setVoice hSpeaker,pVoice
            End If
        End If
    End If

    Const ForReading = 1, ForWriting = 2, ForAppending = 8

    if Not IsNull(pUnicodeFileName) Then
        Set fso = CreateObject("Scripting.FileSystemObject")
        If pEncoding = "UTF-16LE" Then
            fileMode = -1
        ElseIf pEncoding = "ASCII" Then
            fileMode = 0
        Else
            fileMode = -2 'System Default
        End If
        Set pInFile = fso.OpenTextFile(pUnicodeFileName, ForReading, False, fileMode)
        If IsNull(pInFile) Then
            PrintErr("Unable to open input file "& pUnicodeFileName)
            doit = False
            Exit Function
        End If
    Else
        If isCscript Then
            Set pInFile = WScript.StdIn
        Else
            pInFile = Null
        End If
    End If

    If IsNull(pInFile) Then

        If IsNull(pText) Then
            sText = InputBox("Enter the text you want the computer to say", "ptts")
        Else
            sText = pText
        End If

        sText = Trim(sText)

        If sText <> "" Then
            Call Speak(hSpeaker, sText)
        End If

    Else
        While Not pInFile.AtEndOfStream
            textLine = pInFile.ReadLine
    '        // We now have something to say
            If doMultWaveFiles Then
                waveSeq = waveSeq + 1
                fnNumber = "00000" & CStr(waveSeq)
                fnNumber = Mid (fnNumber, Len(fnNumber) - 4)
                fileName = pFileName & fnNumber & ".wav"
                Set hSpeaker = createSpeaker(fileName)
                if IsNull(hSpeaker) Then
                    printErr("ERROR hSpeaker is Null")
                    doit = False
                    Exit Function
                Else 
                    if rate <> -999 Then
                        IsOK=setRate(hSpeaker, rate)
                    End If
                    if IsOK And volume <> -999 Then
                        IsOK=setVolume(hSpeaker, volume)
                    End If
                    if Not IsOK Then
                        printErr("Set rate " & rate & _
                            " or volume " & volume & " failed." & IsOK)
                        doit = False
                        Exit Function
                    End If
                End If
            End If
            Call Speak(hSpeaker,textLine)
            If doMultWaveFiles Then
                Call closeSpeaker(hSpeaker)
            End If
        Wend
    End If
    If Not IsNull(hSpeaker) Then
        Call closeSpeaker(hSpeaker)
    End If
End Function

outputFile = Null
Const SVSFlagsAsync = 1 
const SVSFPurgeBeforeSpeak = 2 


Function createSpeaker(filename)
    ' printErr("createSpeaker " & filename)
    Dim speaker
    outputFile = Null
    Set speaker = CreateObject("SAPI.SpVoice")
    If Not IsNull(filename) Then
        Set outputFile = CreateObject("SAPI.SpFileStream")
        Set format = outputFile.format
        ' Need to fix this for samples and channels
        format.Type = getWaveType(samples,channels)
        Set outputFile.Format = format
        outputFile.Open filename, 3
        Set speaker.AudioOutputStream = outputFile
    End If
    Set createSpeaker = speaker
End Function


Function Speak(hSpeaker, text)
    On Error Resume Next
    hSpeaker.Speak text, SVSFlagsAsync + SVSFPurgeBeforeSpeak
    Do
            Sleep 100
    Loop Until hSpeaker.WaitUntilDone(10)

    Speak = True
End Function


Function setRate(hSpeaker, rate)
    hSpeaker.Rate = rate
    setRate = True
End Function


Function setVolume(hSpeaker, volume)
    hSpeaker.Volume = volume
    setVolume = True
End Function


Function setVoice(hSpeaker, voice)
    Set list = hSpeaker.GetVoices("Name="&voice)
    If list.Count <> 1 Then
        printErr("ERROR "&list.Count&" voices match "&voice)
        setVoice = False
        Exit Function
    End If
    Set hSpeaker.Voice = list.Item(0)
    setVoice = True
End Function


Function closeSpeaker(hSpeaker)
    Set hSpeaker = Nothing
    hSpeaker = Null
    Set outputFile = Nothing
    outputFile = Null
    closeSpeaker = True
End Function


Function getWaveType(samples, channels)
    getWaveType = 34
    If     samples =  8000 Then 
        getWaveType = 6
    ElseIf samples = 16000 Then 
        getWaveType = 18
    ElseIf samples = 22050 Then 
        getWaveType = 22
    ElseIf samples = 44100 Then 
        getWaveType = 34
    ElseIf samples = 48000 Then 
        getWaveType = 38
    Else
        printErr("Invalid samples "&samples)
    End If
    If channels = 1 Then
    ElseIf channels = 2 Then
        getWaveType = getWaveType + 1
    Else
        printErr("Invalid channel number "&channels)
    End If
End Function