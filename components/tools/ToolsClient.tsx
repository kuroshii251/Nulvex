"use client";

import React, { useState } from "react";
import CryptoTool from "@/components/tools/cryptography";
import { ShieldAlert } from "lucide-react";
import Sidebar from "@/components/tools/sidebar";
import ClickjackingTester from "@/components/tools/clickjackingtest";
import BugBountyReporter from "@/components/tools/reportemplate";
import PasswordGenerator from "@/components/tools/passwordgenerator";
import WhoisLookup from "@/components/tools/whoislookup";
import AESEncryptor from "@/components/tools/aes";
import HashGenerator from "@/components/tools/hash";
import JWTDecoder from "@/components/tools/jwt";
import CORSTester from "@/components/tools/corstest";
import HeadersAnalyzer from "@/components/tools/headersanalyzer";
import URLEncoder from "@/components/tools/urlencode";
import DNSLookup from "@/components/tools/dnslookup";
import SubdomainScanner from "@/components/tools/subdomain";
import IPGeolocation from "@/components/tools/ipgeo";
import MACLookup from "@/components/tools/maclookup";

export default function ToolsClient() {
  const [activeTool, setActiveTool] = useState("base64");

  const renderToolComponent = () => {
    switch (activeTool) {
      case "base64": return <CryptoTool />;
      case "aes": return <AESEncryptor />;
      case "hash": return <HashGenerator />;
      case "jwt": return <JWTDecoder />;
      case "clickjackingtest": return <ClickjackingTester />;
      case "corstest": return <CORSTester />;
      case "headersanalyzer": return <HeadersAnalyzer />;
      case "urlencode": return <URLEncoder />;
      case "whoislookup": return <WhoisLookup />;
      case "dnslookup": return <DNSLookup />;
      case "subdomain": return <SubdomainScanner />;
      case "ipgeo": return <IPGeolocation />;
      case "reporttemplate": return <BugBountyReporter />;
      case "passwordgenerator": return <PasswordGenerator />;
      case "maclookup": return <MACLookup />;
      default:
        return (
          <div className="p-8 border border-white/5 bg-gray-900/20 rounded-2xl text-center max-w-xl">
            <ShieldAlert className="w-8 h-8 text-red-500 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-white">Under Development</h3>
            <p className="text-xs text-gray-500 mt-1">
              This module is being constructed. Threat pipelines will deploy it shortly.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col md:flex-row flex-1">
      {/* Sidebar Navigation */}
      <Sidebar activeTool={activeTool} setActiveTool={setActiveTool} />

      {/* Dynamic Tool Content Workspace */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto" style={{ background: "#000000" }}>
        {renderToolComponent()}
      </main>
    </div>
  );
}
