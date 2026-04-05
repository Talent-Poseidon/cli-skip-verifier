@startuml
header Sistem Assessment - Event Storming Alur Kerja
title Diagram Alur Proses Penilaian

skinparam monochrome false
skinparam packageStyle rectangle
skinparam shadowing false

legend left
    |= Warna |= Tipe Komponen |
    |<#FEF5E7>| Aggregate (Kuning) |
    |<#FAD7A0>| Domain Event (Oranye) |
    |<#AED6F1>| Command (Biru Muda) |
    |<#ABEBC6>| System (Hijau) |
    |<#F5B7B1>| Policy (Pink) |
    |<#D7BDE2>| View (Ungu) |
endlegend

node "Master Data Setup" {
    [Setup Kamus] <<Aggregate>>
    [Submit Kamus by template] <<Command>>
    [Kamus Submitted] <<Domain Event>>
    [Kamus Potensi & Kompetensi] <<View>>
    
    [Setup Standar Jabatan] <<Aggregate>>
    [Submit Standar] <<Command>>
    [Standar Submitted] <<Domain Event>>
    
    [Setup Scenario] <<Aggregate>>
    [Submit Scenario] <<Command>>
    [Scenario Submitted] <<Domain Event>>
}

node "Project Management" {
    [Setup Project] <<Aggregate>>
    [Create Project] <<Command>>
    [Submit Project] <<Domain Event>>
    [1 Batch Max 20] <<Policy>>
    
    [Send Invitation] <<System>>
    [Assessee Notified] <<Domain Event>>
    [Invitation Expired 7 Day] <<Policy>>
    
    [Assign Assessor] <<Command>>
    [Assessor Assigned] <<Domain Event>>
}

node "Assessee Journey" {
    [Start Intake] <<Command>>
    [Dashboard Page] <<View>>
    
    package "Testing" {
        [Potensi Intake] <<View>>
        [Intray / Case Study] <<View>>
        [Submit Test] <<Command>>
    }
    
    package "Interaction" {
        [Start Interaction] <<Command>>
        [Active Camera] <<Policy>>
        [Share Screen] <<Policy>>
        [Interaction Page Assessee] <<View>>
    }
    [Assessment End] <<Domain Event>>
}

node "Assessor Journey" {
    [Assessor Dashboard] <<View>>
    [List Assessee] <<View>>
    [Interaction Page Assessor] <<View>>
}

node "Final Output" {
    [Scoring Page] <<View>>
    [Scoring Assessee] <<Aggregate>>
    [Submit Scoring] <<Command>>
    [Report Generated] <<Domain Event>>
}

' Relationships
[Submit Kamus by template] --> [Kamus Submitted]
[Kamus Submitted] --> [Setup Standar Jabatan]
[Kamus Submitted] --> [Setup Scenario]

[Submit Project] --> [Send Invitation]
[Submit Project] --> [Assign Assessor]
[Send Invitation] --> [Assessee Notified]

[Assessee Notified] --> [Dashboard Page]
[Dashboard Page] --> [Potensi Intake]
[Dashboard Page] --> [Intray / Case Study]
[Dashboard Page] --> [Interaction Page Assessee]

[Assessor Assigned] --> [Assessor Dashboard]
[Assessor Dashboard] --> [Interaction Page Assessor]

[Submit Test] --> [Scoring Page]
[Assessment End] --> [Scoring Page]
[Scoring Page] --> [Submit Scoring]
[Submit Scoring] --> [Report Generated]

@enduml