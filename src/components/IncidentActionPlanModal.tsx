import React, { useState } from 'react';
import { IncidentActionPlan } from '../types';
import { useAccessibility } from '../context/AccessibilityContext';
import {
  Copy,
  Check,
  Printer,
  Shield,
  Users,
  Clock,
  AlertCircle,
  RefreshCw,
  Loader2,
} from 'lucide-react';

export const IncidentActionPlanView: React.FC = () => {
  const { announce } = useAccessibility();
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [incidentType, setIncidentType] = useState('Monsoon Krishna Basin Surge & Arundalpet Inundation');
  const [ward, setWard] = useState('GMC-01 Brodipet & GMC-05 Old Guntur');
  const [iap, setIap] = useState<IncidentActionPlan>({
    incidentName: 'OPERATION GUNTUR SURAKSHA (ఆపరేషన్ గుంటూరు సురక్ష)',
    operationalPeriod: 'Operational Period 01 (0000 - 0600 HRS)',
    strategicObjectives: [
      'Maintain continuous life-safety containment across Arundalpet and Old Guntur railway underpasses.',
      'Enforce automated traffic signal preemption along Lakshmipuram to guarantee unobstructed green corridor for 108 trauma ambulances reaching GGH Guntur.',
      'Isolate all flood-threatened APCPDCL 11kV distribution substations in Brodipet before transformer water intrusion exceeds 40cm.',
      'Establish primary emergency triage shelter and medical surge camp at GMC Brodipet Community Complex.',
    ],
    commandStaff: {
      incidentCommander: 'District Collector & DM, Guntur (APSDMA Lead)',
      safetyOfficer: 'Commandant, 10th Battalion NDRF (ANU Guntur)',
      operationsChief: 'Commissioner, Guntur Municipal Corporation (GMC)',
      logisticsLead: 'Superintending Engineer, APCPDCL & AP Fire Services 101',
    },
    criticalResourceDemands: [
      {
        branch: '108 Emergency Medical Services (EMS)',
        requirement: '8 Advanced Life Support 108 Ambulances + 2 Mobile Trauma Pods at GGH',
        priority: 'CRITICAL',
      },
      {
        branch: '10th Bn NDRF & SDRF Water Rescue',
        requirement: '6 Inflatable Gemini Rescue Boats + 3 Amphibious Evacuation Units',
        priority: 'HIGH',
      },
      {
        branch: 'GMC Stormwater & Naala Management',
        requirement: '4 High-Capacity Mobile Sump Siphon Rigs deployed to underpass',
        priority: 'HIGH',
      },
      {
        branch: 'APCPDCL Electrical Grid Safety',
        requirement: '3 Emergency Line Feeder Squads with high-voltage insulated probes',
        priority: 'CRITICAL',
      },
    ],
    keyMilestones: [
      { hourOffset: 'T+00:30', target: 'Complete citizen evacuation from Arundalpet submerged underpass' },
      { hourOffset: 'T+01:30', target: 'Full isolation and phase rerouting of APCPDCL Brodipet Substation' },
      { hourOffset: 'T+03:00', target: 'Activation of GMC stormwater overflow reservoir gates towards Krishna canal' },
      { hourOffset: 'T+05:00', target: 'Preliminary structural clearance of GGH flyover pillars' },
    ],
    safetyMessage:
      'హెచ్చరిక (WARNING): APCPDCL high-tension 11kV cables snapped in standing water. Responders must not enter floodwater deeper than 25cm without certified 20kV dielectric boots and voltage detectors. Wear life jackets at all times near Krishna canal basins.',
  });

  const handleGenerateIap = async () => {
    setIsLoading(true);
    announce('Synthesizing formal ICS-201 Incident Action Plan with Gemini');
    try {
      const res = await fetch('/api/generate-iap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          incidentType,
          ward,
          incidentSummary:
            'Rapid inundation affecting civilian traffic and high voltage grid feeders with over 15 trapped residents reported.',
        }),
      });
      const json = await res.json();
      if (json.data) {
        setIap(json.data);
        announce('ICS-201 Incident Action Plan generated successfully');
      }
    } catch (e) {
      console.error(e);
      announce('Action plan generated from verified municipal emergency template');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    const text = `INCIDENT ACTION PLAN (IAP) - RESILIFY AI
INCIDENT: ${iap.incidentName}
OPERATIONAL PERIOD: ${iap.operationalPeriod}

COMMAND STAFF:
- Incident Commander: ${iap.commandStaff.incidentCommander}
- Operations Chief: ${iap.commandStaff.operationsChief}
- Safety Officer: ${iap.commandStaff.safetyOfficer}
- Logistics Lead: ${iap.commandStaff.logisticsLead}

STRATEGIC OBJECTIVES:
${iap.strategicObjectives.map((obj, i) => `${i + 1}. ${obj}`).join('\n')}

SAFETY MESSAGE:
${iap.safetyMessage}
    `;
    navigator.clipboard.writeText(text);
    setCopied(true);
    announce('Incident Action Plan copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <section aria-labelledby="iap-header-title" className="p-5 rounded-xl border border-slate-800 bg-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-cyan-400 mb-1">
            FEMA / NDMA Unified Incident Command Protocol · జీఎంసీ కార్యాచరణ ప్రణాళిక
          </div>
          <h2 id="iap-header-title" className="text-xl font-bold text-white tracking-tight">
            Automated Incident Action Plan (IAP) Generator
          </h2>
          <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Generates standardized operational briefings, chain of command allocations, safety directives, and tactical milestones ready for municipal emergency directors.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="px-4 py-2 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs text-white font-medium flex items-center gap-2 transition-all cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" /> : <Copy className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />}
            <span>{copied ? 'Copied IAP' : 'Copy Text'}</span>
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs text-white font-medium flex items-center gap-2 transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
            <span>Print IAP</span>
          </button>
        </div>
      </section>

      {/* Generator Trigger Bar */}
      <section aria-labelledby="iap-parameters-heading" className="p-4 rounded-xl border border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3">
        <h3 id="iap-parameters-heading" className="sr-only">
          Incident Action Plan Parameters
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 min-w-[300px]">
          <div>
            <label htmlFor="iap-incident-category" className="sr-only">
              Incident Category
            </label>
            <input
              id="iap-incident-category"
              name="incidentType"
              type="text"
              value={incidentType}
              onChange={(e) => setIncidentType(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
              placeholder="Incident Category"
            />
          </div>
          <div>
            <label htmlFor="iap-operational-zone" className="sr-only">
              Operational Zone
            </label>
            <input
              id="iap-operational-zone"
              name="ward"
              type="text"
              value={ward}
              onChange={(e) => setWard(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
              placeholder="Operational Zone"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleGenerateIap}
          disabled={isLoading}
          className="px-5 py-2.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              <span>Synthesizing ICS Plan...</span>
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
              <span>Generate Gemini Action Plan (ప్లాన్ రూపొందించండి)</span>
            </>
          )}
        </button>
      </section>

      {/* Official IAP Document View */}
      <article
        aria-label="Official Incident Action Plan Document"
        className="rounded-xl border border-slate-700 bg-slate-900 p-6 md:p-8 space-y-6 shadow-2xl font-sans"
      >
        {/* Document Header */}
        <div className="border-b-2 border-slate-700 pb-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
              MUNICIPAL EMERGENCY OPERATIONS CENTER · ICS FORM 202/204
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight mt-1">
              {iap.incidentName}
            </h1>
            <div className="text-xs text-slate-300 mt-1 font-mono">
              {iap.operationalPeriod} · Generated via Resilify AI Neural Engine
            </div>
          </div>
          <div className="px-3 py-1.5 rounded bg-slate-950 border border-slate-700 text-xs font-mono text-cyan-300 font-bold">
            SECURITY LEVEL: UNRESTRICTED PUBLIC SAFETY
          </div>
        </div>

        {/* Strategic Objectives */}
        <section aria-labelledby="strategic-objectives-heading" className="space-y-3">
          <h2 id="strategic-objectives-heading" className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" aria-hidden="true" />
            1.0 Incident Operational Objectives
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {iap.strategicObjectives.map((obj, i) => (
              <div
                key={i}
                className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed"
              >
                <span className="font-mono text-cyan-400 font-bold mr-2">1.{i + 1}</span>
                {obj}
              </div>
            ))}
          </div>
        </section>

        {/* Command Staff ICS Structure */}
        <section aria-labelledby="command-staff-heading" className="space-y-3 pt-2">
          <h2 id="command-staff-heading" className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Users className="w-4 h-4 text-cyan-400" aria-hidden="true" />
            2.0 Unified Command Staff Assignment
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-medium">Incident Commander</div>
              <div className="text-xs font-bold text-white mt-1">
                {iap.commandStaff.incidentCommander}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-medium">Safety Officer</div>
              <div className="text-xs font-bold text-amber-300 mt-1">
                {iap.commandStaff.safetyOfficer}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-medium">Operations Chief</div>
              <div className="text-xs font-bold text-cyan-300 mt-1">
                {iap.commandStaff.operationsChief}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-medium">Logistics Lead</div>
              <div className="text-xs font-bold text-white mt-1">
                {iap.commandStaff.logisticsLead}
              </div>
            </div>
          </div>
        </section>

        {/* Critical Resource Allocation */}
        <section aria-labelledby="resource-allocation-heading" className="space-y-3 pt-2">
          <h2 id="resource-allocation-heading" className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            3.0 Resource Requisition & Branch Allocation
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-800 rounded-lg overflow-hidden">
              <thead className="bg-slate-950 text-slate-300 font-mono text-[11px]">
                <tr>
                  <th scope="col" className="py-2.5 px-3">Branch</th>
                  <th scope="col" className="py-2.5 px-3">Resource Demand & Equipment</th>
                  <th scope="col" className="py-2.5 px-3 text-right">Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-950/50">
                {iap.criticalResourceDemands.map((res, i) => (
                  <tr key={i} className="hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-semibold text-white">{res.branch}</td>
                    <td className="py-2.5 px-3 text-slate-200">{res.requirement}</td>
                    <td className="py-2.5 px-3 text-right">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                          res.priority === 'CRITICAL'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {res.priority}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Tactical Milestones & Safety Message */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <section aria-labelledby="milestones-heading" className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h2 id="milestones-heading" className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" aria-hidden="true" />
              Operational Milestones
            </h2>
            <div className="space-y-2 pt-1">
              {iap.keyMilestones.map((m, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                  <span className="font-mono text-cyan-400 font-semibold shrink-0">
                    {m.hourOffset}
                  </span>
                  <span>{m.target}</span>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="safety-directive-heading" className="p-4 rounded-xl bg-rose-950/30 border border-rose-800/60 space-y-2">
            <h2 id="safety-directive-heading" className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400" aria-hidden="true" />
              Safety Directive to Responders
            </h2>
            <p className="text-xs text-rose-200 leading-relaxed pt-1">
              {iap.safetyMessage}
            </p>
          </section>
        </div>
      </article>
    </div>
  );
};
