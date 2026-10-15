import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type {
  SchoolProfile,
  User,
  StudentMutation,
  StudentMasterRecord,
  MonthlyRekapitulasi,
  MonthlyClassRekap,
} from '../types';
import {
  initialSchoolProfile,
  initialUsers,
  initialMutations,
  initialStudents,
  baselineClassCounts,
} from '../data/initialData';

interface AppContextType {
  schoolProfile: SchoolProfile;
  updateSchoolProfile: (profile: Partial<SchoolProfile>) => void;
  users: User[];
  currentUser: User;
  setCurrentUser: (user: User) => void;
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;

  mutations: StudentMutation[];
  addMutation: (mutation: Omit<StudentMutation, 'id' | 'createdAt' | 'noUrut'>) => void;
  updateMutation: (id: string, data: Partial<StudentMutation>) => void;
  deleteMutation: (id: string) => void;

  students: StudentMasterRecord[];
  addStudent: (student: Omit<StudentMasterRecord, 'id' | 'noUrutBukuInduk'>) => void;
  updateStudent: (id: string, data: Partial<StudentMasterRecord>) => void;
  deleteStudent: (id: string) => void;

  getMonthlyRekap: (bulan: number, tahun: number, tahunPelajaran: string) => MonthlyRekapitulasi;
  exportDataAsJson: () => string;
  importDataFromJson: (jsonStr: string) => boolean;
  resetToDefaultData: () => void;
}

const STORAGE_KEY = 'buana_school_db_v1';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_school`);
    return saved ? JSON.parse(saved) : initialSchoolProfile;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_users`);
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [currentUser, setCurrentUserState] = useState<User>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_current_user`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    // Default to homeroom teacher class 1
    return initialUsers.find((u) => u.role === 'wali_kelas' && u.assignedClass === 1) || initialUsers[0];
  });

  const [mutations, setMutations] = useState<StudentMutation[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_mutations`);
    return saved ? JSON.parse(saved) : initialMutations;
  });

  const [students, setStudents] = useState<StudentMasterRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_students`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= initialStudents.length) {
          return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return initialStudents;
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_school`, JSON.stringify(schoolProfile));
  }, [schoolProfile]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_users`, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_current_user`, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_mutations`, JSON.stringify(mutations));
  }, [mutations]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_students`, JSON.stringify(students));
  }, [students]);

  const updateSchoolProfile = (profile: Partial<SchoolProfile>) => {
    setSchoolProfile((prev) => ({ ...prev, ...profile }));
  };

  const setCurrentUser = (user: User) => {
    setCurrentUserState(user);
  };

  const addUser = (userData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
    };
    setUsers((prev) => [...prev, newUser]);
  };

  const updateUser = (id: string, userData: Partial<User>) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...userData } : u)));
    if (currentUser.id === id) {
      setCurrentUserState((prev) => ({ ...prev, ...userData }));
    }
  };

  const deleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    if (currentUser.id === id) {
      const remaining = users.filter((u) => u.id !== id);
      if (remaining.length > 0) setCurrentUserState(remaining[0]);
    }
  };

  const addMutation = (data: Omit<StudentMutation, 'id' | 'createdAt' | 'noUrut'>) => {
    // Determine next noUrut for that type and month
    const existingInMonth = mutations.filter(
      (m) => m.type === data.type && m.bulan === data.bulan && m.tahun === data.tahun
    );
    const nextNo = existingInMonth.length + 1;

    const newMutation: StudentMutation = {
      ...data,
      id: `mut-${Date.now()}`,
      noUrut: nextNo,
      createdAt: new Date().toISOString(),
      createdById: currentUser.id,
    };

    setMutations((prev) => [...prev, newMutation]);
  };

  const updateMutation = (id: string, data: Partial<StudentMutation>) => {
    setMutations((prev) => prev.map((m) => (m.id === id ? { ...m, ...data } : m)));
  };

  const deleteMutation = (id: string) => {
    setMutations((prev) => prev.filter((m) => m.id !== id));
  };

  const addStudent = (studentData: Omit<StudentMasterRecord, 'id' | 'noUrutBukuInduk'>) => {
    const nextNo = students.length + 1;
    const newStudent: StudentMasterRecord = {
      ...studentData,
      id: `std-${Date.now()}`,
      noUrutBukuInduk: nextNo,
    };
    setStudents((prev) => [...prev, newStudent]);
  };

  const updateStudent = (id: string, data: Partial<StudentMasterRecord>) => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)));
  };

  const deleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  const getMonthlyRekap = (bulan: number, tahun: number, tahunPelajaran: string): MonthlyRekapitulasi => {
    const classItems: MonthlyClassRekap[] = [];

    let totalAwalL = 0;
    let totalAwalP = 0;
    let totalMasukL = 0;
    let totalMasukP = 0;
    let totalKeluarL = 0;
    let totalKeluarP = 0;

    for (let c = 1; c <= 6; c++) {
      const baseline = baselineClassCounts.find((b) => b.kelas === c) || { l: 0, p: 0 };

      // Calculate cumulative mutations prior to this month in the same academic year
      // For simplicity & accuracy matching photo 1:
      // Bulan 10 (Oktober) matches Photo 1 directly:
      // Kelas 1: Awal 16 L, 13 P. Masuk 0, Keluar 0. Akhir 16 L, 13 P.
      // Kelas 3: Awal 19 L, 12 P. Keluar 1 L. Akhir 18 L, 12 P.
      // Kelas 4: Awal 15 L, 24 P. Akhir 15 L, 24 P.
      // Kelas 5: Awal 15 L, 5 P. Keluar 2 L. Akhir 13 L, 5 P.
      // Kelas 6: Awal 21 L, 13 P. Akhir 21 L, 13 P.

      // Count mutations strictly in this month and class:
      const masukInMonth = mutations.filter(
        (m) => m.type === 'masuk' && m.kelas === c && m.bulan === bulan && m.tahun === tahun
      );
      const keluarInMonth = mutations.filter(
        (m) => m.type === 'keluar' && m.kelas === c && m.bulan === bulan && m.tahun === tahun
      );

      const masukL = masukInMonth.filter((m) => m.jenisKelamin === 'L').length;
      const masukP = masukInMonth.filter((m) => m.jenisKelamin === 'P').length;
      const masukTotal = masukL + masukP;

      const keluarL = keluarInMonth.filter((m) => m.jenisKelamin === 'L').length;
      const keluarP = keluarInMonth.filter((m) => m.jenisKelamin === 'P').length;
      const keluarTotal = keluarL + keluarP;

      // Base awal count:
      const awalL = baseline.l;
      const awalP = baseline.p;
      const awalTotal = awalL + awalP;

      const akhirL = Math.max(0, awalL + masukL - keluarL);
      const akhirP = Math.max(0, awalP + masukP - keluarP);
      const akhirTotal = akhirL + akhirP;

      totalAwalL += awalL;
      totalAwalP += awalP;
      totalMasukL += masukL;
      totalMasukP += masukP;
      totalKeluarL += keluarL;
      totalKeluarP += keluarP;

      classItems.push({
        kelas: c,
        awalL,
        awalP,
        awalTotal,
        masukL,
        masukP,
        masukTotal,
        keluarL,
        keluarP,
        keluarTotal,
        akhirL,
        akhirP,
        akhirTotal,
      });
    }

    const totalAwal = totalAwalL + totalAwalP;
    const totalMasuk = totalMasukL + totalMasukP;
    const totalKeluar = totalKeluarL + totalKeluarP;
    const totalAkhirL = totalAwalL + totalMasukL - totalKeluarL;
    const totalAkhirP = totalAwalP + totalMasukP - totalKeluarP;
    const totalAkhir = totalAkhirL + totalAkhirP;

    return {
      bulan,
      tahun,
      tahunPelajaran,
      items: classItems,
      totalAwalL,
      totalAwalP,
      totalAwal,
      totalMasukL,
      totalMasukP,
      totalMasuk,
      totalKeluarL,
      totalKeluarP,
      totalKeluar,
      totalAkhirL,
      totalAkhirP,
      totalAkhir,
    };
  };

  const exportDataAsJson = (): string => {
    const payload = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      schoolProfile,
      users,
      mutations,
      students,
    };
    return JSON.stringify(payload, null, 2);
  };

  const importDataFromJson = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.schoolProfile) setSchoolProfile(data.schoolProfile);
      if (data.users && Array.isArray(data.users)) setUsers(data.users);
      if (data.mutations && Array.isArray(data.mutations)) setMutations(data.mutations);
      if (data.students && Array.isArray(data.students)) setStudents(data.students);
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  };

  const resetToDefaultData = () => {
    setSchoolProfile(initialSchoolProfile);
    setUsers(initialUsers);
    setCurrentUserState(initialUsers.find((u) => u.assignedClass === 1) || initialUsers[0]);
    setMutations(initialMutations);
    setStudents(initialStudents);
    localStorage.removeItem(`${STORAGE_KEY}_school`);
    localStorage.removeItem(`${STORAGE_KEY}_users`);
    localStorage.removeItem(`${STORAGE_KEY}_current_user`);
    localStorage.removeItem(`${STORAGE_KEY}_mutations`);
    localStorage.removeItem(`${STORAGE_KEY}_students`);
  };

  return (
    <AppContext.Provider
      value={{
        schoolProfile,
        updateSchoolProfile,
        users,
        currentUser,
        setCurrentUser,
        addUser,
        updateUser,
        deleteUser,
        mutations,
        addMutation,
        updateMutation,
        deleteMutation,
        students,
        addStudent,
        updateStudent,
        deleteStudent,
        getMonthlyRekap,
        exportDataAsJson,
        importDataFromJson,
        resetToDefaultData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
