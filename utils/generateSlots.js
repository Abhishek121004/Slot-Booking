export const generateSlots = () => {
  const slots = [];
  for (let i = 0; i < 24; i++) {
    const hour = i.toString().padStart(2, "0");
    slots.push({
      time: `${hour}:00`,
      subSlots: 3,
      isBlocked: false
    });
  }
  return slots;
};