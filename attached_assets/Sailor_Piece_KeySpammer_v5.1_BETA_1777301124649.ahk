; ==============================================================================
; Script Name: Sailor Piece Keyspammer v5.0 BETA
; Author:      Yato
; License:     Attribution-NonCommercial (CC BY-NC)
; ==============================================================================
; IMPORTANT ANTI-CHEAT DISCLAIMER:
; Please ensure that all background games utilizing anti-cheat software 
; (such as Valorant, CS:GO, Genshin Impact, League of Legends, etc.) 
; are completely CLOSED before running this macro. Active anti-cheats 
; may flag AutoHotkey scripts as malicious, which could result in an account ban.
; ==============================================================================
; TERMS OF USE:
; 1. Attribution: You must give appropriate credit to the original author (Yato).
; 2. GUI/Code Credit: Credit to "Yato" must remain visible in the script 
;    comments and prominently displayed within any Graphical User Interface (GUI).
; 3. Non-Commercial: You may not use this material for commercial purposes 
;    or for-profit ventures.
; 4. Modification: You are free to remix, transform, and build upon the material.
; 5. Reciprocal License: By modifying this material, you grant the original author a non-exclusive, royalty-free license to use, host, and distribute those  modifications.
; ==============================================================================

/*
    CREDIT NOTICE:
    This script was originally authored by Yato.
    If you are seeing this, ensure that the GUI also displays: "Original Code by Yato" or something similar

    You may freely share my macro around other servers, however, note that if you do download my macros from other servers and you get a Virus or Malware, I am NOT  responsible as people can maliciously alter the code.
*/

#Requires AutoHotkey v2.0
#SingleInstance Force

IniFile := "AutoSub.ini"
DefaultPresets := "Default" 

if !FileExist(IniFile) {
    WarningText := "IMPORTANT DISCLAIMER:`nMake sure all background games with anti-cheats (Valorant, CS:GO, Genshin Impact, League of Legends, etc.) are CLOSED before using this macro. Leaving them open may trigger their anti-cheat and ban you!`n`nNo configuration has been found.`n`nOK = Agree to auto subscribe`nCancel = Exit"
    
    Result := MsgBox(WarningText, "First Time Setup & Warning", "OKCancel Iconi")
    if (Result = "Cancel")
        ExitApp()
    Run("https://www.youtube.com/@yatoark/?sub_confirmation=1")
    Sleep(3000)
    TargetID := WinGetID("A")
    WinGetPos(&X, &Y, &W, &H, TargetID)
    Click(X + (W / 2), Y + (H / 2))
    Sleep(100), Send("{Tab}"), Sleep(100), Send("{Tab}"), Sleep(300), Send("{Enter}"), Sleep(500), Send("{Enter}")
    
    IniWrite(DefaultPresets, IniFile, "Meta", "Presets")
    IniWrite("e", IniFile, "Default", "Key1")
    IniWrite("100", IniFile, "Default", "Delay1")
}

PresetList := IniRead(IniFile, "Meta", "Presets", DefaultPresets)

IsActive := false
OldToggleKey := "" 
StartTime := 0
KeyTasks := []
KeyEdits := []   
AssignEdits := []
DelayEdits := [] 
SlotCount := 2 

SavedTheme := IniRead(IniFile, "Meta", "Theme", "Default")

if (SavedTheme = "Dark") {
    BgColor := "121212", PanelColor := "1E1E1E", CardColor := "2C2C2C", TextColor := "E0E0E0", AccentColor := "6200EE"
} else if (SavedTheme = "Ocean") {
    BgColor := "0A192F", PanelColor := "112240", CardColor := "233554", TextColor := "E6F1FF", AccentColor := "64FFDA"
} else if (SavedTheme = "Crimson") {
    BgColor := "1A0505", PanelColor := "2D0A0A", CardColor := "4A1515", TextColor := "FFFFFF", AccentColor := "FF4C4C"
} else if (SavedTheme = "Forest") {
    BgColor := "0F2922", PanelColor := "173A30", CardColor := "265447", TextColor := "E8F5E9", AccentColor := "4CAF50"
} else if (SavedTheme = "Purple") {
    BgColor := "B098D4", PanelColor := "1A1124", CardColor := "2A1B38", TextColor := "FFFFFF", AccentColor := "1A1124"
} else if (SavedTheme = "Sunset") {
    BgColor := "2D142C", PanelColor := "510A32", CardColor := "801336", TextColor := "FFFFFF", AccentColor := "EE4540"
} else if (SavedTheme = "Hacker") {
    BgColor := "050505", PanelColor := "0A0A0A", CardColor := "111111", TextColor := "00FF00", AccentColor := "003300"
} else if (SavedTheme = "Coffee") {
    BgColor := "3E2723", PanelColor := "4E342E", CardColor := "5D4037", TextColor := "D7CCC8", AccentColor := "8D6E63"
} else if (SavedTheme = "Midnight") {
    BgColor := "000000", PanelColor := "080808", CardColor := "121212", TextColor := "FFFFFF", AccentColor := "333333"
} else if (SavedTheme = "Nord") {
    BgColor := "2E3440", PanelColor := "3B4252", CardColor := "434C5E", TextColor := "D8DEE9", AccentColor := "88C0D0"
} else if (SavedTheme = "Solarized Dark") {
    BgColor := "002B36", PanelColor := "073642", CardColor := "586E75", TextColor := "839496", AccentColor := "B58900"
} else if (SavedTheme = "Solarized Light") {
    BgColor := "FDF6E3", PanelColor := "EEE8D5", CardColor := "93A1A1", TextColor := "002B36", AccentColor := "268BD2"
} else if (SavedTheme = "Dracula") {
    BgColor := "282A36", PanelColor := "44475A", CardColor := "6272A4", TextColor := "F8F8F2", AccentColor := "BD93F9"
} else if (SavedTheme = "Monokai") {
    BgColor := "272822", PanelColor := "3E3D32", CardColor := "49483E", TextColor := "F8F8F2", AccentColor := "F92672"
} else if (SavedTheme = "Rose Pine") {
    BgColor := "191724", PanelColor := "26233A", CardColor := "312F44", TextColor := "E0DEF4", AccentColor := "EBBCBA"
} else if (SavedTheme = "Gruvbox") {
    BgColor := "282828", PanelColor := "3C3836", CardColor := "504945", TextColor := "EBDBB2", AccentColor := "FABD2F"
} else if (SavedTheme = "Tokyo Night") {
    BgColor := "1A1B26", PanelColor := "24283B", CardColor := "414868", TextColor := "C0CAF5", AccentColor := "7AA2F7"
} else if (SavedTheme = "Lavender") {
    BgColor := "F5EFFF", PanelColor := "E5D9F2", CardColor := "CDC1FF", TextColor := "4A4A4A", AccentColor := "A294F5"
} else if (SavedTheme = "Mint") {
    BgColor := "F0FDF4", PanelColor := "DCFCE7", CardColor := "BBF7D0", TextColor := "166534", AccentColor := "22C55E"
} else {
    BgColor := "1A1A1A", PanelColor := "1A1A1A", CardColor := "2D2D2D", TextColor := "F0F0F0", AccentColor := "0078D7"
}

global DebugMode := false
global LastLogMsg := ""
global LogMsgCount := 0
global LogHistory := []
global WebhookURL := ""
global WebhookInterval := 10
global UseWebhook := 0

global DebugGui := Gui("+AlwaysOnTop -MaximizeBox", "Debug Log")
DebugGui.BackColor := PanelColor
DebugGui.SetFont("s9 c" TextColor, "Consolas")
global DebugEdit := DebugGui.Add("Edit", "w350 h400 ReadOnly Multi -Wrap Background" CardColor " c" TextColor)
DebugGui.OnEvent("Close", (*) => (CheckDebug.Value := 0, ToggleDebugGui()))

global WebhookGui := Gui("+AlwaysOnTop -MaximizeBox", "Discord Webhook")
WebhookGui.BackColor := PanelColor
WebhookGui.SetFont("s9 c" TextColor, "Segoe UI")
WebhookGui.Add("Text", "w250 Background" PanelColor, "Webhook URL:")
global WebhookURLEdit := WebhookGui.Add("Edit", "w250 Background" CardColor " c" TextColor)
BtnTestWebhook := WebhookGui.Add("Button", "w250 h30", "Test Webhook")
BtnTestWebhook.OnEvent("Click", TestWebhookMsg)
BtnSaveWebhook := WebhookGui.Add("Button", "w250 h30", "Save && Close")
BtnSaveWebhook.OnEvent("Click", CloseWebhookGui)
WebhookGui.OnEvent("Close", CloseWebhookGui)

TestWebhookMsg(*) {
    testUrl := WebhookURLEdit.Value
    if (testUrl = "")
        return
    psScript := "$body = @{embeds=@(@{title='Test Webhook'; description='Your webhook works'; color=16766720})} | ConvertTo-Json -Depth 3; Invoke-RestMethod -Uri '" testUrl "' -Method Post -Body $body -ContentType 'application/json'"
    Run('powershell -NoProfile -Command "' psScript '"', , "Hide")
    LogDebug("Sent test message to Discord.")
}

TestMainWebhook(*) {
    global WebhookURL
    if (WebhookURL = "") {
        MsgBox("Please set a webhook URL first by clicking 'Change'.", "Error", "Iconx")
        return
    }
    psScript := "$body = @{embeds=@(@{title='Test Webhook'; description='Your webhook works'; color=16766720})} | ConvertTo-Json -Depth 3; Invoke-RestMethod -Uri '" WebhookURL "' -Method Post -Body $body -ContentType 'application/json'"
    Run('powershell -NoProfile -Command "' psScript '"', , "Hide")
    LogDebug("Sent test message to Discord (From Main GUI).")
}

SendWebhookStatus(title, color) {
    global WebhookURL, UseWebhook
    if (!UseWebhook || WebhookURL = "")
        return
    psScript := "$body = @{embeds=@(@{title='" title "'; color=" color "})} | ConvertTo-Json -Depth 3; Invoke-RestMethod -Uri '" WebhookURL "' -Method Post -Body $body -ContentType 'application/json'"
    Run('powershell -NoProfile -Command "' psScript '"', , "Hide")
}

CloseWebhookGui(*) {
    global WebhookURL := WebhookURLEdit.Value
    WebhookGui.Hide()
    SaveAndApply(false)
}

OpenWebhookGui(*) {
    WebhookURLEdit.Value := WebhookURL
    WebhookGui.Show()
}

HandleWebhookClick(*) {
    if (CheckWebhook.Value) {
        OpenWebhookGui()
    }
    UpdateGuiLayout()
    SaveAndApply(false)
}

LogDebug(Msg) {
    global DebugMode, DebugEdit, LastLogMsg, LogMsgCount, LogHistory
    if (!DebugMode)
        return
        
    Timestamp := FormatTime(A_Now, "HH:mm:ss")
    
    if (Msg == LastLogMsg) {
        LogMsgCount++
        LogHistory[LogHistory.Length] := "[" Timestamp "] " Msg " (x" LogMsgCount ")"
    } else {
        LastLogMsg := Msg
        LogMsgCount := 1
        LogHistory.Push("[" Timestamp "] " Msg)
        
        if (LogHistory.Length > 150) {
            LogHistory.RemoveAt(1)
        }
    }
    
    OutText := ""
    for item in LogHistory {
        OutText .= item "`n"
    }
    
    DebugEdit.Value := OutText
    SendMessage(0x115, 7, 0, DebugEdit.Hwnd)
}

ToggleDebugGui(*) {
    global DebugMode := CheckDebug.Value
    if (DebugMode) {
        DebugGui.Show("NoActivate")
        LogDebug("--- Debug Log Enabled ---")
    } else {
        DebugGui.Hide()
    }
}

MainGui := Gui("+AlwaysOnTop -MaximizeBox", "Version 5.1 BETA")
MainGui.OnEvent("Close", (*) => ExitApp())
MainGui.BackColor := BgColor

MainGui.SetFont("s9 c" TextColor, "Segoe UI")

MainGui.SetFont("s10 w700")
global HeaderBG := MainGui.Add("Text", "x0 y0 w310 h40 Background" AccentColor)
TitleLnk1 := MainGui.Add("Text", "x0 y4 w310 h20 Center +0x200 Background" AccentColor " c" TextColor, "KEYSPAMMER")
MainGui.SetFont("s7 w400")
TitleLnk2 := MainGui.Add("Text", "x0 y22 w310 h15 Center +0x200 Background" AccentColor " c" TextColor, "Double Click Header To Watch Tutorial")
TitleLnk1.OnEvent("DoubleClick", (*) => Run("https://www.youtube.com/watch?v=pYPqz9JSPao&t=151s"))
TitleLnk2.OnEvent("DoubleClick", (*) => Run("https://www.youtube.com/watch?v=pYPqz9JSPao&t=151s"))

MainGui.SetFont("s9 w600")
global MainTabs := MainGui.Add("Tab3", "x5 y45 w300 h500 Background" PanelColor " c" TextColor, ["Main", "System"])

MainTabs.UseTab(1)
MainGui.SetFont("s8 w600")

global BG_Preset := MainGui.Add("Text", "x15 y75 w280 h55 Background" PanelColor)
global GB_Preset := MainGui.Add("GroupBox", "x15 y75 w280 h55 c" TextColor " Background" PanelColor, "💾 Preset Manager")

global BG_Slots := MainGui.Add("Text", "x15 y135 w280 h10 Background" PanelColor)
global GB_Slots := MainGui.Add("GroupBox", "x15 y135 w280 h10 c" TextColor " Background" PanelColor, "⌨️ Key Tasks")

global BG_Mode := MainGui.Add("Text", "x15 y0 w280 h10 Background" PanelColor)
global GB_Mode := MainGui.Add("GroupBox", "x15 y0 w280 h10 c" TextColor " Background" PanelColor, "⚙️ Mode Settings")

global BG_Clicker := MainGui.Add("Text", "x15 y0 w280 h10 Background" PanelColor)
global GB_Clicker := MainGui.Add("GroupBox", "x15 y0 w280 h10 c" TextColor " Background" PanelColor, "🖱️ Auto Clicker")

global BG_Toggle := MainGui.Add("Text", "x15 y0 w280 h10 Background" PanelColor)
global GB_Toggle := MainGui.Add("GroupBox", "x15 y0 w280 h10 c" TextColor " Background" PanelColor, "🔑 Start / Stop")

MainGui.SetFont("w400 s9")
DDLPreset := MainGui.Add("DropDownList", "x25 y93 w110 Choose1", StrSplit(PresetList, "|"))
DDLPreset.OnEvent("Change", (guiCtrl, *) => LoadPresetSettings(guiCtrl.Text))

BtnNew := MainGui.Add("Button", "x145 y92 w40 h24", "NEW")
BtnNew.OnEvent("Click", CreateNewPreset)
BtnDel := MainGui.Add("Button", "x190 y92 w40 h24", "DEL")
BtnDel.OnEvent("Click", DeletePreset)
BtnSave := MainGui.Add("Button", "x235 y92 w50 h24", "SAVE")
BtnSave.OnEvent("Click", (*) => SaveAndApply(true))

global TxtKey := MainGui.Add("Text", "x25 y150 w110 Background" PanelColor, "Target Key")
global TxtDelay := MainGui.Add("Text", "x145 y150 w110 Background" PanelColor, "Delay (ms)")
global TxtAssign := MainGui.Add("Text", "x195 y150 w85 Hidden Background" PanelColor, "Assignment")
SlotContainerY := 170 

Loop 10 {
    YPos := SlotContainerY + ((A_Index - 1) * 26) 
    
    ke := MainGui.Add("Edit", "x25 y" YPos " w110 Lowercase Background" CardColor " c" TextColor)
    de := MainGui.Add("Edit", "x145 y" YPos " w110 Background" CardColor " c" TextColor)
    ae := MainGui.Add("DropDownList", "x195 y" YPos " w85 Choose1 Hidden", ["All", "Melee", "Sword"])
    
    ke.OnEvent("Change", (*) => SaveAndApply(false))
    de.OnEvent("Change", (*) => SaveAndApply(false))
    ae.OnEvent("Change", (*) => SaveAndApply(false))
    
    KeyEdits.Push(ke)
    DelayEdits.Push(de)
    AssignEdits.Push(ae)
}

BtnAddSlot := MainGui.Add("Button", "w125 h26", "+ ADD SLOT")
BtnRemoveSlot := MainGui.Add("Button", "w125 h26", "- REMOVE SLOT")
BtnAddSlot.OnEvent("Click", (*) => ChangeSlotCount(1))
BtnRemoveSlot.OnEvent("Click", (*) => ChangeSlotCount(-1))

MainGui.SetFont("w700")
TxtMode := MainGui.Add("Text", "w50 Background" PanelColor, "Mode:")
MainGui.SetFont("w400")
DDLMode := MainGui.Add("DropDownList", "w150 Choose1", ["Normal", "Boss Rush", "Infinite Tower"])
DDLMode.OnEvent("Change", (*) => (UpdateGuiLayout(), SaveAndApply(false)))

MainGui.SetFont("w700")
global CheckMelee := MainGui.Add("Checkbox", "w140 Background" PanelColor, "Melee Swap")
CheckMelee.OnEvent("Click", HandleMeleeClick)
MainGui.SetFont("w400 s8")
BtnSetM1 := MainGui.Add("Button", "w120 h24", "Set Melee 1")
BtnSetM2 := MainGui.Add("Button", "w120 h24", "Set Melee 2")
BtnSetM1.OnEvent("Click", (*) => GrabPos(1))
BtnSetM2.OnEvent("Click", (*) => GrabPos(2))

MainGui.SetFont("s9")
TxtSwap := MainGui.Add("Text", "w125 Background" PanelColor, "Swap Interval (ms):")
EditMeleeDelay := MainGui.Add("Edit", "w125 Background" CardColor " c" TextColor, "5000")
EditMeleeDelay.OnEvent("Change", (*) => SaveAndApply(false))

MainGui.SetFont("w700")
global CheckMeleeSword := MainGui.Add("Checkbox", "w180 Background" PanelColor, "Melee + Sword Swap")
CheckMeleeSword.OnEvent("Click", HandleMeleeSwordClick)
MainGui.SetFont("w400 s9")

TxtSwordSwap := MainGui.Add("Text", "w130 Background" PanelColor, "Swap Interval (ms):")
EditSwordDelay := MainGui.Add("Edit", "w125 Background" CardColor " c" TextColor, "5000")
EditSwordDelay.OnEvent("Change", (*) => SaveAndApply(false))

CheckClick := MainGui.Add("Checkbox", "w140 vUseClick Background" PanelColor, "Auto Clicker")
CheckClick.OnEvent("Click", (*) => SaveAndApply(false))
EditClickDelay := MainGui.Add("Edit", "w125 Background" CardColor " c" TextColor, "100")
EditClickDelay.OnEvent("Change", (*) => SaveAndApply(false))

TxtHotkey := MainGui.Add("Text", "w80 Background" PanelColor, "Start/Stop Key:")
global BtnHotkey := MainGui.Add("Button", "w160 h26", "F1")
BtnHotkey.OnEvent("Click", RecordHotkey)

MainTabs.UseTab(2)
MainGui.SetFont("s8 w600")

global BG_System := MainGui.Add("Text", "x15 y75 w280 h10 Background" PanelColor)
global GB_System := MainGui.Add("GroupBox", "x15 y75 w280 h10 c" TextColor " Background" PanelColor, "💻 System Configuration")
MainGui.SetFont("w400 s9")

global CheckWebhook := MainGui.Add("Checkbox", "w130 Background" PanelColor, "Discord Webhook")
CheckWebhook.OnEvent("Click", HandleWebhookClick)

global BtnChangeWebhook := MainGui.Add("Button", "w55 h24 Hidden", "Change")
BtnChangeWebhook.OnEvent("Click", OpenWebhookGui)

global BtnTestWebhookMain := MainGui.Add("Button", "w55 h24 Hidden", "Test")
BtnTestWebhookMain.OnEvent("Click", TestMainWebhook)

global TxtWebhookInterval := MainGui.Add("Text", "w135 Background" PanelColor, "Webhook Interval (m):")
global EditWebhookInterval := MainGui.Add("Edit", "w120 Background" CardColor " c" TextColor, "10")
EditWebhookInterval.OnEvent("Change", (*) => SaveAndApply(false))

global CheckDebug := MainGui.Add("Checkbox", "w130 Background" PanelColor, "Debug Log")
CheckDebug.OnEvent("Click", ToggleDebugGui)

global TxtTheme := MainGui.Add("Text", "w60 Background" PanelColor, "Theme:")
global DDLTheme := MainGui.Add("DropDownList", "w120 Choose1", ["Default", "Dark", "Ocean", "Crimson", "Forest", "Purple", "Sunset", "Hacker", "Coffee", "Midnight", "Nord", "Solarized Dark", "Solarized Light", "Dracula", "Monokai", "Rose Pine", "Gruvbox", "Tokyo Night", "Lavender", "Mint"])
DDLTheme.Choose(SavedTheme)
DDLTheme.OnEvent("Change", ChangeTheme)

MainTabs.UseTab()

StatusCircle := MainGui.Add("Progress", "w12 h12 BackgroundRed vStatus", 0)
StatusText := MainGui.Add("Text", "w60 vStatusTxt Background" BgColor, "OFF")
RuntimeText := MainGui.Add("Text", "w130 Right vRuntimeTxt Background" BgColor, "Runtime: 0s")

MainGui.SetFont("s8")
global TxtCredit := MainGui.Add("Link", "w280 c888888 Background" BgColor, "Credit: Yato | <a href=`"https://discord.gg/9dkmX6pAZd`">Join Discord</a>")
MainGui.SetFont("s9")

global MiniGui := Gui("+AlwaysOnTop -MaximizeBox -MinimizeBox +ToolWindow", "Status")
MiniGui.BackColor := PanelColor
MiniGui.SetFont("s9 c" TextColor, "Segoe UI")

MiniGui.Add("Text", "x10 y10 w150 c" AccentColor " w700 Background" PanelColor, "● MACRO RUNNING")
global MiniRuntimeTxt := MiniGui.Add("Text", "x160 y10 w130 Right Background" PanelColor, "0s")

MiniGui.SetFont("w400")
MiniGui.Add("Text", "x10 y35 w70 Background" PanelColor, "Preset:")
global MiniPresetTxt := MiniGui.Add("Text", "x80 y35 w210 w700 Background" PanelColor, "-")

MiniGui.Add("Text", "x10 y55 w70 Background" PanelColor, "Mode:")
global MiniModeTxt := MiniGui.Add("Text", "x80 y55 w210 w700 Background" PanelColor, "-")

MiniGui.Add("Text", "x10 y75 w70 Background" PanelColor, "Toggle Key:")
global MiniHotkeyTxt := MiniGui.Add("Text", "x80 y75 w210 w700 Background" PanelColor, "-")

MiniGui.Add("Text", "x10 y105 w280 Center c888888 Background" PanelColor, "Press Toggle Key to Stop")
MiniGui.OnEvent("Close", (*) => ToggleSpam())

LoadPresetSettings(DDLPreset.Text)

ChangeTheme(guiCtrl, *) {
    IniWrite(guiCtrl.Text, IniFile, "Meta", "Theme")
    MsgBox("Theme changed to " guiCtrl.Text ". The script will now reload to apply changes.", "Theme Applied", "Iconi")
    Reload()
}

HandleMeleeClick(*) {
    if (CheckMelee.Value)
        CheckMeleeSword.Value := 0
    UpdateGuiLayout()
    SaveAndApply(false)
}

HandleMeleeSwordClick(*) {
    if (CheckMeleeSword.Value)
        CheckMelee.Value := 0
    UpdateGuiLayout()
    SaveAndApply(false)
}

LoadPresetSettings(PName) {
    global SlotCount := Number(IniRead(IniFile, PName, "SavedSlots", 2))
    if (SlotCount < 2) {
        SlotCount := 2
    }

    BtnHotkey.Text := IniRead(IniFile, PName, "ToggleKey", "F1")
    Loop 10 {
        if (A_Index <= SlotCount) {
            KeyEdits[A_Index].Value := IniRead(IniFile, PName, "Key" A_Index, "")
            SavedAssign := IniRead(IniFile, PName, "Assign" A_Index, "All")
            AssignEdits[A_Index].Choose(SavedAssign)
            if (AssignEdits[A_Index].Text == "")
                AssignEdits[A_Index].Choose("All")
            DelayEdits[A_Index].Value := IniRead(IniFile, PName, "Delay" A_Index, "100")
        } else {
            KeyEdits[A_Index].Value := ""
            AssignEdits[A_Index].Choose("All")
            DelayEdits[A_Index].Value := "100"
        }
    }
    
    SavedMode := IniRead(IniFile, PName, "MacroMode", "Normal")
    DDLMode.Choose(SavedMode)
    if (DDLMode.Text == "")
        DDLMode.Choose("Normal")

    CheckClick.Value := IniRead(IniFile, PName, "UseClicker", 0)
    EditClickDelay.Value := IniRead(IniFile, PName, "ClickDelay", "100")
    
    CheckMelee.Value := IniRead(IniFile, PName, "UseMeleeSwap", 0)
    EditMeleeDelay.Value := IniRead(IniFile, PName, "MeleeSwapDelay", "200")

    CheckMeleeSword.Value := IniRead(IniFile, PName, "UseMeleeSword", 0)
    EditSwordDelay.Value := IniRead(IniFile, PName, "SwordSwapDelay", "200")
    
    CheckWebhook.Value := IniRead(IniFile, "Meta", "UseWebhook", 0)
    global WebhookURL := IniRead(IniFile, "Meta", "WebhookURL", "")
    global WebhookInterval := IniRead(IniFile, "Meta", "WebhookInterval", "10")
    EditWebhookInterval.Value := WebhookInterval

    if (CheckMelee.Value && CheckMeleeSword.Value) {
        CheckMeleeSword.Value := 0
    }

    UpdateGuiLayout()
    UpdateSettings(false)
}

ChangeSlotCount(change) {
    global SlotCount
    newCount := SlotCount + change
    if (newCount < 2 || newCount > 10) {
        return
    }
    SlotCount := newCount
    UpdateGuiLayout()
    SaveAndApply(false)
}

UpdateGuiLayout() {
    global SlotCount, SlotContainerY
    global GB_Slots, GB_Mode, GB_Clicker, GB_Toggle, GB_System
    global BG_Slots, BG_Mode, BG_Clicker, BG_Toggle, BG_System
    global MainTabs, StatusCircle, StatusText, RuntimeText, TxtCredit
    global CheckMelee, CheckMeleeSword, CheckWebhook

    CurrentMode := DDLMode.Text
    if (CurrentMode == "")
        CurrentMode := "Normal"

    ShowMelee := (CurrentMode = "Boss Rush" || CurrentMode = "Infinite Tower")
    ShowMeleeSword := (CurrentMode = "Boss Rush" || CurrentMode = "Infinite Tower")
    IsMeleeSwordActive := (ShowMeleeSword && CheckMeleeSword.Value)

    if (IsMeleeSwordActive) {
        TxtAssign.Visible := true
        TxtKey.Move(25, , 70)
        TxtDelay.Move(105, , 80)
        TxtAssign.Move(195, , 85)
    } else {
        TxtAssign.Visible := false
        TxtKey.Move(25, , 110)
        TxtDelay.Move(145, , 110)
    }

    Loop 10 {
        if (A_Index <= SlotCount) {
            KeyEdits[A_Index].Visible := true
            DelayEdits[A_Index].Visible := true
            if (IsMeleeSwordActive) {
                AssignEdits[A_Index].Visible := true
                KeyEdits[A_Index].Move(25, , 70)
                DelayEdits[A_Index].Move(105, , 80)
                AssignEdits[A_Index].Move(195, , 85)
            } else {
                AssignEdits[A_Index].Visible := false
                KeyEdits[A_Index].Move(25, , 110)
                DelayEdits[A_Index].Move(145, , 110)
            }
        } else {
            KeyEdits[A_Index].Visible := false
            AssignEdits[A_Index].Visible := false
            DelayEdits[A_Index].Visible := false
            KeyEdits[A_Index].Value := "" 
        }
    }

    NextY := SlotContainerY + (SlotCount * 26) + 5
    BtnAddSlot.Move(25, NextY)
    BtnRemoveSlot.Move(160, NextY)
    NextY += 32

    BG_Slots.Move(15, 135, 280, NextY - 135 + 5)
    GB_Slots.Move(15, 135, 280, NextY - 135 + 5)
    NextY += 12

    StartY_Mode := NextY
    NextY += 18 

    TxtMode.Move(25, NextY + 3)
    DDLMode.Move(125, NextY)
    NextY += 28

    if (ShowMelee) {
        CheckMelee.Visible := true
        CheckMelee.Move(25, NextY)
        NextY += 25
        
        if (CheckMelee.Value) {
            BtnSetM1.Visible := true, BtnSetM2.Visible := true
            TxtSwap.Visible := true, EditMeleeDelay.Visible := true
            
            BtnSetM1.Move(25, NextY)
            BtnSetM2.Move(155, NextY)
            NextY += 28
            
            TxtSwap.Move(25, NextY + 3)
            EditMeleeDelay.Move(155, NextY)
            NextY += 28
        } else {
            BtnSetM1.Visible := false, BtnSetM2.Visible := false
            TxtSwap.Visible := false, EditMeleeDelay.Visible := false
        }
    } else {
        CheckMelee.Visible := false
        BtnSetM1.Visible := false, BtnSetM2.Visible := false
        TxtSwap.Visible := false, EditMeleeDelay.Visible := false
    }

    if (ShowMeleeSword) {
        CheckMeleeSword.Visible := true
        CheckMeleeSword.Move(25, NextY)
        NextY += 25
        
        if (CheckMeleeSword.Value) {
            TxtSwordSwap.Visible := true, EditSwordDelay.Visible := true
            TxtSwordSwap.Move(25, NextY + 3)
            EditSwordDelay.Move(155, NextY)
            NextY += 28
        } else {
            TxtSwordSwap.Visible := false, EditSwordDelay.Visible := false
        }
    } else {
        CheckMeleeSword.Visible := false
        TxtSwordSwap.Visible := false, EditSwordDelay.Visible := false
    }

    BG_Mode.Move(15, StartY_Mode, 280, NextY - StartY_Mode)
    GB_Mode.Move(15, StartY_Mode, 280, NextY - StartY_Mode)
    NextY += 10

    StartY_Clicker := NextY
    NextY += 18 

    CheckClick.Move(25, NextY + 3)
    EditClickDelay.Move(155, NextY)
    NextY += 28

    BG_Clicker.Move(15, StartY_Clicker, 280, NextY - StartY_Clicker)
    GB_Clicker.Move(15, StartY_Clicker, 280, NextY - StartY_Clicker)
    NextY += 10

    StartY_Toggle := NextY
    NextY += 18 

    TxtHotkey.Move(25, NextY + 3)
    BtnHotkey.Move(115, NextY)
    NextY += 30

    BG_Toggle.Move(15, StartY_Toggle, 280, NextY - StartY_Toggle)
    GB_Toggle.Move(15, StartY_Toggle, 280, NextY - StartY_Toggle)
    NextY += 10

    TabHeight1 := NextY - 45 + 10

    SysY := 95
    CheckWebhook.Move(25, SysY + 3)
    if (CheckWebhook.Value) {
        BtnChangeWebhook.Visible := true
        BtnTestWebhookMain.Visible := true
        BtnChangeWebhook.Move(160, SysY)
        BtnTestWebhookMain.Move(225, SysY)
        SysY += 28
        
        TxtWebhookInterval.Visible := true
        EditWebhookInterval.Visible := true
        TxtWebhookInterval.Move(25, SysY + 3)
        EditWebhookInterval.Move(160, SysY)
        SysY += 28
    } else {
        BtnChangeWebhook.Visible := false
        BtnTestWebhookMain.Visible := false
        TxtWebhookInterval.Visible := false
        EditWebhookInterval.Visible := false
        SysY += 28
    }

    CheckDebug.Move(25, SysY + 3)
    SysY += 28
    
    TxtTheme.Move(25, SysY + 3)
    DDLTheme.Move(85, SysY)
    SysY += 32

    BG_System.Move(15, 75, 280, SysY - 75 + 10)
    GB_System.Move(15, 75, 280, SysY - 75 + 10)

    TabHeight2 := SysY - 45 + 15
    MaxTabHeight := Max(TabHeight1, TabHeight2)

    MainTabs.Move(5, 45, 300, MaxTabHeight)
    
    FinalY := 45 + MaxTabHeight + 5
    StatusCircle.Move(15, FinalY + 3)
    StatusText.Move(35, FinalY)
    RuntimeText.Move(165, FinalY)
    FinalY += 25
    
    TxtCredit.Move(15, FinalY)
    FinalY += 20

    TotalHeight := FinalY
    MainGui.Show("w310 h" TotalHeight " NoActivate") 
    WinRedraw(MainGui.Hwnd) 
}

GrabPos(num) {
    ToolTip("Click on the item in your inventory...")
    ih := InputHook("L1 M")
    KeyWait("LButton", "D")
    MouseGetPos(&mX, &mY)
    IniWrite(mX, IniFile, DDLPreset.Text, "M" num "X")
    IniWrite(mY, IniFile, DDLPreset.Text, "M" num "Y")
    ToolTip("Position " num " Saved!")
    LogDebug("Melee Position " num " saved at X:" mX " Y:" mY)
    Sleep(1000)
    ToolTip()
}

SaveAndApply(ShowMsg := false) {
    PName := DDLPreset.Text
    IniWrite(SlotCount, IniFile, PName, "SavedSlots")
    
    Loop 10 {
        if (A_Index <= SlotCount) {
            IniWrite(KeyEdits[A_Index].Value, IniFile, PName, "Key" A_Index)
            IniWrite(AssignEdits[A_Index].Text, IniFile, PName, "Assign" A_Index)
            IniWrite(DelayEdits[A_Index].Value, IniFile, PName, "Delay" A_Index)
        } else {
            try IniDelete(IniFile, PName, "Key" A_Index)
            try IniDelete(IniFile, PName, "Assign" A_Index)
            try IniDelete(IniFile, PName, "Delay" A_Index)
        }
    }
    
    IniWrite(DDLMode.Text, IniFile, PName, "MacroMode")
    IniWrite(CheckClick.Value, IniFile, PName, "UseClicker")
    IniWrite(EditClickDelay.Value, IniFile, PName, "ClickDelay")
    
    IniWrite(CheckMelee.Value, IniFile, PName, "UseMeleeSwap")
    IniWrite(EditMeleeDelay.Value, IniFile, PName, "MeleeSwapDelay")

    IniWrite(CheckMeleeSword.Value, IniFile, PName, "UseMeleeSword")
    IniWrite(EditSwordDelay.Value, IniFile, PName, "SwordSwapDelay")
    
    IniWrite(CheckWebhook.Value, IniFile, "Meta", "UseWebhook")
    IniWrite(WebhookURL, IniFile, "Meta", "WebhookURL")
    IniWrite(EditWebhookInterval.Value, IniFile, "Meta", "WebhookInterval")

    IniWrite(BtnHotkey.Text, IniFile, PName, "ToggleKey")
    UpdateSettings(ShowMsg)
}

UpdateSettings(ShowMsg := false) {
    global KeyTasks, UseClicker, ClickDelay, ToggleKey, OldToggleKey, IsActive 
    global UseMeleeSwap, MeleeSwapDelay, UseMeleeSword, SwordSwapDelay, CurrentMode
    global UseWebhook
    
    if (OldToggleKey != "") {
        try Hotkey(OldToggleKey, "Off")
    }
    
    StopAllTimers()
    KeyTasks := []
    
    Loop SlotCount {
        k := Trim(KeyEdits[A_Index].Value)
        a := AssignEdits[A_Index].Text
        d := Trim(DelayEdits[A_Index].Value)
        
        if (k == "") {
            continue
        }
        
        thisDelay := IsNumber(d) ? Number(d) : 100
        KeyTasks.Push({k: k, a: a, d: thisDelay, fn: SendSpecificKey.Bind(k, a)})
    }
    
    ClickDelay := IsNumber(EditClickDelay.Value) ? Number(EditClickDelay.Value) : 100
    MeleeSwapDelay := IsNumber(EditMeleeDelay.Value) ? Number(EditMeleeDelay.Value) : 5000
    SwordSwapDelay := IsNumber(EditSwordDelay.Value) ? Number(EditSwordDelay.Value) : 5000
    
    CurrentMode := DDLMode.Text
    UseClicker := CheckClick.Value 
    UseWebhook := CheckWebhook.Value
    global WebhookInterval := IsNumber(EditWebhookInterval.Value) ? Number(EditWebhookInterval.Value) : 10
    
    UseMeleeSwap := (CurrentMode = "Boss Rush" || CurrentMode = "Infinite Tower") ? CheckMelee.Value : 0
    UseMeleeSword := (CurrentMode = "Boss Rush" || CurrentMode = "Infinite Tower") ? CheckMeleeSword.Value : 0
    
    ToggleKey := BtnHotkey.Text
    
    try Hotkey(ToggleKey, ToggleSpam, "On")
    OldToggleKey := ToggleKey
    if (ShowMsg) {
        MsgBox("Settings Applied", "Success", "Iconi T1")
    }
}

ToggleSpam(*) {
    global IsActive := !IsActive, StartTime, CurrentMelee, CurrentSword
    if (IsActive) {
        StartTime := A_TickCount
        CurrentMelee := 1
        CurrentSword := 1
        
        if (UseMeleeSword && WinActive("A")) {
            Send("1")
        }
        
        LogDebug("Macro Toggled: ON (Starting Melee " CurrentMelee ")")
        SendWebhookStatus("Macro Started", 65280)
        ResumeMacro()
            
        SetTimer(UpdateRuntime, 1000)
        StatusCircle.Opt("BackgroundGreen"), StatusText.Value := "ON"
        
        MiniPresetTxt.Value := DDLPreset.Text
        MiniModeTxt.Value := CurrentMode
        MiniHotkeyTxt.Value := ToggleKey
        MiniRuntimeTxt.Value := "0s"
        MainGui.Hide()
        
        MonitorGetWorkArea(1, &WL, &WT, &WR, &WB)
        XPos := WR - 300 - 10
        YPos := WT + 10
        MiniGui.Show("x" XPos " y" YPos " w300 NoActivate")
    } else {
        LogDebug("Macro Toggled: OFF")
        SendWebhookStatus("Macro Stopped", 16711680)
        StopAllTimers()
        MiniGui.Hide()
        MainGui.Show()
    }
}

PauseMacro() {
    global KeyTasks
    for task in KeyTasks
        SetTimer(task.fn, 0)
    try SetTimer(DoTheClick, 0)
    try SetTimer(DoMeleeSwap, 0)
    try SetTimer(DoMeleeSwordSwap, 0)
    try SetTimer(TakeAndSendScreenshot, 0)
}

ResumeMacro() {
    global KeyTasks, UseClicker, ClickDelay, UseMeleeSwap, MeleeSwapDelay, UseMeleeSword, SwordSwapDelay
    global UseWebhook, WebhookInterval, WebhookURL
    for task in KeyTasks
        SetTimer(task.fn, task.d)
    if (UseClicker)
        SetTimer(DoTheClick, ClickDelay)
    if (UseMeleeSwap)
        SetTimer(DoMeleeSwap, MeleeSwapDelay)
    if (UseMeleeSword)
        SetTimer(DoMeleeSwordSwap, SwordSwapDelay)
    if (UseWebhook && WebhookURL != "" && WebhookInterval > 0) {
        LogDebug("Started Webhook Timer: " WebhookInterval " min interval")
        TakeAndSendScreenshot() 
        SetTimer(TakeAndSendScreenshot, WebhookInterval * 60000)
    }
}

TakeAndSendScreenshot() {
    global WebhookURL
    if (WebhookURL = "")
        return
    
    payload := '{"embeds": [{"title": "Screenshot Update", "color": 3447003, "image": {"url": "attachment://ss.png"}}]}'
    try FileDelete("payload.json")
    FileAppend(payload, "payload.json")
    
    psScript := "Add-Type -AssemblyName System.Drawing; Add-Type -AssemblyName System.Windows.Forms; $bmp = New-Object System.Drawing.Bitmap([System.Windows.Forms.Screen]::PrimaryScreen.Bounds.Width, [System.Windows.Forms.Screen]::PrimaryScreen.Bounds.Height); $gfx = [System.Drawing.Graphics]::FromImage($bmp); $gfx.CopyFromScreen(0, 0, 0, 0, $bmp.Size); $bmp.Save('ss.png'); $gfx.Dispose(); $bmp.Dispose();"
    
    cmd := 'cmd.exe /c powershell -NoProfile -Command "' psScript '" && curl.exe -s -F "payload_json=<payload.json" -F "file=@ss.png" "' WebhookURL '" && del payload.json && del ss.png'
    Run(cmd, , "Hide")
    LogDebug("Sent screenshot to Discord.")
}

SafeSleep(duration) {
    global IsActive
    endTime := A_TickCount + duration
    while (A_TickCount < endTime) {
        if (!IsActive)
            return false 
        Sleep(50)
    }
    return true
}

DoMeleeSwap() {
    global CurrentMelee
    if !WinActive("A") {
        return
    }
    
    PName := DDLPreset.Text
    mX := IniRead(IniFile, PName, "M" CurrentMelee "X", 0)
    mY := IniRead(IniFile, PName, "M" CurrentMelee "Y", 0)
    
    if (mX = 0) {
        LogDebug("Melee Swap Failed: Position " CurrentMelee " not set!")
        return
    }

    Click(mX, mY)
    Sleep(50)
    
    Send("1")
    
    CurrentMelee := (CurrentMelee = 1) ? 2 : 1
    LogDebug("Swapped active weapon to Melee " CurrentMelee)
}

DoMeleeSwordSwap() {
    global CurrentSword
    if !WinActive("A") {
        return
    }
    
    if (CurrentSword = 1) {
        Send("2")
        CurrentSword := 2
        LogDebug("Melee+Sword Swap: Pressed 2 (Sword)")
    } else {
        Send("1")
        CurrentSword := 1
        LogDebug("Melee+Sword Swap: Pressed 1 (Melee)")
    }
}

StopAllTimers() {
    global IsActive := false
    PauseMacro()
    SetTimer(UpdateRuntime, 0)
    StatusCircle.Opt("BackgroundRed"), StatusText.Value := "OFF"
}

SendSpecificKey(keyToSend, assign) {
    global CurrentSword
    if WinActive("A") {
        if (UseMeleeSword) {
            if (assign = "Melee" && CurrentSword != 1) {
                return
            }
            if (assign = "Sword" && CurrentSword != 2) {
                return
            }
            
            Send(keyToSend)
            LogDebug("Executed Key: " keyToSend " [" assign "]")
        } else {
            Send(keyToSend)
            LogDebug("Executed Key: " keyToSend)
        }
    }
}

DoTheClick() {
    if WinActive("A") {
        Click()
        LogDebug("Executed Click")
    }
}

UpdateRuntime() {
    Elapsed := Floor((A_TickCount - StartTime) / 1000)
    Hours := Floor(Elapsed / 3600)
    Mins := Floor(Mod(Elapsed, 3600) / 60)
    Secs := Mod(Elapsed, 60)
    
    TimeString := ""
    if (Hours > 0)
        TimeString .= Hours "h "
    if (Hours > 0 || Mins > 0)
        TimeString .= Mins "m "
    TimeString .= Secs "s"
    
    RuntimeText.Value := "Runtime: " TimeString
    try MiniRuntimeTxt.Value := TimeString
}

RecordHotkey(*) {
    BtnHotkey.Text := "..."
    ih := InputHook("L1", "{F1}{F2}{F3}{F4}{F5}{F6}{F7}{F8}{F9}{F10}{F11}{F12}")
    ih.Start()
    NewKey := ""
    while (ih.InProgress) {
        if GetKeyState("XButton1", "P") {
            NewKey := "XButton1"
            ih.Stop()
            break
        }
        if GetKeyState("XButton2", "P") {
            NewKey := "XButton2"
            ih.Stop()
            break
        }
        if GetKeyState("MButton", "P") {
            NewKey := "MButton"
            ih.Stop()
            break
        }
        Sleep(10) 
    }
    if (NewKey == "") {
        NewKey := (ih.EndKey != "") ? ih.EndKey : ih.Input
    }
    if (NewKey != "") {
        BtnHotkey.Text := NewKey
        SaveAndApply(false)
    }
}

CreateNewPreset(*) {
    IB := InputBox("Name:", "New Preset")
    if (IB.Result = "Cancel" || IB.Value = "") {
        return
    }
    global PresetList .= "|" IB.Value
    IniWrite(PresetList, IniFile, "Meta", "Presets")
    DDLPreset.Delete(), DDLPreset.Add(StrSplit(PresetList, "|"))
    DDLPreset.Text := IB.Value
    SaveAndApply(false)
}

DeletePreset(*) {
    if (StrSplit(PresetList, "|").Length <= 1) {
        return 
    }
    TargetPreset := DDLPreset.Text
    IniDelete(IniFile, TargetPreset)
    NewList := ""
    for index, item in StrSplit(PresetList, "|") {
        if (item != TargetPreset) {
            NewList .= (NewList == "" ? "" : "|") item
        }
    }
    global PresetList := NewList
    IniWrite(PresetList, IniFile, "Meta", "Presets")
    DDLPreset.Delete()
    DDLPreset.Add(StrSplit(PresetList, "|"))
    DDLPreset.Choose(1)
    LoadPresetSettings(DDLPreset.Text)
}