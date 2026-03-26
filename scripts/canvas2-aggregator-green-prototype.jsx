import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Home,
  Users,
  Sparkles,
  Package,
  Receipt,
  QrCode,
  MapPin,
  Leaf,
  Search,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Wifi,
  WifiOff,
  ClipboardList,
  Scale,
  BadgeDollarSign,
  Banknote,
} from "lucide-react";

/**
 * JANI APP (Green) — Aggregators / Co-ops prototype
 * Screens:
 * 1) Homepage
 * 2) Farmers (KDE: location, farm size, field mapping, crops, unique ID / QR)
 * 3) JANI AI assistant
 * 4) Collection (produce collection log: quantity, quality, variety, etc.)
 * 5) Books (track quantity, payments, price)
 *
 * Notes:
 * - Front-end only, in-memory state
 * - Green theme via emerald accents
 */

const fmt = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 });

function uid(prefix) {
  return `${prefix}-${Math.random().toString(16).slice(2, 6)}${Math.random().toString(16).slice(2, 6)}`.toUpperCase();
}

function todayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function pillClass(status) {
  if (status === "synced") return "border-emerald-200 bg-emerald-50 text-emerald-800";
  if (status === "pending") return "border-amber-200 bg-amber-50 text-amber-800";
  return "border-slate-200 bg-slate-50 text-slate-700";
}

function Shell({ children }) {
  return (
    <div className="min-h-screen w-full flex justify-center bg-slate-50">
      <div className="w-full max-w-md min-h-screen bg-white border-x border-slate-200">
        {children}
      </div>
    </div>
  );
}

function TopBar({ title, online, queued, onToggleOnline, onSync }) {
  return (
    <div className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-2xl bg-emerald-700 text-white grid place-items-center shadow-sm">
            <Leaf className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500">JANI APP</div>
            <div className="text-base font-semibold leading-none">{title}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleOnline}
            className="h-9 w-9 rounded-2xl border border-slate-200 grid place-items-center"
            aria-label="Toggle online"
          >
            {online ? <Wifi className="h-4 w-4 text-emerald-700" /> : <WifiOff className="h-4 w-4 text-slate-600" />}
          </button>
          <button
            onClick={onSync}
            className="h-9 w-9 rounded-2xl border border-slate-200 grid place-items-center"
            aria-label="Sync"
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-700" />
          </button>
          <Badge variant="outline" className="rounded-xl">{queued} queued</Badge>
        </div>
      </div>
    </div>
  );
}

function BottomNav({ active, setActive }) {
  const items = [
    { key: "home", label: "Home", icon: Home },
    { key: "farmers", label: "Farmers", icon: Users },
    { key: "assistant", label: "Assistant", icon: Sparkles },
    { key: "collection", label: "Collection", icon: Package },
    { key: "books", label: "Books", icon: Receipt },
  ];

  return (
    <div className="sticky bottom-0 z-30 bg-white border-t border-slate-200">
      <div className="grid grid-cols-5">
        {items.map((it) => {
          const Icon = it.icon;
          const isActive = active === it.key;
          return (
            <button
              key={it.key}
              onClick={() => setActive(it.key)}
              className={`py-3 flex flex-col items-center gap-1 text-xs ${isActive ? "text-emerald-800" : "text-slate-500"}`}
            >
              <div
                className={`h-9 w-9 rounded-2xl grid place-items-center ${
                  isActive ? "bg-emerald-700 text-white" : "bg-slate-100 text-slate-700"
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>
              {it.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, hint }) {
  return (
    <Card className="rounded-3xl shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs text-slate-500">{label}</div>
            <div className="text-2xl font-semibold mt-1">{value}</div>
            {hint ? <div className="text-xs text-slate-500 mt-1">{hint}</div> : null}
          </div>
          <div className="h-10 w-10 rounded-2xl bg-emerald-50 border border-emerald-200 grid place-items-center">
            <Icon className="h-5 w-5 text-emerald-700" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SectionTitle({ icon: Icon, title, right }) {
  return (
    <div className="flex items-center justify-between mt-5 mb-2 px-4">
      <div className="flex items-center gap-2">
        <div className="h-9 w-9 rounded-2xl bg-emerald-50 border border-emerald-200 grid place-items-center">
          <Icon className="h-5 w-5 text-emerald-700" />
        </div>
        <div className="font-semibold">{title}</div>
      </div>
      {right}
    </div>
  );
}

function Row({ title, subtitle, right, onClick, active }) {
  const Wrapper = onClick ? "button" : "div";
  return (
    <Wrapper
      onClick={onClick}
      className={`w-full text-left px-4 py-3 flex items-center justify-between border-b border-slate-100 ${
        active ? "bg-emerald-50/60" : "bg-white"
      }`}
    >
      <div>
        <div className="text-sm font-medium">{title}</div>
        {subtitle ? <div className="text-xs text-slate-500 mt-1">{subtitle}</div> : null}
      </div>
      {right}
    </Wrapper>
  );
}

function Empty({ icon: Icon, title, desc, action }) {
  return (
    <div className="px-6 py-10 text-center">
      <div className="mx-auto h-12 w-12 rounded-2xl bg-emerald-50 border border-emerald-200 grid place-items-center">
        <Icon className="h-6 w-6 text-emerald-700" />
      </div>
      <div className="mt-3 font-semibold">{title}</div>
      <div className="text-sm text-slate-500 mt-1">{desc}</div>
      <div className="mt-4">{action}</div>
    </div>
  );
}

export default function JaniAggregatorGreenPrototype() {
  const [active, setActive] = useState("home");
  const [online, setOnline] = useState(true);
  const [queued, setQueued] = useState(3);

  const [farmers, setFarmers] = useState(() => [
    {
      id: "FR-001",
      name: "Amina El Idrissi",
      location: "Souss",
      farmSizeHa: 2.4,
      crops: ["Olive"],
      status: "synced",
      fields: [
        {
          id: "FD-101",
          name: "Field A",
          crop: "Olive",
          variety: "Picholine",
          sizeHa: 1.4,
          gps: { lat: 30.4201, lng: -9.5981 },
          status: "synced",
        },
      ],
    },
    {
      id: "FR-002",
      name: "Youssef Berrada",
      location: "Haouz",
      farmSizeHa: 1.1,
      crops: ["Citrus"],
      status: "pending",
      fields: [],
    },
  ]);

  const [collections, setCollections] = useState(() => [
    {
      id: "LOT-9A3F",
      date: todayISO(),
      farmerId: "FR-001",
      crop: "Olive",
      variety: "Picholine",
      quantity: 18,
      unit: "crates",
      weightKg: 540,
      qualityGrade: "A",
      notes: "Collected at gate 2",
      status: "pending",
    },
  ]);

  // Books: derived ledger rows; can be created from collections
  const [ledger, setLedger] = useState(() => [
    {
      id: "PAY-0003",
      date: todayISO(),
      farmerId: "FR-001",
      lotId: "LOT-9A3F",
      pricePerKg: 2.3,
      paidAmount: 1242,
      currency: "MAD",
      status: "pending",
    },
  ]);

  const totals = useMemo(() => {
    const totalFarmers = farmers.length;
    const totalFields = farmers.reduce((acc, f) => acc + (f.fields?.length || 0), 0);
    const todayLots = collections.filter((c) => c.date === todayISO()).length;
    const pending =
      farmers.filter((f) => f.status === "pending").length +
      collections.filter((c) => c.status === "pending").length +
      ledger.filter((l) => l.status === "pending").length;

    const totalKgToday = collections
      .filter((c) => c.date === todayISO())
      .reduce((acc, c) => acc + (Number(c.weightKg) || 0), 0);

    return { totalFarmers, totalFields, todayLots, pending, totalKgToday };
  }, [farmers, collections, ledger]);

  function queueOne() {
    setQueued((q) => q + 1);
  }

  function onSync() {
    if (!online) return;
    setFarmers((prev) => prev.map((x) => ({ ...x, status: "synced", fields: x.fields.map((f) => ({ ...f, status: "synced" })) })));
    setCollections((prev) => prev.map((x) => ({ ...x, status: "synced" })));
    setLedger((prev) => prev.map((x) => ({ ...x, status: "synced" })));
    setQueued(0);
  }

  const title =
    active === "home"
      ? "Homepage"
      : active === "farmers"
      ? "Farmers"
      : active === "assistant"
      ? "JANI AI Assistant"
      : active === "collection"
      ? "Collection"
      : "Books";

  return (
    <Shell>
      <TopBar
        title={title}
        online={online}
        queued={queued}
        onToggleOnline={() => setOnline((v) => !v)}
        onSync={onSync}
      />

      <div className="px-4 pt-4 pb-24">
        {active === "home" ? (
          <HomeScreen
            totals={totals}
            online={online}
            queued={queued}
            go={setActive}
            onSync={onSync}
          />
        ) : null}

        {active === "farmers" ? (
          <FarmersScreen
            farmers={farmers}
            setFarmers={setFarmers}
            onQueue={queueOne}
          />
        ) : null}

        {active === "assistant" ? (
          <AssistantScreen
            farmers={farmers}
            collections={collections}
            ledger={ledger}
            onSuggestion={(route) => setActive(route)}
          />
        ) : null}

        {active === "collection" ? (
          <CollectionScreen
            farmers={farmers}
            collections={collections}
            setCollections={setCollections}
            onQueue={queueOne}
          />
        ) : null}

        {active === "books" ? (
          <BooksScreen
            farmers={farmers}
            collections={collections}
            ledger={ledger}
            setLedger={setLedger}
            onQueue={queueOne}
          />
        ) : null}
      </div>

      <BottomNav active={active} setActive={setActive} />
    </Shell>
  );
}

function HomeScreen({ totals, online, queued, go, onSync }) {
  return (
    <>
      <div className="rounded-3xl bg-emerald-800 text-white p-5 shadow-sm">
        <div className="text-xs text-emerald-100">Trace • Transform • Trust</div>
        <div className="text-xl font-semibold mt-1">Aggregator / Co-op Console</div>
        <div className="text-sm text-emerald-100 mt-2">
          Register farmers, map fields, collect produce lots, and track payments — with an audit trail.
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-emerald-100">
          <div className="flex items-center gap-2">
            {online ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
            <span>{online ? "Online" : "Offline"}</span>
          </div>
          <div className="flex items-center gap-2">
            {queued > 0 ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
            <span>{queued > 0 ? `${queued} pending uploads` : "All synced"}</span>
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <Button
            onClick={onSync}
            className="rounded-2xl bg-white text-emerald-900 hover:bg-white/90"
          >
            <CheckCircle2 className="h-4 w-4 mr-2" /> Sync
          </Button>
          <Button
            variant="secondary"
            onClick={() => go("collection")}
            className="rounded-2xl bg-emerald-700/30 text-white border border-white/15 hover:bg-emerald-700/40"
          >
            <Package className="h-4 w-4 mr-2" /> New collection
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <Stat icon={Users} label="Farmers" value={totals.totalFarmers} hint="Registered" />
        <Stat icon={MapPin} label="Fields" value={totals.totalFields} hint="Mapped" />
        <Stat icon={Package} label="Lots" value={totals.todayLots} hint="Collected today" />
        <Stat icon={Scale} label="Kg today" value={fmt.format(totals.totalKgToday)} hint="Total weight" />
      </div>

      <SectionTitle
        icon={Plus}
        title="Quick actions"
        right={<Badge variant="outline" className="rounded-xl">Offline-first</Badge>}
      />

      <div className="grid grid-cols-2 gap-3">
        <Button onClick={() => go("farmers")} variant="secondary" className="rounded-2xl justify-start">
          <Users className="h-4 w-4 mr-2" /> Add farmer
        </Button>
        <Button onClick={() => go("farmers")} variant="secondary" className="rounded-2xl justify-start">
          <MapPin className="h-4 w-4 mr-2" /> Map field
        </Button>
        <Button onClick={() => go("assistant")} variant="secondary" className="rounded-2xl justify-start">
          <Sparkles className="h-4 w-4 mr-2" /> Ask JANI
        </Button>
        <Button onClick={() => go("books")} variant="secondary" className="rounded-2xl justify-start">
          <Receipt className="h-4 w-4 mr-2" /> Payments
        </Button>
      </div>

      <SectionTitle icon={ClipboardList} title="Today overview" />
      <Card className="rounded-3xl shadow-sm">
        <CardContent className="p-4 space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <div className="text-slate-600">Pending items</div>
            <Badge variant="outline" className="rounded-xl">{totals.pending}</Badge>
          </div>
          <div className="text-xs text-slate-500">
            Tip: keep QR scanning on for collection to reduce mix-ups and strengthen the audit trail.
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function FarmersScreen({ farmers, setFarmers, onQueue }) {
  const [q, setQ] = useState("");
  const [selectedId, setSelectedId] = useState(farmers[0]?.id || "");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return farmers;
    return farmers.filter((f) => `${f.name} ${f.id} ${f.location}`.toLowerCase().includes(s));
  }, [farmers, q]);

  const selected = useMemo(() => farmers.find((f) => f.id === selectedId) || null, [farmers, selectedId]);

  function addFarmer(payload) {
    const f = {
      id: uid("FR"),
      status: "pending",
      fields: [],
      ...payload,
    };
    setFarmers((prev) => [f, ...prev]);
    setSelectedId(f.id);
    onQueue();
  }

  function addField(farmerId, payload) {
    setFarmers((prev) =>
      prev.map((f) => {
        if (f.id !== farmerId) return f;
        const field = { id: uid("FD"), status: "pending", ...payload };
        return { ...f, status: "pending", fields: [field, ...(f.fields || [])] };
      })
    );
    onQueue();
  }

  return (
    <>
      <div className="flex items-center gap-2 mt-2">
        <div className="relative flex-1">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search farmer, ID, location…" className="pl-9 rounded-2xl" />
        </div>
        <AddFarmerDialog onCreate={addFarmer} />
      </div>

      <SectionTitle
        icon={Users}
        title="Farmer registry"
        right={<Badge variant="outline" className="rounded-xl">{filtered.length}</Badge>}
      />

      {filtered.length === 0 ? (
        <Empty
          icon={Users}
          title="No farmers yet"
          desc="Add a farmer and capture key data elements for traceability."
          action={<AddFarmerDialog onCreate={addFarmer} />}
        />
      ) : (
        <Card className="rounded-3xl shadow-sm overflow-hidden">
          {filtered.map((f) => (
            <Row
              key={f.id}
              title={f.name}
              subtitle={`${f.id} • ${f.location} • ${fmt.format(f.farmSizeHa)} ha • ${f.fields.length} field(s)`}
              active={f.id === selectedId}
              onClick={() => setSelectedId(f.id)}
              right={
                <span className={`text-xs px-2 py-1 rounded-xl border ${pillClass(f.status)}`}>{f.status}</span>
              }
            />
          ))}
        </Card>
      )}

      {selected ? (
        <>
          <SectionTitle
            icon={QrCode}
            title="Unique ID / QR"
            right={<Badge className="rounded-xl bg-emerald-700 hover:bg-emerald-700">{selected.id}</Badge>}
          />
          <Card className="rounded-3xl shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm font-semibold">{selected.name}</div>
                  <div className="text-xs text-slate-500 mt-1">Scan at collection to link lots to this farmer.</div>
                </div>
                <div className="h-14 w-14 rounded-3xl bg-emerald-50 border border-emerald-200 grid place-items-center">
                  <QrCode className="h-7 w-7 text-emerald-700" />
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-2xl border border-slate-200 p-3">
                  <div className="text-xs text-slate-500">Location</div>
                  <div className="font-medium mt-1">{selected.location}</div>
                </div>
                <div className="rounded-2xl border border-slate-200 p-3">
                  <div className="text-xs text-slate-500">Farm size</div>
                  <div className="font-medium mt-1">{fmt.format(selected.farmSizeHa)} ha</div>
                </div>
                <div className="rounded-2xl border border-slate-200 p-3">
                  <div className="text-xs text-slate-500">Crops</div>
                  <div className="font-medium mt-1">{selected.crops?.join(", ") || "—"}</div>
                </div>
                <div className="rounded-2xl border border-slate-200 p-3">
                  <div className="text-xs text-slate-500">Fields</div>
                  <div className="font-medium mt-1">{selected.fields.length}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <SectionTitle
            icon={MapPin}
            title="Field mapping"
            right={<AddFieldDialog farmer={selected} onCreate={(p) => addField(selected.id, p)} />}
          />

          <Card className="rounded-3xl shadow-sm">
            <CardContent className="p-4">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-sm font-semibold">Map placeholder</div>
                <div className="text-xs text-slate-500 mt-1">
                  Next iteration: polygon draw + GPS verification (Mapbox/Google). For now, capture GPS point and field metadata.
                </div>
              </div>

              <div className="mt-4">
                <div className="text-sm font-semibold">Fields</div>
                {selected.fields.length === 0 ? (
                  <div className="text-sm text-slate-500 mt-2">No fields mapped yet.</div>
                ) : (
                  <div className="mt-2 space-y-2">
                    {selected.fields.map((fd) => (
                      <div key={fd.id} className="rounded-3xl border border-slate-200 p-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-sm font-semibold">{fd.name}</div>
                            <div className="text-xs text-slate-500 mt-1">
                              {fd.crop} • {fd.variety} • {fmt.format(fd.sizeHa)} ha
                            </div>
                            <div className="text-xs text-slate-500 mt-1">
                              GPS: {fd.gps?.lat?.toFixed?.(5) ?? "—"}, {fd.gps?.lng?.toFixed?.(5) ?? "—"}
                            </div>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-xl border ${pillClass(fd.status)}`}>{fd.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      ) : null}
    </>
  );
}

function AddFarmerDialog({ onCreate }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [farmSizeHa, setFarmSizeHa] = useState("");
  const [crops, setCrops] = useState("Olive");

  function submit() {
    if (!name.trim()) return;
    onCreate({
      name: name.trim(),
      location: location.trim() || "Unknown",
      farmSizeHa: Number(farmSizeHa) || 0,
      crops: crops
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),
    });
    setName("");
    setLocation("");
    setFarmSizeHa("");
    setCrops("Olive");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-2xl bg-emerald-700 hover:bg-emerald-800">
          <Plus className="h-4 w-4 mr-2" /> Add
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-3xl">
        <DialogHeader>
          <DialogTitle>Add farmer (KDE)</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label>Farmer name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="rounded-2xl" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Location</Label>
              <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Region / village" className="rounded-2xl" />
            </div>
            <div className="space-y-1">
              <Label>Farm size (ha)</Label>
              <Input value={farmSizeHa} onChange={(e) => setFarmSizeHa(e.target.value)} placeholder="e.g., 2.4" className="rounded-2xl" />
            </div>
          </div>
          <div className="space-y-1">
            <Label>Crops (comma separated)</Label>
            <Input value={crops} onChange={(e) => setCrops(e.target.value)} placeholder="Olive, Citrus" className="rounded-2xl" />
            <div className="text-xs text-slate-500">Unique ID / QR will be generated automatically.</div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" className="rounded-2xl" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button className="rounded-2xl bg-emerald-700 hover:bg-emerald-800" onClick={submit}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AddFieldDialog({ farmer, onCreate }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [crop, setCrop] = useState("Olive");
  const [variety, setVariety] = useState("");
  const [sizeHa, setSizeHa] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  function captureGPS() {
    const fakeLat = 30.40 + Math.random() * 0.08;
    const fakeLng = -9.65 + Math.random() * 0.12;
    setLat(fakeLat.toFixed(5));
    setLng(fakeLng.toFixed(5));
  }

  function submit() {
    if (!name.trim()) return;
    onCreate({
      name: name.trim(),
      crop,
      variety: variety.trim() || "Unknown",
      sizeHa: Number(sizeHa) || 0,
      gps: { lat: Number(lat) || null, lng: Number(lng) || null },
    });
    setName("");
    setCrop("Olive");
    setVariety("");
    setSizeHa("");
    setLat("");
    setLng("");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="rounded-2xl">
          <MapPin className="h-4 w-4 mr-2" /> Add field
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-3xl">
        <DialogHeader>
          <DialogTitle>Map a field — {farmer.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1">
            <Label>Field name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Field A" className="rounded-2xl" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Crop</Label>
              <select
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                className="h-10 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm"
              >
                <option>Olive</option>
                <option>Citrus</option>
                <option>Tea</option>
                <option>Coffee</option>
                <option>Vegetables</option>
                <option>Cereals</option>
              </select>
            </div>
            <div className="space-y-1">
              <Label>Variety</Label>
              <Input value={variety} onChange={(e) => setVariety(e.target.value)} placeholder="e.g., Picholine" className="rounded-2xl" />
            </div>
          </div>
          <div className="space-y-1">
            <Label>Size (ha)</Label>
            <Input value={sizeHa} onChange={(e) => setSizeHa(e.target.value)} placeholder="e.g., 1.5" className="rounded-2xl" />
          </div>

          <div className="rounded-3xl border border-slate-200 p-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">GPS capture</div>
              <Button size="sm" variant="secondary" className="rounded-2xl" onClick={captureGPS}>
                <MapPin className="h-4 w-4 mr-2" /> Capture
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="space-y-1">
                <Label>Latitude</Label>
                <Input value={lat} onChange={(e) => setLat(e.target.value)} placeholder="30.12345" className="rounded-2xl" />
              </div>
              <div className="space-y-1">
                <Label>Longitude</Label>
                <Input value={lng} onChange={(e) => setLng(e.target.value)} placeholder="-9.12345" className="rounded-2xl" />
              </div>
            </div>
            <div className="text-xs text-slate-500 mt-2">Next: polygon mapping + verification.</div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="secondary" className="rounded-2xl" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button className="rounded-2xl bg-emerald-700 hover:bg-emerald-800" onClick={submit}>
            Save field
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AssistantScreen({ farmers, collections, ledger, onSuggestion }) {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState(() => [
    {
      role: "assistant",
      text: "Hello, I am JANI AI Assistant. Ask me about onboarding, KDE capture, missing data, or collection anomalies.",
    },
  ]);

  const insights = useMemo(() => {
    const pendingFarmers = farmers.filter((f) => f.status === "pending").length;
    const pendingLots = collections.filter((c) => c.status === "pending").length;
    const pendingPays = ledger.filter((l) => l.status === "pending").length;
    const totalKgToday = collections.filter((c) => c.date === todayISO()).reduce((a, c) => a + (Number(c.weightKg) || 0), 0);

    // quick missing-field heuristic
    const missingFields = farmers.filter((f) => (f.fields?.length || 0) === 0).slice(0, 3);

    return { pendingFarmers, pendingLots, pendingPays, totalKgToday, missingFields };
  }, [farmers, collections, ledger]);

  function reply(userText) {
    const t = userText.trim().toLowerCase();

    if (!t) return { text: "Type a question and I will help.", actions: [] };

    if (t.includes("missing") || t.includes("incomplete") || t.includes("kde")) {
      const list = insights.missingFields.map((f) => `${f.name} (${f.id})`).join(", ");
      return {
        text: insights.missingFields.length
          ? `I found farmers without mapped fields: ${list}. Mapping fields strengthens compliance evidence. Want to open Farmers to map them?`
          : "All farmers have at least one mapped field. Next: validate crop + variety consistency at collection.",
        actions: insights.missingFields.length ? [{ label: "Go to Farmers", route: "farmers" }] : [],
      };
    }

    if (t.includes("today") || t.includes("collection") || t.includes("lots")) {
      return {
        text: `Today you collected ${fmt.format(insights.totalKgToday)} kg. Pending sync: ${insights.pendingLots} lot(s). Want to review Collection log?`,
        actions: [{ label: "Open Collection", route: "collection" }],
      };
    }

    if (t.includes("payment") || t.includes("price") || t.includes("books")) {
      return {
        text: `You have ${insights.pendingPays} pending payment record(s). You can set price/kg and confirm amounts in Books.`,
        actions: [{ label: "Open Books", route: "books" }],
      };
    }

    return {
      text: "I can help you with: onboarding checklist, KDE completeness, quality grading, and payment reconciliation. Try: 'Show missing KDE' or 'Summary of today collection'.",
      actions: [],
    };
  }

  function send() {
    const userText = prompt;
    setPrompt("");
    const r = reply(userText);
    setMessages((prev) => [...prev, { role: "user", text: userText }, { role: "assistant", text: r.text, actions: r.actions }]);
  }

  return (
    <>
      <div className="rounded-3xl bg-emerald-800 text-white p-5 shadow-sm mt-2">
        <div className="text-xs text-emerald-100">JANI AI Assistant</div>
        <div className="text-xl font-semibold mt-1">Smart help for traceability teams</div>
        <div className="text-sm text-emerald-100 mt-2">
          Identify missing KDE, reduce errors at collection, and keep books audit-ready.
        </div>
      </div>

      <SectionTitle icon={Sparkles} title="Chat" right={<Badge variant="outline" className="rounded-xl">Prototype</Badge>} />

      <Card className="rounded-3xl shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="max-h-[340px] overflow-auto p-4 space-y-3">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-3xl px-4 py-3 text-sm border ${
                    m.role === "user"
                      ? "bg-emerald-700 text-white border-emerald-700"
                      : "bg-white border-slate-200 text-slate-800"
                  }`}
                >
                  <div>{m.text}</div>
                  {m.actions?.length ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {m.actions.map((a, i) => (
                        <button
                          key={i}
                          onClick={() => onSuggestion(a.route)}
                          className="px-3 py-1.5 rounded-2xl text-xs border border-emerald-200 bg-emerald-50 text-emerald-800"
                        >
                          {a.label}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-200 p-3">
            <div className="flex gap-2">
              <Input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask: Show missing KDE…"
                className="rounded-2xl"
                onKeyDown={(e) => {
                  if (e.key === "Enter") send();
                }}
              />
              <Button className="rounded-2xl bg-emerald-700 hover:bg-emerald-800" onClick={send}>
                Send
              </Button>
            </div>

            <div className="mt-2 flex flex-wrap gap-2">
              {["Show missing KDE", "Summary of today collection", "Pending payments"].map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setPrompt(s);
                  }}
                  className="px-3 py-1.5 rounded-2xl text-xs border border-slate-200 bg-slate-50 text-slate-700"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <SectionTitle icon={ClipboardList} title="Assistant highlights" />
      <div className="grid grid-cols-2 gap-3">
        <Stat icon={Users} label="Pending farmers" value={insights.pendingFarmers} hint="Need sync" />
        <Stat icon={Package} label="Pending lots" value={insights.pendingLots} hint="Need sync" />
      </div>
    </>
  );
}

function CollectionScreen({ farmers, collections, setCollections, onQueue }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return collections;
    return collections.filter((c) => `${c.id} ${c.crop} ${c.variety} ${c.farmerId}`.toLowerCase().includes(s));
  }, [collections, q]);

  function farmerName(fid) {
    return farmers.find((f) => f.id === fid)?.name || fid;
  }

  function addCollection(payload) {
    const lot = { id: uid("LOT"), status: "pending", date: payload.date || todayISO(), ...payload };
    setCollections((prev) => [lot, ...prev]);
    onQueue();
  }

  return (
    <>
      <div className="flex items-center gap-2 mt-2">
        <div className="relative flex-1">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search lot, crop, farmer…" className="pl-9 rounded-2xl" />
        </div>
        <AddCollectionDialog farmers={farmers} onCreate={addCollection} />
      </div>

      <SectionTitle
        icon={Package}
        title="Produce collection log"
        right={<Badge variant="outline" className="rounded-xl">{filtered.length} lots</Badge>}
      />

      {filtered.length === 0 ? (
        <Empty
          icon={Package}
          title="No collections yet"
          desc="Log produce collection with quantity, quality and variety."
          action={<AddCollectionDialog farmers={farmers} onCreate={addCollection} />}
        />
      ) : (
        <Card className="rounded-3xl shadow-sm overflow-hidden">
          {filtered.map((c) => (
            <Row
              key={c.id}
              title={`${c.id} • Grade ${c.qualityGrade}`}
              subtitle={`${c.date} • ${farmerName(c.farmerId)} • ${c.crop} ${c.variety} • ${fmt.format(c.weightKg)} kg`}
              right={<span className={`text-xs px-2 py-1 rounded-xl border ${pillClass(c.status)}`}>{c.status}</span>}
            />
          ))}
        </Card>
      )}

      <SectionTitle icon={Scale} title="Captured at collection" />
      <Card className="rounded-3xl shadow-sm">
        <CardContent className="p-4 text-sm space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-slate-600">Quantity + weight</div>
            <Badge variant="outline" className="rounded-xl">kg / crates / bags</Badge>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-slate-600">Quality grade</div>
            <Badge variant="outline" className="rounded-xl">A / B / C</Badge>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-slate-600">Crop + variety</div>
            <Badge variant="outline" className="rounded-xl">Linked to farmer</Badge>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function AddCollectionDialog({ farmers, onCreate }) {
  const [open, setOpen] = useState(false);
  const [farmerId, setFarmerId] = useState(farmers[0]?.id || "");
  const [date, setDate] = useState(todayISO());
  const [crop, setCrop] = useState("Olive");
  const [variety, setVariety] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("crates");
  const [weightKg, setWeightKg] = useState("");
  const [qualityGrade, setQualityGrade] = useState("A");
  const [notes, setNotes] = useState("");

  function scanQR() {
    // prototype: pretend QR scan selects first farmer
    setFarmerId(farmers[0]?.id || "");
  }

  function submit() {
    if (!farmerId) return;
    onCreate({
      farmerId,
      date,
      crop,
      variety: variety.trim() || "Unknown",
      quantity: Number(quantity) || 0,
      unit,
      weightKg: Number(weightKg) || 0,
      qualityGrade,
      notes: notes.trim(),
    });
    setDate(todayISO());
    setCrop("Olive");
    setVariety("");
    setQuantity("");
    setUnit("crates");
    setWeightKg("");
    setQualityGrade("A");
    setNotes("");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-2xl bg-emerald-700 hover:bg-emerald-800">
          <Plus className="h-4 w-4 mr-2" /> New
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-3xl">
        <DialogHeader>
          <DialogTitle>Log produce collection</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div className="rounded-3xl border border-slate-200 p-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">Farmer ID (QR)</div>
              <Button size="sm" variant="secondary" className="rounded-2xl" onClick={scanQR}>
                <QrCode className="h-4 w-4 mr-2" /> Scan
              </Button>
            </div>
            <div className="mt-3 space-y-1">
              <Label>Farmer</Label>
              <select
                value={farmerId}
                onChange={(e) => setFarmerId(e.target.value)}
                className="h-10 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm"
              >
                {farmers.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.id})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Date</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="rounded-2xl" />
            </div>
            <div className="space-y-1">
              <Label>Quality grade</Label>
              <select
                value={qualityGrade}
                onChange={(e) => setQualityGrade(e.target.value)}
                className="h-10 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm"
              >
                <option>A</option>
                <option>B</option>
                <option>C</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Crop</Label>
              <select
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                className="h-10 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm"
              >
                <option>Olive</option>
                <option>Citrus</option>
                <option>Tea</option>
                <option>Coffee</option>
                <option>Vegetables</option>
                <option>Cereals</option>
              </select>
            </div>
            <div className="space-y-1">
              <Label>Variety</Label>
              <Input value={variety} onChange={(e) => setVariety(e.target.value)} placeholder="e.g., Picholine" className="rounded-2xl" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Quantity</Label>
              <Input value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="e.g., 20" className="rounded-2xl" />
            </div>
            <div className="space-y-1">
              <Label>Unit</Label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="h-10 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm"
              >
                <option>crates</option>
                <option>bags</option>
                <option>kg</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <Label>Total weight (kg)</Label>
            <Input value={weightKg} onChange={(e) => setWeightKg(e.target.value)} placeholder="e.g., 540" className="rounded-2xl" />
          </div>

          <div className="space-y-1">
            <Label>Notes</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional" className="rounded-2xl" />
          </div>

          <div className="rounded-3xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800">
            Saving will generate a Lot ID and audit trail entry.
          </div>
        </div>

        <DialogFooter>
          <Button variant="secondary" className="rounded-2xl" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button className="rounded-2xl bg-emerald-700 hover:bg-emerald-800" onClick={submit}>
            Save lot
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function BooksScreen({ farmers, collections, ledger, setLedger, onQueue }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return ledger;
    return ledger.filter((l) => `${l.id} ${l.farmerId} ${l.lotId}`.toLowerCase().includes(s));
  }, [ledger, q]);

  function farmerName(fid) {
    return farmers.find((f) => f.id === fid)?.name || fid;
  }

  function addPayment(payload) {
    const row = {
      id: uid("PAY"),
      status: "pending",
      date: payload.date || todayISO(),
      ...payload,
    };
    setLedger((prev) => [row, ...prev]);
    onQueue();
  }

  const totals = useMemo(() => {
    const totalPaid = ledger.reduce((a, l) => a + (Number(l.paidAmount) || 0), 0);
    const totalKg = collections.reduce((a, c) => a + (Number(c.weightKg) || 0), 0);
    return { totalPaid, totalKg };
  }, [ledger, collections]);

  return (
    <>
      <div className="flex items-center gap-2 mt-2">
        <div className="relative flex-1">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search payments, lot, farmer…" className="pl-9 rounded-2xl" />
        </div>
        <AddPaymentDialog farmers={farmers} collections={collections} onCreate={addPayment} />
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <Stat icon={Scale} label="Total kg" value={fmt.format(totals.totalKg)} hint="All lots" />
        <Stat icon={Banknote} label="Total paid" value={fmt.format(totals.totalPaid)} hint="All payments" />
      </div>

      <SectionTitle
        icon={Receipt}
        title="Payments ledger"
        right={<Badge variant="outline" className="rounded-xl">{filtered.length}</Badge>}
      />

      {filtered.length === 0 ? (
        <Empty
          icon={Receipt}
          title="No payments yet"
          desc="Track price/kg, quantity and payments per lot."
          action={<AddPaymentDialog farmers={farmers} collections={collections} onCreate={addPayment} />}
        />
      ) : (
        <Card className="rounded-3xl shadow-sm overflow-hidden">
          {filtered.map((l) => (
            <Row
              key={l.id}
              title={`${l.id} • ${fmt.format(l.paidAmount)} ${l.currency}`}
              subtitle={`${l.date} • ${farmerName(l.farmerId)} • Lot ${l.lotId} • ${fmt.format(l.pricePerKg)} /kg`}
              right={<span className={`text-xs px-2 py-1 rounded-xl border ${pillClass(l.status)}`}>{l.status}</span>}
            />
          ))}
        </Card>
      )}

      <SectionTitle icon={BadgeDollarSign} title="Pricing model" />
      <Card className="rounded-3xl shadow-sm">
        <CardContent className="p-4 text-sm space-y-2">
          <div className="text-slate-600">Example formula</div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
            Amount = (Lot weight in kg × price per kg) − deductions (optional)
          </div>
          <div className="text-xs text-slate-500">Next iteration: quality-based pricing rules and invoices export.</div>
        </CardContent>
      </Card>
    </>
  );
}

function AddPaymentDialog({ farmers, collections, onCreate }) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(todayISO());
  const [farmerId, setFarmerId] = useState(farmers[0]?.id || "");
  const [lotId, setLotId] = useState(collections[0]?.id || "");
  const [pricePerKg, setPricePerKg] = useState("2.3");
  const [paidAmount, setPaidAmount] = useState("");
  const [currency, setCurrency] = useState("MAD");

  const lotWeight = useMemo(() => collections.find((c) => c.id === lotId)?.weightKg || 0, [collections, lotId]);

  function autoCalc() {
    const amt = (Number(lotWeight) || 0) * (Number(pricePerKg) || 0);
    setPaidAmount(String(Math.round(amt * 100) / 100));
  }

  function submit() {
    if (!farmerId || !lotId) return;
    onCreate({
      date,
      farmerId,
      lotId,
      pricePerKg: Number(pricePerKg) || 0,
      paidAmount: Number(paidAmount) || 0,
      currency,
    });
    setDate(todayISO());
    setPaidAmount("");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-2xl bg-emerald-700 hover:bg-emerald-800">
          <Plus className="h-4 w-4 mr-2" /> New
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-3xl">
        <DialogHeader>
          <DialogTitle>Add payment</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1">
            <Label>Date</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="rounded-2xl" />
          </div>

          <div className="space-y-1">
            <Label>Farmer</Label>
            <select
              value={farmerId}
              onChange={(e) => setFarmerId(e.target.value)}
              className="h-10 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm"
            >
              {farmers.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.id})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <Label>Lot</Label>
            <select
              value={lotId}
              onChange={(e) => setLotId(e.target.value)}
              className="h-10 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm"
            >
              {collections.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.id} • {fmt.format(c.weightKg)} kg • Grade {c.qualityGrade}
                </option>
              ))}
            </select>
            <div className="text-xs text-slate-500">Selected lot weight: {fmt.format(lotWeight)} kg</div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Price / kg</Label>
              <Input value={pricePerKg} onChange={(e) => setPricePerKg(e.target.value)} className="rounded-2xl" />
            </div>
            <div className="space-y-1">
              <Label>Currency</Label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="h-10 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm"
              >
                <option>MAD</option>
                <option>USD</option>
                <option>EUR</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <Label>Paid amount</Label>
            <Input value={paidAmount} onChange={(e) => setPaidAmount(e.target.value)} placeholder="Auto-calc or enter" className="rounded-2xl" />
            <Button variant="secondary" className="rounded-2xl mt-2" onClick={autoCalc}>
              <BadgeDollarSign className="h-4 w-4 mr-2" /> Auto-calc (weight × price)
            </Button>
          </div>

          <div className="rounded-3xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800">
            Tip: next iteration can add deductions, quality-based pricing, and invoice export.
          </div>
        </div>

        <DialogFooter>
          <Button variant="secondary" className="rounded-2xl" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button className="rounded-2xl bg-emerald-700 hover:bg-emerald-800" onClick={submit}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
