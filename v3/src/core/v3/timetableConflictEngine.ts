import type { TimetableSlot, TimetableConflict } from '../../types/v3';

/**
 * Checks time intervals for overlap
 * format: "HH:mm"
 */
function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}

function doSlotsOverlap(slotA: TimetableSlot, slotB: TimetableSlot): boolean {
  if (slotA.dayOfWeek !== slotB.dayOfWeek) return false;
  if (slotA.campusId !== slotB.campusId) return false;

  const startA = timeToMinutes(slotA.startTime);
  const endA = timeToMinutes(slotA.endTime);
  const startB = timeToMinutes(slotB.startTime);
  const endB = timeToMinutes(slotB.endTime);

  return Math.max(startA, startB) < Math.min(endA, endB);
}

export function detectTimetableConflicts(slots: TimetableSlot[]): TimetableConflict[] {
  const conflicts: TimetableConflict[] = [];

  for (let i = 0; i < slots.length; i++) {
    for (let j = i + 1; j < slots.length; j++) {
      const a = slots[i];
      const b = slots[j];

      if (doSlotsOverlap(a, b)) {
        // 1. Teacher Collision
        if (a.teacherId === b.teacherId) {
          conflicts.push({
            slotA: a,
            slotB: b,
            conflictType: 'TEACHER_COLLISION',
            description: `Bentrok Guru: ${a.teacherName} terjadwal mengajar di 2 kelas sekaligus (${a.cohortName} [${a.roomName}] & ${b.cohortName} [${b.roomName}]) pada waktu bersamaan (${a.startTime} - ${a.endTime}).`,
          });
        }

        // 2. Room Collision
        if (a.roomName.trim().toLowerCase() === b.roomName.trim().toLowerCase()) {
          conflicts.push({
            slotA: a,
            slotB: b,
            conflictType: 'ROOM_COLLISION',
            description: `Bentrok Ruangan: Ruang [${a.roomName}] dipakai bersamaan oleh ${a.cohortName} (${a.subjectName}) dan ${b.cohortName} (${b.subjectName}).`,
          });
        }
      }
    }
  }

  return conflicts;
}
