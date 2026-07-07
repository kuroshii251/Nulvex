"use client";

import React, { useState, useEffect } from "react";

export default function BugBountyReporter() {
    // State Form Input
    const [title, setTitle] = useState("Broken Access Control on User Profile Deletion");
    const [target, setTarget] = useState("https://target-app.com/api/v1/users/delete");
    const [vulnType, setVulnType] = useState("IDOR (Insecure Direct Object Reference)");
    const [severity, setSeverity] = useState("High");
    const [cvss, setCvss] = useState("8.1 (CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:N)");

    const [description, setDescription] = useState(
        "An attacker can delete entire user accounts within the system en masse (mass account deletion), causing data integrity issues and serious service disruption (Denial of Service) at the user level."
    );
    const [poc, setPoc] = useState(
        "1. Login as User A (attacker).\n2. Intercept the request when trying to delete own account using Burp Suite.\n3. Change the `user_id` parameter from User A's ID to User B's ID (victim).\n4. Send the request, User B's account will be deleted with HTTP 200 OK response."
    );
    const [impact, setImpact] = useState(
        "An attacker can delete entire user accounts within the system en masse (mass account deletion), causing data integrity issues and serious service disruption (Denial of Service) at the user level."
    );
    const [remediation, setRemediation] = useState(
        "Implement Object-Level Access Control. Ensure the server validates whether the `user_id` sent in the request body matches the `session.user_id` from the JWT token or active user session before executing the deletion query."
    );

    const [markdownOutput, setMarkdownOutput] = useState("");

    // Generator logic yang berjalan otomatis (reactive) tiap kali input berubah
    useEffect(() => {
        const draft = `# [BUG REPORT] ${title}

## 1. Vulnerability Details
* **Vulnerability Type:** ${vulnType}
* **Target Endpoint/URL:** \`${target}\`
* **Severity:** **${severity}**
* **CVSS Vector:** \`${cvss || "N/A"}\`

---

## 2. Description
${description}

---

## 3. Steps to Reproduce (PoC)
${poc}

### Sample Request (Burp Suite HTTP History)
\`\`\`http
POST /api/v1/users/delete HTTP/1.1
Host: ${target.split("/")[2] || "target-app.com"}
Authorization: Bearer <ATTACKER_JWT_TOKEN>
Content-Type: application/json

{
  "user_id": "VICTIM_ID_HERE"
}
\`\`\`

---

## 4. Impact
${impact}

---

## 5. Remediation & Secure Coding Recommendation
${remediation}

---
Reported via White Hat Triaging Assistant.`;

        setMarkdownOutput(draft);
    }, [title, target, vulnType, severity, cvss, description, poc, impact, remediation]);

    return (
        <div className="space-y-6 max-w-7xl p-6 bg-gray-900 border border-white/5 rounded-2xl text-gray-200">
            <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Bug Bounty Report Draft Generator</h2>
                <p className="text-xs text-gray-500 mt-1">
                    Fill in the audit finding details below to draft a comprehensive report in an industry-standard Markdown format.                </p>
            </div>

            {/* 3 Column Layout Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">

                {/* KOLOM KIRI: INPUT DATA */}
                <div className="flex flex-col space-y-5">
                    {/* GENERAL META DATA */}
                    <div className="bg-gray-950 border border-white/5 p-4 rounded-xl space-y-4">
                        <h3 className="text-[10px] font-bold text-red-500 uppercase tracking-wider border-b border-white/5 pb-2">
                            Vulnerability Metadata
                        </h3>

                        <div className="space-y-1">
                            <label className="text-[10px] text-gray-400 font-bold uppercase">Bug Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full p-2.5 bg-gray-900 border border-white/5 rounded-lg text-xs text-gray-300 focus:outline-none focus:border-red-500/50"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] text-gray-400 font-bold uppercase">Target Vulnerable Endpoint</label>
                            <input
                                type="text"
                                value={target}
                                onChange={(e) => setTarget(e.target.value)}
                                className="w-full p-2.5 bg-gray-900 border border-white/5 rounded-lg text-xs font-mono text-gray-300 focus:outline-none focus:border-red-500/50"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] text-gray-400 font-bold uppercase">Classification Type</label>
                            <input
                                type="text"
                                value={vulnType}
                                onChange={(e) => setVulnType(e.target.value)}
                                className="w-full p-2.5 bg-gray-900 border border-white/5 rounded-lg text-xs text-gray-300 focus:outline-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className="text-[10px] text-gray-400 font-bold uppercase">Severity</label>
                                <select
                                    value={severity}
                                    onChange={(e) => setSeverity(e.target.value)}
                                    className="w-full p-2.5 bg-gray-900 border border-white/5 rounded-lg text-xs text-gray-300 focus:outline-none"
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                    <option value="Critical">Critical</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] text-gray-400 font-bold uppercase">CVSS v3 SCORE/Vector</label>
                                <input
                                    type="text"
                                    value={cvss}
                                    onChange={(e) => setCvss(e.target.value)}
                                    placeholder="e.g. 7.5"
                                    className="w-full p-2.5 bg-gray-900 border border-white/5 rounded-lg text-xs text-gray-300 focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* CORE TECHNICAL TEXT AREAS */}
                    <div className="bg-gray-950 border border-white/5 p-4 rounded-xl space-y-3">
                        <h3 className="text-[10px] font-bold text-red-500 uppercase tracking-wider border-b border-white/5 pb-2">
                            Technical Descriptions
                        </h3>

                        <div className="space-y-1">
                            <label className="text-[10px] text-gray-400 font-bold uppercase">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full h-24 p-2 bg-gray-900 border border-white/5 rounded-lg text-xs text-gray-300 focus:outline-none focus:border-red-500/50 resize-none"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] text-gray-400 font-bold uppercase">Steps to Reproduce (PoC)</label>
                            <textarea
                                value={poc}
                                onChange={(e) => setPoc(e.target.value)}
                                className="w-full h-32 p-2 bg-gray-900 border border-white/5 rounded-lg text-xs font-mono text-gray-300 focus:outline-none focus:border-red-500/50 resize-none"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] text-gray-400 font-bold uppercase">Business Impact</label>
                            <textarea
                                value={impact}
                                onChange={(e) => setImpact(e.target.value)}
                                className="w-full h-24 p-2 bg-gray-900 border border-white/5 rounded-lg text-xs text-gray-300 focus:outline-none focus:border-red-500/50 resize-none"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] text-gray-400 font-bold uppercase">Remediation Fix</label>
                            <textarea
                                value={remediation}
                                onChange={(e) => setRemediation(e.target.value)}
                                className="w-full h-24 p-2 bg-gray-900 border border-white/5 rounded-lg text-xs text-gray-300 focus:outline-none focus:border-red-500/50 resize-none"
                            />
                        </div>
                    </div>
                </div>

                {/* KOLOM KANAN: OUTPUT */}
                <div className="flex flex-col h-full">
                    {/* OUTPUT RAW DRAFT MARKDOWN */}
                    <div className="flex flex-col bg-gray-950 border border-white/5 p-4 rounded-xl space-y-2 flex-1">
                        <div className="flex justify-between items-center">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Generated Report (Markdown)</label>
                            <button
                                onClick={() => navigator.clipboard.writeText(markdownOutput)}
                                className="text-[10px] font-bold text-red-400 hover:underline bg-transparent border-none cursor-pointer"
                            >
                                [Copy Report]
                            </button>
                        </div>
                        <textarea
                            readOnly
                            value={markdownOutput}
                            className="w-full flex-1 min-h-[400px] lg:min-h-0 p-3 bg-gray-900/40 border border-white/5 rounded-lg text-xs font-mono text-red-400 focus:outline-none resize-none select-all h-full"
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}