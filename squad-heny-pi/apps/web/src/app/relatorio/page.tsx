"use client";
import React, { useState, useMemo } from "react";
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

interface Location {
  state: string;
  city: string;
  tariff: number;
}

const RelatorioEnergia = () => {
  const [reportName, setReportName] = useState(
    `Relatório de ${new Date().toLocaleDateString("pt-BR")}`
  );
  const [isEditingName, setIsEditingName] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<string>("all");
  const [selectedAppliances, setSelectedAppliances] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appliances, setAppliances] = useState<Appliance[]>([
    {
      id: "1",
      name: "Geladeira",
      room: "Cozinha",
      power: 150,
      hoursPerDay: 24,
      material: "Aço inoxidável",
      carbonFootprint: 450,
      efficiency: "A",
    },
    {
      id: "2",
      name: "Ar Condicionado",
      room: "Quarto",
      power: 1500,
      hoursPerDay: 8,
      material: "Alumínio e plástico",
      carbonFootprint: 850,
      efficiency: "C",
    },
    {
      id: "3",
      name: "Televisão LED",
      room: "Sala",
      power: 100,
      hoursPerDay: 6,
      material: "Plástico e vidro",
      carbonFootprint: 200,
      efficiency: "A+",
    },
    {
      id: "4",
      name: "Máquina de Lavar",
      room: "Área de Serviço",
      power: 500,
      hoursPerDay: 1,
      material: "Aço e plástico",
      carbonFootprint: 320,
      efficiency: "B",
    },
    {
      id: "5",
      name: "Chuveiro Elétrico",
      room: "Banheiro",
      power: 5500,
      hoursPerDay: 0.5,
      material: "Plástico e resistência",
      carbonFootprint: 180,
      efficiency: "B",
    },
    {
      id: "6",
      name: "Micro-ondas",
      room: "Cozinha",
      power: 1200,
      hoursPerDay: 0.3,
      material: "Aço e vidro",
      carbonFootprint: 150,
      efficiency: "A",
    },
  ]);

  const [newAppliance, setNewAppliance] = useState<Omit<Appliance, "id">>({
    name: "",
    room: "Cozinha",
    power: 0,
    hoursPerDay: 0,
    material: "",
    carbonFootprint: 0,
    efficiency: "A",
  });

  const location: Location = {
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
      Math.max(...appliances.map((a) => parseInt(a.id))) + 1
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
  }, [selectedRoom, selectedAppliances]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
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

        {/* Lista de Eletrodomésticos */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Home size={24} className="text-blue-600" />
              <h2 className="text-xl font-semibold text-slate-800">
                Meus Eletrodomésticos
              </h2>
              <span className="bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1 rounded-full">
                {appliances.length}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {appliances.map((appliance) => (
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

          {appliances.length === 0 && (
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

        {/* Conscientização Ambiental */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-emerald-500 rounded-xl shadow-lg p-6">
          <div className="flex items-start gap-3">
            <Leaf className="text-emerald-600 mt-1" size={24} />
            <div>
              <h3 className="font-semibold text-slate-800 mb-2">
                💡 Você Sabia?
              </h3>
              <p className="text-slate-700">
                A produção de eletrodomésticos consome recursos naturais
                valiosos. Uma geladeira de aço inoxidável utiliza
                aproximadamente 70kg de aço, cuja produção emite cerca de 140kg
                de CO₂. Escolher aparelhos eficientes e mantê-los por mais tempo
                reduz o impacto ambiental significativamente.
              </p>
            </div>
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

        {/* Tabela de Eletrodomésticos */}
        <div className="bg-white rounded-xl shadow-lg p-6">
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
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredAppliances.map((a) => (
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
                      {((a.power * a.hoursPerDay * 30) / 1000).toFixed(2)} kWh
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
                Seus eletrodomésticos utilizam diversos materiais com diferentes
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
