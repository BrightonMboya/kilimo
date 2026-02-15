import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Search, ShieldCheck, FlaskConical, Microscope, Award, FileCheck, Star, MapPin, Phone, Mail, AlertTriangle, CheckCircle, XCircle, Clock, FileText } from 'lucide-react-native'
import React, { useState, useMemo } from 'react'

// ============================================
// STATIC DATA
// ============================================

type MRLStatus = 'APPROVED' | 'RESTRICTED' | 'BANNED'

interface PesticideEntry {
  name: string
  activeIngredient: string
  mrlValue: number // mg/kg
  phi: number // Pre-Harvest Interval in days
  status: MRLStatus
  crops: string[]
}

const REGISTRY_DATA: PesticideEntry[] = [
  { name: 'Chlorpyrifos', activeIngredient: 'Chlorpyrifos', mrlValue: 0.01, phi: 21, status: 'BANNED', crops: ['Coffee', 'Tea', 'Avocado', 'French Beans'] },
  { name: 'Lambda-Cyhalothrin', activeIngredient: 'Lambda-Cyhalothrin', mrlValue: 0.1, phi: 14, status: 'APPROVED', crops: ['French Beans', 'Avocado', 'Macadamia'] },
  { name: 'Imidacloprid', activeIngredient: 'Imidacloprid', mrlValue: 0.05, phi: 14, status: 'RESTRICTED', crops: ['Coffee', 'Tea', 'Avocado'] },
  { name: 'Acetamiprid', activeIngredient: 'Acetamiprid', mrlValue: 0.3, phi: 7, status: 'APPROVED', crops: ['French Beans', 'Tea', 'Flowers'] },
  { name: 'Mancozeb', activeIngredient: 'Mancozeb', mrlValue: 0.05, phi: 14, status: 'RESTRICTED', crops: ['Avocado', 'French Beans', 'Passion Fruit'] },
  { name: 'Metalaxyl', activeIngredient: 'Metalaxyl-M', mrlValue: 0.1, phi: 14, status: 'APPROVED', crops: ['Avocado', 'French Beans', 'Macadamia'] },
  { name: 'Thiamethoxam', activeIngredient: 'Thiamethoxam', mrlValue: 0.05, phi: 14, status: 'RESTRICTED', crops: ['Coffee', 'Tea', 'French Beans'] },
  { name: 'Cypermethrin', activeIngredient: 'Cypermethrin', mrlValue: 0.5, phi: 7, status: 'APPROVED', crops: ['Coffee', 'Tea', 'French Beans', 'Avocado'] },
  { name: 'Profenofos', activeIngredient: 'Profenofos', mrlValue: 0.01, phi: 21, status: 'BANNED', crops: ['French Beans', 'Avocado'] },
  { name: 'Spiromesifen', activeIngredient: 'Spiromesifen', mrlValue: 0.3, phi: 7, status: 'APPROVED', crops: ['Avocado', 'French Beans', 'Flowers'] },
  { name: 'Abamectin', activeIngredient: 'Abamectin', mrlValue: 0.01, phi: 14, status: 'APPROVED', crops: ['Avocado', 'French Beans', 'Flowers'] },
  { name: 'Dimethoate', activeIngredient: 'Dimethoate', mrlValue: 0.01, phi: 28, status: 'BANNED', crops: ['Coffee', 'Tea', 'Avocado', 'French Beans'] },
  { name: 'Carbendazim', activeIngredient: 'Carbendazim', mrlValue: 0.1, phi: 14, status: 'RESTRICTED', crops: ['Coffee', 'Avocado', 'Macadamia'] },
  { name: 'Azoxystrobin', activeIngredient: 'Azoxystrobin', mrlValue: 1.0, phi: 7, status: 'APPROVED', crops: ['Avocado', 'French Beans', 'Coffee'] },
  { name: 'Spinosad', activeIngredient: 'Spinosad', mrlValue: 0.3, phi: 3, status: 'APPROVED', crops: ['Avocado', 'French Beans', 'Flowers', 'Tea'] },
]

interface Expert {
  name: string
  specialization: string
  organization: string
  rating: number
  phone: string
  email: string
}

const EXPERTS_DATA: Expert[] = [
  { name: 'Dr. Sarah Wanjiku', specialization: 'Pesticide Residue Analysis', organization: 'KEPHIS', rating: 4.8, phone: '+254 712 345 678', email: 'swanjiku@kephis.org' },
  { name: 'Prof. James Ochieng', specialization: 'Organic Certification', organization: 'KARI', rating: 4.9, phone: '+254 723 456 789', email: 'jochieng@kari.org' },
  { name: 'Dr. Grace Mutua', specialization: 'Food Safety & HACCP', organization: 'SGS Kenya', rating: 4.7, phone: '+254 734 567 890', email: 'gmutua@sgs.com' },
  { name: 'Eng. Peter Kamau', specialization: 'GlobalGAP Compliance', organization: 'AfriCert', rating: 4.6, phone: '+254 745 678 901', email: 'pkamau@africert.org' },
  { name: 'Dr. Amina Hassan', specialization: 'Soil & Water Quality', organization: 'KALRO', rating: 4.8, phone: '+254 756 789 012', email: 'ahassan@kalro.org' },
]

interface Lab {
  name: string
  location: string
  accreditations: string[]
  services: string[]
  phone: string
  email: string
  turnaround: string
}

const LABS_DATA: Lab[] = [
  { name: 'SGS Kenya Ltd', location: 'Nairobi, Kenya', accreditations: ['ISO 17025', 'KEBS Accredited'], services: ['Pesticide Residue Analysis', 'Heavy Metals', 'Mycotoxins', 'Microbiological'], phone: '+254 20 350 0200', email: 'ke.agriculture@sgs.com', turnaround: '5-7 days' },
  { name: 'Crop Nutrition Laboratory Services', location: 'Nairobi, Kenya', accreditations: ['ISO 17025', 'KENAS Accredited'], services: ['Soil Analysis', 'Plant Tissue Analysis', 'Water Quality', 'Pesticide Residue'], phone: '+254 20 213 3908', email: 'info@cropnuts.com', turnaround: '3-5 days' },
  { name: 'Kenya Plant Health Inspectorate (KEPHIS)', location: 'Nairobi, Kenya', accreditations: ['ISO 17025', 'Government Agency'], services: ['Phytosanitary Certification', 'Pesticide Residue Analysis', 'Seed Testing'], phone: '+254 20 353 6171', email: 'director@kephis.org', turnaround: '7-10 days' },
  { name: 'Chemiphar Uganda Ltd', location: 'Kampala, Uganda', accreditations: ['ISO 17025', 'UNBS Accredited'], services: ['Pesticide Residue Analysis', 'Food Safety Testing', 'Water Quality'], phone: '+256 414 267 483', email: 'info@chemiphar.co.ug', turnaround: '5-7 days' },
  { name: 'Tanzania Bureau of Standards (TBS)', location: 'Dar es Salaam, Tanzania', accreditations: ['ISO 17025', 'Government Agency'], services: ['Food Safety Testing', 'Pesticide Residue', 'Microbiological Testing'], phone: '+255 22 245 0206', email: 'info@tbs.go.tz', turnaround: '7-14 days' },
]

// ============================================
// SUB-TAB COMPONENTS
// ============================================

const STATUS_COLORS = {
  APPROVED: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
  RESTRICTED: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200' },
  BANNED: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' },
}

function RegistryTab() {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!search.trim()) return REGISTRY_DATA
    const q = search.toLowerCase()
    return REGISTRY_DATA.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.activeIngredient.toLowerCase().includes(q) ||
        p.crops.some((c) => c.toLowerCase().includes(q))
    )
  }, [search])

  return (
    <View className="flex-1">
      <View className="mx-4 mt-4 mb-3 bg-white rounded-xl border border-gray-200 flex-row items-center px-3">
        <Search size={18} color="#9CA3AF" />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search Registry (MRLs, PHIs...)"
          className="flex-1 py-3 px-2 text-gray-900"
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        <View className="gap-3 pb-8">
          {filtered.map((item, idx) => {
            const colors = STATUS_COLORS[item.status]
            return (
              <View key={idx} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <View className="flex-row justify-between items-start mb-2">
                  <View className="flex-1 mr-2">
                    <Text className="font-semibold text-gray-900 text-base">{item.name}</Text>
                    <Text className="text-xs text-gray-500 mt-0.5">{item.activeIngredient}</Text>
                  </View>
                  <View className={`${colors.bg} ${colors.border} border px-2.5 py-1 rounded-full`}>
                    <Text className={`${colors.text} text-xs font-bold`}>{item.status}</Text>
                  </View>
                </View>
                <View className="flex-row mt-2 gap-4">
                  <View className="bg-blue-50 px-3 py-1.5 rounded-lg">
                    <Text className="text-xs text-blue-600 font-medium">MRL: {item.mrlValue} mg/kg</Text>
                  </View>
                  <View className="bg-purple-50 px-3 py-1.5 rounded-lg">
                    <Text className="text-xs text-purple-600 font-medium">PHI: {item.phi} days</Text>
                  </View>
                </View>
                <View className="flex-row flex-wrap mt-2 gap-1">
                  {item.crops.map((crop, ci) => (
                    <Text key={ci} className="text-xs text-gray-400">{crop}{ci < item.crops.length - 1 ? ' · ' : ''}</Text>
                  ))}
                </View>
              </View>
            )
          })}
          {filtered.length === 0 && (
            <View className="bg-white p-8 rounded-xl border border-gray-100 items-center mt-4">
              <Search size={32} color="#D1D5DB" />
              <Text className="text-gray-500 text-center mt-2">No results found</Text>
              <Text className="text-gray-400 text-sm text-center mt-1">Try a different search term</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  )
}

function ExpertsTab() {
  return (
    <ScrollView className="flex-1 px-4 mt-4" showsVerticalScrollIndicator={false}>
      <View className="gap-3 pb-8">
        {EXPERTS_DATA.map((expert, idx) => (
          <View key={idx} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <View className="flex-row justify-between items-start mb-1">
              <View className="flex-1">
                <Text className="font-semibold text-gray-900 text-base">{expert.name}</Text>
                <Text className="text-sm text-green-600 mt-0.5">{expert.specialization}</Text>
                <Text className="text-xs text-gray-500 mt-0.5">{expert.organization}</Text>
              </View>
              <View className="flex-row items-center bg-yellow-50 px-2 py-1 rounded-full border border-yellow-200">
                <Star size={12} color="#EAB308" fill="#EAB308" />
                <Text className="text-yellow-700 text-xs font-bold ml-1">{expert.rating}</Text>
              </View>
            </View>
            <View className="mt-3 pt-3 border-t border-gray-100 gap-2">
              <View className="flex-row items-center">
                <Phone size={14} color="#6B7280" />
                <Text className="text-sm text-gray-600 ml-2">{expert.phone}</Text>
              </View>
              <View className="flex-row items-center">
                <Mail size={14} color="#6B7280" />
                <Text className="text-sm text-gray-600 ml-2">{expert.email}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

function LabsTab() {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!search.trim()) return LABS_DATA
    const q = search.toLowerCase()
    return LABS_DATA.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.location.toLowerCase().includes(q) ||
        l.services.some((s) => s.toLowerCase().includes(q))
    )
  }, [search])

  return (
    <View className="flex-1">
      <View className="mx-4 mt-4 mb-3 bg-white rounded-xl border border-gray-200 flex-row items-center px-3">
        <Search size={18} color="#9CA3AF" />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search labs by name, location, service..."
          className="flex-1 py-3 px-2 text-gray-900"
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        <View className="gap-3 pb-8">
          {filtered.map((lab, idx) => (
            <View key={idx} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <Text className="font-semibold text-gray-900 text-base">{lab.name}</Text>
              <View className="flex-row items-center mt-1">
                <MapPin size={14} color="#6B7280" />
                <Text className="text-sm text-gray-500 ml-1">{lab.location}</Text>
              </View>

              <View className="flex-row flex-wrap mt-2 gap-1.5">
                {lab.accreditations.map((acc, ai) => (
                  <View key={ai} className="bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                    <Text className="text-xs text-green-700 font-medium">{acc}</Text>
                  </View>
                ))}
              </View>

              <View className="mt-3">
                <Text className="text-xs font-medium text-gray-700 mb-1">Services:</Text>
                <Text className="text-xs text-gray-500">{lab.services.join(' · ')}</Text>
              </View>

              <View className="mt-3 flex-row items-center">
                <Clock size={12} color="#6B7280" />
                <Text className="text-xs text-gray-500 ml-1">Turnaround: {lab.turnaround}</Text>
              </View>

              <View className="mt-3 pt-3 border-t border-gray-100 gap-2">
                <View className="flex-row items-center">
                  <Phone size={14} color="#6B7280" />
                  <Text className="text-sm text-gray-600 ml-2">{lab.phone}</Text>
                </View>
                <View className="flex-row items-center">
                  <Mail size={14} color="#6B7280" />
                  <Text className="text-sm text-gray-600 ml-2">{lab.email}</Text>
                </View>
              </View>
            </View>
          ))}
          {filtered.length === 0 && (
            <View className="bg-white p-8 rounded-xl border border-gray-100 items-center mt-4">
              <Search size={32} color="#D1D5DB" />
              <Text className="text-gray-500 text-center mt-2">No labs found</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  )
}

function ResultsTab() {
  return (
    <View className="flex-1 px-4 mt-4">
      <View className="bg-white p-8 rounded-xl border border-gray-100 items-center justify-center shadow-sm">
        <FlaskConical size={48} color="#D1D5DB" />
        <Text className="text-gray-800 font-semibold text-lg mt-4">No Test Results Yet</Text>
        <Text className="text-gray-400 text-sm text-center mt-2 px-4">
          Submit a sample at an accredited lab to see your test results here.
        </Text>
      </View>
    </View>
  )
}

function CertsTab() {
  return (
    <View className="flex-1 px-4 mt-4">
      <View className="bg-white p-8 rounded-xl border border-gray-100 items-center justify-center shadow-sm">
        <Award size={48} color="#D1D5DB" />
        <Text className="text-gray-800 font-semibold text-lg mt-4">No Certificates Yet</Text>
        <Text className="text-gray-400 text-sm text-center mt-2 px-4">
          Complete quality testing to earn your compliance certificates.
        </Text>
      </View>
    </View>
  )
}

// ============================================
// MAIN QMS SCREEN
// ============================================

type TabKey = 'registry' | 'experts' | 'labs' | 'results' | 'certs'

const TABS: { key: TabKey; label: string; icon: typeof ShieldCheck }[] = [
  { key: 'registry', label: 'Registry', icon: FileCheck },
  { key: 'experts', label: 'Experts', icon: Star },
  { key: 'labs', label: 'Labs', icon: Microscope },
  { key: 'results', label: 'Results', icon: FlaskConical },
  { key: 'certs', label: 'Certs', icon: Award },
]

export default function QMSScreen() {
  const [activeTab, setActiveTab] = useState<TabKey>('registry')

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      {/* Header */}
      <View className="bg-green-700 p-6 rounded-b-3xl shadow-lg pb-6">
        <View className="flex-row items-center mb-1">
          <ShieldCheck size={28} color="white" />
          <Text className="text-3xl font-bold text-white ml-2">QMS Module</Text>
        </View>
        <Text className="text-green-100 text-sm tracking-widest font-medium">EXPORT EXCELLENCE</Text>
      </View>

      {/* Sub-tabs */}
      <View className="px-4 mt-4">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-2">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.key
              const Icon = tab.icon
              return (
                <TouchableOpacity
                  key={tab.key}
                  onPress={() => setActiveTab(tab.key)}
                  className={`flex-row items-center px-4 py-2.5 rounded-full border ${
                    isActive
                      ? 'bg-green-600 border-green-600'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <Icon size={16} color={isActive ? 'white' : '#6B7280'} />
                  <Text
                    className={`ml-1.5 text-sm font-medium ${
                      isActive ? 'text-white' : 'text-gray-600'
                    }`}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </ScrollView>
      </View>

      {/* Tab Content */}
      <View className="flex-1">
        {activeTab === 'registry' && <RegistryTab />}
        {activeTab === 'experts' && <ExpertsTab />}
        {activeTab === 'labs' && <LabsTab />}
        {activeTab === 'results' && <ResultsTab />}
        {activeTab === 'certs' && <CertsTab />}
      </View>
    </SafeAreaView>
  )
}
