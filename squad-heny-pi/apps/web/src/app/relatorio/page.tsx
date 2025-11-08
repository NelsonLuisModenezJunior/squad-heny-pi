"use client";
import React, { useState, useMemo, useEffect } from "react";
import { HeroHeader } from "../../components/header";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Zap,
  Leaf,
  TrendingUp,
  Filter,
  Download,
  Edit2,
  Calendar,
  MapPin,
  DollarSign,
  AlertCircle,
  Lightbulb,
  Plus,
  X,
  Trash2,
  Home,
  Building2,
  Briefcase,
  ArrowLeft,
} from "lucide-react";

interface Appliance {
  id: string;
  name: string;
  room: string;
  power: number;
  hoursPerDay: number;
  material: string;
  carbonFootprint: number;
  efficiency: string;
}

interface LocationData {
  id: string;
  name: string;
  icon: "home" | "apartment" | "business";
  cep: string;
  city: string;
  state: string;
  address: string;
  number: string;
  tariff: number;
  appliances: Appliance[];
}

interface Location {
  state: string;
  city: string;
  tariff: number;
}

const RelatorioEnergia = () => {
  const [currentView, setCurrentView] = useState<"locations" | "report">(
    "locations"
  );
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
    null
  );
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      const storage = (window as any).storage;
      if (storage && typeof storage.get === "function") {
        const result = await storage.get("energy-locations");
        if (result) {
          const savedLocations = JSON.parse(result.value);
          setLocations(savedLocations);
        }
      } else {
        // fallback to localStorage when `window.storage` is not available
        const raw = localStorage.getItem("energy-locations");
        if (raw) setLocations(JSON.parse(raw));
      }
    } catch (error) {
      console.log("No locations found, starting fresh");
    }
  };

  const saveLocations = async (newLocations: LocationData[]) => {
    try {
      const storage = (window as any).storage;
      const payload = JSON.stringify(newLocations);
      if (storage && typeof storage.set === "function") {
        await storage.set("energy-locations", payload);
      } else {
        // fallback to localStorage
        localStorage.setItem("energy-locations", payload);
      }
      setLocations(newLocations);
    } catch (error) {
      console.error("Error saving locations:", error);
    }
  };

  const currentLocation = locations.find(
    (loc) => loc.id === selectedLocationId
  );

  const [reportName, setReportName] = useState(
    `Relatório de ${new Date().toLocaleDateString("pt-BR")}`
  );
  const [isEditingName, setIsEditingName] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<string>("all");
  const [selectedAppliances, setSelectedAppliances] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appliances, setAppliances] = useState<Appliance[]>(
    currentLocation?.appliances || []
  );

  const [newAppliance, setNewAppliance] = useState<Omit<Appliance, "id">>({
    name: "",
    room: "Cozinha",
    power: 0,
    hoursPerDay: 0,
    material: "",
    carbonFootprint: 0,
    efficiency: "A",
  });

  const [newLocation, setNewLocation] = useState<
    Omit<LocationData, "id" | "appliances">
  >({
    name: "",
    icon: "home",
    cep: "",
    city: "",
    state: "São Paulo",
    address: "",
    number: "",
    tariff: 0.92,
  });

  // view mode for appliances: 'cards' (default) or 'list' (table)
  const [applianceView, setApplianceView] = useState<"cards" | "list">("cards");

  // report sub-tab: 'report' (default) shows charts/lists, 'edit' shows edit-location form
  const [reportTab, setReportTab] = useState<"report" | "edit">("report");
  const [editLocation, setEditLocation] = useState<LocationData | null>(null);

  useEffect(() => {
    if (selectedLocationId) {
      const loc = locations.find((l) => l.id === selectedLocationId) || null;
      setEditLocation(loc ? { ...loc } : null);
      // keep appliances in sync when a new location is selected
      if (loc) setAppliances(loc.appliances || []);
      setReportTab("report");
    } else {
      setEditLocation(null);
    }
  }, [selectedLocationId, locations]);

  useEffect(() => {
    if (currentLocation) {
      setAppliances(currentLocation.appliances);
    }
  }, [selectedLocationId]);

  useEffect(() => {
    if (currentLocation && currentView === "report") {
      const updatedLocations = locations.map((loc) =>
        loc.id === selectedLocationId ? { ...loc, appliances } : loc
      );
      saveLocations(updatedLocations);
    }
  }, [appliances]);

  const createLocation = () => {
    if (!newLocation.name || !newLocation.city || !newLocation.address) {
      alert("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    const newLoc: LocationData = {
      id: Date.now().toString(),
      ...newLocation,
      appliances: [],
    };

    const updatedLocations = [...locations, newLoc];
    saveLocations(updatedLocations);
    setIsLocationModalOpen(false);
    setNewLocation({
      name: "",
      icon: "home",
      cep: "",
      city: "",
      state: "São Paulo",
      address: "",
      number: "",
      tariff: 0.92,
    });
  };

  const deleteLocation = (id: string) => {
    if (confirm("Deseja realmente excluir este local?")) {
      const updatedLocations = locations.filter((loc) => loc.id !== id);
      saveLocations(updatedLocations);
      if (selectedLocationId === id) {
        setSelectedLocationId(null);
        setCurrentView("locations");
      }
    }
  };

  const selectLocation = (id: string) => {
    setSelectedLocationId(id);
    setCurrentView("report");
  };

  const location: Location = currentLocation
    ? {
        state: currentLocation.state,
        city: currentLocation.city,
        tariff: currentLocation.tariff,
      }
    : {
        state: "São Paulo",
        city: "Campinas",
        tariff: 0.92,
      };

  const addAppliance = () => {
    if (
      !newAppliance.name ||
      newAppliance.power <= 0 ||
      newAppliance.hoursPerDay <= 0
    ) {
      alert("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    const newId = (
      Math.max(...appliances.map((a) => parseInt(a.id)), 0) + 1
    ).toString();
    setAppliances([...appliances, { ...newAppliance, id: newId }]);
    setIsModalOpen(false);
    setNewAppliance({
      name: "",
      room: "Cozinha",
      power: 0,
      hoursPerDay: 0,
      material: "",
      carbonFootprint: 0,
      efficiency: "A",
    });
  };

  const removeAppliance = (id: string) => {
    if (confirm("Deseja realmente remover este eletrodoméstico?")) {
      setAppliances(appliances.filter((a) => a.id !== id));
    }
  };

  const rooms = ["all", ...Array.from(new Set(appliances.map((a) => a.room)))];

  const filteredAppliances = useMemo(() => {
    let filtered = appliances;
    if (selectedRoom !== "all") {
      filtered = filtered.filter((a) => a.room === selectedRoom);
    }
    if (selectedAppliances.length > 0) {
      filtered = filtered.filter((a) => selectedAppliances.includes(a.id));
    }
    return filtered;
  }, [selectedRoom, selectedAppliances, appliances]);

  const stats = useMemo(() => {
    const monthlyConsumption = filteredAppliances.reduce(
      (sum, a) => sum + (a.power * a.hoursPerDay * 30) / 1000,
      0
    );
    const monthlyCost = monthlyConsumption * location.tariff;
    const totalCarbon = filteredAppliances.reduce(
      (sum, a) => sum + a.carbonFootprint,
      0
    );

    return {
      monthlyConsumption: monthlyConsumption.toFixed(2),
      monthlyCost: monthlyCost.toFixed(2),
      totalCarbon: totalCarbon.toFixed(2),
      avgEfficiency:
        filteredAppliances.length > 0
          ? (
              (filteredAppliances.filter((a) =>
                ["A", "A+", "A++"].includes(a.efficiency)
              ).length /
                filteredAppliances.length) *
              100
            ).toFixed(0)
          : "0",
    };
  }, [filteredAppliances, location.tariff]);

  const consumptionByRoom = useMemo(() => {
    const byRoom: { [key: string]: number } = {};
    filteredAppliances.forEach((a) => {
      if (!byRoom[a.room]) byRoom[a.room] = 0;
      byRoom[a.room] += (a.power * a.hoursPerDay * 30) / 1000;
    });
    return Object.entries(byRoom).map(([name, value]) => ({
      name,
      consumo: parseFloat(value.toFixed(2)),
    }));
  }, [filteredAppliances]);

  const monthlyTrend = [
    { mes: "Jun", consumo: 245, custo: 225 },
    { mes: "Jul", consumo: 268, custo: 247 },
    { mes: "Ago", consumo: 253, custo: 233 },
    { mes: "Set", consumo: 271, custo: 249 },
    {
      mes: "Out",
      consumo: parseFloat(stats.monthlyConsumption),
      custo: parseFloat(stats.monthlyCost),
    },
  ];

  const efficiencyData = [
    {
      name: "Eficientes (A/A+)",
      value: filteredAppliances.filter((a) =>
        ["A", "A+", "A++"].includes(a.efficiency)
      ).length,
      color: "#10b981",
    },
    {
      name: "Moderados (B)",
      value: filteredAppliances.filter((a) => a.efficiency === "B").length,
      color: "#f59e0b",
    },
    {
      name: "Ineficientes (C/D)",
      value: filteredAppliances.filter((a) =>
        ["C", "D", "E"].includes(a.efficiency)
      ).length,
      color: "#ef4444",
    },
  ];

  const suggestions = useMemo(() => {
    const highConsumers = filteredAppliances
      .map((a) => ({
        ...a,
        monthlyKwh: (a.power * a.hoursPerDay * 30) / 1000,
      }))
      .sort((a, b) => b.monthlyKwh - a.monthlyKwh)
      .slice(0, 3);

    return highConsumers.map((a) => ({
      appliance: a.name,
      currentConsumption: a.monthlyKwh.toFixed(2),
      suggestion:
        a.efficiency === "C" || a.efficiency === "D"
          ? `Substituir por modelo A+ pode economizar até ${(
              a.monthlyKwh * 0.4
            ).toFixed(2)} kWh/mês`
          : "Otimizar uso reduzindo tempo de funcionamento",
      priority: a.efficiency === "C" || a.efficiency === "D" ? "Alta" : "Média",
    }));
  }, [filteredAppliances]);

  const toggleAppliance = (id: string) => {
    setSelectedAppliances((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const exportReport = () => {
    const reportData = {
      nome: reportName,
      data: new Date().toLocaleDateString("pt-BR"),
      local: `${location.city}, ${location.state}`,
      estatisticas: stats,
      eletrodomesticos: filteredAppliances,
    };
    console.log("Exportando relatório:", reportData);
    alert("Relatório exportado! Verifique o console.");
  };

  const getLocationIcon = (icon: string, size: number = 48) => {
    const iconProps = { size, strokeWidth: 1.5 };
    switch (icon) {
      case "apartment":
        return <Building2 {...iconProps} />;
      case "business":
        return <Briefcase {...iconProps} />;
      default:
        return <Home {...iconProps} />;
    }
  };

  const getLocationColor = (icon: string) => {
    switch (icon) {
      case "apartment":
        return "from-blue-500 to-blue-600";
      case "business":
        return "from-purple-500 to-purple-600";
      default:
        return "from-emerald-500 to-emerald-600";
    }
  };

  // LOCATIONS VIEW
  if (currentView === "locations") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
        <HeroHeader />
        <div className="mt-24 max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full mb-6 shadow-lg">
              <Zap size={40} className="text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              Gerenciador de Relatórios
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Selecione um local para visualizar o relatório de consumo ou crie
              um novo local para começar
            </p>
          </div>

          {/* Locations Grid */}
          {locations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {locations.map((loc) => (
                <div
                  key={loc.id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
                  onClick={() => selectLocation(loc.id)}
                >
                  {/* Card Header */}
                  <div
                    className={`bg-gradient-to-br ${getLocationColor(
                      loc.icon
                    )} p-6 text-white relative`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        {getLocationIcon(loc.icon, 32)}
                        <div>
                          <h3 className="text-xl font-bold">{loc.name}</h3>
                          <p className="text-sm text-white/90 flex items-center gap-1 mt-1">
                            <MapPin size={14} />
                            {loc.city}, {loc.state}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteLocation(loc.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-all duration-200"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 space-y-3">
                    <div className="flex items-start gap-2 text-slate-700">
                      <MapPin size={16} className="mt-1 text-slate-400" />
                      <div className="text-sm">
                        <p>
                          {loc.address}, {loc.number}
                        </p>
                        {loc.cep && (
                          <p className="text-slate-500">CEP: {loc.cep}</p>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <Zap size={16} className="text-emerald-600" />
                          <span className="text-sm text-slate-600">
                            Eletrodomésticos
                          </span>
                        </div>
                        <span className="text-lg font-bold text-emerald-600">
                          {loc.appliances.length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <DollarSign size={16} className="text-blue-600" />
                          <span className="text-sm text-slate-600">Tarifa</span>
                        </div>
                        <span className="text-sm font-semibold text-slate-700">
                          R$ {loc.tariff.toFixed(2)}/kWh
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        selectLocation(loc.id);
                      }}
                      className="w-full mt-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 rounded-lg transition-colors"
                    >
                      Ver Relatório →
                    </button>
                  </div>
                </div>
              ))}

              {/* Add Location Card */}
              <div
                onClick={() => setIsLocationModalOpen(true)}
                className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-dashed border-slate-300 hover:border-emerald-400 flex flex-col items-center justify-center p-8 cursor-pointer group min-h-[300px]"
              >
                <div className="bg-white rounded-full p-6 mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Plus size={32} className="text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  Novo Local
                </h3>
                <p className="text-sm text-slate-600 text-center max-w-xs">
                  Adicione uma casa, apartamento ou empresa para monitorar o
                  consumo
                </p>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto">
              {/* Empty State */}
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-slate-100 rounded-full mb-6">
                  <Home size={48} className="text-slate-400" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-3">
                  Nenhum local cadastrado
                </h2>
                <p className="text-slate-600 mb-8 max-w-md mx-auto">
                  Comece criando seu primeiro local para monitorar o consumo de
                  energia e receber sugestões inteligentes
                </p>
                <button
                  onClick={() => setIsLocationModalOpen(true)}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-4 rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
                >
                  <Plus size={20} />
                  Criar Primeiro Local
                </button>
              </div>
            </div>
          )}

          {/* Location Modal */}
          {isLocationModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-4 flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white">
                    Adicionar Novo Local
                  </h2>
                  <button
                    onClick={() => setIsLocationModalOpen(false)}
                    className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {/* Location Name */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Nome do Local *
                    </label>
                    <input
                      type="text"
                      value={newLocation.name}
                      onChange={(e) =>
                        setNewLocation({ ...newLocation, name: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Ex: Minha Casa, Apartamento Centro, Empresa XYZ"
                    />
                  </div>

                  {/* Location Type */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">
                      Tipo de Local *
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      <button
                        type="button"
                        onClick={() =>
                          setNewLocation({ ...newLocation, icon: "home" })
                        }
                        className={`p-6 rounded-xl border-2 transition-all ${
                          newLocation.icon === "home"
                            ? "border-emerald-500 bg-emerald-50 shadow-lg"
                            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <Home
                          size={40}
                          className={`mx-auto mb-3 ${
                            newLocation.icon === "home"
                              ? "text-emerald-600"
                              : "text-slate-400"
                          }`}
                        />
                        <p
                          className={`text-sm font-semibold ${
                            newLocation.icon === "home"
                              ? "text-emerald-600"
                              : "text-slate-600"
                          }`}
                        >
                          Casa
                        </p>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setNewLocation({ ...newLocation, icon: "apartment" })
                        }
                        className={`p-6 rounded-xl border-2 transition-all ${
                          newLocation.icon === "apartment"
                            ? "border-blue-500 bg-blue-50 shadow-lg"
                            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <Building2
                          size={40}
                          className={`mx-auto mb-3 ${
                            newLocation.icon === "apartment"
                              ? "text-blue-600"
                              : "text-slate-400"
                          }`}
                        />
                        <p
                          className={`text-sm font-semibold ${
                            newLocation.icon === "apartment"
                              ? "text-blue-600"
                              : "text-slate-600"
                          }`}
                        >
                          Apartamento
                        </p>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setNewLocation({ ...newLocation, icon: "business" })
                        }
                        className={`p-6 rounded-xl border-2 transition-all ${
                          newLocation.icon === "business"
                            ? "border-purple-500 bg-purple-50 shadow-lg"
                            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <Briefcase
                          size={40}
                          className={`mx-auto mb-3 ${
                            newLocation.icon === "business"
                              ? "text-purple-600"
                              : "text-slate-400"
                          }`}
                        />
                        <p
                          className={`text-sm font-semibold ${
                            newLocation.icon === "business"
                              ? "text-purple-600"
                              : "text-slate-600"
                          }`}
                        >
                          Empresa
                        </p>
                      </button>
                    </div>
                  </div>

                  {/* Address Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        CEP
                      </label>
                      <input
                        type="text"
                        value={newLocation.cep}
                        onChange={(e) =>
                          setNewLocation({
                            ...newLocation,
                            cep: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="00000-000"
                        maxLength={9}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Estado *
                      </label>
                      <select
                        value={newLocation.state}
                        onChange={(e) =>
                          setNewLocation({
                            ...newLocation,
                            state: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      >
                        <option value="São Paulo">São Paulo</option>
                        <option value="Rio de Janeiro">Rio de Janeiro</option>
                        <option value="Minas Gerais">Minas Gerais</option>
                        <option value="Bahia">Bahia</option>
                        <option value="Paraná">Paraná</option>
                        <option value="Santa Catarina">Santa Catarina</option>
                        <option value="Rio Grande do Sul">
                          Rio Grande do Sul
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Cidade *
                      </label>
                      <input
                        type="text"
                        value={newLocation.city}
                        onChange={(e) =>
                          setNewLocation({
                            ...newLocation,
                            city: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="Ex: Campinas"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Tarifa de Energia (R$/kWh)
                      </label>
                      <input
                        type="number"
                        value={newLocation.tariff}
                        onChange={(e) =>
                          setNewLocation({
                            ...newLocation,
                            tariff: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="0.92"
                        step="0.01"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Endereço *
                      </label>
                      <input
                        type="text"
                        value={newLocation.address}
                        onChange={(e) =>
                          setNewLocation({
                            ...newLocation,
                            address: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="Ex: Rua das Flores"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Número *
                      </label>
                      <input
                        type="text"
                        value={newLocation.number}
                        onChange={(e) =>
                          setNewLocation({
                            ...newLocation,
                            number: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="123"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
                    <button
                      onClick={() => setIsLocationModalOpen(false)}
                      className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={createLocation}
                      className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg font-medium"
                    >
                      Criar Local
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // REPORT VIEW
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Back Button & Location Info */}
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentView("locations")}
              className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 transition-colors font-medium"
            >
              <ArrowLeft size={20} />
              Voltar para Locais
            </button>
            {currentLocation && (
              <div className="flex items-center gap-3">
                <div
                  className={`bg-gradient-to-br ${getLocationColor(
                    currentLocation.icon
                  )} p-2 rounded-lg text-white`}
                >
                  {getLocationIcon(currentLocation.icon, 24)}
                </div>
                <div>
                  <p className="font-semibold text-slate-800">
                    {currentLocation.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {currentLocation.city}, {currentLocation.state}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter size={20} className="text-emerald-600" />
            <h2 className="text-xl font-semibold text-slate-800">Filtros</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Cômodo
              </label>
              <select
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="all">Todos os cômodos</option>
                {rooms.slice(1).map((room) => (
                  <option key={room} value={room}>
                    {room}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Eletrodomésticos
              </label>
              <div className="flex flex-wrap gap-2">
                {appliances.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => toggleAppliance(a.id)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedAppliances.includes(a.id) ||
                      selectedAppliances.length === 0
                        ? "bg-emerald-100 text-emerald-700 border-2 border-emerald-500"
                        : "bg-slate-100 text-slate-400 border-2 border-transparent"
                    }`}
                  >
                    {a.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <Zap size={24} />
              <span className="text-emerald-100 text-sm">kWh</span>
            </div>
            <p className="text-3xl font-bold">{stats.monthlyConsumption}</p>
            <p className="text-emerald-100 text-sm mt-1">Consumo Mensal</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <DollarSign size={24} />
              <span className="text-blue-100 text-sm">BRL</span>
            </div>
            <p className="text-3xl font-bold">R$ {stats.monthlyCost}</p>
            <p className="text-blue-100 text-sm mt-1">Custo Estimado</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <Leaf size={24} />
              <span className="text-orange-100 text-sm">kg CO₂</span>
            </div>
            <p className="text-3xl font-bold">{stats.totalCarbon}</p>
            <p className="text-orange-100 text-sm mt-1">Emissão de Carbono</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp size={24} />
              <span className="text-purple-100 text-sm">%</span>
            </div>
            <p className="text-3xl font-bold">{stats.avgEfficiency}%</p>
            <p className="text-purple-100 text-sm mt-1">Eficiência Média</p>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Consumo por Cômodo
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={consumptionByRoom}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="consumo" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Tendência Mensal
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="consumo"
                  stroke="#10b981"
                  strokeWidth={2}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="custo"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Eficiência e Sugestões */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Distribuição de Eficiência
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={efficiencyData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {efficiencyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="text-amber-500" size={24} />
              <h3 className="text-lg font-semibold text-slate-800">
                Sugestões Inteligentes
              </h3>
            </div>
            <div className="space-y-3">
              {suggestions.map((sug, idx) => (
                <div
                  key={idx}
                  className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-slate-800">
                      {sug.appliance}
                    </h4>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        sug.priority === "Alta"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {sug.priority}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">
                    Consumo atual:{" "}
                    <span className="font-semibold">
                      {sug.currentConsumption} kWh/mês
                    </span>
                  </p>
                  <p className="text-sm text-slate-700">{sug.suggestion}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex-1">
              {isEditingName ? (
                <input
                  type="text"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                  onBlur={() => setIsEditingName(false)}
                  className="text-3xl font-bold text-slate-800 border-b-2 border-emerald-500 focus:outline-none"
                  autoFocus
                />
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold text-slate-800">
                    {reportName}
                  </h1>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="text-slate-400 hover:text-emerald-600"
                  >
                    <Edit2 size={20} />
                  </button>
                </div>
              )}
              <div className="flex items-center gap-4 mt-2 text-slate-600">
                <span className="flex items-center gap-1">
                  <Calendar size={16} />
                  {new Date().toLocaleDateString("pt-BR")}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={16} />
                  {location.city}, {location.state}
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} />
                Adicionar
              </button>
              <button
                onClick={exportReport}
                className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <Download size={20} />
                Exportar
              </button>
            </div>
          </div>
        </div>

        {/* Modal de Adicionar Eletrodoméstico */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800">
                  Adicionar Eletrodoméstico
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Nome do Eletrodoméstico *
                    </label>
                    <input
                      type="text"
                      value={newAppliance.name}
                      onChange={(e) =>
                        setNewAppliance({
                          ...newAppliance,
                          name: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: Geladeira"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Cômodo *
                    </label>
                    <select
                      value={newAppliance.room}
                      onChange={(e) =>
                        setNewAppliance({
                          ...newAppliance,
                          room: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Cozinha">Cozinha</option>
                      <option value="Sala">Sala</option>
                      <option value="Quarto">Quarto</option>
                      <option value="Banheiro">Banheiro</option>
                      <option value="Área de Serviço">Área de Serviço</option>
                      <option value="Escritório">Escritório</option>
                      <option value="Garagem">Garagem</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Potência (Watts) *
                    </label>
                    <input
                      type="number"
                      value={newAppliance.power || ""}
                      onChange={(e) =>
                        setNewAppliance({
                          ...newAppliance,
                          power: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: 150"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Horas de Uso por Dia *
                    </label>
                    <input
                      type="number"
                      value={newAppliance.hoursPerDay || ""}
                      onChange={(e) =>
                        setNewAppliance({
                          ...newAppliance,
                          hoursPerDay: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: 8"
                      min="0"
                      max="24"
                      step="0.1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Material Principal
                    </label>
                    <input
                      type="text"
                      value={newAppliance.material}
                      onChange={(e) =>
                        setNewAppliance({
                          ...newAppliance,
                          material: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: Aço inoxidável"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Emissão CO₂ (kg/ano)
                    </label>
                    <input
                      type="number"
                      value={newAppliance.carbonFootprint || ""}
                      onChange={(e) =>
                        setNewAppliance({
                          ...newAppliance,
                          carbonFootprint: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: 450"
                      min="0"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Eficiência Energética
                    </label>
                    <select
                      value={newAppliance.efficiency}
                      onChange={(e) =>
                        setNewAppliance({
                          ...newAppliance,
                          efficiency: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="A++">A++ (Mais Eficiente)</option>
                      <option value="A+">A+</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                      <option value="E">E (Menos Eficiente)</option>
                    </select>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                  <p className="text-sm text-blue-800">
                    <strong>Consumo Estimado:</strong>{" "}
                    {newAppliance.power && newAppliance.hoursPerDay
                      ? `${(
                          (newAppliance.power * newAppliance.hoursPerDay * 30) /
                          1000
                        ).toFixed(2)} kWh/mês`
                      : "-- kWh/mês"}
                  </p>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-200">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={addAppliance}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Adicionar Eletrodoméstico
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Unified Appliance View: toggle between cards and list */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Home size={24} className="text-blue-600" />
              <h2 className="text-xl font-semibold text-slate-800">
                Meus Eletrodomésticos
              </h2>
              <span className="bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1 rounded-full">
                {filteredAppliances.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setApplianceView("cards")}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  applianceView === "cards"
                    ? "bg-slate-100 text-slate-900 border border-slate-200"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                Cards
              </button>
              <button
                onClick={() => setApplianceView("list")}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  applianceView === "list"
                    ? "bg-slate-100 text-slate-900 border border-slate-200"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                Lista
              </button>
            </div>
          </div>

          {applianceView === "cards" ? (
            // Cards grid
            <>
              {filteredAppliances.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredAppliances.map((appliance) => (
                    <div
                      key={appliance.id}
                      className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-slate-800 text-lg">
                            {appliance.name}
                          </h3>
                          <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                            <MapPin size={14} />
                            {appliance.room}
                          </p>
                        </div>
                        <button
                          onClick={() => removeAppliance(appliance.id)}
                          className="text-red-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Potência:</span>
                          <span className="font-medium text-slate-800">
                            {appliance.power}W
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Uso diário:</span>
                          <span className="font-medium text-slate-800">
                            {appliance.hoursPerDay}h
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Consumo/mês:</span>
                          <span className="font-medium text-emerald-600">
                            {(
                              (appliance.power * appliance.hoursPerDay * 30) /
                              1000
                            ).toFixed(2)}{" "}
                            kWh
                          </span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                          <span className="text-slate-600">Eficiência:</span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              ["A", "A+", "A++"].includes(appliance.efficiency)
                                ? "bg-green-100 text-green-700"
                                : appliance.efficiency === "B"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {appliance.efficiency}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-slate-300 mb-4">
                    <Home size={64} className="mx-auto" />
                  </div>
                  <p className="text-slate-500 text-lg">
                    Nenhum eletrodoméstico cadastrado
                  </p>
                  <p className="text-slate-400 text-sm mt-2">
                    Clique no botão "Adicionar" para começar
                  </p>
                </div>
              )}
            </>
          ) : (
            // List / table view
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                Detalhes dos Eletrodomésticos
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                        Nome
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                        Cômodo
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                        Potência
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                        Uso Diário
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                        Consumo Mensal
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                        Material
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                        Eficiência
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredAppliances.length > 0 ? (
                      filteredAppliances.map((a) => (
                        <tr
                          key={a.id}
                          className="hover:bg-slate-50 transition-colors"
                        >
                          <td className="px-4 py-3 text-sm text-slate-800 font-medium">
                            {a.name}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600">
                            {a.room}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600">
                            {a.power}W
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600">
                            {a.hoursPerDay}h
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600">
                            {((a.power * a.hoursPerDay * 30) / 1000).toFixed(2)}{" "}
                            kWh
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600">
                            {a.material}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                ["A", "A+"].includes(a.efficiency)
                                  ? "bg-green-100 text-green-700"
                                  : a.efficiency === "B"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {a.efficiency}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => removeAppliance(a.id)}
                              className="text-red-500 hover:text-red-700 font-medium"
                            >
                              Remover
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={8}
                          className="text-center py-12 text-slate-500"
                        >
                          Nenhum eletrodoméstico cadastrado — clique em
                          "Adicionar"
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
        {/* Informações Ambientais */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-500 rounded-xl shadow-lg p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-blue-600 mt-1" size={24} />
            <div>
              <h3 className="font-semibold text-slate-800 mb-2">
                Impacto Ambiental dos Materiais
              </h3>
              <p className="text-slate-700 mb-3">
                Eletrodomésticos utilizam diversos materiais com diferentes
                impactos ambientais:
              </p>
              <ul className="space-y-2 text-sm text-slate-700">
                <li>
                  • <strong>Aço inoxidável:</strong> Reciclável 100%, mas
                  produção emite 1,9kg CO₂ por kg de aço
                </li>
                <li>
                  • <strong>Alumínio:</strong> Requer 15.000 kWh/tonelada na
                  produção, mas reciclar economiza 95% da energia
                </li>
                <li>
                  • <strong>Plástico:</strong> Derivado do petróleo, leva até
                  400 anos para se degradar
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelatorioEnergia;
