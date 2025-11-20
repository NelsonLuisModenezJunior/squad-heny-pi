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
import { localService, type Local } from "../../services/localService";
import { tarifaService } from "../../services/tarifaService";
import { eletroService, type Eletro } from "../../services/eletroService";
import {
  reportService,
  type ReportStats,
  type MonthlyHistory,
} from "../../services/reportService";

interface Appliance {
  id: string;
  name: string;
  room: string;
  power: number;
  hoursPerDay: number;
  material: string;
  carbonFootprint: number;
  efficiency: string;
  category: string;
}

interface LocationData {
  id: string;
  name: string;
  icon: "home" | "apartment" | "business";
  city: string;
  state: string;
  address: string;
  number: string;
  tariff: number;
  // Removed appliances array - now loaded from backend per location
}

interface Location {
  state: string;
  city: string;
  tariff: number;
}

interface Room {
  comodo_id: number;
  comodo_nome: string;
}

interface Category {
  categoria_id: number;
  categoria_nome: string;
}

interface Estado {
  id: number;
  estado_nome: string;
  estado_uf: string;
  created_at: string;
  updated_at: string;
}

// Mapper: Backend Eletro → Frontend Appliance
function eletroToAppliance(eletro: Eletro): Appliance {
  return {
    id: eletro.eletro_id.toString(),
    name: eletro.eletro_nome,
    room: eletro.comodo?.comodo_nome || "Desconhecido",
    power: eletro.eletro_potencia,
    hoursPerDay: eletro.eletro_hrs_uso_dia,
    material: "", // campo não existe no backend, pode ser removido ou preenchido default
    carbonFootprint: eletro.eletro_emissao_co2_anual || 0,
    efficiency: eletro.classificacao_eficiencia || "N/A", // usa classificação calculada pelo backend
    category: eletro.categoria?.categoria_nome || "",
  };
}

const RelatorioEnergia = () => {
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [states, setStates] = useState<Estado[]>([]);
  // Buscar estados
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token não encontrado");
          return;
        }

        const response = await fetch("http://localhost:8000/api/estados", {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Erro da API:", {
            status: response.status,
            statusText: response.statusText,
            body: errorText,
          });
          throw new Error(
            `Erro ao buscar estados: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        setStates(data);
      } catch (error) {
        console.error("Erro ao buscar estados:", error);
      }
    };

    fetchStates();
  }, []);

  // Buscar categorias
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token não encontrado");
          return;
        }

        const response = await fetch("http://localhost:8000/api/categorias", {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Erro da API:", {
            status: response.status,
            statusText: response.statusText,
            body: errorText,
          });
          throw new Error(
            `Erro ao buscar categorias: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token não encontrado");
          return;
        }

        console.log("Token usado:", token); // Para debug

        const response = await fetch("http://localhost:8000/api/comodos", {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Erro da API:", {
            status: response.status,
            statusText: response.statusText,
            body: errorText,
          });
          throw new Error(
            `Erro ao buscar cômodos: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        setAvailableRooms(data);
      } catch (error) {
        console.error("Erro ao buscar cômodos:", error);
      }
    };

    fetchRooms();
  }, []);

  // Initialize newAppliance defaults when rooms/categories load
  useEffect(() => {
    if (availableRooms.length > 0 || categories.length > 0) {
      setNewAppliance((prev) => ({
        ...prev,
        room: availableRooms[0]?.comodo_nome || prev.room,
        category: categories[0]?.categoria_nome || prev.category,
      }));
    }
  }, [availableRooms, categories]);

  const [currentView, setCurrentView] = useState<"locations" | "report">(
    "locations"
  );
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [backendLocals, setBackendLocals] = useState<Local[]>([]);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
    null
  );
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      const locais = await localService.getAll();
      setBackendLocals(locais);

      // Converter para formato LocationData
      const locationsData: LocationData[] = locais.map((local) => ({
        id: local.id.toString(),
        name: local.local_nome,
        city: local.local_cidade,
        address: local.local_endereco,
        number: local.local_numero,
        state: local.estado?.estado_nome || "",
        icon: "home", // default
        tariff: local.tarifa?.tarifa_valor || 0.92,
      }));

      setLocations(locationsData);
    } catch (error) {
      console.error("Erro ao carregar locais:", error);
      alert(
        `Erro ao carregar locais: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
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
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appliances, setAppliances] = useState<Appliance[]>([]);
  const [isLoadingAppliances, setIsLoadingAppliances] = useState(false);

  // Backend statistics state
  const [stats, setStats] = useState<ReportStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [statsError, setStatsError] = useState<string | null>(null);

  // Monthly history state
  const [monthlyHistory, setMonthlyHistory] = useState<MonthlyHistory[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const [newAppliance, setNewAppliance] = useState<Omit<Appliance, "id">>({
    name: "",
    room: "Cozinha",
    power: 0,
    hoursPerDay: 0,
    material: "",
    carbonFootprint: 0,
    efficiency: "",
    category: "",
  });

  const [newLocation, setNewLocation] = useState({
    name: "",
    icon: "home" as "home" | "apartment" | "business",
    city: "",
    state_id: "",
    address: "",
    number: "",
    tariff_value: 0,
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
      setReportTab("report");

      // Load appliances and stats from backend for this location
      loadAppliances(selectedLocationId);
      fetchStats(selectedLocationId);
      fetchMonthlyHistory(selectedLocationId);
    } else {
      setEditLocation(null);
      setAppliances([]);
      setStats(null);
      setMonthlyHistory([]);
    }
  }, [selectedLocationId, locations]);

  const loadAppliances = async (locationId: string) => {
    try {
      setIsLoadingAppliances(true);
      const eletros = await eletroService.getByLocal(locationId);
      const mappedAppliances = eletros.map(eletroToAppliance);
      setAppliances(mappedAppliances);
    } catch (error) {
      console.error("Erro ao carregar eletrodomésticos:", error);
      alert(
        `Erro ao carregar eletrodomésticos: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
      setAppliances([]);
    } finally {
      setIsLoadingAppliances(false);
    }
  };

  const fetchStats = async (locationId: string) => {
    try {
      setIsLoadingStats(true);
      setStatsError(null);
      const data = await reportService.getLocationStats(locationId);
      setStats(data);
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido";
      setStatsError(errorMessage);
      alert(`Erro ao carregar estatísticas: ${errorMessage}`);
    } finally {
      setIsLoadingStats(false);
    }
  };

  const fetchMonthlyHistory = async (locationId: string) => {
    try {
      setIsLoadingHistory(true);
      const data = await reportService.getMonthlyHistory(locationId);
      setMonthlyHistory(data);
    } catch (error) {
      console.error("Erro ao carregar histórico mensal:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido";
      alert(`Erro ao carregar histórico mensal: ${errorMessage}`);
      setMonthlyHistory([]);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const createLocation = async () => {
    if (
      !newLocation.name ||
      !newLocation.city ||
      !newLocation.address ||
      !newLocation.state_id ||
      !newLocation.tariff_value
    ) {
      alert("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    try {
      // Primeiro, criar a tarifa
      const tarifaCreated = await tarifaService.create(
        newLocation.tariff_value
      );

      console.log("Tarifa criada:", tarifaCreated);
      console.log("tarifa_id:", tarifaCreated.tarifa_id);
      console.log(
        "Objeto completo da tarifa:",
        JSON.stringify(tarifaCreated, null, 2)
      );

      if (!tarifaCreated || !tarifaCreated.tarifa_id) {
        throw new Error(
          `Tarifa criada mas sem ID válido. Resposta: ${JSON.stringify(
            tarifaCreated
          )}`
        );
      }

      // Depois, criar o local com a tarifa_id
      const localCreated = await localService.create({
        local_nome: newLocation.name,
        local_cidade: newLocation.city,
        local_endereco: newLocation.address,
        local_numero: newLocation.number,
        estado_id: parseInt(newLocation.state_id),
        tarifa_id: tarifaCreated.tarifa_id,
      });

      // Recarregar a lista de locais
      await loadLocations();

      setIsLocationModalOpen(false);
      setNewLocation({
        name: "",
        icon: "home",
        city: "",
        state_id: "",
        address: "",
        number: "",
        tariff_value: 0,
      });

      alert("Local criado com sucesso!");
    } catch (error) {
      console.error("Erro ao criar local:", error);
      alert(
        `Erro ao criar local: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
    }
  };

  const deleteLocation = async (id: string) => {
    if (confirm("Deseja realmente excluir este local?")) {
      try {
        await localService.delete(parseInt(id));
        await loadLocations();

        if (selectedLocationId === id) {
          setSelectedLocationId(null);
          setCurrentView("locations");
        }

        alert("Local excluído com sucesso!");
      } catch (error) {
        console.error("Erro ao excluir local:", error);
        alert(
          `Erro ao excluir local: ${
            error instanceof Error ? error.message : "Erro desconhecido"
          }`
        );
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

  const addAppliance = async () => {
    if (
      !newAppliance.name ||
      newAppliance.power <= 0 ||
      newAppliance.hoursPerDay <= 0
    ) {
      alert("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    if (!selectedLocationId) {
      alert("Nenhum local selecionado");
      return;
    }

    if (!newAppliance.room || !newAppliance.category) {
      alert("Por favor, selecione o cômodo e a categoria");
      return;
    }

    try {
      const comodo = availableRooms.find(
        (r) => r.comodo_nome === newAppliance.room
      );
      const categoria = categories.find(
        (c) => c.categoria_nome === newAppliance.category
      );

      if (!comodo || !categoria) {
        alert("Cômodo ou categoria inválidos");
        return;
      }

      const createRequest = {
        categoria_id: categoria.categoria_id,
        comodo_id: comodo.comodo_id,
        local_id: parseInt(selectedLocationId),
        eletro_nome: newAppliance.name,
        eletro_potencia: newAppliance.power,
        eletro_hrs_uso_dia: newAppliance.hoursPerDay,
      };

      const created = await eletroService.create(createRequest);

      if (selectedLocationId) {
        await Promise.all([
          loadAppliances(selectedLocationId),
          fetchStats(selectedLocationId),
          fetchMonthlyHistory(selectedLocationId)
        ]);
      }

      setIsModalOpen(false);
      setNewAppliance({
        name: "",
        room: availableRooms[0]?.comodo_nome || "Cozinha",
        power: 0,
        hoursPerDay: 0,
        material: "",
        carbonFootprint: 0,
        efficiency: "A",
        category: categories[0]?.categoria_nome || "",
      });

      alert("Eletrodoméstico adicionado com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar eletrodoméstico:", error);
      alert(
        `Erro ao adicionar eletrodoméstico: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
    }
  };

  const removeAppliance = async (id: string) => {
    if (!confirm("Deseja realmente remover este eletrodoméstico?")) {
      return;
    }

    try {
      await eletroService.delete(id);
      setAppliances(appliances.filter((a) => a.id !== id));

      // Reload stats from backend
      if (selectedLocationId) {
        await fetchStats(selectedLocationId);
      }

      alert("Eletrodoméstico removido com sucesso!");
    } catch (error) {
      console.error("Erro ao remover eletrodoméstico:", error);
      alert(
        `Erro ao remover eletrodoméstico: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
    }
  };

  const roomNames = [
    "all",
    ...Array.from(new Set(appliances.map((a) => a.room))),
  ];

  // Agrupar eletrodomésticos por categoria
  const appliancesByCategory = useMemo(() => {
    const grouped = new Map<string, Appliance[]>();

    // Filtrar por cômodo primeiro
    let appliancesToGroup = appliances;
    if (selectedRoom !== "all") {
      appliancesToGroup = appliances.filter((a) => a.room === selectedRoom);
    }

    appliancesToGroup.forEach((appliance) => {
      const category = appliance.category || "Sem Categoria";
      if (!grouped.has(category)) {
        grouped.set(category, []);
      }
      grouped.get(category)!.push(appliance);
    });
    return grouped;
  }, [appliances, selectedRoom]);

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

  const consumptionByRoom = useMemo(() => {
    const roomConsumption = new Map<string, number>();

    filteredAppliances.forEach((appliance) => {
      const room = appliance.room;
      const consumption = (appliance.power * appliance.hoursPerDay * 30) / 1000; // kWh/mês
      roomConsumption.set(room, (roomConsumption.get(room) || 0) + consumption);
    });

    return Array.from(roomConsumption.entries()).map(([name, consumo]) => ({
      name,
      consumo,
    }));
  }, [filteredAppliances]);

  // Use monthly history from backend
  const monthlyTrend = useMemo(() => {
    return monthlyHistory.map((item) => ({
      mes: item.mes,
      consumo: item.consumo,
      custo: item.custo,
      emissao: item.co2,
    }));
  }, [monthlyHistory]);

  // Estatísticas filtradas baseadas nos eletrodomésticos filtrados
  const filteredStats = useMemo(() => {
    const monthlyConsumption = filteredAppliances.reduce(
      (sum, a) => sum + (a.power * a.hoursPerDay * 30) / 1000,
      0
    );
    const monthlyCost = monthlyConsumption * (location.tariff || 0.92);
    const monthlyCO2 = monthlyConsumption * 0.0817; // fator de emissão médio
    const avgEfficiency =
      filteredAppliances.length > 0
        ? filteredAppliances.reduce((sum, a) => {
            const effMap: Record<string, number> = {
              "A+": 100,
              A: 85,
              B: 70,
              C: 55,
              D: 40,
              E: 25,
            };
            return sum + (effMap[a.efficiency] || 50);
          }, 0) / filteredAppliances.length
        : 0;

    return { monthlyConsumption, monthlyCost, monthlyCO2, avgEfficiency };
  }, [filteredAppliances, location.tariff]);

  const efficiencyData = useMemo(
    () => [
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
    ],
    [filteredAppliances]
  );

  // Savings simulator state and logic
  const [simApplianceId, setSimApplianceId] = useState<string>(
    filteredAppliances.length > 0 ? filteredAppliances[0].id : ""
  );
  const [simHours, setSimHours] = useState<number>(
    filteredAppliances.length > 0 ? filteredAppliances[0].hoursPerDay : 0
  );
  const [simTariff, setSimTariff] = useState<number>(location.tariff || 0.92);
  const [simReplacement, setSimReplacement] = useState<"A+" | "A++">("A+");
  const [simResult, setSimResult] = useState<{
    currentKwh: number;
    newKwh: number;
    savingsKwh: number;
    monthlySavings: number;
    annualSavings: number;
  } | null>(null);

  // logged user from localStorage (shown under report title)
  const [loggedUser, setLoggedUser] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw) return setLoggedUser(null);
      try {
        const parsed = JSON.parse(raw);
        setLoggedUser(parsed?.name || String(parsed));
      } catch {
        setLoggedUser(raw);
      }
    } catch (err) {
      setLoggedUser(null);
    }
  }, []);

  useEffect(() => {
    // when available appliances change, reset simulator defaults
    if (filteredAppliances.length > 0) {
      setSimApplianceId(filteredAppliances[0].id);
      setSimHours(filteredAppliances[0].hoursPerDay);
    } else {
      setSimApplianceId("");
      setSimHours(0);
    }
  }, [filteredAppliances]);

  useEffect(() => {
    setSimTariff(location.tariff || 0.92);
  }, [location.tariff]);

  const runSimulation = () => {
    const appliance = filteredAppliances.find((a) => a.id === simApplianceId);
    if (!appliance) return;

    const hours = simHours || appliance.hoursPerDay || 0;
    const currentKwh = (appliance.power * hours * 30) / 1000;

    // coarse savings estimates: A+ => 30% less energy, A++ => 45% less
    const factor =
      simReplacement === "A+" ? 0.3 : simReplacement === "A++" ? 0.45 : 0;
    const newKwh = currentKwh * (1 - factor);
    const savingsKwh = currentKwh - newKwh;
    const monthlySavings = savingsKwh * simTariff;
    const annualSavings = monthlySavings * 12;

    setSimResult({
      currentKwh,
      newKwh,
      savingsKwh,
      monthlySavings,
      annualSavings,
    });
  };

  const toggleAppliance = (id: string) => {
    setSelectedAppliances((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleCategory = (category: string) => {
    setOpenCategories((prev) => {
      const newSet = new Set<string>();

      if (!prev.has(category)) {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const clearFilters = () => {
    setSelectedAppliances([]);
  };

  const hasSelectedFromCategory = (category: string) => {
    const categoryAppliances = appliancesByCategory.get(category) || [];
    return categoryAppliances.some((a) => selectedAppliances.includes(a.id));
  };

  // exportReport removed — exporting handled elsewhere or not needed

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
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100">
                      <div className="flex justify-between items-center mb-2">
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
                        Estado *
                      </label>
                      <select
                        value={newLocation.state_id}
                        onChange={(e) =>
                          setNewLocation({
                            ...newLocation,
                            state_id: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      >
                        <option value="">Selecione um estado</option>
                        {states.map((state) => (
                          <option key={state.id} value={state.id}>
                            {state.estado_nome} - ({state.estado_uf})
                          </option>
                        ))}
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
                        Tarifa de Energia (R$/kWh) *
                      </label>
                      <input
                        type="number"
                        value={newLocation.tariff_value}
                        onChange={(e) =>
                          setNewLocation({
                            ...newLocation,
                            tariff_value: parseFloat(e.target.value) || 0,
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
        {/* Back Button & Location Info (now hosts centered report title) */}
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="relative flex items-center justify-between">
            <div>
              <button
                onClick={() => setCurrentView("locations")}
                className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 transition-colors font-medium"
              >
                <ArrowLeft size={20} />
                Voltar para Locais
              </button>
            </div>

            {/* centered title */}
            <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
              <h2 className="text-xl font-semibold text-slate-800">
                {reportName}
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                {loggedUser || "Usuário não identificado"}
              </p>
            </div>

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

        {/* Report Title Bar removed (now rendered inside the Back/Location box) */}

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
                {roomNames.slice(1).map((room) => (
                  <option key={room} value={room}>
                    {room}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Categorias de Eletrodomésticos
              </label>

              {/* Botão Todos */}
              <button
                onClick={clearFilters}
                className={`px-3 py-1 rounded-full text-sm transition-colors mb-3 ${
                  selectedAppliances.length === 0
                    ? "bg-emerald-100 text-emerald-700 border-2 border-emerald-500"
                    : "bg-slate-100 text-slate-600 border-2 border-transparent hover:bg-slate-200"
                }`}
              >
                Todos ({appliances.length})
              </button>

              <div className="flex flex-wrap gap-2">
                {Array.from(appliancesByCategory.entries()).map(
                  ([category, items]) => (
                    <div key={category} className="relative">
                      {/* Botão da Categoria */}
                      <button
                        onClick={() => toggleCategory(category)}
                        className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-2 transition-all ${
                          openCategories.has(category)
                            ? "bg-emerald-500 text-white shadow-md"
                            : hasSelectedFromCategory(category)
                            ? "bg-emerald-100 text-emerald-700 border-2 border-emerald-500"
                            : "bg-slate-100 text-slate-600 border-2 border-transparent hover:bg-slate-200"
                        }`}
                      >
                        {category}
                        <span
                          className={`text-xs ${
                            openCategories.has(category)
                              ? "text-emerald-100"
                              : "text-slate-500"
                          }`}
                        >
                          ({items.length})
                        </span>
                        <svg
                          className={`w-3 h-3 transition-transform duration-200 ${
                            openCategories.has(category) ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>

                      {/* Dropdown */}
                      {openCategories.has(category) && (
                        <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl border border-slate-200 p-2 z-20 min-w-[240px] max-h-[300px] overflow-y-auto">
                          {items.map((appliance) => (
                            <label
                              key={appliance.id}
                              className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded cursor-pointer group"
                            >
                              <input
                                type="checkbox"
                                checked={selectedAppliances.includes(
                                  appliance.id
                                )}
                                onChange={() => toggleAppliance(appliance.id)}
                                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
                              />
                              <div className="flex-1">
                                <span className="text-sm text-slate-700 font-medium group-hover:text-emerald-600">
                                  {appliance.name}
                                </span>
                              </div>
                              <span className="text-xs text-slate-400">
                                {appliance.power}W
                              </span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>

              {/* Indicador de filtros ativos */}
              {selectedAppliances.length > 0 && (
                <div className="mt-3 flex items-center gap-2 text-sm">
                  <span className="text-slate-600">
                    <strong>{selectedAppliances.length}</strong>{" "}
                    eletrodoméstico(s) filtrado(s)
                  </span>
                  <button
                    onClick={clearFilters}
                    className="text-emerald-600 hover:text-emerald-700 hover:underline font-medium"
                  >
                    Limpar filtros
                  </button>
                </div>
              )}
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
            <p className="text-3xl font-bold">
              {filteredStats.monthlyConsumption.toFixed(2)}
            </p>
            <p className="text-emerald-100 text-sm mt-1">
              Consumo Mensal (Filtrado)
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <DollarSign size={24} />
              <span className="text-blue-100 text-sm">BRL</span>
            </div>
            <p className="text-3xl font-bold">
              R$ {filteredStats.monthlyCost.toFixed(2)}
            </p>
            <p className="text-blue-100 text-sm mt-1">
              Custo Estimado (Filtrado)
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <Leaf size={24} />
              <span className="text-orange-100 text-sm">kg CO₂</span>
            </div>
            <p className="text-3xl font-bold">
              {filteredStats.monthlyCO2.toFixed(2)}
            </p>
            <p className="text-orange-100 text-sm mt-1">
              Emissão CO₂ (Filtrado)
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp size={24} />
              <span className="text-purple-100 text-sm">%</span>
            </div>
            <p className="text-3xl font-bold">
              {filteredStats.avgEfficiency.toFixed(0)}%
            </p>
            <p className="text-purple-100 text-sm mt-1">
              Eficiência Média (Filtrado)
            </p>
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
                  name="Consumo (kWh)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="custo"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Custo (R$)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="emissao"
                  stroke="#f97316"
                  strokeWidth={2}
                  name="CO₂ (kg)"
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
                Simulador de Economia
              </h3>
            </div>

            {filteredAppliances.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                Nenhum eletrodoméstico disponível para simular. Adicione
                aparelhos e tente novamente.
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Eletrodoméstico
                    </label>
                    <select
                      value={simApplianceId}
                      onChange={(e) => {
                        const id = e.target.value;
                        setSimApplianceId(id);
                        const ap = filteredAppliances.find((a) => a.id === id);
                        if (ap) setSimHours(ap.hoursPerDay);
                      }}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    >
                      {filteredAppliances.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.name} — {a.power}W — {a.efficiency}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Horas de uso por dia
                    </label>
                    <input
                      type="number"
                      value={simHours}
                      onChange={(e) =>
                        setSimHours(parseFloat(e.target.value) || 0)
                      }
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                      step="0.1"
                      min={0}
                      max={24}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Tarifa (R$/kWh)
                    </label>
                    <input
                      type="number"
                      value={simTariff}
                      onChange={(e) =>
                        setSimTariff(parseFloat(e.target.value) || 0)
                      }
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                      step="0.01"
                      min={0}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Substituir por
                    </label>
                    <select
                      value={simReplacement}
                      onChange={(e) =>
                        setSimReplacement(e.target.value as "A+" | "A++")
                      }
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="A+">A+ (estimativa ~30% economia)</option>
                      <option value="A++">
                        A++ (estimativa ~45% economia)
                      </option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={runSimulation}
                    className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                  >
                    Simular
                  </button>
                  <button
                    onClick={() => setSimResult(null)}
                    className="px-6 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
                  >
                    Resetar
                  </button>
                </div>

                {simResult ? (
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-50 rounded-lg p-4">
                      <p className="text-sm text-slate-600">Consumo atual</p>
                      <p className="text-2xl font-bold text-slate-800">
                        {simResult.currentKwh.toFixed(2)} kWh/mês
                      </p>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-4">
                      <p className="text-sm text-slate-600">
                        Após substituição
                      </p>
                      <p className="text-2xl font-bold text-slate-800">
                        {simResult.newKwh.toFixed(2)} kWh/mês
                      </p>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-4">
                      <p className="text-sm text-slate-600">
                        Economia estimada
                      </p>
                      <p className="text-2xl font-bold text-emerald-600">
                        {simResult.savingsKwh.toFixed(2)} kWh/mês
                      </p>
                      <p className="text-sm text-slate-600 mt-1">
                        R$ {simResult.monthlySavings.toFixed(2)}/mês — R${" "}
                        {simResult.annualSavings.toFixed(2)}/ano
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-500 mt-4">
                    Configure os parâmetros e clique em "Simular" para ver a
                    estimativa.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* removed original Header here because moved to top */}

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
                      {availableRooms.map((room) => (
                        <option key={room.comodo_id} value={room.comodo_nome}>
                          {room.comodo_nome}
                        </option>
                      ))}
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
                      Categoria
                    </label>
                    <select
                      value={newAppliance.category}
                      onChange={(e) =>
                        setNewAppliance({
                          ...newAppliance,
                          category: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {categories.map((category) => (
                        <option
                          key={category.categoria_id}
                          value={category.categoria_nome}
                        >
                          {category.categoria_nome}
                        </option>
                      ))}
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
              <button
                onClick={() => setIsModalOpen(true)}
                className="ml-3 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Plus size={16} />
                Adicionar
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
                        <div className="flex justify-between">
                          <span className="text-slate-600">Emissão (CO₂):</span>
                          <span className="font-medium text-red-600">
                            {Number(appliance.carbonFootprint).toFixed(2)}{" "}
                            kg/ano
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
                        Emissão CO₂
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
                            {Number(a.carbonFootprint).toFixed(2)} kg/ano
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
      </div>
    </div>
  );
};

export default RelatorioEnergia;
