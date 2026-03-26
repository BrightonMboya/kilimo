import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Home,
  Users,
  MapPin,
  Layers,
  Package,
  Receipt,
  User,
  Search,
  Plus,
  Wifi,
  WifiOff,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Leaf,
  Scale,
  Calendar,
  ClipboardList,
  Settings,
} from "lucide-react";

// Minimal, offline-first style prototype for an Aggregator / Co-op traceability app.
// Sections: Home, Farmers, Batch, Books, Profile.

const fmt = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 });

function pillTone(status) {
  if (status === "synced") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (status === "pending") return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-slate-50 text-slate-700 border-slate-200";
}

function nowISODate() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function uid(prefix) {
  return `${prefix}-${Math.random().toString(16).slice(2, 6)}${Math.random().toString(16).slice(2, 6)}`.toUpperCase();
}

function Screen({ children }) {
  return (
    <div className="min-h-screen w-full flex justify-center bg-slate-50">
      <div className="w-full max-w-md min-h-screen bg-white border-x border-slate-200">
        {children}
      </div>
    </div>
  );
}

function TopBar({ title, online, queued }) {
  return (
    <div className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-2xl bg-slate-900 text-white grid place-items-center shadow-sm">
            <Leaf className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm text-slate-500">JANI AI</div>
            <div className="text-base font-semibold leading-none">{title}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs text-slate-600">
            {online ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
            <span>{online ? "Online" : "Offline"}</span>
          </div>
          <Badge variant="outline" className="rounded-xl">
            {queued} queued
          </Badge>
        </div>
      </div>
    </div>
  );
}

function BottomNav({ active, onChange }) {
  const items = [
    { key: "home", label: "Home", icon: Home },
    { key: "farmers", label: "Farmers", icon: Users },
    { key: "batch", label: "Batch", icon: Package },
    { key: "books", label: "Books", icon: Receipt },
    { key: "profile", label: "Profile", icon: User },
  ];

  return (
    <div className="sticky bottom-0 z-20 bg-white border-t border-slate-200">
      <div className="grid grid-cols-5">
        {items.map((it) => {
          const Icon = it.icon;
          const isActive = it.key === active;
          return (
            <button
              key={it.key}
              onClick={() => onChange(it.key)}
              className={`py-3 flex flex-col items-center gap-1 text-xs ${
                isActive ? "text-slate-900" : "text-slate-500"
              }`}
            >
              <div
                className={`h-9 w-9 rounded-2xl grid place-items-center ${
                  isActive ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"
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
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs text-slate-500">{label}</div>
            <div className="text-2xl font-semibold mt-1">{value}</div>
            {hint ? <div className="text-xs text-slate-500 mt-1">{hint}</div> : null}
          </div>
          <div className="h-10 w-10 rounded-2xl bg-slate-100 grid place-items-center">
            <Icon className="h-5 w-5 text-slate-700" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SectionTitle({ icon: Icon, title, right }) {
  return (
    <div className="flex items-center justify-between px-4 mt-5 mb-2">
      <div className="flex items-center gap-2">
        <div className="h-9 w-9 rounded-2xl bg-slate-100 grid place-items-center">
          <Icon className="h-5 w-5 text-slate-700" />
        </div>
        <h2 className="font-semibold">{title}</h2>
      </div>
      {right}
    </div>
  );
}

function Row({ title, subtitle, right, tone = "" }) {
  return (
    <div className={`px-4 py-3 flex items-center justify-between border-b border-slate-100 ${tone}`}>
      <div>
        <div className="text-sm font-medium">{title}</div>
        {subtitle ? <div className="text-xs text-slate-500 mt-1">{subtitle}</div> : null}
      </div>
      {right}
    </div>
  );
}

function Empty({ icon: Icon, title, desc, action }) {
  return (
    <div className="px-6 py-10 text-center">
      <div className="mx-auto h-12 w-12 rounded-2xl bg-slate-100 grid place-items-center">
        <Icon className="h-6 w-6 text-slate-700" />
      </div>
      <div className="mt-3 font-semibold">{title}</div>
      <div className="text-sm text-slate-500 mt-1">{desc}</div>
      <div className="mt-4">{action}</div>
    </div>
  );
}

export default function JaniCoopTraceabilityPrototype() {
  const [active, setActive] = useState("home");
  const [online, setOnline] = useState(true);
  const [queued, setQueued] = useState(2);

  // In-memory sample data
  const [farmers, setFarmers] = useState(() => [
    {
      id: "FR-001",
      name: "Amina El Idrissi",
      phone: "+212 6 00 00 00 00",
      village: "Souss",
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
      status: "synced",
    },
    {
      id: "FR-002",
      name: "Youssef Berrada",
      phone: "+212 6 11 11 11 11",
      village: "Haouz",
      fields: [],
      status: "pending",
    },
  ]);

  const [batches, setBatches] = useState(() => [
    {
      id: "LOT-9A3F",
      date: nowISODate(),
      farmerId: "FR-001",
      fieldId: "FD-101",
      crop: "Olive",
      variety: "Picholine",
      quantity: 18,
      unit: "crates",
      weightKg: 540,
      kde: {
        inputsDeclared: "Organic compost",
        harvestMethod: "Hand-picked",
        notes: "Collected at gate 2",
      },
      status: "pending",
    },
  ]);

  const [invoices, setInvoices] = useState(() => [
    {
      id: "INV-0007",
      date: nowISODate(),
      farmerId: "FR-001",
      lotId: "LOT-9A3F",
      amount: 1250,
      currency: "MAD",
      status: "pending",
    },
  ]);

  const totals = useMemo(() => {
    const totalFarmers = farmers.length;
    const mappedFields = farmers.reduce((acc, f) => acc + (f.fields?.length || 0), 0);
    const pendingSync =
      farmers.filter((f) => f.status === "pending").length +
      batches.filter((b) => b.status === "pending").length +
      invoices.filter((i) => i.status === "pending").length;
    const todayBatches = batches.filter((b) => b.date === nowISODate()).length;
    return { totalFarmers, mappedFields, pendingSync, todayBatches };
  }, [farmers, batches, invoices]);

  function bumpQueue() {
    setQueued((q) => q + 1);
  }

  function maybeSync() {
    if (!online) return;
    // Quick fake sync: mark some items as synced and reduce queued.
    setFarmers((prev) => prev.map((f) => ({ ...f, status: "synced" })));
    setBatches((prev) => prev.map((b) => ({ ...b, status: "synced" })));
    setInvoices((prev) => prev.map((i) => ({ ...i, status: "synced" })));
    setQueued(0);
  }

  const titleByTab = {
    home: "Dashboard",
    farmers: "Farmers",
    batch: "Batch Collection",
    books: "Books",
    profile: "Profile",
  };

  return (
    <Screen>
      <TopBar title={titleByTab[active]} online={online} queued={queued} />

      <div className="px-4 pt-4 pb-24">
        {active === "home" ? (
          <HomeTab
            totals={totals}
            online={online}
            queued={queued}
            onToggleOnline={() => setOnline((v) => !v)}
            onSync={maybeSync}
            onGo={(k) => setActive(k)}
          />
        ) : null}

        {active === "farmers" ? (
          <FarmersTab
            farmers={farmers}
            setFarmers={setFarmers}
            onQueue={bumpQueue}
          />
        ) : null}

        {active === "batch" ? (
          <BatchTab
            farmers={farmers}
            batches={batches}
            setBatches={setBatches}
            onQueue={bumpQueue}
          />
        ) : null}

        {active === "books" ? (
          <BooksTab
            farmers={farmers}
            batches={batches}
            invoices={invoices}
            setInvoices={setInvoices}
            onQueue={bumpQueue}
          />
        ) : null}

        {active === "profile" ? (
          <ProfileTab online={online} queued={queued} onToggleOnline={() => setOnline((v) => !v)} />
        ) : null}
      </div>

      <BottomNav active={active} onChange={setActive} />
    </Screen>
  );
}

function HomeTab({ totals, online, queued, onToggleOnline, onSync, onGo }) {
  return (
    <>
      <div className="rounded-3xl bg-slate-900 text-white p-5 shadow-sm">
        <div className="text-xs text-slate-300">Trace • Transform • Trust</div>
        <div className="text-xl font-semibold mt-1">Co-op Traceability Console</div>
        <div className="text-sm text-slate-200 mt-2">
          Collect farmer data, map fields, create lots, generate invoices, and keep a clean audit trail.
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Button
            onClick={onToggleOnline}
            variant="secondary"
            className="rounded-2xl"
          >
            {online ? (
              <>
                <Wifi className="h-4 w-4 mr-2" /> Set Offline
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4 mr-2" /> Set Online
              </>
            )}
          </Button>
          <Button
            onClick={onSync}
            className="rounded-2xl bg-white text-slate-900 hover:bg-white/90"
          >
            <CheckCircle2 className="h-4 w-4 mr-2" /> Sync
          </Button>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-slate-200">
          <div className="flex items-center gap-2">
            {queued > 0 ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
            <span>{queued > 0 ? "Pending uploads" : "All synced"}</span>
          </div>
          <span>Audit trail enabled</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <Stat icon={Users} label="Farmers" value={totals.totalFarmers} hint="Registered" />
        <Stat icon={MapPin} label="Fields" value={totals.mappedFields} hint="Mapped" />
        <Stat icon={Package} label="Lots" value={totals.todayBatches} hint="Collected today" />
        <Stat icon={ClipboardList} label="To sync" value={totals.pendingSync} hint="Pending items" />
      </div>

      <SectionTitle
        icon={Plus}
        title="Quick actions"
        right={<Badge variant="outline" className="rounded-xl">Offline-first</Badge>}
      />

      <div className="grid grid-cols-2 gap-3">
        <Button onClick={() => onGo("farmers")} variant="secondary" className="rounded-2xl justify-start">
          <Users className="h-4 w-4 mr-2" /> Add farmer
        </Button>
        <Button onClick={() => onGo("farmers")} variant="secondary" className="rounded-2xl justify-start">
          <MapPin className="h-4 w-4 mr-2" /> Map field
        </Button>
        <Button onClick={() => onGo("batch")} variant="secondary" className="rounded-2xl justify-start">
          <Package className="h-4 w-4 mr-2" /> Record lot
        </Button>
        <Button onClick={() => onGo("books")} variant="secondary" className="rounded-2xl justify-start">
          <Receipt className="h-4 w-4 mr-2" /> Create invoice
        </Button>
      </div>

      <SectionTitle icon={ClipboardList} title="What you can do" />
      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-4 space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-2xl bg-slate-100 grid place-items-center">
              <Layers className="h-5 w-5 text-slate-700" />
            </div>
            <div>
              <div className="font-medium">Map farms and fields</div>
              <div className="text-slate-500 text-xs mt-1">GPS capture, polygons, field metadata, and farmer ID.</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-2xl bg-slate-100 grid place-items-center">
              <Package className="h-5 w-5 text-slate-700" />
            </div>
            <div>
              <div className="font-medium">Create traceable lots</div>
              <div className="text-slate-500 text-xs mt-1">Record KDE at collection: crop, variety, weight, inputs, and notes.</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-2xl bg-slate-100 grid place-items-center">
              <Receipt className="h-5 w-5 text-slate-700" />
            </div>
            <div>
              <div className="font-medium">Generate invoices</div>
              <div className="text-slate-500 text-xs mt-1">Pay farmers transparently and keep books ready for audits.</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function FarmersTab({ farmers, setFarmers, onQueue }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return farmers;
    return farmers.filter((f) => `${f.name} ${f.id} ${f.village}`.toLowerCase().includes(s));
  }, [farmers, q]);

  const [selectedFarmerId, setSelectedFarmerId] = useState(farmers[0]?.id || "");
  const selected = useMemo(() => farmers.find((f) => f.id === selectedFarmerId) || null, [farmers, selectedFarmerId]);

  function addFarmer(payload) {
    const newFarmer = {
      id: uid("FR"),
      ...payload,
      fields: [],
      status: "pending",
    };
    setFarmers((prev) => [newFarmer, ...prev]);
    setSelectedFarmerId(newFarmer.id);
    onQueue();
  }

  function addField(farmerId, payload) {
    setFarmers((prev) =>
      prev.map((f) => {
        if (f.id !== farmerId) return f;
        const field = {
          id: uid("FD"),
          ...payload,
          status: "pending",
        };
        return { ...f, fields: [field, ...(f.fields || [])], status: "pending" };
      })
    );
    onQueue();
  }

  return (
    <>
      <div className="flex items-center gap-2 mt-2">
        <div className="relative flex-1">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search farmer, ID, village…"
            className="pl-9 rounded-2xl"
          />
        </div>
        <AddFarmerDialog onCreate={addFarmer} />
      </div>

      <div className="mt-4">
        <Tabs value={selectedFarmerId} onValueChange={setSelectedFarmerId}>
          <TabsList className="w-full rounded-2xl bg-slate-100">
            {filtered.slice(0, 3).map((f) => (
              <TabsTrigger key={f.id} value={f.id} className="rounded-2xl">
                {f.name.split(" ")[0]}
              </TabsTrigger>
            ))}
            {filtered.length > 3 ? (
              <TabsTrigger value={"__more"} className="rounded-2xl" disabled>
                +{filtered.length - 3}
              </TabsTrigger>
            ) : null}
          </TabsList>
        </Tabs>
      </div>

      {filtered.length === 0 ? (
        <Empty
          icon={Users}
          title="No farmers found"
          desc="Try a different search or add a new farmer record."
          action={<AddFarmerDialog onCreate={addFarmer} />}
        />
      ) : null}

      <SectionTitle
        icon={Users}
        title="Farmer records"
        right={<Badge variant="outline" className="rounded-xl">{filtered.length} total</Badge>}
      />

      <Card className="rounded-2xl shadow-sm overflow-hidden">
        {filtered.map((f) => (
          <button
            key={f.id}
            onClick={() => setSelectedFarmerId(f.id)}
            className={`w-full text-left ${f.id === selectedFarmerId ? "bg-slate-50" : "bg-white"}`}
          >
            <Row
              title={f.name}
              subtitle={`${f.id} • ${f.village} • ${f.fields.length} field(s)`}
              right={
                <span className={`text-xs px-2 py-1 rounded-xl border ${pillTone(f.status)}`}>
                  {f.status}
                </span>
              }
            />
          </button>
        ))}
      </Card>

      {selected ? (
        <>
          <SectionTitle
            icon={MapPin}
            title="Farm mapping"
            right={<AddFieldDialog farmer={selected} onCreate={(p) => addField(selected.id, p)} />}
          />

          <Card className="rounded-2xl shadow-sm overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{selected.name}</CardTitle>
              <div className="text-xs text-slate-500">Phone: {selected.phone || "—"}</div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Map preview</div>
                  <Badge variant="outline" className="rounded-xl">GPS / Polygon</Badge>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Prototype placeholder: integrate maps later (Mapbox/Google) for polygon drawing and verification.
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded-2xl bg-white border border-slate-200 p-3">
                    <div className="text-xs text-slate-500">Last capture</div>
                    <div className="text-sm font-medium mt-1">{nowISODate()}</div>
                  </div>
                  <div className="rounded-2xl bg-white border border-slate-200 p-3">
                    <div className="text-xs text-slate-500">Verification</div>
                    <div className="text-sm font-medium mt-1">QR + ID match</div>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div className="text-sm font-semibold">Fields</div>
                {selected.fields.length === 0 ? (
                  <div className="text-sm text-slate-500 mt-2">No fields mapped yet.</div>
                ) : (
                  <div className="mt-2 space-y-2">
                    {selected.fields.map((fd) => (
                      <div key={fd.id} className="rounded-2xl border border-slate-200 p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-medium">{fd.name}</div>
                            <div className="text-xs text-slate-500 mt-1">
                              {fd.crop} • {fd.variety} • {fmt.format(fd.sizeHa)} ha
                            </div>
                            <div className="text-xs text-slate-500 mt-1">
                              GPS: {fd.gps?.lat?.toFixed?.(5) ?? "—"}, {fd.gps?.lng?.toFixed?.(5) ?? "—"}
                            </div>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-xl border ${pillTone(fd.status)}`}>{fd.status}</span>
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
  const [phone, setPhone] = useState("");
  const [village, setVillage] = useState("");

  function submit() {
    if (!name.trim()) return;
    onCreate({ name: name.trim(), phone: phone.trim(), village: village.trim() || "Unknown" });
    setName("");
    setPhone("");
    setVillage("");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-2xl">
          <Plus className="h-4 w-4 mr-2" /> Add
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-3xl">
        <DialogHeader>
          <DialogTitle>Add farmer</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label>Full name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Amina El Idrissi" className="rounded-2xl" />
          </div>
          <div className="space-y-1">
            <Label>Phone</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g., +212…" className="rounded-2xl" />
          </div>
          <div className="space-y-1">
            <Label>Village / Cooperative zone</Label>
            <Input value={village} onChange={(e) => setVillage(e.target.value)} placeholder="e.g., Souss" className="rounded-2xl" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" className="rounded-2xl" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button className="rounded-2xl" onClick={submit}>
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
  const [notes, setNotes] = useState("");

  function autoGPS() {
    // Fake GPS capture for prototype
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
      notes: notes.trim(),
    });
    setName("");
    setCrop("Olive");
    setVariety("");
    setSizeHa("");
    setLat("");
    setLng("");
    setNotes("");
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
          <DialogTitle>Map a field for {farmer.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label>Field name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Field A" className="rounded-2xl" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Crop</Label>
              <Select value={crop} onValueChange={setCrop}>
                <SelectTrigger className="rounded-2xl"><SelectValue placeholder="Select crop" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Olive">Olive</SelectItem>
                  <SelectItem value="Citrus">Citrus</SelectItem>
                  <SelectItem value="Berries">Berries</SelectItem>
                  <SelectItem value="Argan">Argan</SelectItem>
                  <SelectItem value="Tomato">Tomato</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Variety</Label>
              <Input value={variety} onChange={(e) => setVariety(e.target.value)} placeholder="e.g., Picholine" className="rounded-2xl" />
            </div>
          </div>
          <div className="space-y-1">
            <Label>Size (hectares)</Label>
            <Input value={sizeHa} onChange={(e) => setSizeHa(e.target.value)} placeholder="e.g., 1.5" className="rounded-2xl" />
          </div>

          <div className="rounded-2xl border border-slate-200 p-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">GPS capture</div>
              <Button size="sm" variant="secondary" className="rounded-2xl" onClick={autoGPS}>
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
            <div className="text-xs text-slate-500 mt-2">Next: polygon mapping (draw boundary) and verification.</div>
          </div>

          <div className="space-y-1">
            <Label>Notes</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional" className="rounded-2xl" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" className="rounded-2xl" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button className="rounded-2xl" onClick={submit}>
            Save field
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function BatchTab({ farmers, batches, setBatches, onQueue }) {
  const [q, setQ] = useState("");

  const farmerOptions = useMemo(() => farmers.map((f) => ({ id: f.id, name: f.name })), [farmers]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return batches;
    return batches.filter((b) => `${b.id} ${b.crop} ${b.variety} ${b.farmerId}`.toLowerCase().includes(s));
  }, [batches, q]);

  function addBatch(payload) {
    const lotId = uid("LOT");
    const newBatch = {
      id: lotId,
      status: "pending",
      date: payload.date || nowISODate(),
      ...payload,
    };
    setBatches((prev) => [newBatch, ...prev]);
    onQueue();
  }

  function farmerName(fid) {
    return farmers.find((f) => f.id === fid)?.name || fid;
  }

  return (
    <>
      <div className="flex items-center gap-2 mt-2">
        <div className="relative flex-1">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search lot, crop, farmer…"
            className="pl-9 rounded-2xl"
          />
        </div>
        <AddBatchDialog farmers={farmers} onCreate={addBatch} />
      </div>

      <SectionTitle
        icon={Package}
        title="Lots (batch collection)"
        right={<Badge variant="outline" className="rounded-xl">{filtered.length} lots</Badge>}
      />

      {filtered.length === 0 ? (
        <Empty
          icon={Package}
          title="No lots yet"
          desc="Record produce collection and capture KDE for traceability."
          action={<AddBatchDialog farmers={farmers} onCreate={addBatch} />}
        />
      ) : (
        <Card className="rounded-2xl shadow-sm overflow-hidden">
          {filtered.map((b) => (
            <Row
              key={b.id}
              title={b.id}
              subtitle={`${b.date} • ${farmerName(b.farmerId)} • ${b.crop} ${b.variety}`}
              right={
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-xl border ${pillTone(b.status)}`}>{b.status}</span>
                </div>
              }
            />
          ))}
        </Card>
      )}

      <SectionTitle icon={Scale} title="KDE captured at collection" />
      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-4 space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-2xl bg-slate-100 grid place-items-center">
              <Calendar className="h-5 w-5 text-slate-700" />
            </div>
            <div>
              <div className="font-medium">Date + location</div>
              <div className="text-xs text-slate-500 mt-1">Collection date, site (gate/warehouse), and operator.</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-2xl bg-slate-100 grid place-items-center">
              <Leaf className="h-5 w-5 text-slate-700" />
            </div>
            <div>
              <div className="font-medium">Crop + variety</div>
              <div className="text-xs text-slate-500 mt-1">Linked to mapped field for compliance evidence.</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-2xl bg-slate-100 grid place-items-center">
              <Scale className="h-5 w-5 text-slate-700" />
            </div>
            <div>
              <div className="font-medium">Quantity + weight</div>
              <div className="text-xs text-slate-500 mt-1">Crates/bags and verified kilograms.</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-2xl bg-slate-100 grid place-items-center">
              <QrCode className="h-5 w-5 text-slate-700" />
            </div>
            <div>
              <div className="font-medium">Farmer ID + QR</div>
              <div className="text-xs text-slate-500 mt-1">Scan to prevent mix-ups and strengthen audit trail.</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function AddBatchDialog({ farmers, onCreate }) {
  const [open, setOpen] = useState(false);

  const [farmerId, setFarmerId] = useState(farmers[0]?.id || "");
  const [fieldId, setFieldId] = useState("");
  const [date, setDate] = useState(nowISODate());

  const farmer = useMemo(() => farmers.find((f) => f.id === farmerId) || null, [farmers, farmerId]);
  const fields = farmer?.fields || [];

  const [crop, setCrop] = useState("Olive");
  const [variety, setVariety] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("crates");
  const [weightKg, setWeightKg] = useState("");
  const [inputsDeclared, setInputsDeclared] = useState("");
  const [notes, setNotes] = useState("");

  function scanQR() {
    // Prototype: just confirms farmer selection and pre-fills field if single
    if (fields.length === 1) setFieldId(fields[0].id);
  }

  function submit() {
    if (!farmerId) return;
    onCreate({
      date,
      farmerId,
      fieldId: fieldId || (fields[0]?.id ?? ""),
      crop,
      variety: variety.trim() || "Unknown",
      quantity: Number(quantity) || 0,
      unit,
      weightKg: Number(weightKg) || 0,
      kde: {
        inputsDeclared: inputsDeclared.trim(),
        harvestMethod: "",
        notes: notes.trim(),
      },
    });

    setDate(nowISODate());
    setCrop("Olive");
    setVariety("");
    setQuantity("");
    setUnit("crates");
    setWeightKg("");
    setInputsDeclared("");
    setNotes("");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-2xl">
          <Plus className="h-4 w-4 mr-2" /> New
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-3xl">
        <DialogHeader>
          <DialogTitle>Record produce collection</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div className="rounded-2xl border border-slate-200 p-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Farmer ID (QR)</div>
              <Button size="sm" variant="secondary" className="rounded-2xl" onClick={scanQR}>
                <QrCode className="h-4 w-4 mr-2" /> Scan
              </Button>
            </div>
            <div className="mt-3 space-y-1">
              <Label>Farmer</Label>
              <Select value={farmerId} onValueChange={setFarmerId}>
                <SelectTrigger className="rounded-2xl"><SelectValue placeholder="Select farmer" /></SelectTrigger>
                <SelectContent>
                  {farmers.map((f) => (
                    <SelectItem key={f.id} value={f.id}>{f.name} ({f.id})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="mt-3 space-y-1">
              <Label>Field</Label>
              <Select value={fieldId} onValueChange={setFieldId}>
                <SelectTrigger className="rounded-2xl"><SelectValue placeholder={fields.length ? "Select field" : "No fields mapped"} /></SelectTrigger>
                <SelectContent>
                  {fields.length ? (
                    fields.map((fd) => (
                      <SelectItem key={fd.id} value={fd.id}>{fd.name} ({fd.crop})</SelectItem>
                    ))
                  ) : (
                    <SelectItem value="__none" disabled>No fields mapped</SelectItem>
                  )}
                </SelectContent>
              </Select>
              <div className="text-xs text-slate-500">Linking to a mapped field improves compliance evidence.</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Collection date</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="rounded-2xl" />
            </div>
            <div className="space-y-1">
              <Label>Unit</Label>
              <Select value={unit} onValueChange={setUnit}>
                <SelectTrigger className="rounded-2xl"><SelectValue placeholder="Select unit" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="crates">crates</SelectItem>
                  <SelectItem value="bags">bags</SelectItem>
                  <SelectItem value="kg">kg</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Crop</Label>
              <Select value={crop} onValueChange={setCrop}>
                <SelectTrigger className="rounded-2xl"><SelectValue placeholder="Select crop" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Olive">Olive</SelectItem>
                  <SelectItem value="Citrus">Citrus</SelectItem>
                  <SelectItem value="Berries">Berries</SelectItem>
                  <SelectItem value="Argan">Argan</SelectItem>
                  <SelectItem value="Tomato">Tomato</SelectItem>
                </SelectContent>
              </Select>
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
              <Label>Total weight (kg)</Label>
              <Input value={weightKg} onChange={(e) => setWeightKg(e.target.value)} placeholder="e.g., 540" className="rounded-2xl" />
            </div>
          </div>

          <div className="space-y-1">
            <Label>KDE: inputs / treatments declared</Label>
            <Input value={inputsDeclared} onChange={(e) => setInputsDeclared(e.target.value)} placeholder="e.g., organic compost, approved pesticide…" className="rounded-2xl" />
          </div>

          <div className="space-y-1">
            <Label>Notes</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional (quality, gate, operator, exceptions…)" className="rounded-2xl" />
          </div>

          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>System will generate a Lot ID + audit trail entry on save.</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="secondary" className="rounded-2xl" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button className="rounded-2xl" onClick={submit}>
            Save lot
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function BooksTab({ farmers, batches, invoices, setInvoices, onQueue }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return invoices;
    return invoices.filter((i) => `${i.id} ${i.lotId} ${i.farmerId}`.toLowerCase().includes(s));
  }, [invoices, q]);

  function farmerName(fid) {
    return farmers.find((f) => f.id === fid)?.name || fid;
  }

  function addInvoice(payload) {
    const newInv = {
      id: uid("INV"),
      status: "pending",
      date: payload.date || nowISODate(),
      ...payload,
    };
    setInvoices((prev) => [newInv, ...prev]);
    onQueue();
  }

  return (
    <>
      <div className="flex items-center gap-2 mt-2">
        <div className="relative flex-1">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search invoice, lot, farmer…"
            className="pl-9 rounded-2xl"
          />
        </div>
        <AddInvoiceDialog farmers={farmers} batches={batches} onCreate={addInvoice} />
      </div>

      <SectionTitle
        icon={Receipt}
        title="Invoices"
        right={<Badge variant="outline" className="rounded-xl">{filtered.length} total</Badge>}
      />

      {filtered.length === 0 ? (
        <Empty
          icon={Receipt}
          title="No invoices yet"
          desc="Create invoices from collected lots to pay farmers transparently."
          action={<AddInvoiceDialog farmers={farmers} batches={batches} onCreate={addInvoice} />}
        />
      ) : (
        <Card className="rounded-2xl shadow-sm overflow-hidden">
          {filtered.map((i) => (
            <Row
              key={i.id}
              title={`${i.id} • ${fmt.format(i.amount)} ${i.currency}`}
              subtitle={`${i.date} • ${farmerName(i.farmerId)} • Lot: ${i.lotId || "—"}`}
              right={<span className={`text-xs px-2 py-1 rounded-xl border ${pillTone(i.status)}`}>{i.status}</span>}
            />
          ))}
        </Card>
      )}

      <SectionTitle icon={ClipboardList} title="What goes into an invoice" />
      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-4 text-sm space-y-3">
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-2xl bg-slate-100 grid place-items-center">
              <Package className="h-5 w-5 text-slate-700" />
            </div>
            <div>
              <div className="font-medium">Linked to lot</div>
              <div className="text-xs text-slate-500 mt-1">Invoice references Lot ID for traceability and reconciliation.</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-2xl bg-slate-100 grid place-items-center">
              <Receipt className="h-5 w-5 text-slate-700" />
            </div>
            <div>
              <div className="font-medium">Price + deductions</div>
              <div className="text-xs text-slate-500 mt-1">Quality grades, packaging fees, and cooperative services (optional).</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-2xl bg-slate-100 grid place-items-center">
              <CheckCircle2 className="h-5 w-5 text-slate-700" />
            </div>
            <div>
              <div className="font-medium">Audit-ready</div>
              <div className="text-xs text-slate-500 mt-1">Status, timestamps, and operator log for every transaction.</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function AddInvoiceDialog({ farmers, batches, onCreate }) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(nowISODate());
  const [farmerId, setFarmerId] = useState(farmers[0]?.id || "");
  const [lotId, setLotId] = useState(batches[0]?.id || "");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("MAD");
  const [notes, setNotes] = useState("");

  function submit() {
    if (!farmerId) return;
    onCreate({ date, farmerId, lotId, amount: Number(amount) || 0, currency, notes: notes.trim() });
    setDate(nowISODate());
    setAmount("");
    setNotes("");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-2xl">
          <Plus className="h-4 w-4 mr-2" /> New
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-3xl">
        <DialogHeader>
          <DialogTitle>Create invoice</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1">
            <Label>Date</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="rounded-2xl" />
          </div>

          <div className="space-y-1">
            <Label>Farmer</Label>
            <Select value={farmerId} onValueChange={setFarmerId}>
              <SelectTrigger className="rounded-2xl"><SelectValue placeholder="Select farmer" /></SelectTrigger>
              <SelectContent>
                {farmers.map((f) => (
                  <SelectItem key={f.id} value={f.id}>{f.name} ({f.id})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label>Linked lot</Label>
            <Select value={lotId} onValueChange={setLotId}>
              <SelectTrigger className="rounded-2xl"><SelectValue placeholder="Select lot" /></SelectTrigger>
              <SelectContent>
                {batches.length ? (
                  batches.map((b) => (
                    <SelectItem key={b.id} value={b.id}>{b.id} • {b.crop} {b.variety}</SelectItem>
                  ))
                ) : (
                  <SelectItem value="__none" disabled>No lots recorded</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Amount</Label>
              <Input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g., 1250" className="rounded-2xl" />
            </div>
            <div className="space-y-1">
              <Label>Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="rounded-2xl"><SelectValue placeholder="Currency" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="MAD">MAD</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1">
            <Label>Notes</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional" className="rounded-2xl" />
          </div>

          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3 text-xs text-slate-600">
            Tip: Add quality grades and pricing rules in the next iteration (e.g., price per kg).
          </div>
        </div>

        <DialogFooter>
          <Button variant="secondary" className="rounded-2xl" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button className="rounded-2xl" onClick={submit}>
            Save invoice
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ProfileTab({ online, queued, onToggleOnline }) {
  return (
    <>
      <div className="rounded-3xl bg-slate-900 text-white p-5 shadow-sm mt-2">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-300">Organization</div>
            <div className="text-xl font-semibold mt-1">Atlas Co-op</div>
            <div className="text-sm text-slate-200 mt-2">Aggregator settings, users, and sync preferences.</div>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-white/10 grid place-items-center">
            <Settings className="h-6 w-6" />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-slate-200">
          <div className="flex items-center gap-2">
            {online ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
            <span>{online ? "Online" : "Offline"}</span>
          </div>
          <span>{queued} queued</span>
        </div>
      </div>

      <SectionTitle icon={User} title="Account" />
      <Card className="rounded-2xl shadow-sm overflow-hidden">
        <Row title="Logged in as" subtitle="Co-op Operator" right={<Badge variant="outline" className="rounded-xl">Role</Badge>} />
        <Row title="Language" subtitle="English (add Arabic/French)" right={<Badge variant="outline" className="rounded-xl">Multi</Badge>} />
        <Row title="Data privacy" subtitle="Local storage + audit trail" right={<CheckCircle2 className="h-4 w-4 text-emerald-600" />} />
      </Card>

      <SectionTitle icon={Settings} title="Sync \u0026 offline" right={
        <Button onClick={onToggleOnline} variant="secondary" className="rounded-2xl">
          {online ? <><Wifi className="h-4 w-4 mr-2" /> Go offline</> : <><WifiOff className="h-4 w-4 mr-2" /> Go online</>}
        </Button>
      } />

      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-4 text-sm space-y-3">
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-2xl bg-slate-100 grid place-items-center">
              <CheckCircle2 className="h-5 w-5 text-slate-700" />
            </div>
            <div>
              <div className="font-medium">Offline-first capture</div>
              <div className="text-xs text-slate-500 mt-1">Keep collecting in the field even without network.</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-2xl bg-slate-100 grid place-items-center">
              <AlertTriangle className="h-5 w-5 text-slate-700" />
            </div>
            <div>
              <div className="font-medium">Conflict handling</div>
              <div className="text-xs text-slate-500 mt-1">Next iteration: merge rules + approvals for edits.</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-2xl bg-slate-100 grid place-items-center">
              <Receipt className="h-5 w-5 text-slate-700" />
            </div>
            <div>
              <div className="font-medium">Export reports</div>
              <div className="text-xs text-slate-500 mt-1">Next iteration: generate PDFs and shipment documents.</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-xs text-slate-500 mt-6 px-2">
        Prototype scope: Home • Farmers (add + map) • Batch (KDE capture) • Books (invoices) • Profile.
      </div>
    </>
  );
}
","access