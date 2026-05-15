import React, { useState, useMemo } from 'react';
import { 
  Search, MapPin, AlertCircle, Clock, Pill, Menu, X, ArrowRight, 
  User, Package, LogOut, ChevronRight, Phone, ShieldCheck, 
  Activity, BarChart3, Bell, LifeBuoy
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MEDICINES, SHOPS, MOCK_INVENTORY, type Medicine, type Shop, type InventoryItem } from './data/mockData';

type View = 'search' | 'emergency' | 'pharmacist' | 'login' | 'hubs';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activePharmacistShop, setActivePharmacistShop] = useState<Shop | null>(null);
  const [inventory, setInventory] = useState<InventoryItem[]>(MOCK_INVENTORY);
  const [distanceLimit, setDistanceLimit] = useState<number>(20);
  const [pharmacistSearchQuery, setPharmacistSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newEntry, setNewEntry] = useState({ medicineId: MEDICINES[0].id, stock: 0, expiryDate: '', price: 0 });

  const filteredInventory = useMemo(() => {
    if (!searchQuery) return [];
    const query = searchQuery.toLowerCase();
    
    return inventory.filter(item => {
      const medicine = MEDICINES.find(m => m.id === item.medicineId);
      const shop = SHOPS.find(s => s.id === item.shopId);
      const matchesSearch = medicine?.name.toLowerCase().includes(query) || medicine?.category.toLowerCase().includes(query);
      const matchesDistance = shop ? shop.distanceKm <= distanceLimit : true;
      return matchesSearch && matchesDistance;
    }).map(item => ({
      ...item,
      medicine: MEDICINES.find(m => m.id === item.medicineId)!,
      shop: SHOPS.find(s => s.id === item.shopId)!
    }));
  }, [searchQuery, inventory, distanceLimit]);

  const emergencyDrugs = useMemo(() => {
    return inventory.filter(item => {
      const medicine = MEDICINES.find(m => m.id === item.medicineId);
      return medicine?.isLifeSaving;
    }).map(item => ({
      ...item,
      medicine: MEDICINES.find(m => m.id === item.medicineId)!,
      shop: SHOPS.find(s => s.id === item.shopId)!
    }));
  }, [inventory]);

  const handleUpdateStock = (itemId: string, newStock: number) => {
    setInventory(prev => prev.map(item => 
      item.id === itemId ? { ...item, stock: newStock } : item
    ));
  };

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePharmacistShop) return;

    const newItem: InventoryItem = {
      id: `i${Date.now()}`,
      medicineId: newEntry.medicineId,
      shopId: activePharmacistShop.id,
      stock: newEntry.stock,
      expiryDate: newEntry.expiryDate || new Date(Date.now() + 31536000000).toISOString().split('T')[0],
      price: newEntry.price
    };

    setInventory(prev => [newItem, ...prev]);
    setIsAddModalOpen(false);
    setNewEntry({ medicineId: MEDICINES[0].id, stock: 0, expiryDate: '', price: 0 });
  };

  const handleLogin = (shopId: string) => {
    const shop = SHOPS.find(s => s.id === shopId);
    if (shop) {
      setActivePharmacistShop(shop);
      setIsLoggedIn(true);
      setCurrentView('pharmacist');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div 
              className="flex items-center gap-2.5 cursor-pointer" 
              onClick={() => setCurrentView('search')}
            >
              <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
                <ShieldCheck size={24} />
              </div>
              <div>
                <span className="block text-lg font-extrabold tracking-tight text-slate-900 leading-none font-display">Grama Sanjeevini</span>
                <span className="text-[10px] uppercase tracking-widest font-bold text-brand-600">Rural Healthcare Network</span>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-1.5">
              <NavBtn 
                active={currentView === 'search'} 
                onClick={() => setCurrentView('search')} 
                icon={Search} 
                label="Search" 
              />
              <NavBtn 
                active={currentView === 'emergency'} 
                onClick={() => setCurrentView('emergency')} 
                icon={AlertCircle} 
                label="Emergency" 
              />
              <div className="w-px h-6 bg-slate-200 mx-2" />
              {isLoggedIn ? (
                <button
                  onClick={() => setCurrentView('pharmacist')}
                  className="flex items-center gap-2 pl-2 pr-4 py-1.5 rounded-full bg-brand-50 text-brand-700 font-semibold text-sm border border-brand-100 hover:bg-brand-100 transition-colors"
                >
                  <div className="w-7 h-7 bg-brand-600 rounded-full flex items-center justify-center text-white">
                    <User size={14} />
                  </div>
                  {activePharmacistShop?.name}
                </button>
              ) : (
                <button
                  onClick={() => setCurrentView('login')}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-brand-600 transition-colors"
                >
                  Pharmacist Login
                </button>
              )}
            </div>
            
            {/* Mobile simplified toggle */}
            <div className="md:hidden flex items-center gap-2">
               <button 
                  onClick={() => setCurrentView('emergency')}
                  className="p-2 text-rose-500"
               >
                  <AlertCircle size={24} />
               </button>
               <button 
                  onClick={() => setCurrentView(isLoggedIn ? 'pharmacist' : 'login')}
                  className="p-2 text-slate-600"
               >
                  <User size={24} />
               </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {currentView === 'search' && (
            <motion.div
              key="search"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-10"
            >
              {/* Hero Section */}
              <div className="text-center max-w-2xl mx-auto space-y-4">
                <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-display">
                  Healthcare within <span className="text-brand-600">reachable distance.</span>
                </h2>
                <p className="text-lg text-slate-500 font-medium">
                  Find life-saving medicines and inventory across 12 villages in our verified rural pharmacy network.
                </p>
              </div>

              {/* Search Bar & Filters */}
              <div className="max-w-xl mx-auto space-y-6">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-slate-400 group-focus-within:text-brand-600 transition-colors" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search for Insulin, Antivenom, or General Medicine..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-2xl py-5 pl-14 pr-6 shadow-soft focus:border-brand-500 focus:ring-4 focus:ring-brand-500/5 outline-none transition-all text-lg font-medium placeholder:text-slate-400"
                  />
                </div>

                <div className="flex items-center justify-center gap-2">
                   <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mr-2">Within Range:</span>
                   {[5, 10, 20].map(dist => (
                      <button
                        key={dist}
                        onClick={() => setDistanceLimit(dist)}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                          distanceLimit === dist 
                            ? 'bg-brand-600 text-white shadow-md' 
                            : 'bg-white text-slate-500 border border-slate-200 hover:border-brand-300'
                        }`}
                      >
                        {dist} km
                      </button>
                   ))}
                </div>
              </div>

              {/* Search Results */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                  {searchQuery ? (
                    <>
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Network Search Results</h3>
                        <span className="text-xs font-semibold text-slate-400">{filteredInventory.length} shops found</span>
                      </div>
                      <div className="space-y-4">
                        {filteredInventory.length > 0 ? (
                          filteredInventory.map((item, idx) => (
                            <MedicineCard key={item.id} item={item} index={idx} />
                          ))
                        ) : (
                          <div className="bg-white rounded-2xl p-20 text-center border border-slate-100 italic text-slate-400">
                            No immediate inventory found. Try checking the town town hub.
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <ActionCard 
                        title="Emergency Stock" 
                        desc="View life-saving drugs available for immediate dispatch."
                        icon={AlertCircle}
                        color="rose"
                        onClick={() => setCurrentView('emergency')}
                      />
                      <ActionCard 
                        title="Village Hub Map" 
                        desc="Browse the 10+ verified medical stores in our circle."
                        icon={MapPin}
                        color="brand"
                        onClick={() => setCurrentView('hubs')}
                      />
                    </div>
                  )}

                  {/* Category Discovery */}
                  {!searchQuery && (
                    <div className="pt-8">
                       <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Browse by Need</h3>
                       <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          <CategoryIcon icon={Pill} label="General" count="42" onClick={() => setSearchQuery('General')} />
                          <CategoryIcon icon={AlertCircle} label="Emergency" count="5" onClick={() => setSearchQuery('Emergency')} />
                          <CategoryIcon icon={Clock} label="Diabetes" count="12" onClick={() => setSearchQuery('Diabetes')} />
                          <CategoryIcon icon={LifeBuoy} label="First Aid" count="28" onClick={() => setSearchQuery('General')} />
                       </div>
                    </div>
                  )}
                </div>

                {/* Sidebar Stats */}
                <div className="space-y-6">
                  <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-soft">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2.5 bg-brand-50 text-brand-600 rounded-xl">
                        <Activity size={20} />
                      </div>
                      <h4 className="font-bold text-slate-800">Network Pulse</h4>
                    </div>
                    <div className="space-y-4">
                      <PulseStat label="Active Shops" value="12" pulse />
                      <PulseStat label="Critical Drugs" value="5" color="text-rose-500" />
                      <PulseStat label="Network Status" value="Online" color="text-brand-600" />
                    </div>
                  </div>

                  <div className="bg-slate-900 rounded-3xl p-6 text-white overflow-hidden relative group">
                    <div className="relative z-10">
                      <h4 className="text-xl font-bold mb-2">Pharmacist?</h4>
                      <p className="text-slate-400 text-sm mb-6">Manage your inventory and set expiry alerts for the community.</p>
                      <button 
                        onClick={() => setCurrentView('login')}
                        className="w-full py-3 bg-brand-600 hover:bg-brand-500 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                      >
                        Enter Portal <ArrowRight size={18} />
                      </button>
                    </div>
                    <ShieldCheck className="absolute -right-8 -bottom-8 text-white/5 w-40 h-40 group-hover:scale-110 transition-transform duration-500" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentView === 'hubs' && (
            <motion.div
              key="hubs"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="max-w-2xl">
                <button 
                  onClick={() => setCurrentView('search')}
                  className="group flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors mb-4"
                >
                  <ChevronRight size={16} className="rotate-180" /> Back to Search
                </button>
                <h2 className="text-3xl font-extrabold text-slate-900 font-display">Hub Directory</h2>
                <p className="text-slate-500 font-medium">Browse verified medical stores in the Grama Sanjeevini network.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {SHOPS.map((shop) => (
                  <div key={shop.id} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-soft hover:border-brand-500 transition-all group">
                    <div className="flex items-center gap-4 mb-6">
                       <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white transition-all">
                          <MapPin size={24} />
                       </div>
                       <div>
                          <h4 className="font-bold text-slate-900">{shop.name}</h4>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{shop.village} Branch</p>
                       </div>
                    </div>
                    <div className="space-y-3 mb-6">
                       <div className="flex items-start gap-3">
                          <MapPin size={14} className="text-brand-500 shrink-0 mt-0.5" />
                          <p className="text-xs font-medium text-slate-500">{shop.address}</p>
                       </div>
                       <div className="flex items-center gap-3">
                          <Clock size={14} className="text-slate-400 shrink-0" />
                          <p className="text-xs font-medium text-slate-500">8:00 AM - 10:00 PM</p>
                       </div>
                    </div>
                    <a 
                      href={`tel:${shop.contact}`}
                      className="w-full py-3 bg-slate-50 text-slate-600 rounded-xl font-bold text-center flex items-center justify-center gap-2 hover:bg-brand-50 hover:text-brand-700 transition-all border border-slate-100"
                    >
                      <Phone size={16} /> Contact Store
                    </a>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {currentView === 'emergency' && (
            <motion.div
              key="emergency"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <button 
                    onClick={() => setCurrentView('search')}
                    className="group flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors mb-2"
                  >
                    <ChevronRight size={16} className="rotate-180" /> Back to Search
                  </button>
                  <h2 className="text-3xl font-extrabold text-slate-900 font-display">Life-Saving Monitor</h2>
                  <p className="text-slate-500 font-medium">Critical medicines with real-time stock levels across the network.</p>
                </div>
                <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl border border-slate-200 shadow-soft">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">Live Monitoring Active</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {emergencyDrugs.map((item, idx) => (
                  <EmergencyTile key={item.id} item={item} index={idx} />
                ))}
              </div>
            </motion.div>
          )}

          {currentView === 'login' && (
            <motion.div
              key="login"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-lg mx-auto py-12"
            >
              <div className="bg-white rounded-[2rem] p-10 border border-slate-200 shadow-md text-center space-y-8">
                <div className="w-20 h-20 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center mx-auto ring-8 ring-brand-50/50">
                  <User size={40} />
                </div>
                <div>
                  <h2 className="text-3xl font-extrabold text-slate-900 font-display">Pharmacy Portal</h2>
                  <p className="text-slate-500 font-medium mt-1">Select your branch to begin management.</p>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  {SHOPS.map(shop => (
                    <button
                      key={shop.id}
                      onClick={() => handleLogin(shop.id)}
                      className="group flex items-center justify-between p-5 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-brand-500 hover:shadow-md transition-all text-left"
                    >
                      <div>
                        <p className="font-bold text-slate-900 group-hover:text-brand-700 transition-colors">{shop.name}</p>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{shop.village}</p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white transition-all">
                        <ChevronRight size={18} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {currentView === 'pharmacist' && isLoggedIn && activePharmacistShop && (
            <motion.div
              key="pharmacist"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-soft">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-brand-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-brand-500/20">
                    <Package size={32} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold text-slate-900">{activePharmacistShop.name}</h2>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] mt-1">{activePharmacistShop.village} Branch • ID: {activePharmacistShop.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button className="px-4 py-2 font-bold text-slate-400 hover:text-slate-600 transition-colors">Alerts</button>
                  <button 
                    onClick={() => { setIsLoggedIn(false); setCurrentView('search'); }}
                    className="bg-rose-50 text-rose-600 px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-rose-100 transition-all shadow-sm"
                  >
                    <LogOut size={18} /> Sign Out
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <DashStat 
                  label="Critical Alerts" 
                  value={MOCK_INVENTORY.filter(i => i.shopId === activePharmacistShop.id && MEDICINES.find(m => m.id === i.medicineId)?.isLifeSaving).length} 
                  icon={AlertCircle} 
                  color="rose"
                />
                <DashStat 
                  label="Stock Items" 
                  value={MOCK_INVENTORY.filter(i => i.shopId === activePharmacistShop.id).length} 
                  icon={Package} 
                  color="brand"
                />
                <DashStat 
                  label="Near Expiry" 
                  value={MOCK_INVENTORY.filter(i => i.shopId === activePharmacistShop.id && new Date(i.expiryDate) < new Date('2026-06-01')).length} 
                  icon={Clock} 
                  color="amber"
                />
                <DashStat 
                  label="Daily Reach" 
                  value="142" 
                  icon={Activity} 
                  color="indigo"
                />
              </div>

              <div className="bg-white rounded-[2rem] border border-slate-200 shadow-soft overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-bold text-slate-800 text-lg">Inventory Controller</h3>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Search stock..."
                        value={pharmacistSearchQuery}
                        onChange={(e) => setPharmacistSearchQuery(e.target.value)}
                        className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:border-brand-500 transition-all w-48"
                      />
                    </div>
                    <button 
                      onClick={() => setIsAddModalOpen(true)}
                      className="bg-brand-600 text-white px-5 py-2 rounded-xl font-bold text-sm shadow-lg shadow-brand-500/20 hover:bg-brand-500 transition-all"
                    >
                      + Add Entry
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50/50 text-[10px] uppercase font-bold text-slate-400 tracking-[0.2em]">
                        <th className="px-8 py-5">Product Name</th>
                        <th className="px-8 py-5">Status</th>
                        <th className="px-8 py-5">Stock Level</th>
                        <th className="px-8 py-5">Expiry Date</th>
                        <th className="px-8 py-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {inventory
                        .filter(i => i.shopId === activePharmacistShop.id)
                        .filter(i => {
                          const med = MEDICINES.find(m => m.id === i.medicineId);
                          return med?.name.toLowerCase().includes(pharmacistSearchQuery.toLowerCase());
                        })
                        .map(item => {
                        const med = MEDICINES.find(m => m.id === item.medicineId)!;
                        const isNearExpiry = new Date(item.expiryDate) < new Date('2026-06-01');
                        return (
                          <tr key={item.id} className="hover:bg-slate-50/30 transition-colors">
                            <td className="px-8 py-5">
                              <p className="font-bold text-slate-900 leading-tight">{med.name}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{med.category}</p>
                            </td>
                            <td className="px-8 py-5">
                              {med.isLifeSaving ? (
                                <span className="px-2 py-0.5 bg-rose-50 text-rose-600 text-[10px] font-black uppercase rounded border border-rose-100">Critical</span>
                              ) : (
                                <span className="px-2 py-0.5 bg-slate-50 text-slate-500 text-[10px] font-black uppercase rounded border border-slate-100">Standard</span>
                              )}
                            </td>
                            <td className="px-8 py-5">
                              <div className="flex items-center gap-3">
                                <button 
                                  onClick={() => handleUpdateStock(item.id, Math.max(0, item.stock - 1))}
                                  className="w-6 h-6 rounded flex items-center justify-center bg-slate-100 text-slate-600 hover:bg-slate-200"
                                >-</button>
                                <span className="text-sm font-extrabold text-slate-700 min-w-4 text-center">{item.stock}</span>
                                <button 
                                  onClick={() => handleUpdateStock(item.id, item.stock + 1)}
                                  className="w-6 h-6 rounded flex items-center justify-center bg-slate-100 text-slate-600 hover:bg-slate-200"
                                >+</button>
                              </div>
                            </td>
                            <td className="px-8 py-5">
                              <span className={`text-sm font-bold ${isNearExpiry ? 'text-amber-600' : 'text-slate-500'}`}>
                                {new Date(item.expiryDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
                                {isNearExpiry && " ⚠️"}
                              </span>
                            </td>
                            <td className="px-8 py-5 text-right">
                              <button className="text-brand-600 font-bold text-sm hover:underline">Settings</button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Add Entry Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden"
            >
              <div className="px-8 pt-8 pb-4 flex justify-between items-center bg-slate-50/50 border-b border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 border-l-4 border-brand-500 pl-4">Add Inventory Entry</h3>
                <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleAddEntry} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Select Medicine</label>
                  <select 
                    value={newEntry.medicineId}
                    onChange={(e) => setNewEntry({...newEntry, medicineId: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 font-bold text-slate-700 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/5 transition-all appearance-none"
                  >
                    {MEDICINES.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Opening Stock</label>
                    <input 
                      type="number" 
                      min="0"
                      required
                      value={newEntry.stock}
                      onChange={(e) => setNewEntry({...newEntry, stock: parseInt(e.target.value) || 0})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 font-bold text-slate-700 outline-none focus:border-brand-500 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Unit Price (₹)</label>
                    <input 
                      type="number" 
                      min="0"
                      required
                      value={newEntry.price}
                      onChange={(e) => setNewEntry({...newEntry, price: parseInt(e.target.value) || 0})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 font-bold text-slate-700 outline-none focus:border-brand-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Expiry Date</label>
                  <input 
                    type="date" 
                    required
                    value={newEntry.expiryDate}
                    onChange={(e) => setNewEntry({...newEntry, expiryDate: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 font-bold text-slate-700 outline-none focus:border-brand-500 transition-all"
                  />
                </div>

                <div className="pt-4">
                  <button 
                    type="submit"
                    className="w-full bg-brand-600 text-white rounded-2xl py-4 font-bold shadow-xl shadow-brand-500/20 hover:bg-brand-500 transition-all hover:-translate-y-0.5 active:translate-y-0"
                  >
                    Confirm & Save to Network
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="mt-20 border-t border-slate-200 bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3 grayscale opacity-60">
               <ShieldCheck size={28} className="text-slate-900" />
               <span className="text-lg font-extrabold text-slate-900 tracking-tight font-display">Grama Sanjeevini</span>
            </div>
            <div className="flex gap-8">
              <FooterLink label="Accessibility" />
              <FooterLink label="Supply Chain" />
              <FooterLink label="Privacy" />
              <FooterLink label="Support" />
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">© 2026 GS Network. India.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function CategoryIcon({ icon: Icon, label, count, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:border-brand-500 hover:shadow-md transition-all text-center group"
    >
      <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
        <Icon size={20} />
      </div>
      <p className="text-sm font-bold text-slate-900 leading-tight mb-1">{label}</p>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{count} Items</p>
    </button>
  );
}

function NavBtn({ active, onClick, icon: Icon, label }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
        active 
          ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10 scale-105' 
          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
      }`}
    >
      <Icon size={16} />
      {label}
    </button>
  );
}

function ActionCard({ title, desc, icon: Icon, color, onClick }: any) {
  const isRed = color === 'rose';
  return (
    <button 
      onClick={onClick}
      className="group p-8 bg-white rounded-3xl border border-slate-200 shadow-soft text-left hover:border-slate-900 transition-all relative overflow-hidden"
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${isRed ? 'bg-rose-50 text-rose-600' : 'bg-brand-50 text-brand-600'}`}>
        <Icon size={28} />
      </div>
      <h4 className="text-xl font-extrabold text-slate-900 mb-2 font-display">{title}</h4>
      <p className="text-slate-500 font-medium leading-relaxed mb-4">{desc}</p>
      <div className={`flex items-center gap-2 font-bold text-sm ${isRed ? 'text-rose-600' : 'text-brand-600'}`}>
        View Details <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
      </div>
    </button>
  );
}

function PulseStat({ label, value, pulse = false, color = "text-slate-900" }: any) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-slate-50">
      <span className="text-sm font-semibold text-slate-400 uppercase tracking-widest">{label}</span>
      <div className="flex items-center gap-2">
        {pulse && <div className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse" />}
        <span className={`font-extrabold ${color}`}>{value}</span>
      </div>
    </div>
  );
}

function MedicineCard({ item, index }: { item: any; index: number }) {
  const isOutOfStock = item.stock === 0;
  
  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft hover:shadow-md transition-all group lg:flex items-center justify-between gap-6"
    >
      <div className="flex items-center gap-6 mb-4 lg:mb-0">
        <div className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center transition-all ${item.medicine.isLifeSaving ? 'bg-rose-50 text-rose-600' : 'bg-brand-50 text-brand-600'}`}>
          <Pill size={28} />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-xl font-extrabold text-slate-900 tracking-tight font-display">{item.medicine.name}</h4>
            {item.medicine.isLifeSaving && (
               <span className="px-2 py-0.5 bg-rose-100 text-rose-700 text-[9px] font-black uppercase rounded tracking-[0.1em] border border-rose-200">Life Critical</span>
            )}
          </div>
          <div className="flex items-center gap-4 text-xs font-bold text-slate-400 mb-2">
            <span className="flex items-center gap-1"><MapPin size={12} className="text-brand-500" /> {item.shop.name}, {item.shop.village}</span>
            <span className="text-slate-300">•</span>
            <span>{item.shop.distanceKm} km away</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t lg:border-t-0 pt-4 lg:pt-0 gap-6">
        <div className="text-left lg:text-right">
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-1">Stock Status</p>
          <div className="flex flex-col items-start lg:items-end gap-1">
            {isOutOfStock ? (
              <span className="text-rose-600 font-extrabold text-lg uppercase tracking-tighter">Sold Out</span>
            ) : (
              <>
                <span className="text-brand-600 font-extrabold text-lg uppercase tracking-tighter">{item.stock} Available</span>
                {item.discount && (
                   <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[9px] font-black uppercase rounded animate-bounce">
                     {item.discount}% OFF (Near Expiry)
                   </span>
                )}
              </>
            )}
          </div>
        </div>
        
        <a 
          href={`tel:${item.shop.contact}`}
          className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${
            isOutOfStock 
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed px-4' 
              : 'bg-brand-600 text-white hover:bg-brand-500 shadow-lg shadow-brand-500/20 active:scale-95'
          }`}
        >
          <Phone size={18} /> <span className="hidden sm:inline">Call Shop</span>
        </a>
      </div>
    </motion.div>
  );
}

function EmergencyTile({ item, index }: { item: any; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-soft group hover:border-rose-300 transition-all flex flex-col justify-between h-full"
    >
      <div>
        <div className="flex justify-between items-start mb-6">
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Activity size={24} />
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Network SKU</p>
            <p className="text-xl font-black text-rose-600 tracking-tighter">{item.stock} Units</p>
          </div>
        </div>
        <h4 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tighter leading-none">{item.medicine.name}</h4>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-6 bg-slate-50 self-start px-3 py-1.5 rounded-lg border border-slate-100">
          <MapPin size={12} className="text-rose-500" /> {item.shop.name} ({item.shop.distanceKm}km)
        </div>
      </div>

      <div className="space-y-3">
        <a 
          href={`tel:${item.shop.contact}`}
          className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-center flex items-center justify-center gap-2 hover:bg-brand-600 transition-colors shadow-lg"
        >
          <Phone size={18} /> Request Dispatch
        </a>
        <button className="w-full py-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest leading-none underline decoration-slate-200">
           View Alternatives
        </button>
      </div>
    </motion.div>
  );
}

function DashStat({ label, value, icon: Icon, color }: any) {
  const colors: Record<string, string> = {
    brand: 'bg-brand-50 text-brand-600 border-brand-100 shadow-brand-500/10',
    rose: 'bg-rose-50 text-rose-600 border-rose-100 shadow-rose-500/10',
    amber: 'bg-amber-50 text-amber-600 border-amber-100 shadow-amber-500/10',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100 shadow-indigo-500/10'
  };

  return (
    <div className={`p-6 bg-white border border-slate-200 rounded-3xl shadow-soft hover:shadow-md transition-all`}>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 border shadow-sm ${colors[color]}`}>
        <Icon size={24} />
      </div>
      <p className="text-3xl font-black text-slate-900 tracking-tighter mb-1">{value}</p>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{label}</p>
    </div>
  );
}

function FooterLink({ label }: { label: string }) {
  return (
    <a href="#" className="text-sm font-bold text-slate-500 hover:text-brand-600 transition-colors">
      {label}
    </a>
  );
}
